<template>
    <transition>
        <div v-if="is_open" class="modal-screen" @click.self="click">
            <div class="modal-content">
                <template v-if="cmd === 'cancel'">
                    <h3>予約のキャンセル</h3>
                    <div class="">
                        <p>キャンセル理由を選択してください。</p>
                        <select v-if="master.cancel_reason" v-model="cancel.cancel_reason">
                            <option value="0">選択してください</option>
                            <template v-for="item in master.cancel_reason">
                                <option v-if="item.selectable === 'guest'" :value="item.id">{{ item.reason }}</option>
                            </template>
                        </select>
                        <p class="notice">
                            サービス利用規約に基づき、キャンセル料が発生する場合があります。<br />詳しくは
                            <router-link to="/document">こちら</router-link>を御覧ください。
                        </p>
                        <p>
                            キャンセルを実行します。<br />よろしいですか？
                        </p>
                        <div class="ff-btn-wrap">
                            <Btn
                                :disabled="!cancelReasonSelected || cancel.is_sending"
                                @click="cancelReserve"
                            >OK</Btn>
                            <Btn
                                class="negative"
                                @click="click"
                            >取り消し</Btn>
                        </div>
                    </div>
                </template>

            </div>
        </div>
    </transition>
</template>

<script>
import getMaster from '../../mixin/getMaster.js';
import Btn from '../contents/inner/Btn.vue';

export default {
    data() {
        return {
            is_open: false,
            cmd: null,
            arg_data: null,
            master: {},
            cancel: {
                is_sending: false,
                cancel_reason: 0,
            },
        }
    },
    props: [
        'guest',
    ],
    mounted: function() {
        this.$eventHub.$on('openCommand', (cmd, data) => {
            this.is_open = true;
            this.cmd = cmd;
            this.arg_data = data;
        });

        this.getCancelReason().then((res) => {
            this.master.cancel_reason = res;
        })
    },
    computed: {
        cancelReasonSelected: function() {
            return this.cancel.cancel_reason != 0;
        }
    },
    methods: {
        click: function() {
            this.is_open = !this.is_open;
        },
        cancelReserve: function() {
            this.cancel.is_sending = true;
            let cancelReserveByGuest = firebase.app().functions('asia-northeast1').httpsCallable('cancelReserveByGuest');
            cancelReserveByGuest({
                reserve_id: this.arg_data.reserve_id,
                reason_id: this.cancel.cancel_reason-0,
            }).then((res) => {
                console.log(res);
                this.is_open = false;
                this.$eventHub.$emit('notification', { icon: 'success', message:'予約のキャンセルに成功しました', });
            }).finally(() => {
                this.cancel.is_sending = false;
            })
        },
    },
    mixins: [
        getMaster,
    ],
    components: {
        Btn,
    },
}
</script>

<style scoped>
.modal-screen {
    background-color: #000000AA;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
}

.modal-content {
    background-color: #FFF;
    background-color: var(--cl-grey-light);
    width: 90%;
    height: 70vh;
    border-radius: 10px;
    box-shadow: var(--mbs-level2);
}

.modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.modal-content h3 {
    font-size: 1.3rem;
    text-align: center;
    padding: 2rem 0;
}

.modal-content > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 2rem 0;
}

.modal-content > div p {
    padding: 1rem;
    text-align: center;
    word-break: break-all;
}

.modal-content > div select {
    width: 80%;
    padding: 0.5rem;
    margin-bottom: 1rem;
}

.modal-content > div .ff-btn-wrap {
    margin-top: 1rem;
}

.modal-content > div .negative {
    background: #AAA;
    margin-left: 2rem;
}
</style>
