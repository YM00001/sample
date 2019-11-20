<template>
    <div class="ffc-wrapper ffa-login-wrapper">
      <h1 class="ffc-ribbon">ログイン</h1>
      <p v-if="is_signup">アカウントの作成が完了しました。<br />ログインしてください。</p>
      <p v-if="is_reset">パスワードをリセットしました。<br />新しいパスワードでログインしてください。</p>
      <p v-if="is_error" class="error-msg">メールアドレスかパスワードが間違っています。</p>
      <form>
          <div class="ffc-block">
              <label for="">メールアドレス</label>
              <input class="input" type="text" required
                v-model="email"
              >
          </div>
          <div class="ffc-block">
              <label for="">パスワード</label>
              <input class="input" type="password" required
                v-model="password"
              >
          </div>
          <div class="ffc-btn-wrap"
            :class="{ 'passive' : is_loading }"
          >
              <button name="button" @click="submitData">ログイン</button>
          </div>
          <Loading v-if="is_loading"></Loading>
      </form>
      <div class="ffc-login-reset">
          <router-link to="/cast/account/reset">パスワードを忘れましたか？</router-link>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import Loading from '../cast/parts/Loading.vue';

export default {
    data() {
        return {
            email: '',
            password: '',
            is_signup: this.$route.query.signup,
            is_reset: this.$route.query.reset,
            is_loading: false,
            is_error: false,
        }
    },
    methods: {
        submitData: function(e) {
            e.preventDefault();
            this.is_loading = true;
            this.is_error = false;

            let flg = false;
            let self = this;
            if (this.email && this.password) {
                // Valid
                axios({
                    url: '/api/cast/login',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: {
                        email: this.email,
                        password: this.password,
                    },
                })
                .then(function (response) {
                    if (response.data === 'Authed') {
                        window.location.href = '/cast/top';
                    } else {
                        self.is_error = true;
                        self.is_loading = false;
                    }
                })
                .catch(function (error) {
                    self.is_error = true;
                    self.is_loading = false;
                });
            } else {
                this.is_error = true;
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

.passive > button {
    background: unset;
    background-color: var(--cl-grey);
}

.error-msg {
    color: var(--cl-red);
}
</style>
