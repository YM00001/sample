<template>
    <div class="msg-wrap">
        <div v-if="!(viewStatus === 'reviewed' || viewStatus === 'canceled')" class="step-icon">
            <p>次のステップ</p>
        </div>
        <div v-if="viewStatus === 'before-entered-hotel'" class="step-content">
            <h3>ホテル入室</h3>
            <p>ご予約時間の10分前までに<br />ホテルへ入室してください。</p>
            <p>入室したらホテル名と部屋番号をご入力ください。</p>
            <div class="step-input">
                <label for="">ホテル名</label>
                <input type="text" placeholder="例)ホテルFoofle" v-model="building.address">
            </div>
            <div class="step-input">
                <label for="">部屋番号</label>
                <input type="text" placeholder="例)201" v-model="building.room">
            </div>
            <div class="step-btn">
                <Btn
                @click="setBuilding"
                :disabled="!building.address || !building.room || is_update_building"
                >送信</Btn>
            </div>
        </div>
        <div v-if="viewStatus === 'before-paycalled' || viewStatus === 'reject-paycalled'" class="step-content">
            <h3>クレジットカード決済</h3>
            <template v-if="viewStatus === 'reject-paycalled'">
                <p class="error-msg">店舗により支払いが否決されました。<br />正しく支払いが完了していることを確認してください。</p>
                <p class="error-msg">必要に応じて店舗に連絡を取り<br />サポートを受けてください。</p>
            </template>
            <p>下記URLへアクセスして事前決済を行ってください。</p>
            <p>お支払い金額：<span class="step-fee">10000</span>円</p>
            <a class="step-ccurl" href="#" target="_blank">https://kirakawa-campus.com/</a>
            <p>なおページ先では{{ reserve.cast_name }}さん所属の{{ reserve.partner_name }}が店舗名として表示されます。<br />誤りではございませんのでご安心くださいませ。</p>
            <div class="step-btn">
                <Btn
                    @click="setPaid"
                    :disabled="is_update_paid"
                >完了</Btn>
            </div>
        </div>
        <div v-if="viewStatus === 'paycalled'" class="step-content">
            <h3>決済確認中</h3>
            <p>お支払い情報を確認中です。<br />しばらくお待ち下さい。</p>
        </div>
        <div v-if="viewStatus === 'before-entered-home'" class="step-content">
            <h3>派遣先住所入力</h3>
            <p>ご自宅の住所をご入力ください。</p>
            <div class="step-input">
                <select class="" name="">
                    <option>港区新橋1-1-1 202</option>
                </select>
            </div>
            <div class="step-input">
                <label for="">住所</label>
                <input type="text" placeholder="例)港区新橋1-1-1" v-model="building.address">
            </div>
            <div class="step-input">
                <label for="">部屋番号</label>
                <input type="text" placeholder="例)202" v-model="building.room">
            </div>
            <div class="step-btn">
                <Btn
                @click="setBuilding"
                :disabled="!building.address || !building.room || is_update_building"
                >送信</Btn>
            </div>
        </div>
        <div v-if="viewStatus === 'entered'" class="step-content">
            <h3>キャストの到着をお待ち下さい</h3>
            <p>ご予約日時になりましたらキャストがお伺いいたします。</p>
            <p class="reserve-pin">{{ reserve.pin }}</p>
            <p>このPINコードはキャストが使用します。<br />求められたらキャストにお伝え下さい。</p>
            <p>キャストがPINコードを確認すると<br />サービス開始、お時間がスタートします。</p>
        </div>
        <div v-if="viewStatus === 'started'" class="step-content">
            <h3>お時間いっぱいお楽しみください</h3>
            <p>終了予定時刻</p>
            <p class="reserve-pin">{{ finishTime }}</p>
        </div>
        <div v-if="viewStatus === 'before-reviewed'" class="step-content">
            <h3>ご満足いただけましたか？</h3>
            <p>キャストについてのレビューを投稿しましょう！<br /></p>
            <p>かんたんなレビューを投稿すると<br /><span class="mile"><span class="mile-fee">{{ bonusMile }}</span>円</span>相当のポイント<span class="mile-get">プレゼント</span></p>
            <div class="step-star">

                <div class="step-stars">
                    <fa
                    v-for="(conf, ind) in starOptions"
                    :key="`_${ind}`"
                    :icon="conf.fas"
                    :style="conf.col"
                    size="3x"
                    ></fa>
                </div>
                <SingleSlider
                ref="star"
                :conf="{
                    name: 'star',
                    min: 0,
                    max: 5,
                    lot: 0.5,
                    unit: '',
                    default: 3,
                    display: {
                    },
                }"
                @change="setStarOptions"
                ></SingleSlider>
            </div>
            <textarea name="name" placeholder="コメント・感想をご記入ください。(150字以内)"
            v-model="comment"
            ></textarea>
            <p class="note"><a>レビューに関するガイドライン</a>に違反しているレビューは削除されます。<br />レビューはあなたの投稿として公開されます。</p>
            <div class="step-btn">
                <Btn
                :disabled="!comment"
                v-if="!is_sending_review"
                @click="submitReview"
                >送信</Btn>
                <Loading v-else></Loading>
            </div>
        </div>
        <div v-if="viewStatus === 'reviewed'" class="step-content">
            <div v-if="is_sending_review" class="step-btn">
                <Loading></Loading>
            </div>
            <template v-if="is_sent_review">
                <div class="step-btn">
                    <p>レビューの投稿ありがとうございました！</p>
                    <a class="backlink" href="/top">TOPに戻る</a>
                </div>
            </template>
        </div>
        <div class="reserve-info-wrap" v-if="reserve.schedule.date">
            <h4>ご予約情報</h4>
            <table>
                <tr>
                    <th>ご利用日時</th>
                    <td>{{ reserve.schedule.date }} {{ reserve.schedule.start_at.replace(/(\d{2})(\d{2})/, '$1:$2') }}</td>
                </tr>
                <tr>
                    <th>キャスト</th>
                    <td>{{ reserve.cast_name }}</td>
                </tr>
                <tr>
                    <th>派遣場所区分</th>
                    <td>{{ master.delivery_type[reserve.transportation.delivery_type].name }}</td>
                </tr>
                <tr>
                    <th>派遣場所最寄り</th>
                    <td>{{ reserve.transportation.delivery_station.name }}</td>
                </tr>
                <tr>
                    <th>派遣場所</th>
                    <td>{{ reserve.building.address }}</td>
                </tr>
                <tr>
                    <th>部屋番号</th>
                    <td>{{ reserve.building.room }}</td>
                </tr>
                <tr>
                    <th>サービスカテゴリ</th>
                    <td>{{ master.service_category[reserve.course.service_category].name }}</td>
                </tr>
                <tr>
                    <th>コース時間</th>
                    <td>{{ reserve.course.min }}分</td>
                </tr>
                <tr>
                    <th>基本プレイ</th>
                    <td>
                        <template v-for="(item, key) in reserve.course.standard">
                            {{ item.name }}　
                        </template>
                    </td>
                </tr>
                <tr>
                    <th>オプションプレイ</th>
                    <td>
                        <template v-if="reserve.course.options.length">
                            <template v-for="(item, key) in reserve.course.option">
                                {{ item.name }}
                            </template>
                        </template>
                        <template v-else>
                            なし
                        </template>
                    </td>
                </tr>
                <tr>
                    <th>ご利用料金</th>
                    <td>{{ reserve.fee.payment_fee }}円</td>
                </tr>
                <tr>
                    <th colspan="2">内訳</th>
                </tr>
                <tr>
                    <th>コース料金</th>
                    <td>{{ reserve.fee.course_fee }}円</td>
                </tr>
                <tr>
                    <th>オプション料金</th>
                    <td>{{ reserve.fee.options_fee }}円</td>
                </tr>
                <tr>
                    <th>交通費</th>
                    <td>{{ reserve.fee.transportation_fee }}円</td>
                </tr>
                <tr>
                    <th>現金決済調整</th>
                    <td>{{ reserve.fee.payment_fee - reserve.fee.total_fee }}円</td>
                </tr>
                <tr>
                    <th colspan="2"></th>
                </tr>
                <tr>
                    <th>使用ポイント</th>
                    <td>{{ reserve.mile.use }}pt</td>
                </tr>
                <tr>
                    <th>獲得ポイント(見込み)</th>
                    <td>{{ reserve.mile.additional_cast + reserve.mile.additional_official + reserve.mile.transportation_adjust }}pt</td>
                </tr>
                <tr>
                    <th>決済方法</th>
                    <td>{{ reserve.fee.is_cc ? 'クレジットカード事前決済' : '現金' }}</td>
                </tr>
                <tr>
                    <th>認証PIN</th>
                    <td>{{ reserve.pin }}</td>
                </tr>
                <tr>
                    <th>キャスト所属</th>
                    <td>{{ reserve.partner_name }}</td>
                </tr>
                <tr>
                    <th>ご予約受付日時</th>
                    <td>{{ displayTimestamp(reserve.timestamp.created) }}</td>
                </tr>
                <tr>
                    <th>サービス開始日時</th>
                    <td>{{ displayTimestamp(reserve.timestamp.started) }}</td>
                </tr>
                <tr>
                    <th>サービス終了日時</th>
                    <td>{{ displayTimestamp(reserve.timestamp.finished) }}</td>
                </tr>
                <tr>
                    <th>キャンセル日時</th>
                    <td>{{ displayTimestamp(reserve.timestamp.canceled) }}</td>
                </tr>
                <tr>
                    <th>キャンセル事由</th>
                    <td>{{ master.hasOwnProperty('cancel_reason') ? master.cancel_reason[reserve.cancel.reason_id].reason : '' }}</td>
                </tr>
            </table>
        </div>
        <div class="reserve-command">
            <ul>
                <li
                v-if="!reserve.status.is_canceled && !reserve.status.is_arrived"
                @click="cancelReserve"
                >この予約をキャンセルする</li>
                <li>この予約についてサポートを受ける</li>
            </ul>
        </div>
        <div class="reserve-botinfo"
        v-if="!reserve.status.is_arrived && (reserve.schedule.is_soon || reserve.report.expected)"
        >
        <div class="reserve-botinfo-inner">
            <fa :icon="['fas', 'bullhorn']" :style="{ color: '#ff2d94'}" size="lg"></fa>
            <p v-if="reserve.report.expected">
                From {{ reserve.cast_name }}:あと約{{ expectToArrive }}分で到着します！
            </p>
            <p v-else>キャストがお客さまのもとへ向かっています！</p>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';

