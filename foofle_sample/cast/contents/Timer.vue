<template>
    <div class="ffc-wrapper ffc-fix">
      <div class="ffc-fix-title">
        <p>{{ reserve.id }}</p>
        <h2>接客中</h2>
      </div>
      <p>残り時間</p>
      <p class="ffc-fix-timer">{{ remain }}</p>
      <div class="ffc-fix-reminder-conf">
        <input type="checkbox" name="" value="">
        <label for="">終了10分前に電話を鳴らす</label>
      </div>
      <SwipeBtn ref="btn" @swipe="finish">終了</SwipeBtn>
    </div>
</template>

<script>
import axios from 'axios';
import SwipeBtn from './inner/SwipeBtn.vue';

export default {
    data() {
        return {
            now: 0,
        }
    },
    props: [
        'reserve',
    ],
    computed: {
        remain: function() {
            let endat = this.reserve.timestamp.started + this.reserve.course.min * 60;
            if (!this.reserve.timestamp.started || (endat - this.now) < 0 ) {
                return '--:--';
            }
            let ms = endat - this.now;
            return `${Math.floor(ms / 60)}:${('00' + (ms % 60)).slice(-2)}`;
        },
    },
    created: function() {
        let setNow = () => {
            this.now = Math.floor(new Date().getTime() / 1000);
        }
        window.setInterval(setNow, 500);
    },
    methods: {
        finish: function() {
            let self = this;
            let flag = true;
            let remain = (this.reserve.timestamp.started + this.reserve.course.min * 60) - this.now;
            if (remain > 300) {
                flag = !window.confirm('終了予定の5分以上前です。サービスを続行します。');
                if (flag) {
                    flag = window.confirm('サービスを終了します。よろしいですか？');
                }
            } else if (remain > 60) {
                flag = window.confirm('サービスを終了します。よろしいですか？');
            }

            if (flag) {
                axios({
                    method: 'POST',
                    url: '/api/cast/reserve/finish',
                    data: { rid: this.$route.params.rid },
                }).then((res) => {
                    if (res.data === 'Success') {
                        self.$router.replace(`/cast/${self.$route.params.rid}/exit`);
                    }
                }).catch((err) => {

                })
            } else {
                this.$refs.btn.clearBtn();
            }
        },
    },
    components: {
        SwipeBtn,
    },
}
</script>

<style scoped>
p.ffc-fix-timer {
    font-size: 5rem;
}

.ffc-fix-reminder-conf {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
}

.ffc-fix-reminder-conf input {
    width: 1rem;
    height: 1rem;
    margin-right: 0.2rem;
}

.ffc-fix-reminder-conf label {
    font-size: 1.2rem;
}
</style>
