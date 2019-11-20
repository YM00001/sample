<template>
    <div class="ffa-block-wrap ffa-block-payment" v-if="payment">
        <h2>お支払い</h2>
        <div class="ffa-block ffa-click">
            <p class="ffa-text-left">現在のお支払い残高</p>
            <div class="ffa-expand">
                <p><span>{{ currency(payment.balance) }}</span></p>
            </div>
            <p v-if="payment.is_fixed">お支払い期日： {{ getDisplay('年月日', payment.paid_limit) }}</p>
            <p v-else>(暫定)</p>
        </div>
    </div>
</template>

<script>
import timeHelper from '../../../mixin/timeHelper.js';
import formatData from '../../../mixin/formatData.js';

export default {
    data() {
        return {

        }
    },
    props: [
        'payment',
    ],
    mixins: [
        timeHelper, formatData,
    ],
}
</script>

<style scoped>

</style>
