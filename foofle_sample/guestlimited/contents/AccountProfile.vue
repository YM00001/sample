<template>
    <div class="ff-content ff-contract">
        <h3>アカウント設定</h3>
        <ul v-if="user && guest" class="config-list">
            <li>
                <div class="list-header">
                    <p class="required">メールアドレス</p>
                    <div>
                        <p>
                            {{ user.email }}
                            <template v-if="!user.emailVerified">
                                <br />
                                <span class="alert">認証メールのURLをクリックして変更を完了してください。</span>
                            </template>
                        </p>
                        <p v-if="!is_google" @click="openWindow('email')">
                            {{ email.is_open ? '破棄' : '変更' }}
                        </p>
                    </div>
                </div>
                <transition name="fade">
                    <div v-if="email.is_open" class="list-body">
                        <div>

                        </div>
                        <div class="input-wrap">
                            <label>新しいメールアドレス</label>
                            <input type="email" v-model="email.content">
                        </div>
                        <div class="input-wrap">
                            <label>現在のパスワード</label>
                            <input type="password" v-model="email.password">
                        </div>
                        <div class="btn-wrap">
                            <Btn
                                @click="changeEmail"
                                :disabled="email.is_sending"
                            >保存</Btn>
                        </div>
                    </div>
                </transition>
            </li>
            <li>
                <div class="list-header">
                    <p class="required">認証電話番号</p>
                    <div>
                        <p>{{ user.phoneNumber || '未設定' }}</p>
                        <p @click="openWindow('auth')">
                            {{ auth.is_open ? '破棄' : '変更' }}
                        </p>
                    </div>
                </div>
                <transition name="fade">
                    <div v-if="auth.is_open" class="list-body">
                        <SmsAuth></SmsAuth>
                    </div>
                </transition>
            </li>
            <li>
                <div class="list-header">
                    <p>サポート電話番号</p>
                    <div>
                        <p>{{ guest.support_number || '未設定' }}</p>
                        <p @click="openWindow('support')">
                            {{ support.is_open ? '破棄' : '変更' }}
                        </p>
                    </div>
                </div>
                <transition name="fade">
                    <div v-if="support.is_open" class="list-body">
                        <div class="input-wrap">
                            <label>新しい電話番号</label>
                            <input type="phone" v-model="support.number">
                        </div>
                        <div class="btn-wrap">
                            <Btn
                                :disabled="support.is_sending"
                                @click="submitSupportNumber"
                            >保存</Btn>
                        </div>
                    </div>
                </transition>
            </li>
            <li>
                <div class="list-header">
                    <p>パスワード</p>
                    <div>
                        <template v-if="is_google">
                            <p>GOOGLEログイン中</p>
                        </template>
                        <template v-else>
                            <p>表示できません</p>
                            <p @click="openWindow('pwd')">
                                {{ pwd.is_open ? '破棄' : '変更' }}
                            </p>
                        </template>
                    </div>
                </div>
                <transition name="fade">
                    <div v-if="pwd.is_open" class="list-body">
                        <div class="input-wrap">
                            <label>現在のパスワード</label>
                            <input type="password" v-model="pwd.old">
                        </div>
                        <div class="input-wrap">
                            <label>新しいパスワード</label>
                            <input type="password" v-model="pwd.new">
                        </div>
                        <div class="input-wrap">
                            <label>新しいパスワード(確認用)</label>
                            <input type="password" v-model="pwd.new_confirm">
                        </div>
                        <div class="btn-wrap">
                            <Btn
                                :disabled="pwd.is_sending"
                                @click="changePassword"
                            >保存</Btn>
                        </div>
                    </div>
                </transition>
            </li>
            <li>
                <p class="tar">アカウント削除</p>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';
import SmsAuth from './inner/SmsAuth.vue';
import Btn from './inner/Btn.vue';

