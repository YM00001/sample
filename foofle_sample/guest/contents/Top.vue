<template>
    <div class="swiper-container" style="width:100%;">
        <div class="swiper-wrapper">
            <Timeline class="swiper-slide"
                :user="user"
                :follow="follow"
                @update="update"
            ></Timeline>
            <Search class="swiper-slide"></Search>
            <Nomination class="swiper-slide"
                :guest="guest"
                :nomination="nomination"
            ></Nomination>
            <Reserve class="swiper-slide"
                :follow="follow"
                :activeReserve="activeReserve"
            ></Reserve>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import Swiper from 'swiper';

import Timeline from './top/Timeline.vue';
import Search from './top/Search.vue';
import Nomination from './top/Nomination.vue';
import Reserve from './top/Reserve.vue';

export default {
    data() {
        return {
            swiper: null,
        }
    },
    props: [
        'user', 'guest', 'follow', 'nomination', 'activeReserve',
    ],
    computed: {
        index: function() {
            return this.swiper ? this.swiper.activeIndex : 0;
        },
    },
    watch: {
        '$route'(to, from) {
            if (to.query.hasOwnProperty('p')) {
                let param = to.query.p;
                let index = this.getIndex(param);
                this.swiper.slideTo(index);
            }
        },
    },
    mounted: function() {
        this.$nextTick(function () {
            this.swiper = new Swiper ('.swiper-container', {
                direction: 'horizontal',
                speed: 100,
                slidesPerView: 1,
                autoHeight: true,
            });
            if (this.$route.query.hasOwnProperty('p')) {
                let param = this.$route.query.p;
                let index = this.getIndex(param);
                this.swiper.slideTo(index);
            }
        });

        this.$eventHub.$on('loadTimeline', () => {
            if (this.swiper) {
                this.swiper.update();
            }
        });
    },
    methods: {
        update: function() {
            if (this.swiper) {
                this.swiper.update();
            }
        },
        getIndex: function(param) {
            let index = 0;

            switch (param) {
                case 'search':
                    index = 1;
                    break;
                case 'nomination':
                    index = 2;
                    break;
                case 'reserve':
                    index = 3;
            }
            return index;
        },
    },
    components: {
        Timeline, Search, Nomination, Reserve,
    },
}
</script>

<style scoped>
.swiper-slide {
    min-height: 70vh;
}
</style>
