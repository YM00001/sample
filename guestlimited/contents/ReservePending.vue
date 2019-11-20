<template>
    <div class="msg-wrap">
        <div class="thanks-msg">
            <h1>ご予約ありがとうございます</h1>
            <p>ご予約を承りました。次のステップへお進みください。</p>
        </div>
        <div class="step-icon">
            <p>次のステップ</p>
        </div>
        <div class="step-content">
            <h3>電話番号認証(初回のみ)</h3>
            <p v-if="!is_creating">ご利用には電話番号の認証が必要です。</p>
            <SmsAuth
                @checked="createRequest"
            ></SmsAuth>
            <template v-if="is_creating">
                <p>ご予約を確定させています。<br />少々お待ちください。</p>
                <Loading></Loading>
            </template>
        </div>
    </div>
</template>

<script>
import SmsAuth from './inner/SmsAuth.vue';

export default {
    data() {
        return {
            is_creating: false,
        }
    },
    methods: {
        createRequest: function() {
            this.is_creating = true;
            let user = firebase.auth().currentUser;

            if (user && user.phoneNumber) {

                let storage = window.localStorage || null;
                if (storage && storage.hasOwnProperty('pending_order_reason_by_unauthsms')) {
                    let recieveRequest = firebase.app().functions('asia-northeast1').httpsCallable('recieveRequest');
                    let request = JSON.parse(storage['pending_order_reason_by_unauthsms']);
                    recieveRequest(request).then(function(res) {
                        var sanitizedMessage = res.data;
                        let rid = /^R0[0-9a-f]{6}$/;
                        if (res && rid.test(res.data)) {
                            self.$router.replace(`/reserve/${res.data}`);
                        } else {
                            self.$eventHub.$emit('notification', { message: 'ご予約をお取りできませんでした。もう一度ご入力をお願いします。'});
                            self.$router.replace(`/request/${request['cast_id']}`);
                        }
                    }).catch((error) => {
                        self.$eventHub.$emit('notification', { message: 'ご予約をお取りできませんでした。もう一度ご入力をお願いします。'});
                        self.$router.replace(`/request/${request['cast_id']}`);
                    });
                } else {
                    window.location = '/top';
                }
            }
            thi.is_creating = false;
        },
    },
    components: {
        SmsAuth,
    }
}
</script>

<style scoped>
.msg-wrap {
    padding: 2rem 1rem;
    background-color: #FFF;
}

.thanks-msg {
    margin-bottom: 2rem;
}

.thanks-msg h1 {
    font-size: 1.4rem;
    text-align: center;
    padding: 2.5rem 0;
}

.msg-wrap p {
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.4rem;;
    margin-bottom: 1rem;
}

.step-icon {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.step-icon p {
    color: #FFF;
    font-size: 1.2rem;
    font-weight: 500;
    background-color: var(--cl-pink);
    display: inline-block;
    padding: 0.5rem 1.3rem;
    margin-bottom: 1.5rem;
}

.step-content h3 {
    color: var(--cl-pink);
    font-size: 1.4rem;
    font-weight: bold;
    width: 100%;
    text-align: center;
    margin-bottom: 1rem;
}
</style>
