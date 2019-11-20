<template>
    <div class="ffc-wrapper ffa-login-wrapper">
      <h1 class="ffc-ribbon">パスワードリセット</h1>
      <p>パスワードをリセットします。</p>
      <p v-if="is_error" class="error-msg">登録されていないメールアドレスまたは生年月日が違います。</p>
      <p v-if="is_done" class="done-msg">入力されたメールアドレス宛にメールをお送りしました。<br />記載されているURLから新しいパスワードを設定してください。</p>
      <div class="ffc-block">
          <label for="">メールアドレス</label>
          <input class="input" type="email" required
            v-model="email"
          >
      </div>
      <div class="ffc-block">
          <label for="">生年月日</label>
          <input class="input" type="date" required
            v-model="birthday"
          >
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
            email: '',
            birthday: '',
            is_loading: false,
            is_error: false,
            is_done: false,
        }
    },
    methods: {
        submitData: function(e) {
            e.preventDefault();
            this.is_loading = true;
            this.is_error = false;
            let self = this;

            if (this.email && this.birthday) {
                // Valid
                axios({
                    url: '/api/cast/reset',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: {
                        email: this.email,
                        birthday: this.birthday,
                    },
                })
                .then(function (response) {
                    if (response.data === 'Done') {
                        self.is_done = true;
                        self.email = '';
                        self.birthday = '';
                    } else {
                        self.is_error = true;
                    }
                })
                .catch(function (error) {
                    self.is_error = true;
                })
                .finally(function (e) {
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

.done-msg {
	color: var(--cl-blue);
}
</style>
