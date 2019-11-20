<template>
    <div class="ffa-complete ffa-container">
      <div class="ffa-complete-wrapper">
        <div class="ffa-complete-img-wrapper">
          <img src="/img/admin/header_logo.png" alt="">
        </div>
        <h1>パスワードのリセットが完了しました。</h1>
        <p>新しいパスワードで<router-link to="/partner/account/login">ログイン</router-link>してください。</p>
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
/* complete scoped */
.ffa-complete {
    height: 84vh;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
}

.ffa-complete-img-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ffa-complete img {
    width: 200px;
    margin-bottom: 30px;
}

.ffa-complete h1 {
    margin-bottom: 30px;
    text-align: center;
}

.ffa-complete p {
    margin-bottom: 16px;
}

.ffa-complete li {
    margin-left: 20px;
    list-style: circle;
}
</style>
