<template>
    <div class="ffa-content column is-10 ffa-detail">
        <h1>決済一覧</h1>
        <template v-if="paymentData">
            <div class="ffa-payment ffa-status-wip"
                v-for="(payment, ind) in paymentData"
            >
                <div class="ffa-payment-header"
                    @click="toggle"
                >
                    <div>
                        <p>決済期間 {{ duration(payment) }}</p>
                        <p>
                            <span class="ffa-payment-variable" v-if="!payment.is_fixed">暫定</span>
                            <span class="ffa-payment-variable" v-if="payment.is_fixed && payment.is_carryover">繰越</span>
                            <span class="ffa-payment-variable" v-if="payment.is_fixed && !payment.is_carryover && !payment.is_paid">未納</span>
                            合計　{{ currency(payment.balance) }}
                        </p>
                    </div>
                    <div v-if="payment.is_fixed">
                        <p v-if="!payment.is_carryover" class="ffa-click">ご請求書</p>
                        <p v-if="payment.is_paid" class="ffa-click">領収書</p>
                    </div>
                </div>
                <transition name="toggle">
                    <div class="ffa-payment-body">
                        <table class="table is-fullwidth">
                            <tbody>
                                <tr>
                                    <th>前期</th>
                                    <th colspan="8"></th>
                                </tr>
                                <tr>
                                    <td colspan="7"></td>
                                    <td>前期繰越手数料</td>
                                    <td>{{ currency(payment.balance_begin) }}</td>
                                </tr>
                                <tr>
                                    <th>手数料</th>
                                    <th>区分</th>
                                    <th>件数</th>
                                    <th>売上</th>
                                    <th>手数料率</th>
                                    <th>小計</th>
                                    <th colspan="3"></th>
                                </tr>
                                <template v-for="(field, key) in payment.field">
                                    <tr v-if="field.is_debt">
                                        <td></td>
                                        <td>{{ fieldname(key) }}</td>
                                        <td>{{ field.count }}</td>
                                        <td>{{ currency(field.value) }}</td>
                                        <td>{{ percentage(fee(payment, key)) }}</td>
                                        <td>{{ currency(field.fee) }}</td>
                                        <td colspan="3"></td>
                                    </tr>
                                </template>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{{ currency(sumDebt(payment.field)) }}</td>
                                </tr>
                                <tr>
                                    <th>手数料調整</th>
                                    <th>区分</th>
                                    <th>件数</th>
                                    <th>売上</th>
                                    <th>手数料率</th>
                                    <th>小計</th>
                                    <th colspan="3"></th>
                                </tr>
                                <template v-for="(field, key) in payment.field">
                                    <tr v-if="!field.is_debt">
                                        <td></td>
                                        <td>{{ fieldname(key) }}</td>
                                        <td>{{ field.count }}</td>
                                        <td>{{ currency(field.value) }}</td>
                                        <td>{{ percentage(fee(payment, key)) }}</td>
                                        <td>{{ currency(field.fee) }}</td>
                                        <td colspan="3"></td>
                                    </tr>
                                </template>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{{ currency(sumNonDebt(payment.field)) }}</td>
                                </tr>
                                <tr>
                                    <th colspan="9"></th>
                                </tr>
                                <tr>
                                    <td colspan="7"></td>
                                    <td>差引手数料</td>
                                    <td>{{ currency(sumAllFee(payment.field)) }}</td>
                                </tr>
                                <tr>
                                    <td colspan="7"></td>
                                    <td>消費税</td>
                                    <td>{{ currency(sumAllTax(payment.field)) }}</td>
                                </tr>
                                <tr>
                                    <td colspan="7"></td>
                                    <td>合計</td>
                                    <td>{{ currency(payment.balance) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </transition>
            </div>
        </template>

    </div>
</template>

<script>
import timeHelper from '../../mixin/timeHelper.js';
import formatData from '../../mixin/formatData.js';

export default {
    data() {
        return {
            field_ja: {
                'reserve_cash': '現金決済',
                'reserve_cancel_cash': 'キャンセル・現金決済',
                'reserve_cc': 'クレジットカード決済',
                'reserve_cancel_cc': 'キャンセル・クレジットカード決済',
                'reserve_mile_transportation_adjustment': 'ポイント発行(現金決済の端数調整)',
                'reserve_cancel_mile_transportation_adjustment': 'キャンセル・ポイント発行(現金決済の端数調整)',
                'reserve_mile_used': 'ポイント使用',
                'reserve_cancel_mile_used': 'キャンセル・ポイント使用',
                'reserve_mile_emitted': 'ポイント発行(店舗)',
                'reserve_cancel_mile_emitted': 'キャンセル・ポイント発行(店舗)',
                'support_adjustment': 'サポートによる調整',
            },
        }
    },
    mounted: function() {
        this.$eventHub.$emit('fetchPaymentData');
    },
    props: [
        'paymentData',
    ],
    methods: {
        toggle: function(e) {console.log(e);
            e.target.classList.toggle('is_active');
            console.log(e.target.classList);
        },
        fieldname: function(field) {
            if (this.field_ja.hasOwnProperty(field)) {
                return this.field_ja[field];
            } else {
                return 'その他';
            }
        },
        duration: function(item) {
            let start = this.getDisplay(item.timestamp, '年月日');
            let end = this.getDisplay(item.end_at, '年月日');
            return `${start} - ${end}`;
        },
        fee: function(item, key) {
            if (key === 'reserve_cash' || key === 'reserve_cancel_cash') {
                return item.fee_cash
            } else if (key === 'reserve_cc' || key === 'reserve_cancel_cc') {
                return item.fee_cc
            } else {
                return '';
            }
        },
        sumDebt: function(fields) {
            return Object.keys(fields).reduce((total, key) => {
                if (fields[key].is_debt) {
                    return total + fields[key].fee;
                } else
                    return total;
            }, 0);
        },
        sumNonDebt: function(fields) {
            return Object.keys(fields).reduce((total, key) => {
                if (!fields[key].is_debt) {
                    return total + fields[key].fee;
                } else
                    return total;
            }, 0);
        },
        sumAllFee: function(fields) {
            return Object.keys(fields).reduce((total, key) => {
                if (fields[key].is_debt) {
                    return total + fields[key].fee;
                } else
                    return total - fields[key].fee;
            }, 0);
        },
        sumAllTax: function(fields) {
            return Object.keys(fields).reduce((total, key) => {
                if (fields[key].is_debt) {
                    return total + fields[key].tax;
                } else
                    return total - fields[key].tax;
            }, 0);
        },
    },
    mixins: [
        timeHelper, formatData,
    ]
}
</script>

<style scoped>

.ffa-payment {
    width: 100%;
    margin-top: 15px;
    padding: 15px;
    box-shadow: var(--mbs-level1);
}

.ffa-payment-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.ffa-payment-header > div {
    width: 100%;
}

.ffa-payment-header div:nth-child(1) p {
    width: 100%;
    text-align: center;
}

.ffa-payment-header div:nth-child(1) p:first-child {
    margin-bottom: 15px;
}

.ffa-payment-header div:nth-child(2) {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row-reverse;
}

.ffa-payment-header div:nth-child(2) p {
    display: inline-block;
    padding: 3px 10px;
    border: 1px solid var(--cl-border);
    margin-left: 10px;
}

.ffa-payment.ffa-status-wip .ffa-payment-header span {
    color: #FFF;
    background-color: var(--cl-border);
    padding: 0 5px;
    margin-right: 10px;
    border: 1px solid var(--cl-border);
    border-radius: 3px;
}

.ffa-payment-body table th:not([all]) {
    padding-top: 30px;
    word-break: keep-all;
    text-align: right;
}

.ffa-payment-body table td {
    border: none;
    word-break: keep-all;
    text-align: right;
}

</style>
