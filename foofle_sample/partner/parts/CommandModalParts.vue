<template>
    <transition>
        <div v-if="is_open" class="modal-screen" @click.self="click">
            <div class="modal-content">
                <div class="header">
                    <h5>{{ display(command) }}</h5>
                    <fa :icon="['fas', 'times']" size="lg"
                        :style="{ color: '#FFF'}"
                        @click="click"
                    ></fa>
                </div>
                <div class="body">
                    <template v-if="command === 'cancel'">
                        <div class="cancel-block">
                            <p>注文をキャンセルします。</p>
                            <div class="">
                                <p>キャンセル理由を選択してください。</p>
                                <select v-model="cancel.parent_id">
                                    <option value="default" selected>選択してください</option>
                                    <template  v-for="(item, key) in cancel.cancel_reason">
                                        <option v-if="item.selectable === 'partner' && !item.parent_id"
                                            :value="key"
                                        >{{ item.reason }}</option>
                                    </template>
                                </select>
                                <fa :icon="['fas', 'arrow-right']"></fa>
                                <select v-model="cancel.child_id">
                                    <option value="disabled" v-if="cancel.parent_id === 'default'" selected>大項目を選択してください</option>
                                    <option　v-else value="default">選択してください</option>
                                    <template v-if="cancel.parent_id !== 'default'">
                                        <template v-for="(item, key) in cancel.cancel_reason">
                                            <option v-if="item.selectable === 'partner' && item.parent_id == cancel.parent_id"
                                                :value="key"
                                            >{{ item.reason }}</option>
                                        </template>
                                    </template>
                                </select>
                            </div>
                            <div class="ffa-btn">
                                <p v-if="!cancel.is_sending" @click="excuteCancel"
                                    :class="{ 'ffa-disabled': !can_cancel }"
                                >キャンセル実行</p>
                                <Loading v-else></Loading>
                            </div>
                        </div>
                    </template>
                    <template v-if="command === 'confirm'">
                        <div class="confirm-block">
                            <p>クレジットカード決済を確認します。</p>
                            <table v-if="info">
                                <tr>
                                    <td>お客様の電話番号</td>
                                    <td>090-1234-5678</td>
                                </tr>
                                <tr>
                                    <td>金額</td>
                                    <td>{{ currency(info.fee.payment_fee) }}</td>
                                </tr>
                            </table>
                            <p>決済の確認ができたら承認してください。</p>
                            <div class="ffa-btns">
                                <div v-if="!confirm.is_sending" class="ffa-btn">
                                    <p @click="executeConfirm(true)"
                                    >承認</p>
                                </div>
                                <div v-if="!confirm.is_sending" class="ffa-btn">
                                    <p @click="executeConfirm(false)"
                                        class="ffa-btn-reject"
                                    >拒否</p>
                                </div>
                                <Loading v-else></Loading>
                            </div>
                        </div>
                    </template>
                    <template v-if="command === 'pin'">
                        <div class="confirm-block">
                            <p>お客様のPINを入力します。</p>
                            <p v-if="pin.error_msg" class="error-msg">PINが正しくありません。<br />番号を再度確認してください。</p>
                            <Pin @enteredPin="enterPin" ref="pin"></Pin>
                            <Loading v-if="pin.is_sending"></Loading>
                        </div>
                    </template>
                    <template v-if="command === 'abuser'">
                        <div class="confirm-block">
                            <p>このお客様を利用NGに設定します。</p>
                            <div class="ffa-btns">
                                <div v-if="!ng.is_sending" class="ffa-btn">
                                    <p @click="executeNg('cast')"
                                    >キャストNG</p>
                                </div>
                                <div v-if="!ng.is_sending" class="ffa-btn">
                                    <p @click="executeNg('partner')"
                                        class="ffa-btn-reject"
                                    >店舗NG</p>
                                </div>
                                <Loading v-else></Loading>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import axios from 'axios';

