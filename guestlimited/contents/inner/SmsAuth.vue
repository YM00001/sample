<template>
    <div class="auth-wrap">
        <div v-if="!status" class="auth-block">
            <p>SMS(ショートメール)が受信できる番号をご入力ください。<br />入力後、送信ボタンを押すと確認コードをお送りします。</p>
            <input type="text" placeholder="電話番号を入力してください"
                v-model="input_number"
            >
            <Btn id="send-btn"
                @click="send"
                :disabled="sms_sending || invalidNumber"
            >送信</Btn>
        </div>
        <div id="captcha_container"></div>
        <div v-if="status === 'sent'" class="auth-block">
            <template v-if="!pin_sending">
                <p>{{ input_number }}宛にSMSをお送りしました。<br/>SMSに記載された確認コードを入力してください。</p>
                <Pin6
                    @enteredPin="check"
                ></Pin6>
                <p>1,2分待ってもSMSが届かない場合には<br/>再送信からもう一度番号をご入力ください。</p>
                <p class="reenter"
                    @click="resend"
                >再送信</p>
            </template>
            <Loading v-else></Loading>
        </div>
        <div v-if="status === 'complete'" class="auth-block">
            <p>確認が完了しました。</p>
        </div>
    </div>
</template>

<script>
import Btn from './Btn.vue';
import Pin6 from './Pin6.vue';
import Loading from '../../../guest/contents/inner/Loading.vue';

export default {
    data() {
        return {
            status: null,
            input_number: '',
            pin_sending: false,
            sms_sending: false,
        }
    },
    computed: {
        modNumber: function() {
            let reg = /-/g;
            let num;
            if (reg.test(this.input_number)) {
                num = this.input_number.replace(reg, '');
            } else {
                num = this.input_number;
            }
            return '+81' + num.slice(-10);
        },
        invalidNumber: function() {
            let reg = /-/g;
            let num = this.input_number.replace(reg, '');
            if (/[^-\d]/.test(this.input_number)) { return '半角数字、ハイフン以外の文字が含まれています。'; }
            if (num.length !== 11) { return '桁数が少なすぎます。'; }
            if (num.slice(0, 1) !== '0') { return '電話番号は0からはじまります。'; }
            return false;
        },
    },
    mounted: function() {
        firebase.auth().languageCode = 'ja';
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha_container', {
          'size': 'invisible',
        });
        this.recaptchaVerifier.render().then(function(widgetId) {
          self.recaptchaWidgetId = widgetId;
        });
    },
    methods: {
        send: function() {
            this.sms_sending = true;
            let self = this;

            firebase.auth().signInWithPhoneNumber(this.modNumber, this.recaptchaVerifier)
            .then((confirmationResult) => {
              self.confirmationResult = confirmationResult;
              self.status = 'sent';
              self.sms_sending = false;
            }).catch(function (error) {
              console.log(error);
              self.$eventHub.$emit('notification', { message: 'エラーが発生しました。お時間を置いてお試しください。'});
            });
        },
        check: function(code) {
            this.pin_sending = true;
            let self = this;
            let user = firebase.auth().currentUser;
            let credential = firebase.auth.PhoneAuthProvider.credential(this.confirmationResult.verificationId, code);console.log(code);
            if (user.phoneNumber) {
                user.updatePhoneNumber(credential).then((userCred) => {console.log(userCred);
                    self.status = 'complete';
                    self.pin_sending = false;
                    self.$emit('checked');
                }).catch((error) => {
                    console.log(error);
                    self.$eventHub.$emit('notification', { message: '認証コードが正しくありません。'});
                    self.pin_sending = false;
                });
                
            } else {
                user.linkWithCredential(credential).then((userCred) => {console.log(userCred);
                    self.status = 'complete';
                    self.pin_sending = false;
                    self.$emit('checked');
                }).catch((error) => {
                    console.log(error);
                    self.$eventHub.$emit('notification', { message: '認証コードが正しくありません。'});
                    self.pin_sending = false;
                });
            }
        },
        resend: function() {
            this.status = null;

            this.recaptchaVerifier.clear();
            this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha_container', {
              'size': 'invisible',
            });
            this.recaptchaVerifier.render().then(function(widgetId) {
              self.recaptchaWidgetId = widgetId;
            });
            //this.recaptchaVerifier.reset();
        },
    },
    components: {
        Btn, Pin6, Loading,
    },
}
</script>

<style scoped>
.auth-block {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.auth-block input {
    background-color: var(--cl-grey-light);
    height: 3rem;
    width: 18rem;
    text-align: center;
    margin: 1rem 0.5rem 1rem;
}

.auth-block input::placeholder {
    font-size: 1.2rem;
}

.auth-block p {
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.4rem;;
    margin-bottom: 1rem;
}

.auth-block p.reenter {
    font-size: 1rem;
    text-decoration: underline;
}
</style>
