<template>
    <div class="ffa-mailauth ffa-container"
        v-if="allow"
    >
      <div class="ffa-mailauth-wrapper">
        <div class="ffa-mailauth-img-wrapper">
          <img src="/img/admin/header_logo.png" alt="">
        </div>
        <h1>メールアドレスの認証が完了しました。<br />下記ページからログインして店舗情報の入力へお進みください。</h1>
        <div class="ffa-mailauth-link">
          <router-link to="/partner/account/login">ログイン</router-link>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            allow: false,
        }
    },
    mounted: function() {
        let self = this;
        axios({
            url: '/api/partner/emailauth',
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
}
</script>

<style scoped>
.ffa-mailauth {
    height: 84vh;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
}

.ffa-mailauth-img-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ffa-mailauth img {
    width: 200px;
    margin-bottom: 30px;
}

.ffa-mailauth h1 {
    margin-bottom: 30px;
    text-align: center;
}

.ffa-mailauth-link {
    text-align: center;
}
</style>