import getMaster from '../../mixin/getMaster.js';
import timeHelper from '../../mixin/timeHelper.js';
import Loading from '../../guest/contents/inner/Loading.vue';
import Btn from './inner/Btn.vue';
import SingleSlider from '../../guest/contents/form/SingleSlider.vue';

export default {
    data() {
        return {
            master: {},
            starOptions: [],
            reserve: {
                schedule: {
                    date: null,
                },
                status: {
                    is_arrived: false,
                },
                report: {
                    expect: 0,
                },
            },
            building: {
                address: '',
                room: '',
            },
            comment: '',
            is_update_building: false,
            is_update_paid: false,
            is_sending_review: false,
            is_sent_review: false,
        }
    },
    computed: {
        star: function() {
            return this.$refs.star.getValue();
        },
        viewStatus: function() {
            if (!this.reserve.hasOwnProperty('fee')) {
                return 'unloaded';
            } else {
                let tp = this.reserve.transportation;
                let building = this.reserve.building;
                let status = this.reserve.status;
                let cc = this.reserve.fee.is_cc;

                if (status.is_canceled) { return 'canceled'; }
                if (status.is_finished && status.is_reviewed) { return 'reviewed'; }
                if (status.is_finished && !status.is_reviewed) { return 'before-reviewed'; }
                if (!status.is_finished && status.is_started) { return 'started'; }
                if (building.address) { return 'entered'; }
                if ((cc && status.is_paid || !cc) && !building.address && tp.delivery_type == 3) { return 'before-entered-home'; }
                if ((cc && status.is_paid || !cc) && !building.address && (tp.delivery_type == 1 || tp.delivery_type == 2)) { return 'before-entered-hotel'; }
                if (cc && status.is_pay_rejected) { return 'reject-paycalled' }
                if (cc && status.is_pay_attempted) { return 'paycalled' }
                if (cc && !status.is_pay_attempted) { return 'before-paycalled'}
            }
        },
        expectToArrive: function() {
            let report = this.reserve.report.expected;
            if (!report) { return ''; }

            let d = new Date(this.reserve.timestamp.reported * 1000);
            let n = new Date();
            d.setMinutes(d.getMinutes() + report);
            let sec = Math.floor((d.getTime() - n.getTime()) / 1000);
            return Math.floor(sec / 60) - ((Math.floor(sec / 60)) % 5) + 5
        },
        finishTime: function() {
            if (!this.reserve.timestamp.started) { return ''; }
            let endat = (this.reserve.timestamp.started + (this.reserve.course.min * 60)) * 1000;
            let d = new Date(endat);
            return `${d.getHours()}:${('00'+d.getMinutes()).slice(-2)}`;
        },
        bonusMile: function() {
            if (this.reserve) {
                return Math.floor((this.reserve.fee.course_fee + this.reserve.fee.options_fee + this.reserve.fee.transportation_fee) * 0.01);
            } else {
                return 0;
            }
        },
    },
    mounted: function() {
        this.setStarOptions(3);

        this.reserve_id = this.$route.params.reserveid;
        firebase.firestore().collection('reserve').doc(this.reserve_id).onSnapshot((doc) => {
            this.reserve = doc.data();
        });

        this.getServiceCategory().then((res) => {
            this.master.service_category = res;
        });
        this.getDeliveryType().then((res) => {
            this.master.delivery_type = res;
        });

        this.getCancelReason().then((res) => {
            this.master.cancel_reason = res;
        });
    },
    methods: {
        setStarOptions: function(val) {
            if (!val) {
                return [];
            }
            let a = Math.floor(val);
            let b = val % 1 === 0.5;

            let prop1 = { fas : ['fas', 'star'], col : { color : '#ffe51e'}};
            let prop5 = { fas : ['fas', 'star-half-alt'], col : { color : '#ffe51e'}};
            let prop0 = { fas : ['far', 'star'], col : { color : '#ffe51e'}};

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
            this.starOptions = res;
            return res;
        },
        displayTimestamp: function(ts) {
            if (!ts) { return ''; }
            let d = new Date(ts * 1000);
            let mn = d.getHours() < 6;
            if (mn) {
                d.setDate(d.getDate() - 1);
            }
            let day = `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`;
            let hour = mn ? d.getHours() + 24 : d.getHours();
            return `${day} ${('00'+hour).slice(-2)}:${('00'+d.getMinutes()).slice(-2)}`;
        },
        setBuilding: function() {
            this.is_update_building = true;
            firebase.firestore().collection('reserve').doc(this.reserve_id).update({
                'building.address': this.building.address,
                'building.room': this.building.room,
            }).finally(() => {
                this.is_update_building = false;
            });
        },
        setPaid: function() {
            this.is_update_paid = true;
            firebase.firestore().collection('reserve').doc(this.reserve_id).update({
                'status.is_pay_attempted': true,
                'status.is_pay_rejected': false,
                'timestamp.pay_attempted': this.getNow(),
            }).finally(() => {
                this.is_update_building = false;
            });
        },
        submitReview: function() {
            this.is_sending_review = true;
            let self = this;
            let now = Math.floor((new Date().getTime()) / 1000);
            firebase.firestore().collection('reserve').doc(this.reserve_id).update({
                'review.star': this.star,
                'review.comment': this.comment,
                'status.is_reviewed': true,
                'timestamp.reviewed': now,
            }).then((res) => {
                let deployReview = firebase.app().functions('asia-northeast1').httpsCallable('deployReview');
                deployReview({ reserve_id: this.reserve_id }).then(function(res) {
                    console.log(res);
                    self.is_sending_review = false;
                    self.is_sent_review = true;
                }).catch((error) => {
                    console.log(`Error：${error.message}`);
                });
            });
        },
        cancelReserve: function() {
            this.$eventHub.$emit('openCommand', 'cancel', {reserve_id: this.reserve_id, });
        },
    },
    mixins: [
        getMaster, timeHelper,
    ],
    components: {
        Btn, SingleSlider, Loading,
    },
}
</script>

