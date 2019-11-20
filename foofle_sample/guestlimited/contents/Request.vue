<template>
    <div class="ff-reserve" v-if="true">
        <div class="header-wrap" v-if="cast.profile">
            <div class="header">
                <WebImage
                    :src="cast.profile.img"
                >
            </WebImage>
                <p>{{ cast.profile.name }}<span>さんのご指名</span></p>
            </div>
        </div>
        <template v-if="cast.config">
            <div v-show="ui_status.recent === 'first'" class="reserve-block" id="first_input">
                <div class="reserve-title">
                    <p>STEP1</p>
                    <h2>コース・利用時間・日時の選択</h2>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>サービスカテゴリ</h4>
                        <div class="ff-tips">
                            <i class="sprite ff-icon-tips-blue"></i>
                            <div class="ff-tips-wrap">
                                <p>希望するサービスの種類を選択してください。</p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body">
                        <template v-for="(item, ind) in master.service_category">
                            <div class="ff-btn ff-form-btnck"
                                v-if="item.id === cast.config.service.service_category"
                            >
                                <input type="radio" id="service_soft" name="service_category" :value="item.id" v-model="request.service_category" checked>
                                <label for="service_soft">{{ item.name }}</label>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>コース時間</h4>
                        <div class="ff-tips">
                            <i></i>
                            <div class="ff-tips-wrap">
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body">
                        <div class="ff-form-btnradio"
                            v-for="(item, ind) in cast.config.course"
                        >
                            <input type="radio" name="minute"
                                :id="`ff_reserve_${item.min}`"
                                :value="ind"
                                v-model="course_index">
                            <label :for="`ff_reserve_${item.min}`">{{ item.min }}分</label>
                        </div>
                    </div>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>派遣エリア(最寄り駅)</h4>
                        <div class="ff-tips">
                            <i></i>
                            <div class="ff-tips-wrap">
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body">
                        <ul class="ff-search-suggest">
                            <li
                                @click="fixStationByUsed"
                                :data-json="JSON.stringify({'add':'松戸市松戸','area_id':1,'area_name':'松戸','id':'1132009','is_core':true,'is_launched':true,'lat':35.784472,'lon':139.900779,'name':'松戸','state':'千葉県'})"
                            >松戸</li>
                        </ul>
                        <div class="ff-form-search">
                            <input class="" type="text" v-model="station_query" placeholder="希望の駅を検索できます">
                            <fa :icon="['fas', 'search']"></fa>
                        </div>
                        <ul class="ff-search-list" v-if="station_query">
                            <template v-for="(item, ind) in suggest_station">
                                <li
                                    v-if="checkQuery(station_query, item.name)"
                                    :data-index="ind"
                                    @click="fixStation"
                                >{{ item.name }}</li>
                            </template>
                        </ul>
                        <div class="ff-search-fixed-item"
                            v-if="request.delivery_station"
                        >
                            <p>選択中：</p>
                            <div>
                                {{ request.delivery_station.name }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>派遣場所</h4>
                        <div class="ff-tips">
                            <i class="sprite ff-icon-tips-blue"></i>
                            <div class="ff-tips-wrap">
                                <p>希望派遣場所の種類を選択してください。</p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body">
                        <template v-for="(item, ind) in master.delivery_type">
                            <div class="ff-btn ff-form-btnck"
                                v-if="cast.config.delivery_type.filter(conf => conf === item.id).length > 0"
                            >
                                <input type="radio" :id="`delivery_type_${item.id}`" name="delivery_type" :value="item.id" v-model="request.delivery_type">
                                <label :for="`delivery_type_${item.id}`">{{ item.name }}</label>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>ご利用日時</h4>
                        <div class="ff-tips">
                            <i class="sprite ff-icon-tips-blue"></i>
                            <div class="ff-tips-wrap">
                                <p>希望するサービスの種類を選択してください。</p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body">
                        <div class="swiper-container" style="width:100%;">
                            <!-- Additional required wrapper -->
                            <div class="swiper-wrapper">
                                <!-- Slides -->
                                <div v-if="!is_loaded_schedule" class="swiper-slide ff-reserve-schedule">
                                    <Loading></Loading>
                                </div>
                                <div class="swiper-slide ff-reserve-schedule"
                                    v-for="(item, key, index) in cast.schedule"
                                >
                                    <p class="ff-reserve-schedule-count">{{ compileDayAfter(index) }}</p>
                                    <p class="ff-reserve-schedule-date">{{ compileDate(key) }}</p>
                                    <p class="ff-reserve-schedule-hour">{{ compileDay(key) }}</p>
                                    <div class="ff-reserve-btn ff-reserve-btn-soon"
                                        v-if="item.can_soon"
                                    >
                                        <input id="ff-reserve_date1" type="radio" name="schedule"
                                            :value="`${key}/0`"
                                            v-model="schedule_index"
                                            @change="calcTransportation">
                                        <label for="ff-reserve_date1">今すぐ<span>{{ item.info[0].departure_area.name }}発</span></label>
                                    </div>
                                    <div class="ff-reserve-schedule-list">
                                        <template v-if="item.info">
                                            <template v-for="(list, ind) in item.info">
                                                <div class="ff-reserve-btn"
                                                    v-if="list.can_request && list.mins.filter(mi => mi.min == course.min)[0] && list.mins.filter(mi => mi.min == course.min)[0].can_request && !(index === 0 && item.can_soon && ind === 0)">
                                                    <input type="radio" name="schedule"
                                                        :id="`ff_reserve_${key}T${list.start_at}`"
                                                        :value="`${key}/${ind}`"
                                                        v-model="schedule_index"
                                                        @change="calcTransportation">
                                                    <label
                                                        :for="`ff_reserve_${key}T${list.start_at}`">
                                                        {{ list.start_at_display }}
                                                    </label>
                                                </div>
                                            </template>
                                        </template>
                                        <div v-else class="non-schedule">
                                            スケジュールがありません
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- If we need navigation buttons -->
                            <div class="swiper-button-prev"></div>
                            <div class="swiper-button-next"></div>
                        </div>
                    </div>
                </div>

                <div class="ff-btn-wrap ff-at-simple">
                    <Btn event="next1st"
                        :disabled="!first_valid"
                        @next1st="changeStatus('end', 'first')"
                    >次へ</Btn>
                </div>
            </div>
            <div v-if="ui_status.recent !== 'first'" class="reserve-block ff-reserve-confirm">
                <table>
                    <tr>
                        <td>サービス</td>
                        <td>{{ master.service_category[request.service_category].name }}</td>
                    </tr>
                    <tr>
                        <td>コース時間</td>
                        <td>{{ course.min }}分</td>
                    </tr>
                    <tr>
                        <td>派遣場所最寄り駅</td>
                        <td>{{ request.delivery_station.name }}</td>
                    </tr>
                    <tr>
                        <td>派遣場所</td>
                        <td>{{ master.delivery_type[request.delivery_type].name }}</td>
                    </tr>
                    <tr>
                        <td>予約日時</td>
                        <td>{{ schedule.date.slice(-5).replace('-', '/') }}-<span>{{ schedule.is_soon ? '今すぐ' : schedule.start_at_display }}</span></td>
                    </tr>
                </table>
                <p class="ff-reserve-confirm-edit"
                    v-if="!is_sending"
                    data-move="edit"
                    data-type="first"
                    @click="changeStatus('edit', 'first')"
                >変更する</p>
            </div>
            <div v-show="ui_status.recent === 'second'" class="reserve-block" id="second_input">
                <div class="reserve-title">
                    <p>STEP2</p>
                    <h2>オプション・決済方法の選択</h2>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>基本サービス</h4>
                        <div class="ff-tips">
                            <i class="sprite ff-icon-tips-blue"></i>
                            <div class="ff-tips-wrap">
                                <p>希望するサービスの種類を選択してください。</p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body">
                        <ul class="ff-reserve-item-list">
                            <li class="ff-btn ff-form-btnck"
                                v-for="(item, ind) in request.standard"
                            >
                                <input type="checkbox"
                                    :id="`standard_${item.id}`"
                                    :checked="item.is_enable"
                                    :disabled="!item.is_enable">
                                <label :for="`standard_${item.id}`">{{ item.name }}</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>オプションサービス</h4>
                        <div class="ff-tips">
                            <i class="sprite ff-icon-tips-blue"></i>
                            <div class="ff-tips-wrap">
                                <p>希望するサービスの種類を選択してください。</p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body">
                        <ul class="ff-reserve-item-list">
                            <li class="ff-btn ff-form-btnck"
                                v-for="(item, ind) in cast.config.service.options"
                            >
                                <input type="checkbox"
                                    :id="`option_${item.id}`"
                                    :value="ind"
                                    v-model="options_tmp"
                                >
                                <label :for="`option_${item.id}`">{{ item.name }}<span>{{ currency(item.price) }}</span></label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>ご利用料金</h4>
                        <div class="ff-tips">
                            <i></i>
                            <div class="ff-tips-wrap">
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body">
                        <table class="ff-reserve-fee-table">
                            <tr>
                                <td>基本コース料金</td>
                                <td>{{ currency(course.price) }}</td>
                            </tr>
                            <tr>
                                <td>オプション料金</td>
                                <td>{{ currency(options_fee) }}</td>
                            </tr>
                            <tr>
                                <td>交通費</td>
                                <td>{{ currency(transportation_fee) }}<span>発：{{ schedule.departure_area.name }}エリア→着：{{ request.delivery_station.name }}</span></td>
                            </tr>
                            <tr class="ff-reserve-fee-table-sum">
                                <td>小計</td>
                                <td>{{ currency(total_fee) }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>ポイントの使用</h4>
                        <div class="ff-tips">
                            <i class="sprite ff-icon-tips-blue"></i>
                            <div class="ff-tips-wrap">
                                <p>希望するサービスの種類を選択してください。</p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body ff-reserve-mile">
                        <div class="ff-reserve-mile-left">
                            <p>使用可能</p>
                            <i class="sprite ff-icon-mile-color"></i>
                            <p v-if="guest">{{ guest.mile.balance }}<span>pt</span></p>
                        </div>
                        <div class="ff-reserve-mile-right">
                            <input type="number" value="0" v-model="request.mile_use">
                            <p>pt使用する</p>
                        </div>
                    </div>
                </div>
                <div class="ff-search-body-row">
                    <div class="ff-search-body-row-header">
                        <h4>お支払い方法</h4>
                        <div class="ff-tips">
                            <i></i>
                            <div class="ff-tips-wrap">
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-search-body-row-body ff-reserve-payment">
                        <p>お支払い総額<span>{{ currency(payment_fee) }}</span></p>
                        <div class="ff-reserve-payment-block">
                            <div class="ff-form-radio">
                                <input id="payment1" type="radio" name="is_cc" value="1" v-model="request.is_cc">
                                <label for="payment1">クレジットカード事前決済</label>
                            </div>
                            <div class="ff-form-radio">
                                <input id="payment2" type="radio" name="is_cc" value="0" v-model="request.is_cc">
                                <label for="payment2">現金(キャストに手渡し)</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ff-btn-wrap ff-at-simple">
                    <Btn event="next2nd"
                        data-move="end"
                        data-type="first"
                        @next2nd="changeStatus('end', 'second')"
                    >次へ</Btn>
                </div>
            </div>
            <div v-if="ui_status.recent === 'confirm'" class="reserve-block ff-reserve-confirm">
                <table>
                    <tr>
                        <td>基本サービス</td>
                        <td>
                            <template v-for="(item, ind) in request.standard">
                                <template v-if="item.is_enable">
                                    {{ item.name }}&emsp;
                                </template>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td>オプションサービス</td>
                        <td>
                            <template v-if="options.length">
                                <template v-for="item in options">
                                    {{ item.name }}&emsp;
                                </template>
                            </template>
                            <template v-else>
                                選択されていません
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td>お支払い方法</td>
                        <td>{{ request.is_cc ? 'クレジットカード事前決済' : '現金(当日キャストへお支払い)' }}</td>
                    </tr>
                    <tr>
                        <td>お支払い総額</td>
                        <td>{{ currency(payment_fee) }}</td>
                    </tr>
                </table>
                <p class="ff-reserve-confirm-edit"
                    v-if="!is_sending"
                    data-move="edit"
                    data-type="second"
                    @click="changeStatus('edit', 'second')"
                >変更する</p>
            </div>
        </template>
        <div v-if="ui_status.recent === 'confirm'" class="ff-reserve-commit">
            <template v-if="!is_sending">
                <p>内容にお間違えがないか確認されましたら<br>「予約する」ボタンを押してください。</p>
                <Btn
                    event="submit"
                    @submit="submitRequest"
                >予約する</Btn>
            </template>
            <Loading v-else
                text="送信中"
            ></Loading>
        </div>
    </div>
</template>

<script>
import u from 'umbrellajs';
import Swiper from 'swiper';
import axios from 'axios';
import getMaster from '../../mixin/getMaster.js';
import formatData from '../../mixin/formatData.js';

import Btn from './inner/Btn.vue';

const Transportation = firebase.app().functions('asia-northeast1').httpsCallable('Transportation');

export default {
    data() {
        return {
            name: null,
            master: {
                service_category: [],
                delivery_type: [],
                options: [],
                stations: [],
                areas: [],
            },
            cast: {
                profile: null,
                config: null,
                schedule: null,
            },
            request: {
                cast_id: '',
                partner_id: 'bc1d37fcef30447e95d4',
                guest_id: '',
                service_category: true,
                delivery_station: '',
                delivery_type: 1,
                transportation: null,
                schedule: {},
                is_soon: false,
                standard: [],
                options: [],
                mile_use: 0,
                fee: {},
                is_cc: 0,
            },
            station_query: '',
            suggest_station: [],
            options_tmp: [],
            course_index: 0,
            schedule_index: '',
            ui_status: {
                recent: 'first',
                is_confirm: false,
            },
            is_loaded_schedule: false,
            is_sending: false,
        }
    },
    props: [
        'guest',
    ],
    mounted: function() {
        let self = this;
        this.fetchData();
    },
    computed: {
        schedule: function() {
            let date = this.schedule_index.match(/\d{4}-\d{2}-\d{2}/);
            let ind = this.schedule_index.match(/\/(\d*)/);
            return ind ? this.cast.schedule[date[0]].info[ind[1]] : { departure_area: { name: null, }};
        },
        options: function() {
            let arr = [];
            for (let i = 0; i< this.options_tmp.length; i++) {
                arr.push(this.cast.config.service.options[this.options_tmp[i]]);
            }
            return arr;
        },
        options_fee: function() {
            let fee = 0;
            this.options.forEach((item) => fee += (item.price-0));
            return fee;
        },
        course: function() {
            return this.cast.config.course[this.course_index];
        },
        transportation_fee: function() {
            let obj = this.request.transportation;
            if (obj) {
                let h = this.schedule.start_at.slice(0, 2);
                let m = this.schedule.start_at.slice(-2)-0;

                let j = t => ((23 <= t && t <= 29 ) || t <= 5);

                let sn = j(h);

                m += (this.course.min-0);
                while (m >= 60) {
                    m -= 60;
                    h++;
                }
                let en = j(h);
                let fee = (sn && en) ? obj.fee_night_trip : (sn || en) ? obj.fee_atline_trip : obj.fee_trip;

                return fee;
            }
            return 0;
        },
        total_fee: function() {
            try {
                return (this.course.price-0) + (this.options_fee-0) + (this.transportation_fee-0);
            } catch(e) {
                return 0;
            }
        },
        payment_fee: function() {
            let rootfee = (this.total_fee-0) - (this.request.mile_use-0);
            return (this.request.is_cc-0) ? rootfee : Math.ceil(rootfee / 1000) * 1000;
        },
        first_valid: function() {
            if (this.request.delivery_type && this.course.min && this.request.delivery_station.name
                && this.request.delivery_type && this.schedule.can_request) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        fetchData: function() {
            let castid = this.$route.params.castid.toUpperCase();
            let db = firebase.app().firestore();
            db.collection('cast').doc(castid).get().then((dns) => {
                let data = dns.data();
                this.cast.profile = data.profile;
                this.cast.config = data.config;

                // Request init
                this.request.cast_id = castid;
                this.request.partner_id = data.partner_id;
                this.request.service_category = data.config.service.service_category;
                for (let i = 0; i < data.config.service.standard.length; i++) {
                    this.request.standard.push(data.config.service.standard[i]);
                }
                for (let i = 0; i < data.config.service.additional.length; i++) {
                    this.request.standard.push(data.config.service.additional[i]);
                }
            });

            let getCastSchedule = firebase.app().functions('asia-northeast1').httpsCallable('getCastSchedule');
            getCastSchedule({cast_id: castid}).then((res) => {
                this.cast.schedule = res.data;
                return this.$nextTick();
            }).then(() => {
                this.is_loaded_schedule = true;
                window.setTimeout(()=> {
                    this.initSwiper();
                }, 1000);
            });

            this.getAreas().then((res) => {
                this.master.areas = res;
            });
            /* decrease reading firestore comment in required */
            this.getStations().then((res) => {
                this.suggest_station = res;
            });
            this.getServiceCategory().then((res) => {
                this.master.service_category = res;
            });
            this.getDeliveryType().then((res) => {
                this.master.delivery_type = res;
            });

        },
        initSwiper: function() {
            let mySwiper = new Swiper ('.swiper-container', {
                // Optional parameters
                direction: 'horizontal',
                speed: 100,
                autoHeight: true,

                // Navigation arrows
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            })
        },
        compileDayAfter: function(ind) {
            switch (ind) {
                case 0:
                    return '本日';
                case 1:
                    return '明日';
                case 2:
                    return 'あさって';
                default:
                    return `${ind}日後`;
            }
        },
        compileDate: function(day) {
            let d = new Date(day);
            return `${d.getMonth()+1}/${d.getDate()}`;
        },
        compileDay: function(day) {
            let d = new Date(day);
            let a = ['日', '月', '火', '水', '木', '金', '土'];
            return `${a[d.getDay()]}曜日`;
        },
        fixStation: function(e) {
            e.preventDefault();
            let ind = e.target.dataset.index;
            this.request.delivery_station = this.suggest_station[ind];
            this.calcTransportation();
        },
        fixStationByUsed: function(e) {
            e.preventDefault();
            let json = e.target.dataset.json;
            this.request.delivery_station = JSON.parse(json);
            this.calcTransportation();
        },
        changeStatus: function(move, type) {
            let status = null;
            if (this.ui_status.is_confirm) {
                if (move === 'end') {
                    status = 'confirm';
                } else if (move === 'edit'){
                    status = type;
                    let el = document.getElementById(`${type}_input`);console.log(el);
                    this.$SmoothScroll(el);
                }
            } else {
                if (move === 'end') {
                    if (type === 'first') {
                        status = 'second';
                    } else if (type === 'second') {
                        status = 'confirm';
                        this.ui_status.is_confirm = true;
                    }
                } else if (move === 'edit'){
                    status = type;
                    let el = document.getElementById(`${type}_input`);console.log(el);
                    this.$SmoothScroll(el);
                }
            }
            this.ui_status.recent = status;
        },
        calcTransportation: function() {console.log('check');
            if (this.schedule.departure_area.name && this.request.delivery_station) {
                Transportation({
                    from: this.schedule.departure_area,
                    to: this.request.delivery_station,
                }).then((res) => {
                    this.request.transportation = res.data;
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                this.request.transportation = null;
            }
        },
        submitRequest: function() {
            let self = this;
            let user = firebase.auth().currentUser;
            this.is_sending = true;

            if (user) {
                // Request Data
                this.request.guest_id = user.uid;
                this.request.fee = {
                    course: this.course.price-0,
                    options: this.options_fee,
                    transportation: this.transportation_fee,
                    total: this.total_fee,
                    payment: this.payment_fee,
                };
                this.request.options = this.options;
                this.request.course = this.course;
                this.request.schedule = this.schedule;

                user.getIdToken().then((token) => {
                    this.request.token = token;
                    return Promise.resolve();
                }).then(() => {

                    // SMS Auth Check
                    if (user.phoneNumber) {
                        let recieveRequest = firebase.app().functions('asia-northeast1').httpsCallable('recieveRequest');
                        recieveRequest(this.request).then(function(res) {
                            var sanitizedMessage = res.data;
                            let rid = /^R0[0-9a-f]{6}$/;
                            if (res && rid.test(res.data)) {
                                self.$router.replace(`/reserve/${res.data}`);
                            } else {
                                console.log(res);
                                self.is_sending = false;
                            }
                        }).catch((error) => {
                              console.log(`Error：${error.message}`);
                        });
                    } else {
                        let storage = window.localStorage || null;
                        if (storage) {
                            storage['pending_order_reason_by_unauthsms'] = JSON.stringify(this.request);
                            self.$router.push(`/reserve/pending`);
                        } else {
                            self.$router.push(`/reserve/R0YYYYYY`); // SMS認証ページ
                        }
                    }
                });
            } else {
                // user was signouted;
                window.location = '/signin';
            }
        },
    },
    components: {
        Btn,
    },
    mixins: [
        getMaster, formatData,
    ],
}
</script>

<style scoped>
.ff-reserve {
    background-color: var(--cl-grey-light);
}

.header-wrap {
    width: 100%;
    height: 54px;
    background: var(--cl-grad);
    margin-bottom: 1rem;
    position: relative;
    z-index: 20;
}

.header {
    width:100%;
    height: 50px;
    padding: 0 1rem;
    background-color: #FFF;
    border-bottom: 1px solid var(--cl-border-light);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 21;
}

.header >>> img {
    width: 46px;
    height: 46px;
    border-radius: 38px;
    margin-right: 1rem;
}

.header p {
    font-size: 1.2rem;
}

.reserve-block {
    background-color: #FFF;
    width: 100%;
    border: 1px solid var(--cl-border-light);
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.reserve-title {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}

.reserve-title p {
    display: inline-block;
    color: #000;
    font-size: 1.4rem;
    letter-spacing: 0.4rem;
    font-weight: bold;
}

.reserve-title h2 {
    display: inline-block;
    font-size: 1.2rem;
}

.swiper-button-next,
.swiper-button-prev {
    top: 3rem !important;
    width: 30px;
    height: 24px;
}

.swiper-button-next {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ff2d94'%2F%3E%3C%2Fsvg%3E")  !important;
}

.swiper-button-prev {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ff2d94'%2F%3E%3C%2Fsvg%3E")  !important;
}

.non-schedule {
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
}

table {
    width: 100%;
}

table tr {
    border-bottom: 1px solid var(--cl-border-light);
}

table td {
    font-size: 1.2rem;
    text-align: center;
    vertical-align: middle;
    padding: 1rem 0.4rem;
    word-break: keep-all;
}

table td:nth-child(1) {
    font-size: 1.1rem;
    color: var(--cl-pink);
    min-width: 40vw;
}

.ff-search-body-row {
    margin-top: -1px;
    padding: 1.2rem 0 0;
}

.ff-search-body-row-header {
    display: flex;
}

.ff-search-body-row-header h4 {
    font-size: 1rem;
    line-height: 1.8rem;
    margin-bottom: 0.4rem;
}

.ff-search-body-row-body {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.ff-search-list {
    width: 100%;
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
}

.ff-search-suggest {
    width: 100%;
    margin-bottom: 0.5rem;
    display: flex;
    flex-wrap: wrap;
}

.ff-search-list li,
.ff-search-suggest li,
.ff-search-fixed-item div {
    font-size: 1.2rem;
    padding: 0.4rem 0.6rem;
    margin: 0 0.3rem 0.3rem 0;
    border: 1px solid var(--cl-border);
    border-radius: 0.3rem;
}

.ff-search-fixed-item {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0.5rem;
}

.ff-search-fixed-item p {
    font-size: 1rem;
    margin-right: 1rem;
}

.ff-search-fixed-item div {
    color: #FFF;
    background-color: var(--cl-pink);
    border-color: var(--cl-pink);
}

</style>
