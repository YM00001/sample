<template>
    <div class="sales-wrap">
        <Header></Header>
        <div class="container">
            <router-view name="content"></router-view>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from './parts/PartnerAccountHeader.vue';
import Footer from './parts/PartnerAccountFooter.vue';

export default {
    data() {
        return {

        }
    },
    components: {
        Header, Footer,
    }
}
</script>

<style scoped>
    .sales-wrap {
        width: 100%;
        height: auto;
        background: #FFF;
        background: linear-gradient(-225deg, #ff2d940A 0%, #3ae6fa0A 100%);
        position: relative;
    }

    .sales-wrap:before,
    .sales-wrap:after {
        content: '';
        width: 12px;
        height: 100%;
        background: linear-gradient(-225deg, #ff2d94 0%, #3ae6fa 100%);;
        position: absolute;
    }

    .sales-wrap:before {
        top: 0;
        left: 0;
    }

    .sales-wrap:after {
        top: 0;
        right: 0;
    }

    .container {
        width: 1280px;
        margin: 0 auto;
        background-color: #FFF;
    }
</style>