<style scoped>
.msg-wrap {
    padding: 2rem 1rem 5rem;
    background-color: #FFF;
}

.thanks-msg {
    margin-bottom: 2rem;
}

.thanks-msg h1 {
    font-size: 1.4rem;
    text-align: center;
    padding: 2.5rem 0;
}

.msg-wrap p {
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.4rem;;
    margin-bottom: 1rem;
}

.step-icon {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.step-icon p {
    color: #FFF;
    font-size: 1.2rem;
    font-weight: 500;
    background-color: var(--cl-pink);
    display: inline-block;
    padding: 0.5rem 1.3rem;
    margin-bottom: 1.5rem;
}

.step-content {
    margin-bottom: 3rem;
}

.step-content h3 {
    color: var(--cl-pink);
    font-size: 1.4rem;
    font-weight: bold;
    width: 100%;
    text-align: center;
    margin-bottom: 1rem;
}

.step-input {
    margin-bottom: 0.5rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
}

.step-input label {
    color: var(--cl-pink);
    padding-right: 0.3rem;
}

.step-input input,
.step-input select {
    background-color: var(--cl-grey-light);
    width: 80%;
    height: 2.5rem;
    padding: 0 0.5rem;
}

.step-btn {
    width: 100%;
    text-align: center;
    padding: 0.5rem;
}

.step-fee {
    font-size: 2rem;
    font-weight: bold;
}

.step-ccurl {
    color: #000;
    font-family: sans-serif;
    font-size: 1.4rem;
    width: 100%;
    text-align: center;
    text-decoration: underline;
    padding: 0.5rem 0 3rem;
}

.msg-wrap .step-content p.reserve-pin {
    font-weight: bold;
    font-size: 3rem;
    letter-spacing: 0.5rem;
    padding: 1rem 0;
}

.reserve-info-wrap h4 {
    color: var(--cl-ink);
    font-size: 1.2rem;
    width: 100%;
    text-align: center;
}

.reserve-info-wrap h4:before,
.reserve-info-wrap h4:after {
    color: var(--cl-blue);
    content: '■';
    margin: 0 0.3rem;
}

table {
    margin: 0.5rem 0 1rem;
}

th, td {
    border: 1px solid #aAA;
    border-color: #DDD;
    padding: 0.3rem 0.2rem;
    word-break: keep-all;
}

th {
    background-color: var(--cl-grey-light);
    word-break: keep-all;
}

.reserve-command ul {
}

.reserve-command ul li {
    font-size: 1.2rem;
    border: 1px solid #DDD;
    margin-top: -1px;
    padding: 0.5rem 1rem;
}

.reserve-command ul li:hover {
    cursor: pointer;
}

.reserve-command ul li:nth-child(1) {
    border-radius: 0.5rem 0.5rem 0 0;
}

.reserve-command ul li:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
}

