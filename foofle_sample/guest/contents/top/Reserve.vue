<template>
<div class="">
    <h3>進行中のご予約</h3>
    <template v-if="activeReserve">
        <div class="reserve-block">
            <a v-for="item in activeReserve" class="reserve-inner" :href="`/reserve/${item.id}`" :key="item.id">
                <fa :icon="['far', 'envelope']" :style="{ color: '#ff2d94'}" size="2x"></fa>
                <div>
                    <p>{{ item.schedule.date }} {{ item.schedule.start_at.slice(0, 2) }}:{{ item.schedule.start_at.slice(-2) }}～ {{ item.transportation.delivery_station.name }}</p>
                    <p>ステータス：<span>{{ viewStatus(item) }}</span></p>
                    <p>{{ item.cast_name }}</p>
                </div>
            </a>
        </div>
    </template>
    <div v-else class="reserve-block">
        <p>現在ご予約はありません</p>
    </div>
    <div class="follow-list">
        <h3>マイリスト</h3>
        <template v-if="follow">
            <ProfileList
                v-for="(item, ind) in cast"
                :key="ind"
                :cast="item"
            >
            </ProfileList>
            <Infinite @infinite="infiniteHandler"
                :spinner="'waveDots'"
            >
                <div slot="no-more" style="padding:2rem 0;">NO MORE CAST</div>
                <div slot="no-results" style="padding:2rem 0;">NO CAST</div>
            </Infinite>
        </template>
    </div>
</div>
</template>

<script>
import Infinite from 'vue-infinite-loading';
import ProfileList from '../inner/ProfileList.vue';

export default {
    data() {
        return {
            index: 0,
            limit: 25,
            retry: 3,
            next: null,
            cast: [],
        }
    },
    props: [
        'follow', 'activeReserve',
    ],
    mounted: function() {

    },
    methods: {
        viewStatus: function(item) {
            let tp = item.transportation;
            let building = item.building;
            let status = item.status;
            let cc = item.fee.is_cc;

            if (status.is_finished && !status.is_reviewed) { return 'レビューを書きましょう！'; }
            if (!status.is_finished && status.is_started) { return 'サービス中'; }
            if (building.address) { return 'キャストの到着待ち'; }
            if ((cc && status.is_paid || !cc) && !building.address && tp.delivery_type == 3) { return '住所入力待ち'; }
            if ((cc && status.is_paid || !cc) && !building.address && (tp.delivery_type == 1 || tp.delivery_type == 2)) { return 'ホテル入室待ち'; }
            if (cc && status.is_pay_rejected) { return 'クレジット決済の否決' }
            if (cc && status.is_pay_attempted) { return 'クレジット決済確認中' }
            if (cc && !status.is_pay_attempted) { return 'クレジット決済待ち'}
        },
        infiniteHandler: function($state) {
            let len = this.follow ? this.follow.length : 0;
            let i;
            if (len > 0) {
                if (len > this.index) {
                    let next = len - (this.limit + this.index) < 0 ? len : (this.limit + this.index);
                    for (i = this.index; i < next; i++) {
                        if (this.follow[i].type === 'cast') {
                            firebase.firestore().collection('cast').doc(this.follow[i].cast_id).onSnapshot((res) => {
                                this.cast.push(res.data());
                            });
                        }
                    }
                    this.index = next;
                    $state.loaded();
                    this.$emit('update');
                } else {
                    $state.complete();
                }
            } else {
                let self = this;
                window.setTimeout(() => {
                    if (self.retry > 0) {
                        $state.loaded();
                        self.retry--;
                    } else {
                        $state.complete();
                    }
                }, 1000);
            }
        },
    },
    components: {
        Infinite, ProfileList,
    },
}
</script>

<style scoped>
.reserve-block {
    width: 95%;
    margin: 0 auto 3rem;
    background-color: #FFF;
    box-shadow: var(--mbs-level1);
    border-radius: 0.5rem;
}

.reserve-block p {
    width: 100%;
    padding: 2rem 0;
    text-align: center;
}

.reserve-inner {
    margin: 0;
    padding: 1rem;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

.reserve-inner > div {
    width: 100%;
    padding: 0 1rem;
}
.reserve-inner > div > p {
    margin: 0;
    padding: 0;
}

.reserve-inner > div > p:nth-child(1) {
    text-align: left;
    margin-bottom: 0.5rem;
}

.reserve-inner > div > p:nth-child(2) {
    text-align: left;
}

.reserve-inner > div > p:nth-child(2) > span {
    color: var(--cl-pink);
    font-size: 1.4rem;
    font-weight: bold;
}

.reserve-inner > div > p:nth-child(3) {
    text-align: right;
}

h3 {
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 0.1rem;
    margin: 1rem 0;
    text-align: center;
}
</style>
