<template>
    <div>
        <Header
        :is_auth="is_auth"
        ></Header>
        <main>
            <router-view
                :reserve="reserve"
            ></router-view>
            <AlertWindow></AlertWindow>
        </main>
        <OperationSideInfo :reserve="reserve"></OperationSideInfo>
    </div>
</template>

<script>
import axios from 'axios';

import Header from './parts/HeaderParts.vue';
import AlertWindow from './parts/AlertWindowParts.vue';
import OperationSideInfo from './parts/OperationSideInfoParts.vue';

export default {
    data() {
        return {
            reserve: {
                id: null,
                building: {
                    address: null,
                    room: null,
                },
                transportation: {
                    delivery_station: {
                        name: null,
                    },
                },
                course: {
                    min: null,
                },
                fee: {
                    is_cc: null,
                    recieve_fee: null,
                },
                timestamp: {
                    reported: null,
                    started: null,
                },
            },
            timeIntervalFlag: null,
        }
    },
    created: function() {
        let self = this;
        let now = this.$route.path;
        let rid = this.$route.params.rid;
        let getReserveData = () => {
            axios({
                method: 'post',
                url: '/api/cast/reserve',
                data: { rid: rid },
            }).then((res) => {
                console.log(res);console.log(now);
                if (res.status === 200) {
                    this.reserve = res.data;
                    if (res.data.status.is_completed) {
                        let nav = `/cast/${rid}/close`;
                        if (now !== nav) {
                            self.$router.replace(nav);
                        }
                    } else if (res.data.status.is_finished) {
                        let nav = `/cast/${rid}/exit`;
                        if (now !== nav) {
                            self.$router.replace(nav);
                        }
                    } else if (res.data.status.is_started) {
                        let nav = `/cast/${rid}/timer`;
                        if (now !== nav) {
                            self.$router.replace(nav);
                        }
                    } else if (res.data.status.is_arrived) {
                        let nav = `/cast/${rid}/enter`;
                        if (now !== nav) {
                            self.$router.replace(nav);
                        }
                    } else {
                        let nav = `/cast/${rid}/transport`;
                        if (now !== nav) {
                            self.$router.replace(nav);
                        }
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        getReserveData();
        this.timeIntervalFlag = window.setInterval(getReserveData, 30000);
    },
    props: [
        'is_auth',
    ],
    components: {
        Header, AlertWindow, OperationSideInfo,
    },
}
</script>

<style scoped>

</style>
