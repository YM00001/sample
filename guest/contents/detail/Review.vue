<template>
<div class="item-wrapper">
    <Review
        v-for="(item, ind) in review"
        :review="item"
        :key="item.id"
        >
    </Review>
    <Infinite @infinite="infiniteHandler"
        :spinner="'waveDots'"
    >
        <div slot="no-more">NO MORE REVIEWS</div>
        <div slot="no-results">NO REVIEWS</div>
    </Infinite>
</div>
</template>

<script>
import Infinite from 'vue-infinite-loading';

import getTweet from '../../../mixin/getTweet.js';
import Review from '../inner/Review.vue';

export default {
    data() {
        return {
            review: [],
            nextref: null,
        }
    },
    mounted: function() {
        this.cast_id = (this.$route.params.castid).toUpperCase();
        this.colref = firebase.firestore().collection('cast').doc(this.cast_id).collection('review');
        this.nextref = this.colref.orderBy('timestamp', 'desc').limit(25);
    },
    methods: {
        infiniteHandler: function($state) {
            this.nextref.onSnapshot((qss) => {
                if (qss.docs.length) {
                    qss.forEach((doc) => {
                        let data = doc.data();
                        this.getReview(data.id).then((res) => {
                            this.review.push(res);
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
        Infinite, Review,
    },
}
</script>

<style scoped>
.item-wrapper {
    width: 100%;
}

.infinite-status-prompt {
    padding: 2rem 0;
}
</style>
