<template>
    <div class="item-wrapper">
        <transition name="check">
            <div class="check-new" v-if="is_loading">
                最新情報の確認中
            </div>
        </transition>
        <template v-for="(item, ind) in tweet">
            <Tweet
                v-if="item.type === 'tweet'"
                :tweet="item"
                :key="ind"
                eventName="loadTimeline"
            ></Tweet>
            <Review
                v-if="item.type === 'review'"
                :review="item"
                :key="ind"
                eventName="loadTimeline"
            ></Review>
        </template>
        <Infinite @infinite="infiniteHandler"
            :spinner="'waveDots'"
        >
            <div slot="no-more" style="padding:2rem 0;">NO MORE TWEET</div>
            <div slot="no-results" style="padding:2rem 0;">NO TWEET</div>
        </Infinite>
    </div>
</template>

<script>
import Infinite from 'vue-infinite-loading';
import getTweet from '../../../mixin/getTweet.js';
import timeHelper from '../../../mixin/timeHelper.js';
import Tweet from '../inner/Tweet.vue';
import Review from '../inner/Review.vue';

export default {
    data() {
        return {
            tweet: [],
            tweet_ids: [],
            index: 0,
            limit: 25,
            next: null,
            is_loading: false,
        }
    },
    props: [
        'user', 'follow',
    ],
    mounted: function() {
        // follow中のcast毎のタイムライン
        // follow中のuser毎のタイムライン
        // follow中のtag毎のタイムライン
        let st = window.localStorage || null;
        if (st && st['timeline_ids']) {
            // this.is_loading = true;
            this.tweet_ids = JSON.parse(st['timeline_ids']);
        }
    },
    watch: {
        follow: function() {
            let st = window.localStorage || null;
            if (this.follow) {
                if (st && st['timeline_least_timestamp']) {
                    let time = st['timeline_least_timestamp']-0;
                    let fj = JSON.stringify(this.follow);

                    if (st['follow_diff'] && st['follow_diff'] === fj) {
                        // 全followのnewtweetをmerge
                        this.getIds(time).then((arr) => {
                            let con = arr.concat(this.tweet_ids);
                            this.tweet_ids = con;
                            st['timeline_ids'] = JSON.stringify(con);
                            st['timeline_least_timestamp'] = this.getNow();
                        });

                    } else {
                        // 差分チェック(newにある&&beforeにない,だけcatch(増分のみ))
                        let before = JSON.parse(st['follow_diff']);
                        let difs = [];
                        this.follow.forEach((item) => {
                            if (before.includes(item)) {
                                difs.push(item);
                            }
                        });

                        // 変更したfollowの過去分を取得しsort
                        this.getNewFollowIds(time, difs).then((arr) => {
                            let con = arr.concat(this.tweet_ids);
                            con.sort((a, b) => b.timestamp - a.timestamp);

                            // 変更したfollow,既存のfollowのnewtweetをmerge
                            this.getIds(time).then((arr) => {
                                let con = arr.concat(this.tweet_ids);
                                this.tweet_ids = con;
                                st['follow_diff'] = fj;
                                st['timeline_ids'] = JSON.stringify(con);
                                st['timeline_least_timestamp'] = this.getNow();
                            })
                        });
                    }
                } else if (st) {
                    // 全取得
                    this.getIds().then((arr) => {
                        let con = arr.concat(this.tweet_ids);console.log(con);
                        this.tweet_ids = con;
                        st['follow_diff'] = JSON.stringify(this.follow);
                        st['timeline_ids'] = JSON.stringify(con);
                        st['timeline_least_timestamp'] = this.getNow();
                    });
                } else {
                    // 全取得 (no write)
                    this.getIds().then((arr) => {
                        let con = arr.concat(this.tweet_ids);
                        this.tweet_ids = con;
                    });
                }
            }
        },
    },
    methods: {
        getIds: function(timestamp) {
            timestamp = timestamp || 0;
            let arr = []
            let promises = [];
            for (let i = 0; i < this.follow.length; i++) {
                let col, subcol;
                switch(this.follow[i].type) {
                    case 'cast':
                        col = 'cast';
                        subcol = 'tweet';
                        break;
                    case 'guest':
                        col = 'guest';
                        subcol = 'review';
                        break;
                }
                //promises.push(firebase.firestore().collection(col).doc(this.follow[i][`${col}_id`]).collection(subcol)
                promises.push(firebase.firestore().collection('cast').doc(this.follow[i][`cast_id`]).collection('tweet')
                    .where('timestamp', '>', timestamp).get().then((qss) => {
                    qss.forEach((doc) => {
                        if (doc.exists) {
                            let data = doc.data();
                            data.type = subcol;
                            arr.push(data);
                        }
                    });
                    return true;
                }));
            }
            return Promise.all(promises).then(() => {
                arr.sort((a, b) => b.timestamp - a.timestamp);
                return arr;
            });
        },
        getNewFollowIds: function(follows, timestamp) {
            timestamp = timestamp || 0;
            let arr = []
            let promises = [];
            for (let i = 0; i < this.follows; i++) {
                promises.push(firebase.firestore().collection('cast').doc(this.follow[i]).collection('tweet')
                    .where('timestamp', '<=', timestamp).get().then((qss) => {
                    qss.forEach((doc) => {
                        arr.push(doc.data());
                    });
                    return true;
                }));
            }
            return Promise.all(promises).then(() => {
                return arr;
            });
        },
        infiniteHandler: function($state) {
            let len = this.tweet_ids ? this.tweet_ids.length : 0;
            let i;
            if (len > 0) {
                if (len > this.index) {
                    let next = len - (this.limit + this.index) < 0 ? len : (this.limit + this.index);
                    let promises = [];
                    for (i = this.index; i < next; i++) {
                        if (this.tweet_ids[i].type === 'tweet') {
                            promises.push(this.getTweet(this.tweet_ids[i].id).then((res) => {
                                this.tweet.push(res);
                            }));
                        } else if (this.tweet_ids[i].type === 'review') {
                            promises.push(this.getReview(this.tweet_ids[i].id).then((res) => {
                                this.tweet.push(res);
                            }));
                        }
                    }
                    this.index = next;
                    $state.loaded();
                    Promise.all(promises).then((res) => {
                        this.$emit('update');
                    });
                } else {
                    $state.complete();
                    this.$emit('update');
                }
            } else {
                window.setTimeout(() => {
                    $state.loaded();
                }, 1000);
            }
        },
    },
    mixins: [
        getTweet, timeHelper,
    ],
    components: {
        Infinite, Tweet, Review,
    },
}
</script>

<style scoped>
.item-wrapper {
    width: 100%;
}

.check-new {
    color: var(--cl-pin);
    font-size: 1.1rem;
    letter-spacing: 0.1rem;
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(0px);
}

.check-enter-active, .check-leave-active {
  transition: all .5s;
}
.check-enter, .check-leave-to {
  transform: translateY(-50px);
  height: 0;
}

</style>
