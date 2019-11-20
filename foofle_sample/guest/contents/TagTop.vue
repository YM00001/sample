<template>
    <div class="ff-content">
        <div v-if="tag" class="profile-wrap">
            <div class="profile-left">
                <fa :icon="['fas', 'hashtag']" :style="{ color: '#1DA1F2' }" size="lg"></fa>
            </div>
            <div class="profile-right">
                <div class="header">
                    <h1>{{ tag }}</h1>
                    <Btn
                        v-if="!is_follow"
                        width="30px"
                        :fa="['fas', 'plus']"
                        color="white"
                        @click="doFollow"
                    >フォロー</Btn>
                    <Btn
                        v-else
                        width="30px"
                        color="black"
                        :disabled="true"
                        @click_disabled="unFollow"
                    >フォロー中</Btn>
                </div>
            </div>
        </div>
        <div class="mains">
            <div class="tab-wrap">
                <div v-for="(name, ind) in tabs"
                     class="tab-item"
                     :class="{ 'is-active' : ind === index }"
                     @click="changeIndex(ind);update()">
                {{ name }}</div>
            </div>
            <div class="swiper-container" style="width:100%;">
                <div class="swiper-wrapper">
                    <div class="swiper-slide tweet-list">
                        <Tweet
                            v-for="item in tweet.values"
                            :tweet="item"
                            :key="item.id"
                        ></Tweet>
                        <Infinite @infinite="infiniteTweetHandler"
                            :spinner="'waveDots'"
                        >
                            <div slot="no-more" style="padding:2rem 0;">NO MORE TWEET</div>
                            <div slot="no-results" style="padding:2rem 0;">NO TWEET</div>
                        </Infinite>
                    </div>
                    <div class="swiper-slide cast-list">
                        <ProfileList
                            v-for="item in cast.values"
                            :cast="item"
                            :key="item.id"
                        ></ProfileList>
                        <Infinite @infinite="infiniteCastHandler"
                            :spinner="'waveDots'"
                        >
                            <div slot="no-more" style="padding:2rem 0;">NO MORE CAST</div>
                            <div slot="no-results" style="padding:2rem 0;">NO CAST</div>
                        </Infinite>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import Swiper from 'swiper';
import Infinite from 'vue-infinite-loading';
import timeHelper from '../../mixin/timeHelper.js';
import getMaster from '../../mixin/getMaster.js';
import getTweet from '../../mixin/getTweet.js';

import Btn from './inner/Btn.vue';
import Tweet from './inner/Tweet.vue';
import ProfileList from './inner/ProfileList.vue';

