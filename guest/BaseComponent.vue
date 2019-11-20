<template>
    <div class="ff-container">
        <HeaderParts
            v-if="header"
            :simpleHeader="simpleHeader"
        ></HeaderParts>
        <main class="main">
            <router-view
                :user="user"
                :guest="guest"
                :follow="follow"
                :nomination="nomination"
                :transaction="transaction"
                :activeReserve="activeReserve"
            ></router-view>
            <router-view name="fixed"></router-view>
        </main>
        <SideMenu
            :guest="guest"
        ></SideMenu>
        <BottomReserveBtn
            v-if="reserveBtn"
            :nomination="nomination"
        ></BottomReserveBtn>
        <BottomSearchBtn
            v-if="searchBtn"
        ></BottomSearchBtn>
        <BottomFloatNav
            v-if="floatNav"
        ></BottomFloatNav>
        <Notification></Notification>
        <TipsModal></TipsModal>
        <GalleryModal></GalleryModal>
        <CommandModal
            :guest="guest"
        ></CommandModal>
    </div>
</template>

<script>
import HeaderParts from './parts/HeaderParts.vue';
import BottomReserveBtn from './parts/BottomReserveBtnParts.vue';
import BottomSearchBtn from './parts/BottomSearchBtnParts.vue';
import BottomFloatNav from './parts/BottomFloatNavParts.vue';
import SideMenu from './parts/SideMenuParts.vue';
import Notification from './parts/NotificationParts.vue';
import GalleryModal from './parts/GalleryModalParts.vue';
import CommandModal from './parts/CommandModalParts.vue';

export default {
    data() {
        return {
            db: null,
            user: null,
            docref: null,
            guest: null,
            follow: null,
            nomination: null,
            transaction: null,
            activeReserve: null,
        }
    },
    props: [
        'header', 'simpleHeader', 'reserveBtn', 'floatNav', 'searchBtn',
    ],
    mounted: function(){
        this.db = firebase.firestore();
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user.uid;
                this.docref = this.db.collection('guest').doc(this.user);
                this.fetchGuest();
                this.fetchFollow();
                this.fetchNomination();
                this.fetchTransaction();
                this.fetchActiveReserve();
            }
        }, (e) => {
            console.log(e);
        });

        this.$eventHub.$on('refreshNomination', () => {
            this.fetchNomination();
        });
    },
    methods: {
        fetchGuest: function() {
            if (this.user) {
                this.docref.onSnapshot((doc) => {
                    this.guest = doc.data();
                });
            }
        },
        fetchFollow: function() {
            if (this.user) {
                this.docref.collection('follow').onSnapshot((qss) => {
                    let arr = [];
                    qss.forEach((doc) => {
                        arr.push(doc.data());
                    });
                    this.follow = arr;
                });
            }
        },
        fetchNomination: function() {
            if (this.user) {
                let d = new Date();
                let now = Math.floor(d.getTime() / 1000);
                let limit = now + 20 * 60;

                this.docref.collection('nomination')
                .where('timestamp_end', '>', now).where('is_canceled', '==', false).onSnapshot((qss) => {
                    this.nomination = null;
                    qss.forEach((doc) => {
                        this.nomination = doc.data();
                    });
                    if (this.nomination) {
                        this.db.collection('nomination').doc(this.nomination.id).onSnapshot((dss) => {
                            this.nomination.detail = dss.data();
                        });
                        this.db.collection('nomination').doc(this.nomination.id).collection('cast').onSnapshot((qss) => {
                            this.nomination.cast = [];
                            qss.forEach((doc) => {
                                this.nomination.cast.push(doc.data());
                            });
                        });
                    }
                });
            }
        },
        fetchTransaction: function() {
            if (this.user) {
                this.docref.collection('transaction').orderBy('created_at', 'desc').onSnapshot((qss) => {
                    let arr = [];
                    qss.forEach((qds) => {
                        arr.push(qds.data());
                    });
                    this.transaction = arr;
                });
            }
        },
        fetchActiveReserve: function() {
            if (this.user) {
                this.db.collection('reserve').where('guest_id', '==', this.user).where('status.is_completed', '==', false).where('status.is_canceled', '==', false).onSnapshot((qss) => {
                    let arr = [];
                    qss.forEach((qds) => {
                        arr.push(qds.data());
                    });
                    this.activeReserve = arr;
                });
            }
        },
    },
    components: {
        HeaderParts, BottomReserveBtn, BottomSearchBtn, BottomFloatNav, SideMenu, Notification, GalleryModal, CommandModal,
    },
}
</script>

<style scoped>
main {
    padding-bottom: 84px;
}
</style>
