<template>
    <div>
        <div class="ffc-fix-alerticon">
            <div class="ffc-fix-alerticon-icon alerticon-sos">
                <span>SOS</span>
                <i></i>
            </div>
            <div class="ffc-fix-alerticon-icon alerticon-call">
                <span>お店に電話</span>
                <i></i>
            </div>
        </div>
        <div class="ffc-fix-alertbox" v-if="alertCode">
            <div class="ffc-fix-alertbox-header">
                <p>SOS発信中</p>
                <p>キャンセル</p>
            </div>
            <div class="ffc-fix-alertbox-progress"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            alertCode: null,
        }
    },
    methods: {
        call: function(e) {
            let self = this;
            axios({
                method: 'POST',
                url: '/api/cast/emergency',
                data: { rid: this.$route.param.rid }
            }).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });
        },
    },
}
</script>

<style scoped>
.ffc-fix-alerticon {
    width: 100%;
    position: fixed;
    bottom: 0;
    display: block;
}

.ffc-fix-alerticon-icon {
    text-align: center;
    position: absolute;
}

.ffc-fix-alerticon-icon span {
    font-size: 1.2rem;
}

.alerticon-sos {
    left: 0.5rem;
    bottom: 1rem;
}

.alerticon-call {
    right: 0.7rem;
    bottom: 1rem;
}

.ffc-fix-alerticon-icon i {
    display: block;
    width: 6rem;
    height: 6rem;
}

.alerticon-sos i {
    background-position: 0.2rem 0;
}

.alerticon-call i {
    background-position: -7.8rem 0.18rem;
}

.ffc-fix-alertbox {
    width: 100%;
    background-color: #474747;
    padding: 1rem 0;
    position: fixed;
    bottom: 0;
    left: 0;
}

.ffc-fix-alertbox-header {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 0.8rem;
}

.ffc-fix-alertbox-header p:nth-child(1) {
    color: #FFF;
    font-size: 1.3rem;
}

.ffc-fix-alertbox-header p:nth-child(2) {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--cl-red);
    background-color: #eef40b;
    padding: 0.8rem 4rem;
}

.ffc-fix-alertbox-progress {
   width: 100%;
   height: 0.4rem;
   background-color: var(--cl-grey);
   position: relative;
   z-index: 3;
}

.ffc-fix-alertbox-progress:after {
   content: '';
   display: block;
   width: 100%;
   height: 0.4rem;
   background-color: var(--cl-red);
   position: absolute;
   top: 0;
   bottom: 0;
   left: 0;
   animation: alert 10s linear;
}

@keyframes alert {
    from { width: 0; }
    to { width: 100%; }
}
</style>
