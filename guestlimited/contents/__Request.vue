<template>
    <div class="ff-contract-block">
        <div class="ff-reserve-block ff-reserve-cast">
            <p>キャスト</p>
            <img src="/img/guest/sample11.png" alt="">
            <div class="ff-reserve-cast-name">
                <p>水崎えりか</p>
                <p>所属：Foofle東東京ディビジョン</p>
            </div>
        </div>
        <div v-if="ui_status.recent === 'first'" class="ff-reserve-block">
            <div class="ff-reserve-block-title">
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
                    <div class="ff-form-search">
                        <input class="" type="text" v-model="station_query">
                    </div>
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
                    {{ request.delivery_station }}
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
                                    <template v-for="(list, ind) in item.info">
                                        <div class="ff-reserve-btn"
                                            v-if="list.can_request && list.mins.filter(mi => mi.min == course.min)[0].can_request && !(index === 0 && item.can_soon && ind === 0)">
                                            <input type="radio" name="schedule"
                                                :id="`ff_reserve_${key}T${list.start_at}`"
                                                :value="`${key}/${ind}`"
                                                v-model="schedule_index"
                                                @change="calcTransportation">
                                            <label
                                                :for="`ff_reserve_${key}T${list.start_at}`">
                                                {{ list.start_at_display }}～<span>{{ list.departure_area.name }}発</span>
                                            </label>
                                        </div>
                                    </template>
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
                <button class="ff-btn-text" type="button" name="button"
                    data-move="end"
                    data-type="first"
                    @click="changeStatus"
                >OK</button>
            </div>
        </div>
        <div v-if="ui_status.recent !== 'first'" class="ff-reserve-block ff-reserve-confirm">
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
                data-move="edit"
                data-type="first"
                @click="changeStatus"
            >変更する</p>
        </div>
        <div v-if="ui_status.recent === 'second'" class="ff-reserve-block">
            <div class="ff-reserve-block-title">
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
                            <label :for="`option_${item.id}`">{{ item.name }}<span>{{ item.price }}</span></label>
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
                            <td>￥{{ course.price }}</td>
                        </tr>
                        <tr>
                            <td>オプション料金</td>
                            <td>￥{{ options_fee }}</td>
                        </tr>
                        <tr>
                            <td>交通費</td>
                            <td>￥{{ transportation_fee }}<span>発：{{ schedule.departure_area.name }}エリア→着：{{ request.delivery_station.name }}</span></td>
                        </tr>
                        <tr class="ff-reserve-fee-table-sum">
                            <td>小計</td>
                            <td>￥{{ total_fee }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="ff-search-body-row">
                <div class="ff-search-body-row-header">
                    <h4>マイルを使用する</h4>
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
                        <p>680<span>pt</span></p>
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
                    <p>お支払い総額<span>￥{{ payment_fee }}</span></p>
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
                <button class="ff-btn-text" type="button" name="button"
                    data-move="end"
                    data-type="second"
                    @click="changeStatus"
                >OK</button>
            </div>
        </div>
        <div v-if="ui_status.recent !== 'second'" class="ff-reserve-block ff-reserve-confirm">
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
                    <td>￥{{ payment_fee }}</td>
                </tr>
            </table>
            <p class="ff-reserve-confirm-edit"
                data-move="edit"
                data-type="second"
                @click="changeStatus"
            >変更する</p>
        </div>
        <div v-if="ui_status.recent === 'confirm'" class="ff-reserve-commit">
            <p>内容にお間違えがないか確認されましたら<br>「予約する」ボタンを押してください。</p>
            <div class="ff-btn-wrap ff-at-simple">
                <button class="ff-btn-text" type="button" name="button" @click="submitRequest">予約する</button>
            </div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper';
import axios from 'axios';
import GetMaster from '../../mixin/getMaster.js';

const Transportation = firebase.app().functions('asia-northeast1').httpsCallable('Transportation');

export default {
    data() {
        return {
            master: {
                service_category: [],
                delivery_type: [],
                options: [],
                stations: [],
                areas: [],
            },
            cast: {
                config: {
                    service: {
                        service_category: 0,
                        standard: [],
                        additional: [],
                        options: [],
                    },
                    course: [],
                    delivery_type: [],
                },
                schedule: [],
            },
            request: {
                cast_id: '',
                partner_id: 'bc1d37fcef30447e95d4',
                guest_id: '',
                service_category: true,
                delivery_station: '',
                delivery_type: '',
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
        }
    },
    mounted: function() {
        let self = this;
        /*
        {
            let db = firebase.app().firestore();
            db.collection('area').get().then((area_qss)=>{
                area_qss.forEach((qds) => {
                    self.master.areas.push(qds.data());
                })
            });
        }*/
        this.fetchData();
    },
    computed: {
        schedule: function() {
            let date = this.schedule_index.match(/\d{4}-\d{2}-\d{2}/);
            let ind = this.schedule_index.match(/\/(\d*)/);
            return ind ? this.cast.schedule[date[0]].info[ind[1]] : null;
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
    },
    methods: {
        fetchData: function() {
            let castid = this.$route.params.castid;
            let db = firebase.app().firestore();
            db.collection('cast').doc(castid).get().then((dns) => {
                let data = dns.data();
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
            }).then(() => {
                this.initSwiper();
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
        changeStatus: function(e) {
            let status = null;
            if (this.ui_status.is_confirm) {
                if (e.target.dataset.move === 'end') {
                    status = 'confirm';
                } else if (e.target.dataset.move === 'edit'){
                    status = e.target.dataset.type;
                }
            } else {
                if (e.target.dataset.move === 'end') {
                    if (e.target.dataset.type === 'first') {
                        status = 'second';
                    } else if (e.target.dataset.type === 'second') {
                        status = 'confirm';
                        this.ui_status.is_confirm = true;
                    }
                } else if (e.target.dataset.move === 'edit'){
                    status = e.target.dataset.type;
                }
            }
            this.ui_status.recent = status;
        },
        calcTransportation: function() {console.log('check');
            if (this.schedule && this.request.delivery_station) {
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
        submitRequest: function(e) {
            e.preventDefault();
            let self = this;
            let user = firebase.auth().currentUser;

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
                    this.request.token = token;console.log(token);
                    return Promise.resolve();
                }).then(() => {

                    if (true) {
                        let recieveRequest = firebase.app().functions('asia-northeast1').httpsCallable('recieveRequest');
                        recieveRequest(this.request).then(function(res) {
                            var sanitizedMessage = res.data;
                            let rid = /^R0[0-9a-f]{6}$/;
                            if (res && rid.test(res.data)) {

                            }

                              console.log(res);
                        }).catch((error) => {
                              console.log(`エラーだよ：${error.message}`);
                        });
                    } else {

                    }
                });
            } else {
                // user was signouted;
                window.location = '/signin';
            }
        },
    },
    mixins: [
        GetMaster,
    ],
}
</script>

<style scoped>

</style>