export default {
    data() {
        return {
            tabs: ['ツイート', 'キャスト',],
            swiper: null,
            tag: null,
            tweet: {
                count: 0,
                index: 0,
                limit: 25,
                ids: [],
                values: [],
                state: null,
            },
            cast: {
                connt: 0,
                index: 0,
                limit: 25,
                ids: [],
                values: [],
                state: null,
            },
        }
    },
    props: [
        'user', 'guest', 'follow', 'nomination',
    ],
    computed: {
        index: function() {
            return this.swiper ? this.swiper.activeIndex : 0;
        },
        is_follow: function() {
            if (!this.follow) { return false; }
            if (!this.tag) { return false; }
            if (this.follow.some((item) => item.tag === this.tag)) { return true; }
            return false;
        },
    },

    mounted: function() {
        this.tag = this.$route.params.tag_value;
        this.fetchTagData();

        this.$nextTick(function () {
            this.swiper = new Swiper ('.swiper-container', {
                direction: 'horizontal',
                speed: 100,
                slidesPerView: 1,
                autoHeight: true,
            });
        });

        this.$eventHub.$on('loadTimeline', () => {
            if (this.swiper) {
                this.swiper.update();
            }
        });
    },
    methods: {
        fetchTagData: function() {
            let ref = firebase.firestore().collection('tag').doc(this.tag);
            ref.collection('tweet').orderBy('timestamp', 'desc').get().then((qss) => {
                this.tweet.count = qss.size;
                qss.forEach((qds) => {
                    this.tweet.ids.push(qds.id);
                });
                return Promise.resolve();
            }).then(() => {
                if (this.tweet.state) {
                    this.tweet.state.loaded();
                }
            });
            ref.collection('cast').get().then((qss) => {
                this.cast.count = qss.size;
                qss.forEach((qds) => {
                    this.cast.ids.push(qds.id);
                });
                return Promise.resolve();
            }).then(() => {
                if (this.cast.state) {
                    this.cast.state.loaded();
                }
            });
        },
        changeIndex: function(ni) {
            this.swiper.slideTo(ni);
        },
        update: function() {
            this.swiper.updateSize();
        },
        doFollow: function() {
            if (this.user) {
                let db = firebase.firestore();
                let now = Math.floor(new Date().getTime() / 1000);
                let ref = db.collection('guest').doc(this.user).collection('follow').doc(this.tag);
                ref.set({
                    tag: this.tag,
                    timestamp: now,
                    type: 'tag',
                });
            }
        },
        unFollow: function() {
            if (this.user) {
                let db = firebase.firestore();
                db.collection('guest').doc(this.user).collection('follow').doc(this.tag).delete();
            }
        },
        infiniteTweetHandler: function($state) {
            let len = this.tweet.ids ? this.tweet.ids.length : 0;
            let i;
            if (len > 0) {
                if (len > this.tweet.index) {
                    let next = len - (this.tweet.limit + this.tweet.index) < 0 ? len : (this.tweet.limit + this.tweet.index);
                    let promises = [];
                    for (i = this.tweet.index; i < next; i++) {
                        promises.push(this.getTweet(this.tweet.ids[i]).then((res) => {
                            this.tweet.values.push(res);
                        }));
                    }
                    this.tweet.index = next;
                    $state.loaded();
                    Promise.all(promises).then((res) => {
                        this.$emit('update');
                    });
                } else {
                    $state.complete();
                    this.$emit('update');
                }
            } else {
                this.tweet.state = $state;
            }
        },
        infiniteCastHandler: function($state) {
            let len = this.cast.ids ? this.cast.ids.length : 0;
            let i;
            if (len > 0) {
                if (len > this.cast.index) {
                    let next = len - (this.cast.limit + this.cast.index) < 0 ? len : (this.cast.limit + this.cast.index);
                    let promises = [];
                    for (i = this.cast.index; i < next; i++) {
                        promises.push(firebase.firestore().collection('cast').doc(this.cast.ids[i]).get().then((res) => {
                            this.cast.values.push(res.data());
                        }));
                    }
                    this.cast.index = next;
                    $state.loaded();
                    Promise.all(promises).then((res) => {
                        this.$emit('update');
                    });
                } else {
                    $state.complete();
                    this.$emit('update');
                }
            } else {
                this.cast.state = $state;
            }
        },
    },
    mixins: [
        timeHelper, getMaster, getTweet,
    ],
    components: {
        Infinite, Btn, Tweet, ProfileList,
    },
}
</script>

<style scoped>
.swiper-container {
    min-height: calc(100vh - 80px);
}

.profile-wrap {
    background-color: #FFF;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
    padding: 1.3rem 1rem;
}

.profile-left {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 40px;
}

.profile-left >>> img {
    width: 58px;
    height: 58px;
    border-radius: 58px;
}

.profile-left p {
    color: var(--cl-pink);
    width: 100%;
    text-align: center;
    margin-top: 0.3rem;
}

.profile-right {
    width: calc(100% - 40px);
    padding-left: 0.5rem;
}

.profile-right > div {
    width: 100%;
}

.header {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0;
}

.header h1 {
    font-size: 1.5rem;
    display: inline-block;
    flex-grow: 3;
}

.mains {
    background-color: #FFF;
}

.tab-wrap {
    width: 100%;
    height: 32px;
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: nowrap;
    background: var(--cl-pink);
    background: var(--cl-grad);
}

.tab-item {
    color: #999;
    background-color: #FFF;
    width: calc(100% / 2);
    height: 32px;
    border-bottom: 1px solid var(--cl-border-light);
    display: flex;
    justify-content: center;
    align-items: center;
}

.tab-item.is-active {
    color: unset;
    height: 30px;
}
</style>
