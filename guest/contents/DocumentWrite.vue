<template>
    <div class="docs">
        <template v-if="!initial_loading">
            <h1>予約の確認方法</h1>
            <div class="content">

                <!-- <AreaInfo></AreaInfo> -->
            </div>
            <div class="common-nav">
                <router-link to="/document">ヘルプトップ</router-link>
            </div>
        </template>
    </div>
</template>

<script>
import getDoc from '../../mixin/getDoc.js';
import Loading from './inner/Loading.vue';
import AreaInfo from './document/AreaInfo.vue';

export default {
    data() {
        return {
            initial_loading: false,
            doc_id: null,
            context: null,
            next: null,
            prev: null,
        }
    },
    mixins: [
        getDoc,
    ],
    components: {
        Loading, AreaInfo,
    },
}
</script>

<style scoped>
.docs h1 {
    font-size: 1.2rem;
    text-align: center;
    letter-spacing: 0.1rem;
    margin: 1rem 0;
}

.docs >>> .ld-wrap {
    margin-top: 3rem;
}

.docs .nav {
    width: 100%;
    display: flex;
    flex-wrap: no-wrap;
    justify-content: space-between;
    padding: 1rem;
}

.docs .nav p {
    width: 40%;
}

.docs .nav p.prev a:before {
    content: '←'
}

.docs .nav p.next {
    text-align: right;
}

.docs .nav p.next a:after {
    content: '→'
}
</style>

<style>
.docs .content {
    background-color: #FFF;
    padding: 1rem 0.5rem;
}

.docs .content h2 {
    font-size: 1.1rem;
    font-weight: normal;
    margin-bottom: 0.3rem;
}

.docs .content p {
    line-height: 1.4rem;
    margin-bottom: 1rem;
}
</style>
