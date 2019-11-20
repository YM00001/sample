<template>
    <header>
      <div class="ffa-container">
        <img src="/img/partner/header_logo.png" alt="">
        <p>{{ name }}様</p>
      </div>
      <nav class="ffa-headnavi">
        <div class="ffa-container">
          <ul class="ffa-headnavi-list">
            <li><router-link
                to="/partner/top/dashboard"
                :class="{ active: getPath === 'top' }"
            >トップ</router-link></li>
            <li><router-link
                to="/partner/cast/list"
                :class="{ active: getPath === 'cast' }"
            >キャスト管理</router-link></li>
            <li><router-link
                to="/partner/reserve/list"
                :class="{ active: getPath === 'reserve' }"
            >予約管理</router-link></li>
            <li><router-link
                to="/partner/payment/duration"
                :class="{ active: getPath === 'payment' }"
            >ペイメント</router-link></li>
            <li><router-link
                to="/partner/document/top"
                :class="{ active: getPath === 'document' }"
            >ドキュメント</router-link></li>
          </ul>
        </div>
      </nav>
    </header>
</template>

<script>

export default {
    data() {
        return {
        }
    },
    computed: {
        getPath: function() {
            return this.$route.path.match(/\/partner\/([^\/]+)/)[1];
        },
    },
    props: [
        'name',
    ],
}
</script>

<style scoped>

header > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
}

header img {
    width: 200px;
}

.ffa-headnavi {
    width: 100%;
    background-color: var(--cl-main);
    margin: 20px 0;
}

.ffa-headnavi-list {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
}

.ffa-headnavi-list li a {
    color: #FFF;
    font-weight: 500;
    opacity: 0.6;
    padding: 10px 20px;
}

.ffa-headnavi-list li a.active {
    color: #FFF;
    opacity: 1;
    position: relative;
}

.ffa-headnavi-list li a.active:after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: var(--cl-main);
    position: absolute;
    bottom: -4px;
    left: 0;
}
</style>
