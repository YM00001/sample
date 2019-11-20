<template>
    <div class="ffa-404 ffa-container">
      <div class="ffa-404-wrapper">
        <div class="ffa-404-img-wrapper">
          <img src="/img/admin/header_logo.png" alt="">
        </div>
        <h1>リクエストされたページの有効期限が切れています。</h1>
        <div class="ffa-404-link">
          <router-link to="/partner/account/login">ログイン</router-link>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
}
</script>

<style scoped>
.ffa-404 {
    height: 84vh;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
}

.ffa-404-img-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ffa-404 img {
    width: 200px;
    margin-bottom: 30px;
}

.ffa-404 h1 {
    margin-bottom: 30px;
}

.ffa-404-link {
    text-align: center;
}
</style>
