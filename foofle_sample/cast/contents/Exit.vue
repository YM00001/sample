<template>
    <div class="ffc-wrapper ffc-fix">
      <div class="ffc-fix-title">
        <p>{{ reserve.id }}</p>
        <h2>接客終了</h2>
      </div>
      <p>店舗に電話をかけてください</p>
      <p class="ffc-fix-number">0120-123-456</p>
      <p>退室後お客様と別れたら<br />次のステップに進んでください</p>
      <SwipeBtn @swipe="exit">退出しました</SwipeBtn>
    </div>
</template>

<script>
import axios from 'axios';
import SwipeBtn from './inner/SwipeBtn.vue';

export default {
    data() {
        return {
            swipe: {
                el: null,
                is_glipped: false,
                grip_x: 0,
                width: null,
            },
        }
    },
    props: [
        'reserve',
    ],
    methods: {
        exit: function() {
            let self = this;
            axios({
                method: 'POST',
                url: '/api/cast/reserve/close',
                data: { rid: this.$route.params.rid },
            }).then((res) => {
                if (res.data === 'Success') {
                    self.$router.replace(`/cast/${self.$route.params.rid}/close`);
                }
            }).catch((err) => {

            });
        },
    },
    components: {
        SwipeBtn,
    },
}
</script>

<style scoped>
p.ffc-fix-number {
    font-size: 2.5rem;
}
</style>
