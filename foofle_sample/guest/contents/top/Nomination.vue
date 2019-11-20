<template>
<div class="">
    <template v-if="nomination">
        <div class="time-remain">
            <p>募集終了まで</p>
            <div>
                <fa :icon="['far', 'clock']" size="lg"></fa>
                <div>
                    <p>残り</p>
                    <p>{{ remain.display }}</p>
                </div>
            </div>
        </div>
        <h3>逆指名リスト</h3>
        <div>
            <template v-if="nomination.cast.length > 0">
                <template v-for="item in nomination.cast">
                    <router-link :to="`/${item.id}`" class="profile-list">
                        <div class="profile-left">
                            <WebImage
                                :src="item.profile.img"
                            ></WebImage>
                        </div>
                        <div class="profile-right">
                            <div>
                                <p class="timestamp">
                                    <fa :icon="['far', 'envelope']" :style="{ color: '#ff2d94'}"></fa>
                                    {{ getDisplay(item.timestamp, 'HH:MM') }}
                                </p>
                                <h5>{{ item.profile.name }}</h5>
                                <p>24歳 <a class="hashtag">#巨乳</a><a class="hashtag">#大学生</a></p>
                            </div>
                            <div>
                                <p class="label">フォロー中！</p>
                                <fa class="angle" :icon="['fas', 'angle-down']" size="2x"></fa>
                            </div>
                        </div>
                    </router-link>
                </template>
            </template>
            <template v-else>
                <div class="profile-list length0">
                    <p>キャストの逆指名を待っています...</p>
                </div>
            </template>
        </div>
    </template>
    <div class="">
        <h3>逆指名</h3>
        <div class="nomination-condition">
            <div class="nomination-form">
                <p v-if="!nomination">いつ遊ぶ？</p>
                <p v-else>募集中</p>
                <ul class="nomination-when">
                    <li v-if="!nomination || soon === 'soon'" class="ff-btn ff-form-btnck">
                        <input id="issoon" type="radio" name="soon" value="soon" v-model="soon">
                        <label for="issoon">今すぐ</label>
                    </li>
                    <li v-if="!nomination || soon === 'not_soon'" class="ff-btn ff-form-btnck">
                        <input id="isnom" type="radio" name="soon" value="not_soon" v-model="soon">
                        <label for="isnom">日時指定</label>
                    </li>
                </ul>
                <div v-if="!nomination && !is_soon" class="nomination-select">
                    <select v-model="date">
                        <option
                            v-for="item in master_date"
                            :value="item.date"
                        >{{ item.display }}</option>
                    </select>
                    <select v-model="time">
                        <option
                            v-for="item in master_time"
                            :value="item.time"
                        >{{ item.display }}</option>
                    </select>
                </div>
                <p v-if="nomination && !is_soon">{{ date }} {{ time }}</p>
            </div>

            <div class="btn-wrap">
                <Btn
                    v-if="!nomination"
                    @click="beginNomination"
                    :disabled="is_sending"
                >逆指名を募る
                </Btn>
                <Btn
                    v-else
                    @click="endNomination"
                    :disabled="is_sending"
                >募集終了
                </Btn>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Btn from '../inner/Btn.vue';
import ProfileList from '../inner/ProfileList';
import timeHelper from '../../../mixin/timeHelper.js';

