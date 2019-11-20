<template>
    <div class="ffa-content column is-10">
        <h1>{{ title }}</h1>
        <Table
            v-if="castlist"
            :defines="listdefines"
            :items="castlist"
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
            castlist: null,
            listdefines: [
                {
                    header: 'キャストID',
                    field: 'id',
                    callback: null,
                },
                {
                    header: 'ステータス',
                    field: 'account_status',
                    callback: null,
                },
                {
                    header: '名前',
                    field: 'profile',
                    callback: (profile) => profile.name,
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
                url: '/api/partner/castlist',
            }).then((response) => {
                if (response.status === 200) {
                    this.castlist = response.data;
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
                this.$router.push(`/partner/cast/${id}`);
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
