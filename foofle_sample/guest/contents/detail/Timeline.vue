<template>
    <div class="item-wrapper">
        <Tweet
            v-for="(item, ind) in tweet"
            :tweet="item"
            :key="ind"
        ></Tweet>
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
import Tweet from '../inner/Tweet.vue';

export default {
    data() {
        return {
            tweet: [],
            nextref: null,
        }
    },
    mounted: function() {
        this.cast_id = (this.$route.params.castid).toUpperCase();
        this.colref = firebase.firestore().collection('cast').doc(this.cast_id).collection('tweet');
        this.nextref = this.colref.orderBy('timestamp', 'desc').limit(25);
    },
    methods: {
        infiniteHandler: function($state) {
            this.nextref.onSnapshot((qss) => {
                if (qss.docs.length) {
                    this.tweet = [];
                    qss.forEach((doc) => {
                        let data = doc.data();
                        this.getTweet(data.id).then((res) => {
                            this.tweet.push(res);
                        });
                    });
                    let lastdoc = qss.docs[qss.docs.length -1];
                    this.nextref = this.colref.orderBy('timestamp', 'desc').startAfter(lastdoc).limit(25);
                    $state.loaded();
                    this.$emit('update');
                } else {
                    $state.complete();
                }
            });
        },
    },
    mixins: [
        getTweet,
    ],
    components: {
        Infinite, Tweet,
    },
}
</script>

<style scoped>
.item-wrapper {
    width: 100%;
}

</style>
