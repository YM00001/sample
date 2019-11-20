<template>
    <div class="">
        <Header
            :is_auth="is_auth"
        ></Header>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
import Header from '../cast/parts/HeaderParts.vue';

export default {
    data() {
        return {

        }
    },
    props: [
        'is_auth',
    ],
    components: {
        Header,
    },
}
</script>

<style scoped>

</style>
