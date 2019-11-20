<template>
    <div class="item-wrapper">
        <div class="gallery-item"
            v-for="(src, ind) in imgs"
            @click="showLightbox(ind)"
        >
            <WebImage
                :src="src"
                :key="ind"
                alt=""
            ></WebImage>
        </div>
        <Infinite @infinite="infiniteHandler"
            :spinner="'waveDots'"
        >
            <div slot="no-more" style="padding:2rem 0;">NO MORE IMAGE</div>
            <div slot="no-results" style="padding:2rem 0;">NO IMAGE</div>
        </Infinite>
    </div>
</template>

<script>
import Infinite from 'vue-infinite-loading';
import getTweet from '../../../mixin/getTweet.js';

export default {
    data() {
        return {
            imgs: [],
            tweet: [],
            nextref: null,
        }
    },
    mounted: function() {
        this.cast_id = (this.$route.params.castid).toUpperCase();
        this.colref = firebase.firestore().collection('cast').doc(this.cast_id).collection('tweet');
        this.nextref = this.colref.orderBy('timestamp', 'desc').limit(4);
        //this.initialize();
    },
    methods: {
        initialize: function() {
            this.nextref.get().then((qss) => {
                if (qss.docs.length) {
                    qss.forEach((doc) => {
                        let data = doc.data();console.log(data);
                        this.getTweet(data.id).then((res) => {
                            if (res.imgs) {
                                for (let i = 0; i < res.imgs.length; i++) {
                                    this.imgs.push(res.imgs[i]);
                                }
                            }
                        });
                    });
                    let lastdoc = qss.docs[qss.docs.length -1];
                    this.nextref = this.colref.orderBy('timestamp', 'desc').startAfter(lastdoc).limit(4);
                    this.$emit('update');
                }
            });
        },
        infiniteHandler: function($state) {console.log(this.colref);
            this.nextref.get().then((qss) => {
                if (qss.docs.length) {
                    qss.forEach((doc) => {
                        let data = doc.data();console.log(data);
                        this.getTweet(data.id).then((res) => {
                            if (res.imgs) {
                                for (let i = 0; i < res.imgs.length; i++) {
                                    this.imgs.push(res.imgs[i]);
                                }
                            }
                        });
                    });
                    let lastdoc = qss.docs[qss.docs.length -1];
                    this.nextref = this.colref.orderBy('timestamp', 'desc').startAfter(lastdoc).limit(4);
                    $state.loaded();
                    this.$emit('update');
                } else {
                    $state.complete();
                }
            });
        },
        showLightbox: function(ind) {
            this.$eventHub.$emit('lightbox', this.imgs, ind);
        },
    },
    mixins: [
        getTweet,
    ],
    components: {
        Infinite,
    },
}
</script>

<style scoped>
.item-wrapper {
    display: flex;
    flex-wrap: wrap;
    padding-top: 1rem;
}

.gallery-item {
    width: calc(100% / 3);
    height: calc(100vw / 3);
    border: 1px solid var(--cl-border-light);
    margin-top: -1px;
    margin-left: -1px;
}

.gallery-item >>> picture {
    width: 100%;
    height: 100%;
}

.gallery-item >>> img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: url('/img/guest/img_placeholder.svg');
    background-size: 40px 40px;
    background-repeat: no-repeat;
    background-position: center;
}

.gallery-item >>> img:hover {
    cursor: pointer;
}

.item-wrapper >>> .infinite-loading-container {
    width: 100%;
}

</style>
