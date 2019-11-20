<template>
<div class="">
    <div class="top-search-input">
        <fa class="icon" :icon="['fas', 'search']"></fa>
        <input type="text" v-model="search_query" placeholder="タグ、フリーワード検索">
    </div>
    <div v-if="!search_query" class="search-article">

    </div>
    <ul v-else class="input-suggest-wrap">
        <template v-if="tag && tag.length > 0">
            <li class="index">ハッシュタグ</li>
            <li v-for="item in tag" class="tag">
                <router-link :to="`/tag/${ item }`" class="tag-link">
                    #{{ item }}
                </router-link>
            </li>
        </template>
        <template v-if="cast && cast.length > 0">
            <li class="index">プロフィール</li>
            <li v-for="item in cast" class="profile">
                <ProfileList
                    :cast="item"
                ></ProfileList>
            </li>
            <li class="viewmore">もっと見る</li>
        </template>
        <template v-if="tweet && tweet.length > 0">
            <li class="index">ツイート</li>
            <li v-for="item in tweet" class="tweet">
                <Tweet :tweet="item"
                ></Tweet>
            </li>
            <li class="viewmore">もっと見る</li>
        </template>

    </ul>
</div>
</template>

<script>
import getMaster from '../../../mixin/getMaster.js';
import getTweet from '../../../mixin/getTweet.js';
import ProfileList from '../inner/ProfileList.vue';
import Tweet from '../inner/Tweet.vue';
import Review from '../inner/Tweet.vue';

export default {
    data() {
        return {
            search_query: null,
            popular_tag: [],
            tag: [],
            cast: [],
            tweet: [],
        }
    },
    mounted: function() {
        this.getPopularTag().then((res) => {
            this.popular_tag = res;
        });
    },
    watch: {
        search_query: function(word) {
            if (word) {
                (() => {
                    this.tag.splice(0, this.tag.length);
                    this.cast.splice(0, this.cast.length);
                    this.tweet.splice(0, this.tweet.length);
                    return Promise.resolve();
                })().then(() => {
                    Promise.all([
                        this.searchPopularTag(word),
                        this.searchInformalMatchedTag(word),
                        this.searchCast(word),
                        this.searchInformalUnmatchedTag(word),
                    ]).then((res) => {

                    });
                })
            }
        },
    },
    methods: {
        searchByTags: function(target) {
            if (target.length > 0) {
                let promises = [];
                for (let i = 0; i < target.length; i++) {
                    let tagref = firebase.firestore().collection('tag').doc(target[i]);
                    promises.push(
                    tagref.collection('tweet').get().then((qss) => {
                        qss.forEach((qds) => {
                            this.getTweet(qds.id).then((res) => {
                                this.tweet.push(res);
                                return Promise.resolve();
                            });
                        })
                    }));
                    promises.push(
                    tagref.collection('cast').get().then((qss) => {
                        qss.forEach((qds) => {
                            firebase.firestore().collection('cast').doc(qds.id).get().then((res) => {
                                this.cast.push(res.data());
                                return Promise.resolve();
                            });
                        })
                    }));
                }
                return Promise.all(promises).then((res) => {
                    return res;
                });
            } else {
                return Promise.resolve();
            }
        },
        searchPopularTag: function(word) {
            if (this.popular_tag && this.popular_tag.length > 0) {
                let target = [];
                for ( let i = 0; i < this.popular_tag.length; i++) {
                    if(this.popular_tag[i].value.indexOf(word) !== -1) {
                        this.tag.push(this.popular_tag[i].value);
                        target.push(this.popular_tag[i].value);
                    }
                }
                target.sort((a, b) => a.length - b.length);
                return this.searchByTags(target).then(() => {
                    return Promise.resolve();
                });

            } else {
                return Promise.resolve();
            }
        },
        searchInformalMatchedTag: function(word) {
            return firebase.firestore().collection('tag').where('is_popular', '==', false).where('value', '==', word).get().then((qss) => {
                let target = [];
                qss.forEach((qds) => {
                    this.tag.push(qds.id);
                    target.push(qds.id);
                });
                return this.searchByTags(target).then(() => {
                    return Promise.resolve();
                });
            })
        },
        searchInformalUnmatchedTag: function(word) {
            return this.getNotPopularTag().then((tags) => {
                let target = [];
                for (let i = 0; i < tags.length; i++) {
                    if(tags[i].value !== word && tags[i].value.indexOf(word) !== -1) {
                        this.tag.push(tags[i].value);
                        target.push(tags[i].value);
                    }
                }
                target.sort((a, b) => a.length - b.length);
                return this.searchByTags(target).then(() => {
                    return Promise.resolve();
                });
            })
        },
        searchCast: function(word) {
            return firebase.firestore().collection('cast').where('profile.name', '==', word).get().then((qss) => {
                qss.forEach((qds) => {
                    this.cast.push(qds.data());
                });
            });
        },
    },
    mixins: [
        getMaster, getTweet,
    ],
    components: {
        Tweet, ProfileList,
    },
}
</script>

<style scoped>
.top-search-input {
    position: relative;
}

.top-search-input input {
    color: #010101;
    font-size: 1.2rem;
    font-family: 'M plus 1p';
    width: 100%;
    height: 2.6rem;
    padding: 0 1rem 0 2rem;
}

.top-search-input .icon {
    position: absolute;
    top: 0.9rem;
    left: 0.9rem;
}

.top-search-input input::placeholder {
    font-family: 'M Plus 1p';
    font-size: 1.2rem;
    font-weight: 300;
}

.input-suggest-wrap {
    width: 100%;
}

.input-suggest-wrap li {
    font-size: 1.2rem;
    background-color: #FFF;
    width: 100%;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid var(--cl-border-light);
}

.tag-link {
    color: #1DA1F2;
    font-size: 1rem;
    font-weight: normal;
    font-family: sans-serif;
    font-style: italic;
}

li.index {
    color: var(--cl-pink);
}

li.profile {
    padding: 0;
    border: none;
}

li.profile img {
    width: 48px;
    height: 48px;
    border-radius: 48px;
}

li.tweet {
    padding: 0;
    border: none;
}

li.viewmore {
    color: var(--cl-pink);
    font-size: 1rem;
    text-align: center;
    padding: 1.2rem 0;
}
</style>
