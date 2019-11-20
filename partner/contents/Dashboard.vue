<template>
    <div class="ffa-content column is-10">
        <h1>ダッシュボード</h1>
        <template v-if="dashboardData">
            <div class="ffa-block-wrap">
                <h2>本日成約のご予約</h2>
                <div class="ffa-block ffa-click">
                    <div class="ffa-expand">
                        <p><span>{{ todayReserve.count }}</span>件</p>
                    </div>
                    <div>
                        <div>
                            <p>売上(見込み)</p>
                            <p><span>{{ currency(todayReserve.value) }}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ffa-block-wrap">
                <h2>本日の出勤人数</h2>
                <div class="ffa-block ffa-click">
                    <div class="ffa-expand">
                        <p><span>{{ commutedCast.count }}</span>人</p>
                    </div>
                    <div>
                        <div>
                            <p>現在出勤中</p>
                            <p><span>{{ commutedCast.active }}</span>人</p>
                        </div>
                        <div>
                            <p>総稼働時間</p>
                            <p><span>{{ commutedCast.hours }}</span>時間</p>
                        </div>
                    </div>
                </div>
            </div>
            <h2>アクティブなご予約</h2>
            <ul v-if="activeReserve.length > 0" class="ffa-dash-list">
                <template  v-for="item in activeReserve">
                    <li v-if="viewStatus(item)">
                        <router-link :to="`/partner/reserve/${item.id}`">
                            <div class="">{{ item.id.toUpperCase() }}</div>
                            <p v-if="viewStatus(item) === 'started'">サービス中(残り{{ getRemain(item) }}分)</p>
                            <p v-if="viewStatus(item) === 'entered'">お客様の入室完了</p>
                            <p v-if="viewStatus(item) === 'before-entered'">お客様の入室待ち</p>
                            <p v-if="viewStatus(item) === 'paycalled'">&lt;パートナー店舗&gt;CC決済確認</p>
                            <p v-if="viewStatus(item) === 'before-paycalled'">お客様のCC決済待ち</p>
                        </router-link>
                    </li>
                </template>
            </ul>
            <p v-else class="ffa-dash-msg">アクティブなご予約はありません。</p>
            <PaymentBlock
                :payment="activePayment"
            ></PaymentBlock>
        </template>
        <AsyncLoading v-else></AsyncLoading>
    </div>
</template>

<script>
import timeHelper from '../../mixin/timeHelper.js';
import formatData from '../../mixin/formatData.js';
import PaymentBlock from './inner/PaymentBlock.vue';
import AsyncLoading from './inner/AsyncLoading.vue';

export default {
    data() {
        return {
            commutedCast: {
                count: 0,
                active: 0,
                hours: 0,
            },
            todayReserve: {
                count: 0,
                value: 0,
            },
            activeReserve: [],
            activePayment: null,
        }
    },
    mounted: function() {
        this.$eventHub.$emit('fetchDashboardData');
    },
    props:[
        'dashboardData',
    ],
    watch: {
        dashboardData: function() {
            if (this.dashboardData) {
                let d = this.dashboardData;

                // TodayReserve
                let tc = d.today.length;
                let val = 0;
                for (let i = 0; i < tc; i++) {
                    val += d.today[i].fee.total_fee;
                }
                this.todayReserve.count = tc;
                this.todayReserve.value = val;

                // Cast
                let now = this.getDisplay(null, '4digit');
                let count = d.cast.length;
                let active = 0;
                let hours = 0;

                for (let i = 0; i < count; i++) {
                    if (d.cast[i].from <= now && now <= d.cast[i].to) {
                        active++;
                    }
                    hours += this.calcDuration(d.cast[i].from, d.cast[i].to);
                }
                this.commutedCast.count = count;
                this.commutedCast.active = active;
                this.commutedCast.hours = Math.floor(hours * 100) / 100;

                // ActiveReserve
                this.activeReserve = d.reserve;

                // ActivePayment
                this.activePayment = d.payment;
            }
        },
    },
    methods: {
        viewStatus: function(item) {
            let status = item.status;
            let building = item.building;
            let cc = item.fee.is_cc;
            if (!status.is_finished && status.is_started) { return 'started'; }
            if (building.address) { return 'entered'; }
            if (((cc && status.is_paid) || !cc) && !building.address) { return 'before-entered'; }
            if (cc && status.is_pay_attempted) { return 'paycalled' }
            if (cc && !status.is_pay_attempted) { return 'before-paycalled'}
            return false;
        },
        getRemain: function(item) {
            let start = item.timestamp.started;
            let course = item.course.min;
            let end = start + (course * 60 * 60);
            let now = this.getNow();
            return Math.floor((end - now) / 60 / 60);
        },
    },
    mixins: [
        timeHelper, formatData,
    ],
    components: {
        PaymentBlock, AsyncLoading,
    }
}
</script>

<style scoped>
.ffa-dash-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
/*
.ffa-dash-list > li {
    display: flex;
    margin-right: 10px;
    margin-bottom: 10px;
}*/

.ffa-dash-list > li > a {
    display: flex;
    margin-right: 10px;
    margin-bottom: 10px;
}

.ffa-dash-list > li > a > div {
    padding: 10px;
    border: 1px solid var(--cl-border);
    background-color: var(--cl-grey);
}

.ffa-dash-list > li > a > p {
    font-weight: 300;
    padding: 10px;
    margin-left: -1px;
    border: 1px solid var(--cl-border);
}

.ffa-dash-msg {
    width: 100%;
    text-align: center;
    padding: 2rem 0;
}
</style>
