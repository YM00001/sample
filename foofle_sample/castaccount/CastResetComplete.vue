<template>
    <div class="ffc-wrapper ffa-login-wrapper">
      <h1 class="ffc-ribbon">パスワードリセット</h1>
      <p>パスワードをリセットします。</p>
      <div class="ffc-block">
          <label for="">新パスワード</label>
          <input class="input" type="password" required
            v-model="password"
            :class="{ 'is-danger' : password_invalid_length }"
            @keyup="validPasswordLength"
          >
          <p class="signup-validation">パスワードは8文字以上で入力してください。</p>
      </div>
      <div class="ffc-block">
          <label for="">確認のためもう一度入力してください</label>
          <input class="input" type="password" required
              v-model="password_confirm"
              :class="{ 'is-danger' : password_invalid_match }"
              @keyup="validPasswordMatch"
          >
          <p class="signup-validation">パスワードが一致しません。</p>
      </div>
      <div class="ffc-btn-wrap"
            :class="{ 'passive' : is_loading }"
      >
          <button name="button" @click="submitData">リセット</button>
      </div>
      <Loading v-if="is_loading"></Loading>
    </div>
</template>

<script>
import axios from 'axios';
import Loading from '../cast/parts/Loading.vue';

export default {
    data() {
        return {
            password: '',
            password_confirm: '',
            password_invalid_length: false,
            password_invalid_match: false,
            token: this.$route.params.token,
            is_loading: false,
        }
    },
    mounted: function() {
        let self = this;
        axios({
            url: '/api/cast/reset/confirm',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: { token: this.$route.params.token },
        })
        .then(function (response) {
            if (response.data !== 'Confirm') {
                self.$router.replace('/cast/account/login');
            } else {
                self.allow = true;
            }
        })
        .catch(function (error) {
            self.$router.replace('/cast/account/login');
        });
    },
    methods: {
        validPasswordLength: function() {
            this.password_invalid_length = !(this.password.length > 7);
            return this.password.length > 7;
        },
        validPasswordMatch: function() {
            this.password_invalid_match = !(this.password === this.password_confirm);
            return this.password === this.password_confirm;
        },
        submitData: function(e) {
            e.preventDefault();
            this.is_loading = true;

            let self = this;
            if (!this.password_invalid_length && !this.password_invalid_match) {
                // Valid
                axios({
                    url: '/api/cast/reset/execute',
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
                        self.$router.replace('/cast/account/login?reset=1');
                    }
                    self.is_loading = false;
                })
                .catch(function (error) {
                    self.is_loading = false;
                });
            } else {
                this.is_loading = false;
            }
        },
    },
    components: {
        Loading,
    }
}
</script>

<style scoped>
.ffa-login-wrapper {
    min-height: calc(100vh - 4rem);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-grow: inherit;
}
.ffa-login-wrapper h1 {
    margin-bottom: 3rem;
}

.ffa-login-wrapper > p {
    text-align: center;
}

.ffa-login-wrapper .ffc-block {
    display: flex;
    justify-content: center;
    align-items: center;
}

.ffa-login-wrapper label,
.ffa-login-wrapper input {
    width: 25rem;
}

.signup-validation {
    display: none;
}

.is-danger ~ .signup-validation {
    color: #ff3860;
    display: block;
}

.passive > button {
    background: unset;
    background-color: var(--cl-grey);
}
</style>