import Loading from '../contents/inner/PartnerLoading.vue';
import Pin from '../contents/inner/Pin.vue';
import getMaster from '../../mixin/getMaster.js';
import formatData from '../../mixin/formatData.js';

export default {
    data() {
        return {
            command: null,
            info: null,
            cmd_ja: {
                'cancel': '予約のキャンセル',
                'confirm': 'クレジットカード決済の認証',
                'contact': 'お客様へ連絡',
                'pin': 'PINの入力',
                'abuser': 'NG顧客設定',
                'support': 'サポートに連絡',
            },
            is_open: false,
            cancel: {
                cancel_reason: [],
                is_sending: false,
                parent_id: 'default',
                child_id: 'disabled',
            },
            confirm: {
                is_sending: false,
            },
            ng: {
                is_sending: false,
            },
            pin: {
                is_sending: false,
                error_msg: null,
            },
        }
    },
    computed: {
        can_cancel: function() {
            return (this.cancel.child_id && this.cancel.child_id !== 'disabled' && this.cancel.child_id !== 'default');
        },
    },
    mounted: function() {
        this.getCancelReason().then((res) => {
            this.cancel.cancel_reason = res;
        });

        this.$eventHub.$on('openCommand', (object) => {
            this.is_open = true;
            this.command = object.command;
            this.info = object.info;
        });
    },
    methods: {
        display: function(cmd) {
            if (this.cmd_ja.hasOwnProperty(cmd)) {
                return this.cmd_ja[cmd];
            } else {
                return 'その他';
            }
        },
        click: function() {
            if (this.is_open) {
                this.is_open = false;
                this.$eventHub.$emit('closeCommand');
            } else {
                this.is_open = true;
            }
        },
        excuteCancel: function(suc) {
            this.cancel.is_sending = true;
            axios({
                method: 'post',
                url: '/api/partner/cancel',
                data: {
                    reserve_id: this.info.id,
                    reason_id: this.cancel.child_id,
                },
            }).then((response) => {console.log(response);
                if (response.data === 'Success') {
                    this.is_open = false;
                    this.$eventHub.$emit('closeCommand');
                    this.$eventHub.$emit('completeCommand');
                    this.$eventHub.$emit('notification', {attr:'is-success', message:'予約をキャンセルしました。'});
                } else {
                    this.$eventHub.$emit('notification', {attr:'is-warning', message:'予約のキャンセルに失敗しました。'});
                }
            }).catch((error) => {
                this.$eventHub.$emit('notification', {attr:'is-warning', message:'予約のキャンセルに失敗しました。'});
            }).finally(() => {
                this.cancel.is_sending = false;
            });
        },
        executeConfirm: function(approve) {
            this.confirm.is_sending = true;
            axios({
                method: 'post',
                url: '/api/partner/ccconfirm',
                data: {
                    reserve_id: this.info.id,
                    is_approved: approve,
                },
            }).then((response) => {console.log(response);
                if (response.data === 'Success') {
                    this.is_open = false;
                    this.$eventHub.$emit('closeCommand');
                    this.$eventHub.$emit('completeCommand');
                    this.$eventHub.$emit('notification', {attr:'is-success', message:`CC決済を${ approve ? '承認' : '拒否' }しました。`});
                } else {
                    this.$eventHub.$emit('notification', {attr:'is-warning', message:`CC決済の${ approve ? '承認' : '拒否' }に失敗しました。`});
                }
            }).catch((error) => {
                this.$eventHub.$emit('notification', {attr:'is-warning', message:`CC決済の${ approve ? '承認' : '拒否' }に失敗しました。`});
            }).finally(() => {
                this.cancel.is_sending = false;
            });
        },
        enterPin: function(e) {
            let self = this;
            self.pin.is_sending = true;
            self.pin.error_msg = false;
            axios({
                method: 'POST',
                url: '/api/partner/enterpin',
                data: {
                    reserve_id: this.info.id,
                    pin: e,
                },
            }).then((res) => {
                if (res.data === 'Success') {
                    this.is_open = false;
                    this.$eventHub.$emit('closeCommand');
                    this.$eventHub.$emit('completeCommand');
                    this.$eventHub.$emit('notification', {attr:'is-success', message:`PINを確認しました。サービスを開始しました。`});
                } else if (res.data === 'Invalid') {
                    self.pin.error_msg = true;
                    self.$refs.pin.clearPin();
                }
            }).catch((err) => {

            }).finally(() => {
                self.pin.is_sending = false;
            })
        },
        executeNg: function(type) {
            let self = this;
            self.ng.is_sending = true;
            axios({
                method: 'POST',
                url: '/api/partner/ng',
                data: {
                    reserve_id: this.info.id,
                    type: type,
                },
            }).then((res) => {
                if (res.data === 'Success') {
                    this.is_open = false;
                    this.$eventHub.$emit('closeCommand');
                    this.$eventHub.$emit('completeCommand');
                    this.$eventHub.$emit('notification', {attr:'is-success', message:`NG顧客の設定が完了しました。`});
                } else if (res.data === 'Invalid') {
                    this.$eventHub.$emit('notification', {attr:'is-warning', message:`NG顧客の設定に失敗しました。`});
                }
            }).catch((err) => {
                this.$eventHub.$emit('notification', {attr:'is-warning', message:`NG顧客の設定に失敗しました。`});
            }).finally(() => {
                self.ng.is_sending = false;
            })
        },
    },
    mixins: [
        getMaster, formatData,
    ],
    components: {
        Loading, Pin,
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
    background-color: #FDFDFD;
    width: 60%;
    height: 70vh;
    border-radius: 10px;
    box-shadow: var(--mbs-level2);
}

.modal-content .header {
    width: 100%;
    padding-bottom: 2rem;
    position: relative;
    display: flex;
    flex-wrap: wrap;

}

.modal-content .header:before {
    content: 'COMMAND';
    display: flex;
    color: #FFF;
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 0.4rem;
    width: 100%;
    height: 36px;
    border-radius: 10px 10px 0 0;
    background: #DDD;
    justify-content: flex-start;
    align-items: center;
    padding-left: 1rem;
}

.modal-content .header svg {
    position: absolute;
    top: 10px;
    right: 16px;
}

.modal-content .header h5 {
    display: inline-block;
    width: 100%;
    background-color: #FFF;
    padding: 1rem;
    border-bottom: 3px dotted var(--cl-pink);
    font-size: 1.2rem;
}

.modal-content .body {
    bakcground-color: #FFF;
    padding: 0 1rem 1rem;
}

.modal-content .body p {
    line-height: 1.4rem;
}

/* Cancel */
.cancel-block {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
}

.cancel-block > p,
.cancel-block > div {
    width: 100%;
    text-align: center;
}

.cancel-block select {
    padding: 0.3rem;
    width: 25%;
}

.cancel-block > p:nth-child(1) {
    margin-bottom: 1.5rem;
}

.cancel-block > div > p:nth-child(1) {
    margin-bottom: 0.5rem;
}

.cancel-block > div > svg {
    margin: 0 1rem;
    opacity: 0.6
}

.ffa-disabled {
    opacity: 0.4
}

/* Confirm */
.confirm-block {
    display: flex;
    flex-wrap: wrap;
}

.confirm-block > div,
.confirm-block > p {
    width: 100%;
    text-align: center;
}

.confirm-block table {
    width: 60%;
    margin: 1rem auto;
    background-color: #FFF;
}

.confirm-block table td {
    border: 1px solid  var(--cl-grey);
    text-align: center;
    padding: 0.3rem;
}

.confirm-block div.ffa-btns {
    display: flex;
    justify-content: center;
    align-items: center;
}

.confirm-block div.ffa-btns div {
    width: auto;
    margin: 0 1rem;
}

.ffa-btn > p.ffa-btn-reject {
    color: unset;
    background-color: #DDD;
}

.error-msg {
    color: red;
}

</style>
