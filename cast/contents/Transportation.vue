<template>
    <div class="ffc-wrapper ffc-fix">
        <div class="ffc-fix-title">
            <p>{{ reserve.id }}</p>
            <h2>移動中</h2>
        </div>
        <transition name="report">
            <div class="ffc-fix-arrive"
                v-if="reserve.building.address && !reserve.timestamp.reported && !is_reported"
            >
                <p>お客様の入室を確認いたしました。<br />あと何分くらいで到着しますか？</p>
                <span>選択してください</span>
                <div>
                    <div class="ffc-radio-btn">
                        <input id="arrive_5m" type="radio" name="reportToArrive">
                        <label for="arrive_5m" @click="reportToArrive(5)"><span>5</span>分</label>
                    </div>
                    <div class="ffc-radio-btn">
                        <input id="arrive_10m" type="radio" name="reportToArrive">
                        <label for="arrive_10m" @click="reportToArrive(10)"><span>10</span>分</label>
                    </div>
                    <div class="ffc-radio-btn">
                        <input id="arrive_15m" type="radio" name="reportToArrive">
                        <label for="arrive_15m" @click="reportToArrive(15)"><span>15</span>分</label>
                    </div>
                    <div class="ffc-radio-btn">
                        <input id="arrive_20m" type="radio" name="reportToArrive">
                        <label for="arrive_20m" @click="reportToArrive(20)"><span>20</span>分</label>
                    </div>
                    <div class="ffc-radio-btn">
                        <input id="arrive_30m" type="radio" name="reportToArrive">
                        <label for="arrive_30m" @click="reportToArrive(30)"><span>30+</span>分</label>
                    </div>
                </div>
            </div>
        </transition>
        <div class="ffc-card">
            <div class="ffc-card-left">
                <p>派遣先最寄り駅</p>
                <p>ホテル名</p>
                <p>部屋番号</p>
            </div>
            <div class="ffc-card-right">
                <p>{{ reserve.transportation.delivery_station.name }}</p>
                <template v-if="reserve.building.address">
                    <p>{{ reserve.building.address }}</p>
                    <p>{{ reserve.building.room }}</p>
                </template>
                <p v-else class="passive">お客様の入室待ち</p>
            </div>
        </div>
        <SwipeBtn @swipe="arrive">到着しました</SwipeBtn>
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
            is_reported: false,
        }
    },
    props: [
        'reserve',
    ],
    watch: {
        reserve: function() {
            if (this.reserve) {
                this.is_reported = this.reserve.status.is_reported;
            }
        },
    },
    methods: {
        reportToArrive: function(e) {
            let self = this;
            axios({
                method: 'POST',
                url: '/api/cast/reserve/report/toarrive',
                data: {
                    rid: this.$route.params.rid,
                    value: e,
                }
            }).then((res) => {
                if (res.data === 'Success') {
                    self.is_reported = true;
                }
            }).catch((err) => {

            })
        },
        arrive: function() {
            let self = this;
            axios({
                method: 'POST',
                url: '/api/cast/reserve/arrive',
                data: { rid: this.$route.params.rid },
            }).then((res) => {
                if (res.data === 'Success') {console.log(res.data);
                    self.$router.replace(`/cast/${self.$route.params.rid}/enter`);
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
.ffc-fix-arrive {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
}

.ffc-fix-arrive > p {
    width: 100%;
    font-size: 1.4rem;
    line-height: 2rem;
    text-align: center;
    margin-bottom: 1.5rem;
}

.ffc-fix-arrive > span {
    color: var(--cl-pink);
    margin-bottom: 0.3rem;
}


.ffc-fix-arrive > div {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;
    position: relative;
    overflow: hidden;
}

.ffc-fix-arrive .ffc-radio-btn {
    margin: 0 0.1rem;
    position: relative;
}

.ffc-fix-arrive .ffc-radio-btn input[type='radio'] + label {
    font-size: 0.9rem;
}

.ffc-fix-arrive .ffc-radio-btn label span {
    font-size: 1.6rem;
}

.ffc-fix-arrive .ffc-radio-btn input[type='radio']:checked + label span {
    color: #FFF;
}

.ffc-fix .ffc-card {
    align-items: stretch;
}

.ffc-fix .ffc-card-left,
.ffc-fix .ffc-card-right {
    width: 48%;
    display: flex;
    flx-direction: column;
    justify-content: space-around;
    flex-wrap: wrap;
}

.ffc-fix .ffc-card-left p {
    width: 100%;
    height: 3.5rem;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ffc-fix .ffc-card-right p {
    color: var(--cl-blue);
    font-weight: 500;
    width: 100%;
    height: 3.5rem;
    font-size: 1.8rem;
    line-height: 1.5rem;
    display: flex;
    justify-content: left;
    align-items: center;
}

.ffc-fix .ffc-card-right p.passive {
    font-size: 1.3rem;
    font-weight: 100;
    color: var(--cl-border);
}

.report-enter-active, .report-leave-active {
  transition: opacity .5s;
}
.report-enter, .report-leave-to {
  opacity: 0;
}

</style>
