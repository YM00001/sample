<template>
    <div class="ffa-reset ffa-container"
        v-if="allow"
    >
      <div class="ffa-reset-wrapper">
        <div class="ffa-reset-img-wrapper">
          <img src="/img/admin/header_logo.png" alt="">
        </div>
        <h1>パスワードをリセットします。</h1>
        <div class="ffa-reset-form-block">
          <label for="reset_password">新しいパスワード</label>
          <input id="reset_password" type="password" name="password" v-model="password" required
              :class="{ 'is-danger' : password_invalid_length }"
              @keyup="validPasswordLength"
          >
          <p class="ffa-reset-validation">パスワードは8文字以上で入力してください。</p>
        </div>
        <div class="ffa-reset-form-block">
          <label for="reset_password_confirm">新しいパスワード(確認用)</label>
          <input id="reset_password_confirm" type="password" name="password_confirm" v-model="password_confirm" required
              :class="{ 'is-danger' : password_invalid_match }"
              @keyup="validPasswordMatch"
          >
          <p class="ffa-reset-validation">パスワードが一致しません。</p>
        </div>
        <div class="ffa-btn-wrap">
          <p v-if="!loading"
          @click="submitData"
          >リセット実行</p>
          <Loading v-else></Loading>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import Loading from './PartnerLoading.vue';

export default {
    data() {
        return {
            password: '',
            password_confirm: '',
            password_invalid_length: false,
            password_invalid_match: false,
            token: this.$route.params.token,
            allow: false,
            loading: false,
        }
    },
    mounted: function() {
        let self = this;
        axios({
            url: '/api/partner/reset/confirm',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: { token: this.$route.params.token },
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data !== 'Confirm') {
                self.$router.replace('/partner/account/login');
            } else {
                self.allow = true;
            }
        })
        .catch(function (error) {
            self.$router.replace('/partner/account/login');
        });
    },
    computed: {
        checkForm: function() {
            let flg = true;
            if (this.password !== this.password_confirm) {
                this.password_invalid_match = true;
            }
            if (this.password_invalid_length || this.password_invalid_match) {
                flg = false;
            }
            return flg;
        },
    },
    methods: {
        submitData: function(e) {
            e.preventDefault();
            this.loading = true;

            let flg = false;
            let self = this;
            if (this.checkForm) {
                // Valid
                axios({
                    url: '/api/partner/reset/execute',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: {
                        password: this.password,
                        token: this.token,
                    },
                })
                .then(function (response) {
                    if (response.data === 'Done') {
                        self.$router.replace('/partner/account/reset/complete');
                    }
                    self.loading = false;
                })
                .catch(function (error) {
                    self.loading = false;
                });
            } else {
                this.loading = false;
            }
        },
        validPasswordLength: function() {
            this.password_invalid_length = !(this.password.length > 7);
            return this.password.length > 7;
        },
        validPasswordMatch: function() {
            this.password_invalid_match = !(this.password === this.password_confirm);
            return this.password === this.password_confirm;
        },
    },
    components: {
        Loading,
    },
}
</script>

<style scoped>
.ffa-reset {
    height: 84vh;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
}

.ffa-reset-img-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ffa-reset img {
    width: 200px;
    margin-bottom: 20px;
}

.ffa-reset h1 {
    width: 100%;
    text-align: center;
    margin-bottom: 26px;
}

.ffa-reset-form-block {
    width: 400px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.ffa-reset-form-block label {
    display: block;
    width: 100%;
}

.ffa-reset-form-block input {
    display: block;
    width: 100%;
}

.ffa-reset .ffa-btn-wrap {
    display: flex;
    justify-content: center;
    padding: 0 0 20px;
    margin-bottom: 40px;
}

.ffa-reset .ffa-btn-wrap p {
    padding: 6px 20px;
}

.ffa-reset .ffa-btn-wrap p:hover {
    cursor: pointer;
    opacity: 0.75;
}

.ffa-reset .ffa-btn-wrap p  {
    color: #FFF;
    background-color: var(--cl-blue);
}

.ffa-reset .ffa-btn-wrap p.ffa-status-passive  {
    color: unset;
    background-color: var(--cl-grey);
}

.ffa-reset-validation {
    display: none;
}

.ffa-reset input.is-danger ~ p.ffa-reset-validation {
    color: #ff3860;
    display: block;
}
</style>
