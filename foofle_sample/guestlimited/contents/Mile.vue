<template>
    <div v-if="guest">
        <div class="mile-balance">
            <div class="mile-balance-left">
                <fa :icon="['fas', 'piggy-bank']" :style="{ color: '#ff2d94' }" size="5x"></fa>
            </div>
            <div class="mile-balance-right">
                <div class="mile-balance-top">
                    <p>利用可能ポイント</p>
                    <p><span>{{ guest.mile.balance }}</span>pt</p>
                </div>
                <div class="mile-balance-bot">
                    <p>獲得見込みポイント</p>
                    <p>{{ guest.mile.prospected }}pt</p>
                </div>
            </div>
        </div>
        <div class="mile-trans">
            <h3>獲得履歴</h3>
            <table>
                <tr>
                    <th>獲得日</th>
                    <th>ポイント</th>
                    <th>理由</th>
                </tr>
                <template v-for="item in transaction">
                    <tr v-if="item.is_support_approved && item.is_counted">
                        <td>{{ getDisplay(item.created_at, 'm/d') }}</td>
                        <td>{{ `${item.is_debt ? '-' : ''}${item.value}` }}</td>
                        <td>{{ reason(item.reason) }}</td>
                    </tr>
                </template>
            </table>
        </div>
    </div>
</template>

<script>
import timeHelper from '../../mixin/timeHelper.js';

export default {
    data() {
        return {

        }
    },
    props: [
        'guest', 'transaction',
    ],
    methods: {
        reason: function(en) {
            let txt;
            switch(en) {
                case 'mile_use_as_request':
                    txt = 'ご予約で利用';
                    break;
                case 'mile_earn_as_transportation_adjust':
                    txt = '交通費調整';
                    break;
                case 'mile_earn_as_additional_cast':
                    txt = 'キャストボーナス';
                    break;
                case 'mile_earn_as_additional_official':
                    txt = 'Foofleボーナス';
                    break;
                case 'mile_earn_as_easy_review':
                    txt = 'レビューの投稿';
                    break;
                case 'support_adjustment':
                    txt = 'サポートによる調整';
                    break;
                default:
                    txt = en;
            }
            return txt;
        }
    },
    mixins: [
        timeHelper,
    ],
}
</script>

<style scoped>
.mile-balance {
    width: 95%;
    margin: 1rem auto 3rem;
    padding: 1rem;
    background-color: #FFF;
    box-shadow: var(--mbs-level1);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
}

.mile-balance-left {
    width: 20%;
}

.mile-balance-right {
    width: 80%;
    padding-left: 1rem;
}

.mile-balance-top {
    width: 100%;
    padding-bottom: 0.5rem;
}

.mile-balance-top p:nth-child(1) {
    color: var(--cl-pink);
    width: 100%;
    font-size: 1.2rem;
    font-weight: bold;
}

.mile-balance-top p:nth-child(2) {
    width: 100%;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: right;
}

.mile-balance-top p:nth-child(2) span {
    display: inline-block;
    color: var(--cl-pink);
    font-size: 1.8rem;
    font-weight: bold;
    margin-right: 0.4rem;
}

.mile-balance-bot {
    padding-top: 1rem;
    border-top: 4px dotted #DDD;
    display: flex;
    justify-content: space-between;
    align-items:center;
}

h3 {
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 0.1rem;
    margin: 1rem 0;
    text-align: center;
}

.mile-trans table {
    width: 97%;
    margin: 0 auto;
}

.mile-trans table tr {
    background-color: #FFF;
}

.mile-trans table th,
.mile-trans table td {
    padding: 0.5rem 0;
    border: 1px solid  #DDD;
}

.mile-trans table tr:nth-child(1) {
    background: var(--cl-pink);
}

.mile-trans table tr:nth-child(1) th {
    color: #FFF;
    border: none;
    background: transparent;
}

.mile-trans table td:nth-child(1),
.mile-trans table td:nth-child(2) {
    text-align: center;
}

.mile-trans table td:nth-child(3) {
    padding: 0.3rem 0.3rem 0.3rem 0.5rem;
}
</style>
