<template>
    <div>
        <Header
            :is-auth="is_auth"
        ></Header>
        <main>
            <div class="ffc-wrapper ffc-top-wrapper">
                <transition name="content-fade" mode="out-in">
                    <router-view
                        :cast="cast"
                    ></router-view>
                </transition>
            </div>
        </main>
        <BottomFloatNavi></BottomFloatNavi>
        <GalleryModal></GalleryModal>
        <SideMenu
            :cast="cast"
        ></SideMenu>
    </div>
</template>

<script>
import axios from 'axios';

import Header from './parts/HeaderParts.vue';
import BottomMenu from './parts/BottomMenuParts.vue';
import Footer from './parts/FooterParts.vue';

import SideMenu from './parts/SideMenuParts.vue';
import BottomFloatNavi from './parts/BottomFloatNaviParts.vue';
import GalleryModal from './parts/GalleryModalParts.vue';
import EditButton from './parts/EditButtonParts.vue';

export default {
    data() {
        return {
            flag_checkStatus: null,
            cast: null,
        }
    },
    props: [
        'is_auth',
    ],
    mounted: function() {
        let checkStatus = () => {
            let self = this;
            axios({
                method: 'get',
                url: '/api/cast/checkInOrder',
            }).then((res) => {
                console.log(res);
                if (/^r0[\da-f]{6}$/i.test(res.data)) {
                    window.clearInterval(self.flag_checkStatus);
                    self.$router.push(`/cast/${res.data}/transport`);
                }
            }).catch((error) => {
                console.log(error);
            });
        };
        this.flag_checkStatus = window.setInterval(checkStatus, 30000);
        checkStatus();
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
        Header, Footer, BottomMenu, BottomFloatNavi, GalleryModal, EditButton, SideMenu,
    },
}
</script>

<style scoped>
.content-fade-enter-active, .content-fade-leave-active {
  transition: opacity .3s ease;
}
.content-fade-enter, .content-fade-leave-to
/* .content-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}

</style>
