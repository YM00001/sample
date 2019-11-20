<template>
    <div class="ffa-content column is-10">
        <h1>{{ title }}</h1>
        <Table
            v-if="paymentlist"
            :defines="listdefines"
            :items="paymentlist"
            :callback="listCallback"
        ></Table>
        <AsyncLoading v-else></AsyncLoading>
    </div>
</template>

<script>
import axios from 'axios';
import Table from './inner/Table.vue';
import AsyncLoading from './inner/AsyncLoading.vue';

let displayTimestamp = function(ts) {
    if (!ts) { return ''; }
    let d = new Date(ts * 1000);
    let mn = d.getHours() < 6;
    if (mn) {
        d.setDate(d.getDate() - 1);
    }
    let day = `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`;
    let hour = mn ? d.getHours() + 24 : d.getHours();
    return `${day} ${('00'+hour).slice(-2)}:${('00'+d.getMinutes()).slice(-2)}`;
};

export default {
    data() {
        return {
            paymentlist: null,
            listdefines: [
                {
                    header: '予約ID',
                    field: 'id',
                    callback:(item) => item.toUpperCase(),
                },
                {
                    header: '日付',
                    field: 'timestamp',
                    callback: (item) => displayTimestamp(item),
                },
                {
                    header: '摘要',
                    field: 'description',
                    callback: null,
                },
                {
                    header: '金額',
                    field: 'value',
                    callback: (item) => item,
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
                url: '/api/partner/paymentlist',
            }).then((response) => {
                if (response.status === 200) {
                    let pts = [];
                    for (let i = 0; i < response.data.length; i++) {
                        let items = response.data[i].item;
                        for (let t = 0; t < items.length; t++) {
                            pts.push(items[t]);
                        }
                    }
                    pts.sort((a, b) => {
                        return b.timestamp - a.timestamp;
                    });
                    this.paymentlist = pts;
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
