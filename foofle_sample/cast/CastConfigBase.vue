<template>
    <div>
        <main>
            <div class="ffc-wrapper ffc-top-wrapper">
                <router-view
                    :title="title"
                    :cast="cast"
                ></router-view>
            </div>
        </main>
        <BottomFloatNavi></BottomFloatNavi>
        <SideMenu
            :cast="cast"
        ></SideMenu>
    </div>
</template>

<script>
import axios from 'axios';

import SideMenu from './parts/SideMenuParts.vue';
import BottomFloatNavi from './parts/BottomFloatNaviParts.vue';

export default {
    data() {
        return {
            cast: null,
        }
    },
    props: [
        'title',
    ],
    mounted: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            let cast_id = window.localStorage['active_cast_id'] || null;
            axios({
                method: 'POST',
                url: '/api/cast/castinfo',
                data: {
                    cast_id: cast_id,
                },
            }).then((res) => {
                this.cast = res.data;
            }).catch((err) => {
                console.log(err);
            });
        },
    },
    components: {
        BottomFloatNavi, SideMenu,
    },
}
</script>

<style scoped>
main {
    padding-bottom: 84px;
}
</style>
