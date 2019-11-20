<template>
    <div class="ffa-complete ffa-container">
      <div class="ffa-complete-wrapper">
        <div class="ffa-complete-img-wrapper">
          <img src="/img/partner/header_logo.png" alt="">
        </div>
        <h1>アカウントの作成を受け付けました</h1>
        <p>ご入力いただいた{{ this.email }}宛にメールをお送りいたしました。<br />メールに記載されているURLをクリックして認証を完了させてください。</p>
        <p>5分ほど経ってもメールが届かない場合には以下の原因が考えられます。</p>
        <ul>
          <li>迷惑メールフォルダに振り分けられている。</li>
          <li>ご入力いただいたメールアドレスが誤っている。</li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: this.$route.query.email,
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
