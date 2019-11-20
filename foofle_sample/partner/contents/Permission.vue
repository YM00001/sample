<template>
    <div class="ffa-content column is-10 ffa-detail">
        <h1>権限設定</h1>
        <Permission
            :permissionData="permissionData"
            :disabled="disabled"
            @submit="submitPermission"
        ></Permission>
    </div>
</template>

<script>
import axios from 'axios';
import Permission from './inner/Permission.vue';

export default {
    data() {
        return {
            disabled: false,
            permissionData: null,
        }
    },
    props: [
        'partnerData',
    ],
    watch: {
        partnerData: function() {
            this.fetchData();
        },
    },
    mounted: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            if (this.partnerData) {
                this.permissionData = this.partnerData.permission;
            }
        },
        submitPermission: function() {
            let self = this;
            this.disabled = true;
            axios({
                url: '/api/partner/permission',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    permission: this.permissionData,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                }
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
            }).finally(function (fin) {
                self.disabled = false;
            });
        },
    },
    components: {
        Permission,
    }
}
</script>

<style scoped>

</style>
