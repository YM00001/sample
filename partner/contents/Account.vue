<template>
    <div class="ffa-content column is-10">
        <div class="ffa-block-wrap ffa-block-create">
            <h1>キャストアカウント作成</h1>
            <div class="ffa-block">
                <div>
                    <label>キャスト名</label>
                    <input type="text" required
                        v-model="cast_name">
                </div>
                <div>
                    <label>キャストのメールアドレス</label>
                    <input type="email" required
                        v-model="cast_email"
                        @change="checkEmail"
                    >
                </div>
                <div class="ffa-btn">
                    <p v-if="!flag_send" @click="submitData">招待メールの送信</p>
                    <Loading v-else></Loading>
                </div>
            </div>
        </div>
        <div class="ffa-block-wrap ffa-block-token">
            <h2>キャストアカウント登録</h2>
            <div v-if="!has_token" class="ffa-block">
                <div class="ffa-btn">
                    <p v-if="!flag_pub" @click="getToken">認証トークンの発行</p>
                    <Loading v-else></Loading>
                </div>
            </div>
            <div v-if="has_token" class="ffa-block">
                <p>認証トークン(24時間有効)</p>
                <p>{{ token.create_auth_token.toUpperCase() }}</p>
                <p>発行日時:{{ token_created_at }}</p>
            </div>
        </div>
        <div class="invite-table">
            <h2>招待済みキャスト</h2>
            <Table
                v-if="invitelist"
                :defines="listdefines"
                :items="invitelist"
            ></Table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import FormValidation from '../../mixin/formValidation.js';
import Loading from './inner/PartnerLoading.vue';
import Table from './inner/Table.vue';

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
            cast_name: '',
            cast_email: '',
            flag_send: false,
            flag_pub: false,
            token: {},
            invitelist: [],
            listdefines: [
                {
                    header: '日付',
                    field: 'timestamp',
                    callback: (item) => displayTimestamp(item),
                },
                {
                    header: '名前',
                    field: 'name',
                    callback: null,
                },
                {
                    header: 'メールアドレス',
                    field: 'email',
                    callback: (item) => item,
                },
                {
                    header: '状態',
                    field: 'status',
                    callbacl: null,
                }
            ],
        }
    },
    computed: {
        has_token: function() {
            return 'create_auth_token' in this.token;
        },

        token_created_at: function() {
            if (this.has_token) {
                let d = new Date(this.token.create_auth_token_created_at * 1000);
                return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${('00'+d.getMinutes()).slice(-2)}`;
            } else {
                return null;
            }
        },
    },
    mounted: function() {
        this.fetchInviteData();
    },
    methods: {
        getToken: function() {
            axios({
                method: 'get',
                url: '/api/partner/createtoken',
            }).then((response) => {
                if (response.status === 200) {
                    this.token = response.data;
                }
            }).catch((error) => {
                this.$eventHub.$emit('notification', {attr:'is-warning', message:'データの取得に失敗しました。\n時間を空けてお試しください。'});
            });
        },
        fetchInviteData: function() {
            axios({
                method: 'get',
                url: '/api/partner/invitelist',
            }).then((response) => {
                if (response.status === 200) {console.log(response.data);
                    this.invitelist = response.data;
                }
            }).catch((error) => {
                this.$eventHub.$emit('notification', {attr:'is-warning', message:'データの取得に失敗しました。\n時間を空けてお試しください。'});
            });
        },
        submitData: function(e) {
            e.preventDefault();
            this.flag_send = true;
            let self = this;
            // Valid
            axios({
                url: '/api/partner/invitecast',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    name: this.cast_name,
                    email: this.cast_email,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'招待メールを送信しました。'});
                    self.cast_name = '';
                    self.cast_email = '';
                } else if (response.data === 'Duplicate') {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'すでに登録されているメールアドレスです'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'送信に失敗しました。\n時間を空けてお試しください。'});
                }
                self.flag_send = false;
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'送信に失敗しました。\n通信状態を確認してください。'});
                self.flag_send = false;
            });
        },
    },
    components: {
        Loading, Table,
    },
    mixins: [
        FormValidation,
    ],
}
</script>

<style scoped>
.ffa-block-create .ffa-block {
    display: flex;
    flex-wrap: wrap;
}

.ffa-block-create .ffa-block input {
    width: 80%;
    margin-top: 3px;
    text-align: center;
}

.ffa-block-create .ffa-block div:nth-child(2) {
    border: none;
}

.ffa-block-token .ffa-block {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.ffa-block-token .ffa-block p:nth-child(2) {
    width: 100%;
    font-size: 2rem;
    text-align: center;
}

.invite-table {
    width: 100%;
    margin-top: 5rem;
}
</style>
