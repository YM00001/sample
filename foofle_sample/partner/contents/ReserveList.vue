<template>
    <div class="ffa-content column is-10">
        <h1>{{ title }}</h1>
        <Table
            v-if="reservelist"
            :defines="listdefines"
            :items="reservelist"
            :callback="listCallback"
        ></Table>
        <AsyncLoading v-else></AsyncLoading>
    </div>
</template>

<script>
import axios from 'axios';
import Table from './inner/Table.vue';
import AsyncLoading from './inner/AsyncLoading.vue';

export default {
    data() {
        return {
            reservelist: null,
            listdefines: [
                {
                    header: '予約ID',
                    field: 'id',
                    callback:(item) => item.toUpperCase(),
                },
                {
                    header: 'ステータス',
                    field: 'status',
                    callback: (item) => {
                        if (item.is_canceled) { return 'キャンセル'; }
                        if (item.is_finished) { return '終了'; }
                        if (!item.is_finished && item.is_started) { return 'サービス中'; }
                        if (item.is_pay_attempted && !item.is_paid) { return '決済確認未対応' }
                        return '進行中'
                    },
                },
                {
                    header: '日付',
                    field: 'schedule',
                    callback: (item) => item.date,
                },
                {
                    header: 'キャスト',
                    field: 'cast_name',
                    callback: null,
                },
                {
                    header: '開始時間',
                    field: 'schedule',
                    callback: (item) => `${item.start_at.slice(0,2)}:${item.start_at.slice(-2)}`,
                },
                {
                    header: 'コース',
                    field: 'course',
                    callback: (item) => `${item.min}分コース`,
                },
                {
                    header: '派遣場所',
                    field: 'transportation',
                    callback: (item) => item.delivery_station.name,
                },
            ],
        }
    },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            axios({
                method: 'get',
                url: '/api/partner/reservelist',
            }).then((response) => {
                if (response.status === 200) {
                    this.reservelist = response.data;console.log(response.data);
                }
            }).catch((error) => {
                this.$eventHub.$emit('notification', {attr:'is-warning', message:'データの取得に失敗しました。\n時間を空けてお試しください。'});
            });
        },
        listCallback: function (e) {
            try {
                let el = e.target;
                if (el.nodeName === 'TD') {
                    el = el.parentNode;
                }
                let id = el.dataset.id;
                this.$router.push(`/partner/reserve/${id}`);
            } catch(err) {
                console.log(err);
            }
        }
    },
    props: [
        'title',
    ],
    components: {
        Table, AsyncLoading,
    },
}
</script>

<style scoped>

</style>