.reserve-botinfo {
    width: 100%;
    height: 36px;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #FFF;
    background: var(--cl-pink);
    background: var(--cl-grad);
    z-index: 100;
}

.reserve-botinfo-inner {
    background: #FFF;
    background: #FFFFFFDA;
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    padding: 0 2rem;
    left: 0;
    bottom: 0;
    overflow: hidden;
}

.reserve-botinfo-inner svg {
    margin-right: 1rem;
    transform: rotate(-15deg);
}

.reserve-botinfo-inner p {
    font-size: 1rem !important;
    padding: 0;
    margin: 0 !important;
}

textarea {
    font-family: 'M plus 1P';
    font-weight: 300;
    width: 100%;
    height: 6rem;
}

.msg-wrap .step-content p.note {
    width: 100%;
    text-align: right;
    font-size: 0.8rem;
    line-height: 1rem;
}

.msg-wrap .step-content p.note a {
    text-decoration: underline;
}

.ff-form-singleslider p {
    text-align: center;
}

.step-stars {
    display: flex;
    justify-content: center;
    margin: 3rem 0 0;
}

.ff-form-singleslider {
    justify-content: center;
    margin-bottom: 1rem;
}

.ff-form-singleslider > p {
    display: none;
}

.mile {
    font-weight: bold;
    color: var(--cl-pink);
}

.mile-fee {
    font-size: 2rem;
    font-weight: bold;
    color: var(--cl-pink);
}

.mile-get {
    font-size: 1.4rem;
    font-weight: bold;
}

.error-msg {
    color: red;
}
</style>
