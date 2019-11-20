<template>
    <div class="ffa-content column is-10 ffa-detail">
        <h1>予約詳細 <span v-if="reserve.schedule">[{{ reserve.id }}]</span></h1>
        <div v-if="reserve.schedule"  class="reserve-command">
            <select class="command-list" @change="openModal" v-model="command">
                <option value="default" selected>実行するアクションを選択してください</option>
                <option v-if="viewStatus !== 'finished' && viewStatus !== 'started' && viewStatus !== 'canceled'"
                    value="cancel"
                >予約キャンセル</option>
                <option v-if="viewStatus === 'paycalled' || viewStatus === 'before-paycalled'"
                    value="confirm"
                >CC払いの承認・拒否</option>
                <option v-if="viewStatus !== 'finished' && viewStatus !== 'canceled'"
                    value="contact"
                >お客様へ連絡</option>
                <option v-if="viewStatus === 'entered'"
                    value="pin"
                >PINの代理入力</option>
                <option v-if="viewStatus === 'finished' || viewStatus === 'canceled'"
                    value="abuser"
                >NG顧客設定</option>
                <option
                    value="support"
                >サポートを受ける</option>
            </select>
            <div  v-if="viewStatus === 'canceled'" class="nta wta">
                <h3>Canceled</h3>
                <div>
                    <p v-if="master.cancel_reason && reserve.status.is_canceled">この注文はキャンセルされました。<br />キャンセル理由：{{ master.cancel_reason[reserve.cancel.reason_id].reason }}</p>
                </div>
            </div>
            <div  v-if="viewStatus === 'before-paycalled'" class="nta wta">
                <h3>Waiting for Customer Action</h3>
                <div>
                    <p>お客様の支払待ちです</p>
                </div>
            </div>
            <div  v-if="viewStatus === 'reject-paycalled'" class="nta wta">
                <h3>Waiting for Customer Action</h3>
                <div>
                    <p>お客様の支払を再度待っています。<br />必要に応じてお客様に連絡をとってください。</p>
                </div>
            </div>
            <div  v-if="viewStatus === 'paycalled'" class="nta">
                <h3>Action Required</h3>
                <div>
                    <p>お客様がCC支払いを完了しました。<br />店舗でCC支払いを確認してください。</p>
                </div>
            </div>
            <div  v-if="viewStatus === 'before-entered'" class="nta">
                <h3>Action Required</h3>
                <div>
                    <p>予約日時に間に合うように派遣を開始してください。<br />ホテル・部屋番号はお客様が入室後に表示されます。</p>
                </div>
            </div>
            <div  v-if="viewStatus === 'entered'" class="nta">
                <h3>Action Required</h3>
                <div>
                    <p>派遣先のホテル・部屋番号が入力されました。<br />(自宅の場合は住所が表示されます)<br />必要に応じて在室確認を行ってください。</p>
                </div>
            </div>
            <div  v-if="viewStatus === 'started'" class="nta">
                <h3>Action Required</h3>
                <div>
                    <p>サービスが開始されました。</p>
                </div>
            </div>
        </div>
        <div v-if="reserve.schedule" class="reserve-info">
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
            </table>
            <table>
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
                    <th>発行ポイント</th>
                    <td>{{ reserve.mile.additional_cast }}pt</td>
                </tr>
                <tr>
                    <th>決済方法</th>
                    <td>{{ reserve.fee.is_cc ? 'クレジットカード事前決済' : '現金' }}</td>
                </tr>
                <tr>
                    <th>お客様お名前</th>
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
                    <td>{{ master.cancel_reason && reserve.status.is_canceled ? master.cancel_reason[reserve.cancel.reason_id].reason : '' }}</td>
                </tr>
            </table>
        </div>
        <AsyncLoading v-else></AsyncLoading>
    </div>
</template>

<script>
import axios from 'axios';
import AsyncLoading from './inner/AsyncLoading.vue';
import getMaster from '../../mixin/getMaster.js';
import timeHelper from '../../mixin/timeHelper.js';

export default {
    data() {
        return {
            master: {},
            reserve: {},
            command: 'default',
        }
    },
    computed: {
        viewStatus: function() {
            if (!this.reserve.hasOwnProperty('fee')) {
                return 'unloaded';
            } else {
                let tp = this.reserve.transportation;
                let building = this.reserve.building;
                let status = this.reserve.status;
                let cc = this.reserve.fee.is_cc;

                if (status.is_canceled) { return 'canceled'; }
                if (status.is_finished) { return 'finished'; }
                if (!status.is_finished && status.is_started) { return 'started'; }
                if (building.address) { return 'entered'; }
                if (((cc && status.is_paid) || (!cc)) && !building.address) { return 'before-entered'; }
                if (cc && status.is_pay_rejected) { return 'reject-paycalled' }
                if (cc && status.is_pay_attempted) { return 'paycalled' }
                if (cc && !status.is_pay_attempted) { return 'before-paycalled'}
            }
        },
    },
    mounted: function() {
        this.fetchData();
        this.getServiceCategory().then((res) => {
            this.master.service_category = res;
        });
        this.getDeliveryType().then((res) => {
            this.master.delivery_type = res;
        });
        this.getCancelReason().then((res) => {
            this.master.cancel_reason = res;
        });

        this.$eventHub.$on('closeCommand', () => {
            this.command = 'default';
        });
        this.$eventHub.$on('completeCommand', () => {
            this.fetchData();
        });
    },
    methods: {
        fetchData: function() {
            let self = this;
            axios({
                method: 'POST',
                url: '/api/partner/reserveDetail',
                data: {
                    reserve_id: this.$route.params.reserveid,
                },
            }).then((res) => {
                if (res) {
                    self.reserve = res.data;
                }
            }).catch((err) => {

            });
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
        openModal: function(e) {
            let cmd = e.target.value;
            if (cmd !== 'default') {
                this.$eventHub.$emit('openCommand', {
                    command: cmd,
                    info: this.reserve,
                });
            }
        },
    },
    mixins: [
        getMaster, timeHelper,
    ],
    components: {
        AsyncLoading,
    },
}
</script>

<style scoped>
.reserve-command {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
}

.reserve-command select {
    margin-bottom: 1rem;
}

.reserve-command select,
.reserve-command option {
    font-family: 'M plus 1p';
    font-weight: 300;
}

.nta {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding: 1rem 0;
    background-color: #fceeee;
}

.nta h3 {
    font-size: 1rem !important;
    color: #FFF;
    background-color: red;
    background-color: var(--cl-red);
    padding: 0.3rem 1rem;
}

.nta.wta {
    background-color: #f8f8f8;
}

.nta.wta h3 {
    background-color: #AAA;
}

.nta div {
    padding: 0 1rem;
}

.nta div p {
    color: var(--cl-red);
}

.nta.wta div p {
    color: unset;
}

.reserve-info {
    display: flex;
    flex-wrap: no-wrap;
    background-color: #FFF;
    box-shadow: var(--mbs-level1);
    border-radius: 1rem;
    padding: 1rem;
}

.reserve-info table {
    width: 50%;
}

.reserve-info table:first-child {
    margin-right: 1rem;
}

.reserve-info th,
.reserve-info td {
    word-break: keep-all;
    padding: 0.2rem 0.3rem;
    background-color: #FFF;
    border: 1px solid var(--cl-grey);
}

.reserve-info th {
    background-color: var(--cl-grey);
    border-color: #FFF;
}
</style>