export default {
    data() {
        return {
            soon: 'soon',
            master_date: [],
            master_time: [],
            date: '',
            time: '1800',
            nomination_info: null,
            now: null,
            is_sending: false,
            nomination_cast: [],
        }
    },
    props: [
        'guest', 'nomination',
    ],
    computed: {
        is_soon: function() {
            return this.soon === 'soon';
        },
        remain: function() {
            let co = (display, min) => ({ display, min });
            if (this.nomination) {
                let ms = this.nomination.timestamp_end - this.now;
                if (ms < 0 ) {
                    return co('--:--', 0);
                }
                return co(`${Math.floor(ms / 60)}:${('00' + (ms % 60)).slice(-2)}`, ms);
            } else {
                return co('--:--', 0);
            }
        },
    },
    created: function() {
        let setNow = () => {
            this.now = Math.floor(new Date().getTime() / 1000);
        }
        window.setInterval(setNow, 500);
    },
    mounted: function() {
        let d = new Date();
        let mv = d.getHours() < 6 ? 2 : 1;
        let day = ['日','月','火','水','木','金','土'];
        d.setDate(d.getDate() - mv);
        for(let i = 0; i < 7; i++) {
            d.setDate(d.getDate() + 1);
            this.master_date.push({
                display: `${d.getMonth() + 1}/${d.getDate()} (${day[d.getDay()]})`,
                date: `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`,
            });
            if (i === 0) { this.date = this.master_date[0].date }
        }
        for (let i = 0; i < 24; i++) {
            this.master_time.push({
                display: `${i < 6 ? i + 24 : i}:00`,
                time: `${('00'+(i < 6 ? i + 24 : i)).slice(-2)}00`,
            });
            this.master_time.push({
                display: `${i < 6 ? i + 24 : i}:30`,
                time: `${('00'+(i < 6 ? i + 24 : i)).slice(-2)}30`,
            });
        }
        this.master_time.sort((a, b) => a.time - b.time);
    },
    methods: {
        beginNomination: function() {
            if (this.guest) { //usercheck
                this.is_sending = true;
                let data;
                let is_soon = this.soon === 'soon';
                let schedule = {
                    date: this.date,
                    start_at: is_soon ? null : this.time,
                    is_soon: is_soon,
                };

                let st = window.localStorage || null;
                if (st && st.hasOwnProperty('search_condition')) {
                    let sc = JSON.parse(st['search_condition']);
                    data = {
                        guest_id: this.guest.uid,
                        guest_name: this.guest.name,
                        delivery_area: sc.delivery_area,
                        delivery_type: sc.delivery_type,
                        service_category: sc.service_category,
                        schedule: schedule,
                        fee_max: sc.fee_max,
                        year_max: sc.year_max,
                        year_min: sc.year_min,
                        tags: [],
                    };

                } else {
                    data = {
                        guest_id: this.guest.uid,
                        guest_name: this.guest.name,
                        delivery_area: null,
                        delivery_type: [],
                        service_category: [],
                        schedule: schedule,
                        fee_max: null,
                        year_max: null,
                        year_min: null,
                        tags: [],
                    };
                }console.log(JSON.stringify(data));

                let recieveNomination = firebase.app().functions('asia-northeast1').httpsCallable('recieveNomination');
                recieveNomination(data).then((res) => {
                    if (res.data) {
                        //this.$eventHub.$emit('refreshNomination');
                        if (st) {
                            st['arrival_nomiation'] = res.data;
                        }
                    }
                }).finally(() => {
                    this.is_sending = false;
                });
            }
        },
        endNomination: function() {
            if (this.guest) {
                this.is_sending = true;
                let cancelNomination = firebase.app().functions('asia-northeast1').httpsCallable('cancelNomination');
                cancelNomination({
                    nomination_id: this.nomination.id,
                }).then((res) => {

                }).finally(() => {
                    this.is_sending = false;
                });
            }
        },
    },
    mixins: [
        timeHelper,
    ],
    components: {
        Btn, ProfileList,
    }
}
</script>

<style scoped>
h3 {
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 0.1rem;
    margin: 1rem 0;
    text-align: center;
}

.profile-list {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    background-color: #FFF;
    margin-top: -1px;
    padding: 0.2rem 1rem;
    border: 1px solid #EEE;
}

.profile-left {
    width: 78px;
    padding: 0.3rem 0;
}

.profile-left >>> img {
    width: 64px;
    border-radius: 72px;
}

.profile-right {
    width: calc(100% - 72px);
    padding-left: 0.5rem;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    position: relative;
}

.profile-right h5 {
    width: 100%;
    font-size: 1.4rem;
    margin: 0.8rem 0 0.5rem 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

.profile-right p {
    width: 100%;
    padding-bottom: 0.2rem;
    font-size: 0.9rem;
}

.profile-right span {
    padding-left: 1rem;
}

.profile-right span.is_commute {
    font-size: 1.1rem;
}

.profile-right span.is_vacation {
    font-size: 1rem;
}

.profile-right p.label {
    font-size: 1rem;
    letter-spacing: -0.2rem;
    width: unset;
    display: inline-block;
    color: #FFF;
    background: red;
    background: var(--cl-grad-layer);
    padding: 0.2rem 1rem;
    border-radius: 10rem;
    position: absolute;
    top: 0.3rem;
    right: 0;
    opacity: 1;
}

.profile-right a.hashtag {
    margin-right: 0.3rem;
}

.time-remain {
    width: 90%;
    margin: 1rem auto;
    padding: 1rem;
    border: 1px solid #DDD;
    border-radius: 5px;
    background-color: #FFF;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.time-remain > div {
    display: flex;
    justify-content: center;
    align-items: center;
}

.time-remain > div > div {
    margin-left: 1rem;
}

.time-remain > div > div p:nth-child(2) {
    color: var(--cl-pink);
    font-size: 2rem;
    font-weight: bold;
}

.nomination-form {
    text-align: center;
}

.nomination-form > p {
    color: var(--cl-pink);
    display: inline-block;
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.nomination-form ul {
    display: flex;
    justify-content: center;
}

.nomination-form ul > li:nth-child(2) {
    margin-left: 1rem;
}

.nomination-select {
    margin-top: 1rem;
}

.nomination-select select {
    padding: 0.3rem 1rem;
    border-radius: 3rem;
}

.btn-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
}

.btn-wrap div.btn {
    font-size: 1.2rem;
    padding: 1rem 1rem;
}

.profile-list.length0 {
    padding: 2rem 0;
}

.profile-list.length0 p {
    width: 100%;
    text-align: center;
}

.angle {
    position: absolute;
    right: 0.3rem;
    bottom: 1.5rem;
    transform: rotate(-90deg);
    opacity: 0.2;
}
</style>
