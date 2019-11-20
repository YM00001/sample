<template>
    <div>
        <Header
            :name="partnerData ? partnerData.name : null"
        ></Header>
        <main>
          <div v-if="checkEmailAuth" class="ffa-container header-msg">
              <div class="alert-msg">
                  <p>アカウントを有効にするために、メールアドレスの認証を行ってください。</p>
              </div>
          </div>
          <div v-else-if="checkApplyConfirmed" class="ffa-container header-msg">
              <div v-if="checkApplyConfirmed === 'unsubmitted'" class="alert-msg">
                  <p>アカウントを有効にするために、届出確認書をアップロードしてください。<router-link to="/partner/top/config">here</router-link></p>
              </div>
              <div v-if="checkApplyConfirmed === 'rejected'" class="alert-msg">
                  <p>届出確認書が確認できませんでした。お手数ですがもう一度アップロードしてください。<router-link to="/partner/top/config">here</router-link></p>
              </div>
          </div>
          <div v-else-if="checkPublic" class="ffa-container header-msg">
              <div class="alert-msg">
                  <p>現在お客様の情報は非公開になっています。準備ができましたら設定から「公開」にしてください。</p>
              </div>
          </div>
          <div class="ffa-container columns">
            <Sidemenu
                :sidemenu="sidemenu"
            ></Sidemenu>
            <router-view
                :partnerData="partnerData"
                :dashboardData="dashboardData"
                :paymentData="paymentData"
            ></router-view>
          </div>
        </main>
        <Footer></Footer>
        <Notification></Notification>
        <TipsModal></TipsModal>
        <CommandModal></CommandModal>
    </div>
</template>

<script>
import axios from 'axios';

import Header from './parts/HeaderParts.vue';
import Sidemenu from './parts/SidemenuParts.vue';
import Footer from './parts/FooterParts.vue';
import Notification from './parts/Notification.vue';
import CommandModal from './parts/CommandModalParts.vue';

export default {
    data() {
        return {
            partnerData: null,
            dashboardData: null,
            paymentData: null,
        }
    },
    created: function() {
        this.fetchPartnerData();
        this.$eventHub.$on('fetchPartnerData', this.fetchPartnerData);
        this.$eventHub.$on('fetchDashboardData', this.fetchDashboardData);
        this.$eventHub.$on('fetchPaymentData', this.fetchPaymentData);
    },
    computed: {
        checkEmailAuth: function() {
            if (this.partnerData && this.partnerData.status === 'email_unauth') {
                return true;
            } else {
                return false;
            }
        },
        checkApplyConfirmed: function() {
            if (this.partnerData && this.partnerData.license_file !== 'submitted') {
                return this.partnerData.license_file;
            } else {
                return false;
            }
        },
        checkPublic: function() {
            if (this.partnerData && !this.partnerData.config.is_public) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        emitErrorMessage: function() {
            this.$eventHub.$emit('notification', {attr:'is-warning', message:'データの取得に失敗しました。\n時間を空けてお試しください。'});
        },
        fetchPartnerData: function() {
            axios({
                method: 'get',
                url: '/api/partner/data',
            }).then((response) => {
                if (response.status === 200) {
                    this.partnerData = response.data;
                }
            }).catch((error) => {
                this.emitErrorMessage();
            });
        },
        fetchDashboardData: function() {
            axios({
                method: 'get',
                url: '/api/partner/dashboard',
            }).then((response) => {
                if (response.status === 200) {
                    this.dashboardData = response.data;
                }
            }).catch((error) => {
                this.emitErrorMessage();
            });
        },
        fetchPaymentData: function() {
            axios({
                method: 'get',
                url: '/api/partner/paymentdata',
            }).then((response) => {
                if (response.status === 200) {
                    this.paymentData = response.data;
                }
            }).catch((error) => {
                this.emitErrorMessage();
            });
        },
    },
    props: [
        'sidemenu',
    ],
    components: {
        Header, Sidemenu, Footer, Notification, CommandModal,
    }
}
</script>

<style>
.ffa-content {
    /*
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    */
}

.header-msg {
    padding: 0.5rem 0 1rem;
}

.alert-msg {
    padding: 0.5rem 1rem;
    border: 2px solid var(--cl-green);
}
</style>
