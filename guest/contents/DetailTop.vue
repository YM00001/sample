<template>
    <div class="ff-content">
        <div v-if="cast" class="profile-wrap">
            <div class="profile-left">
                <WebImage
                    :src="cast.profile.img"
                ></WebImage>
                <p>待機中</p>
            </div>
            <div class="profile-right">
                <div class="header">
                    <h1>{{ cast.profile.name }}</h1>
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
                <div class="ids">
                    @{{ cast.profile.display_id }}
                </div>
                <div v-if="service_category" class="disc">
                    {{ service_category[cast.config.service.service_category].name }}　
                    {{ cast.config.areas.basic.name }}発　4.0 (375)
                </div>
                <div class="msg">
                    <p>{{ cast.profile.introduction }}</p>
                </div>
                <div class="tags">
                    <span
                        v-for="item in cast.tags"
                    >#{{ item }}</span>
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
                    <Timeline class="swiper-slide"></Timeline>
                    <Gallery class="swiper-slide"></Gallery>
                    <Profile class="swiper-slide"></Profile>
                    <System class="swiper-slide"
                        :cast="cast"
                    ></System>
                    <Review class="swiper-slide"

                    ></Review>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import Swiper from 'swiper';
import timeHelper from '../../mixin/timeHelper.js';
import getMaster from '../../mixin/getMaster.js';

import Timeline from './detail/timeline.vue';
import Gallery from './detail/gallery.vue';
import Profile from './detail/profile.vue';
import System from './detail/system.vue';
import Review from './detail/review.vue';
import Btn from './inner/Btn.vue';

export default {
    data() {
        return {
            tabs: ['ツイート', 'ギャラリー', 'プロフィール', 'システム', 'レビュー'],
            swiper: null,
            cast: null,
            cast_id: null,
            service_category: null,
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
            if (!this.cast_id) { return false; }
            if (this.follow.some((item) => item.cast_id === this.cast_id)) { return true; }
            return false;
        },
    },
    mounted: function() {
        this.cast_id = (this.$route.params.castid).toUpperCase();
        let st = window.localStorage || null;
        firebase.firestore().collection('cast').doc(this.cast_id).onSnapshot((doc) => {
            if (doc.exists) {
                this.cast = doc.data();
                if (st) {
                    st[`cast_profile_${this.cast_id}`] = JSON.stringify(this.cast.profile);
                    st[`cast_profile_${this.cast_id}_timestamp`] = this.getNow();
                }
            }
        });
        this.getServiceCategory().then((res) => {
            this.service_category = res;
        });

        this.$nextTick(function () {
            this.swiper = new Swiper ('.swiper-container', {
                direction: 'horizontal',
                speed: 100,
                slidesPerView: 1,
                autoHeight: true,
            });
        });
        /*
        this.swiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            speed: 100,
            slidesPerView: 1,
            autoHeight: true,
        });
        */
        this.$eventHub.$on('loadTimeline', () => {
            if (this.swiper) {
                this.swiper.update();
            }
        });
    },
    methods: {
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
                let ref = db.collection('guest').doc(this.user).collection('follow').doc(this.cast_id);
                ref.set({
                    cast_id: this.cast_id,
                    timestamp: now,
                    type: 'cast',
                });
            }
        },
        unFollow: function() {
            if (this.user) {
                let db = firebase.firestore();
                db.collection('guest').doc(this.user).collection('follow').doc(this.cast_id).delete();
            }
        },
    },
    mixins: [
        timeHelper, getMaster,
    ],
    components: {
        Timeline, Gallery, Profile, System, Review, Btn,
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
    align-items: flex-start;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
}

.profile-left {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 62px;
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
    width: calc(100% - 62px);
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
    padding: 0.4rem 0 0;
}

.header h1 {
    font-size: 1.5rem;
    display: inline-block;
    flex-grow: 3;
}

.ids {
    margin-bottom: 0.5rem;
    opacity: 0.4;
}

.disc {
    margin-bottom: 0.5rem;
}

.msg {
    margin-bottom: 1rem;
}

.msg p {
    white-space: pre-wrap;
}

.tags span {
    margin-right: 0.5rem;
    font-size: 0.85rem;
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
    width: calc(100% / 5);
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
