<template>
    <div class="ff-content ff-contract">
        <template v-if="resetPassword">
            <h1>パスワードリセット</h1>
            <div class="ff-form-container">
                <form>
                    <table>
                        <tr>
                            <td><label for="">パスワード</label></td>
                            <td><input type="password" required v-model="reset.password"></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><p>もう一度パスワードを入力してください。</p><input type="password" required v-model="reset.password_confirm"></td>
                        </tr>
                    </table>
                    <div class="ff-btn-wrap ff-at-simple">
                        <button class="ff-btn-text" type="button" @click="submitNewPassword">リセット実行</button>
                    </div>
                </form>
            </div>
        </template>
        <template v-if="resetPassword_commit">
            <h1>パスワードリセット完了</h1>
            <p>パスワードのリセットが完了しました。</p>
        </template>
        <template v-if="recoverEmail">
            <h1>メールアドレスの回復</h1>
            <p>メールアドレスの変更を取り消しました。</p>
            <p>パスワードリセット用のメールをお送りしました。<br />セキュリティレベル向上のためパスワードリセットをお願いします。</p>
        </template>
        <template v-if="verifyEmail">
            <h1>認証確認中</h1>
            <p>確認完了しました。</p>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            resetPassword: false,
            resetPassword_commit: false,
            recoverEmail: false,
            verifyEmail: false,
            reset: {
                password: '',
                password_confirm: '',
            },
            err: {
                flag: false,
                msg: '',
            },
        }
    },
    created: function() {
        this.checkToken();
    },
    methods: {
        checkToken: function() {
            let self = this;
            let mode = self.$route.query.mode || 'undefined';
            let code = self.$route.query.oobCode || 'undefined';

            firebase.auth().checkActionCode(code).then((res) => {
                switch(mode) {
                    case 'resetPassword':
                        self.resetPassword = true;
                        break;
                    case 'recoverEmail':
                        ((code) => {
                            let recoverEmail = null;
                            firebase.auth().checkActionCode(code).then(function(info) {
                                restoredEmail = info['data']['email'];
                                return firebase.auth().applyActionCode(code);
                            }).then(function() {
                                firebase.auth().sendPasswordResetEmail(restoredEmail).then(function() {
                                    self.recoverEmail = true;
                                }).catch(function(error) {
                                    self.error.msg = '';
                                });
                            }).catch(function(error) {
                                self.error.msg = '';
                            });
                        })(code);
                        break;
                    case 'verifyEmail':
                        ((code) => {
                            firebase.auth().applyActionCode(code).then((res) => {
                                self.verifyEmail = true;
                            }).catch((error) => {

                            });
                        })(code);
                        break;
                    default:
                        self.$router.push('/404');
                }
            }).catch((error) => {
                self.$router.push('/404');
            });
        },

        submitNewPassword: function(e) {
            e.preventDefault();
            let self = this;
            let code = this.$route.query.oobCode;

            firebase.auth().verifyPasswordResetCode(code).then(function() {
                firebase.auth().confirmPasswordReset(code, self.reset.password).then(function(resp) {
                    self.resetPassword = false;
                    self.resetPassword_commit = true;
                }).catch(function(error) {

                });
            }).catch(function(error) {

            });
        }
    },
}
</script>

<style scoped>

</style>
