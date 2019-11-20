<template>
    <div class="ffa-login ffa-container">
      <div class="ffa-login-wrapper">
        <div class="ffa-login-img-wrapper">
          <img src="/img/partner/header_logo.png" alt="">
        </div>
        <form class="" action="#" method="#">
          <div class="ffa-login-form-block">
            <label for="email">メールアドレス</label>
            <input id="email" type="email" name="email" required
                v-model="login.email"
            >
          </div>
          <div class="ffa-login-form-block">
            <label for="password">パスワード</label>
            <input id="password" type="password" name="password" required
                v-model="login.password"
            >
          </div>
          <div class="ffa-btn-wrap">
            <button type="submit"
                v-if="!loading"
                @click="submitData"
            >ログイン</button>
            <Loading v-else></Loading>
          </div>
        </form>
        <div class="ffa-btn-wrap ffa-login-btn-passive">
          <p class="ffa-status-passive"
            v-if="!prloading"
            @click="submitReset"
          >パスワードリセット</p>
          <Loading v-else></Loading>
        </div>
        <Notification
            :visible="login.error"
            :danger="true"
            @unvisible="login.error = false"
        >メールアドレスかパスワードが間違っています。</Notification>
        <Notification
            :visible="prdone"
            :primary="true"
            @unvisible="prdone = false"
        >ご入力いただいたメールアドレス宛にリセット用URLをお送りしました。</Notification>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import Notification from './PartnerNotification.vue';
import Loading from './PartnerLoading.vue';

export default {
    data() {
        return {
            login: {
                email: null,
                password: null,
                error: false,
            },
            loading: false,
            prloading: false,
            prdone: false,
        }
    },
    methods: {
        submitData: function(e) {
            e.preventDefault();
            this.loading = true;

            let flg = false;
            let self = this;
            if (this.login.email && this.login.password) {
                // Valid
                axios({
                    url: '/api/partner/login',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: this.login,
                })
                .then(function (response) {
                    if (response.data === 'Authed') {
                        window.location.href = '/partner/top/dashboard';
                    } else {
                        self.login.error = true;
                        self.loading = false;
                    }
                })
                .catch(function (error) {
                    self.login.error = true;
                    self.loading = false;
                });
            } else {
                this.login.error = true;
                this.loading = false;
            }
        },
        submitReset: function(e) {
            e.preventDefault();
            this.prloading = true;

            let flg = false;
            let self = this;
            if (this.login.email) {
                // Valid
                axios({
                    url: '/api/partner/reset',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: { email: this.login.email },
                })
                .then(function (response) {
                    self.prdone = true;
                    self.prloading = false;
                })
                .catch(function (error) {
                    self.login.error = true;
                    self.prloading = false;
                });
            } else {
                this.login.error = true;
                this.prloading = false;
            }
        },
    },
    components: {
        Notification, Loading,
    },
}
</script>

<style scoped>
.ffa-login {
    height: 84vh;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
}

.ffa-login-img-wrapper {
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ffa-login img {
    width: 200px;
    margin-bottom: 20px;
}

.ffa-login-form-block {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.ffa-login-form-block label {
    display: block;
    width: 100%;
}

.ffa-login-form-block input {
    display: block;
    width: 100%;
}

.ffa-login .ffa-btn-wrap {
    display: flex;
    justify-content: center;
    padding: 0 0 20px;
    margin-bottom: 40px;
}

.ffa-login .ffa-btn-wrap button,
.ffa-login .ffa-btn-wrap p {
    padding: 5px 20px;
}

.ffa-login .ffa-btn-wrap button:hover,
.ffa-login .ffa-btn-wrap p:hover {
    cursor: pointer;
    opacity: 0.75;
}

.ffa-login .ffa-btn-wrap button {
    color: #FFF;
    background-color: var(--cl-blue);
    border: none;
    outline: none;
}

.ffa-login .ffa-btn-wrap p  {
    color: #FFF;
    background-color: var(--cl-blue);
}

.ffa-login .ffa-btn-wrap p.ffa-status-passive  {
    color: unset;
    background-color: var(--cl-grey);
}
</style>
