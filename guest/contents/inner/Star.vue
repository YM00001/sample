<template>
    <div class="star-wrap">
        <fa v-for="(item, ind) in stars"
            :key="ind"
            :icon="item.fas"
            :style="item.col"
        ></fa>
        <span>{{ display(value) }}</span>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStars } from '@fortawesome/free-regular-svg-icons';
library.add(faStar, faStarHalfAlt, faStars);

export default {
    data() {
        return {
            color: '#ffe51e',
            stars: null,
        }
    },
    props: [
        'value',
    ],
    mounted: function() {
        this.deployStar();
    },
    methods: {
        deployStar: function() {
            let val = this.value
            if (!val) {
                this.stars = [];
            }
            let a = Math.floor(val);
            let b = val % 1 === 0.5;

            let prop1 = { fas : ['fas', 'star'], col : { color : this.color}};
            let prop5 = { fas : ['fas', 'star-half-alt'], col : { color : this.color}};
            let prop0 = { fas : ['far', 'star'], col : { color : this.color}};

            let res = [];
            for (let i = 1; i <= 5; i++) {
                if (i <= a) {
                    res.push(prop1);
                } else if (i === (a + 1) && b) {
                    res.push(prop5);
                } else {
                    res.push(prop0);
                }
            }
            this.stars = res;
        },
        display: function(val) {
            if (val % 1 === 0) {
                return `${val}.0`;
            } else {
                return val;
            }
        },
    },
}
</script>

<style scoped>
.star-wrap svg{
    margin-left: -3px;
}
</style>