export default {
    data() {
        return {
            user: null,
            pwd: {
                is_open: false,
                old: null,
                new: null,
                new_confirm: null,
                is_sending: false,
            },
            email: {
                is_open: false,
                content: null,
                password: null,
                is_sending: false,
            },
            support: {
                is_open: false,
                number: null,
                is_sending: false,
            },
            auth: {
                is_open: false,
            },
        }
    },
    props: [
        'guest',
    ],
    computed: {
        is_invalid: function() {
            if (this.profile.name && this.profile.gender && this.profile.birthday) {
                return false;
            } else {
                return true;
            }
        },
        is_google: function() {
            return (this.user && this.user.providerData[0].providerId === 'google.com');
        },
    },
    mounted: function() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                console.log(this.user);
            }
        })
    },
    methods: {
        successMsg: function() {
            this.$eventHub.$emit('notification', { icon: 'success', message: '変更を保存しました。'});
        },
        errorMsg: function(msg) {
            msg = msg || 'エラーが発生しました。お時間を置いてお試しください。';
            this.$eventHub.$emit('notification', { message: msg});
        },
        openWindow: function(cmd) {
            this[cmd].is_open = !this[cmd].is_open;
        },
        submitSupportNumber: function() {
            this.support.is_sending = true;
            let updateGuestAccount = firebase.app().functions('asia-northeast1').httpsCallable('updateGuestAccount');
            let postData = {
                guest_id: this.guest.uid,
                support_number: this.support.number,
            };
            updateGuestAccount(postData).then((res) => {
                if (res.data === 'Success') {
                    this.successMsg();
                    this.support.is_open = false;
                } else {
                    this.errorMsg();
                }
            }).finally(() => {
                this.support.is_sending = false;
            });
        },
        changeEmail: function() {
            this.email.is_sending = true;
            if (this.user) {
                let cred = firebase.auth.EmailAuthProvider.credential(this.user.email, this.email.password);
                this.user.reauthenticateWithCredential(cred).then(() => {
                    this.user.updateEmail(this.email.content).then(() => {
                        firebase.auth().currentUser.sendEmailVerification().then(() => {
                            this.successMsg();
                            this.email.is_open = false;
                        }).catch((err) => {
                            console.log(err);
                        });
                    }).catch((err) => {console.log(err);
                        this.errorMsg();
                    }).finally(() => {
                        this.email.is_sending = false;
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        changePassword: function() {
            this.pwd.is_sending = true;
            if (this.user) {
                let cred = firebase.auth.EmailAuthProvider.credential(this.user.email, this.pwd.old);
                this.user.reauthenticateWithCredential(cred).then(() => {
                    this.user.updatePassword(this.pwd.new).then(() => {
                        this.successMsg();
                        this.pwd.is_open = false;
                    }).catch((err) => {
                        this.errorMsg();
                    }).finally(() => {
                        this.pwd.old = null;
                        this.pwd.new = null;
                        this.pwd.new_confirm = null;
                        this.pwd.is_sending = false;
                    });
                }).catch((err) => {
                    this.errorMsg('パスワードが正しくありません。');
                    this.pwd.is_sending = false;
                });
            }
        },
    },
    components: {
        SmsAuth, Btn,
    },
}
</script>

<style scoped>
h3 {
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 0.1rem;
    margin: 1rem 0;
    text-align: center;
}

.config-list {
    width: 100%;
}

.config-list li {
    width: 100%;
    padding: 1rem;
    background-color: #FFF;
    border-bottom: 1px solid #DDD;
}

.config-list select {
    border: none;
    text-align: right;
}

.required:after {
    content: '必須';
    font-size: 0.8rem;
    color: var(--cl-pink);
    margin-left: 0.5rem;
}

.btn-wrap {
    width: 100%;
    text-align: center;
    padding: 1rem;
}

.tar {
    width: 100%;
    text-align: right;
}

.config-list li {
    padding: 1rem;
}

.config-list .list-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.config-list li div p:nth-child(1) {
    font-size: 1.1rem;
}

.config-list li div p:nth-child(2) {
    color: var(--cl-pink);
    text-align: right;
    margin-top: 0.5rem;
}

.input-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 0;
}

.input-wrap input {
    width: 60%;
}

.input-wrap label {
    word-break: keep-all;
}

.list-body {
    padding-top: 1rem;
}

.list-body >>> .btn {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
}

span.alert {
    font-size: 0.7rem;
    color: var(--cl-pink);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
