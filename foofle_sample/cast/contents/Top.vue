<template>
    <div>
        <template v-for="item in nominations">
            <Nomination
                :nomination="item"
                :disabled="checkNominated(item.id)"
                @clickNomination="clickNomination"
            ></Nomination>
        </template>
        <template>
            <template v-for="item in items">
                <Tweet
                    :tweet="item"
                ></Tweet>
            </template>
            <Infinite @infinite="infiniteHandler"
                :spinner="'waveDots'"
            >
                <div slot="no-more" style="padding:2rem 0;">NO MORE TWEET</div>
                <div slot="no-results" style="padding:2rem 0;">NO TWEET</div>
            </Infinite>
        </template>
        <EditButton
            :icon="['fas', 'bullhorn']"
            @click="click"
        ></EditButton>
    </div>
</template>

<script>
import axios from 'axios';

import Infinite from 'vue-infinite-loading';

import getTweet from '../../mixin/getTweet.js';
import Tweet from './inner/Tweet.vue';
import Nomination from './inner/Nomination.vue';
import EditButton from '../parts/EditButtonParts.vue';

let listItemHandler = () => {

}

export default {
    data() {
        return {
            items: [],
            index: 0,
            limit: 25,
            timeoutExcution: false,
            tweets: [],
            nominations: [],
            state: null,
        }
    },
    props: [
        'cast', 'nomination',
    ],
    mounted: function() {
        let now = Math.floor(new Date().getTime() / 1000);
        firebase.firestore().collection('nomination')
        .where('timestamp_end', '>', now).where('is_canceled', '==', false).onSnapshot((qss) => {
            this.nominations = [];
            qss.forEach((doc) => {
                this.nominations.push(doc.data());
            });
        });

        this.fetchTweetData();
    },
    watch: {
        cast: function(value) {
            if (value) {
                this.fetchTweetData();
            }
        },
    },
    methods: {
        fetchTweetData: function() {
            if (this.cast) {
                firebase.firestore().collection('cast').doc(this.cast.id).collection('tweet').onSnapshot((qss) => {
                    qss.forEach((doc) => {
                        this.tweets.push(doc.data());
                    });
                    if (this.state) {
                        this.state.loaded();
                    }
                });
            }
        },
        click: function() {
            this.$router.push('/cast/post');
        },
        infiniteHandler: function($state) {
            let len = this.tweets.length;
            let i;
            if (len > this.index) {
                let next = len - (this.limit + this.index) < 0 ? len : (this.limit + this.index);
                for (i = this.index; i < next; i++) {
                    this.getTweet(this.tweets[i].id).then((res) => {
                        this.items.push(res);
                    });
                }
                this.index = next;
                $state.loaded();
                this.$emit('update');
            } else {
                this.state = $state;
            }
        },
        checkNominated: function(id) {
            let st = window.localStorage || null;
            return !st || st[`nomination_${id}`];
        },
        clickNomination: function(id) {
            let st = window.localStorage || null;
            if (st && !st[`nomination_${id}`]) {
                let cast_id = st['active_cast_id'] || null;
                axios({
                    method: 'POST',
                    url: '/api/cast/nomination',
                    data: {
                        cast_id: cast_id,
                        nomination_id: id,
                    },
                }).finally(() => {
                    st[`nomination_${id}`] = true;
                });
            } else {
                console.log(st[`nomination_${id}`]);
            }
        },
    },
    mixins: [
        getTweet,
    ],
    components: {
        Tweet, Nomination, EditButton, Infinite,
    },
}
</script>

<style scoped>

</style>
