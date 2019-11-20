<template>
    <div class="ff-content ff-contract">
        <div>
            <p @click="signupWithGoogle">Googleで登録</p>
        </div>
        <h1>無料会員登録</h1>
        <div class="ff-form-container">
            <form>
                <table>
                    <tr>
                        <td><label for="">メールアドレス</label></td>
                        <td><input type="email" required v-model="signup.email"></td>
                    </tr>
                    <tr>
                        <td><label for="">パスワード</label></td>
                        <td><input type="password" required v-model="signup.password"></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><p>もう一度パスワードを入力してください。</p><input type="password" required v-model="signup.password_confirm"></td>
                    </tr>
                </table>
                <div class="ff-form-ck">
                    <input id="terms_chk" type="checkbox" name="" value="">
                    <label for="terms_chk"><a href="">利用規約</a>に同意する</label>
                </div>
                <div class="ff-btn-wrap ff-at-simple">
                    <button class="ff-btn-text" type="button" name="button" @click="signupWithEmail">登録</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            signup: {
                email: '',
                password: '',
                password_confirm: '',
            },
        }
    },
    methods: {
        signupWithEmail: function(e) {
            e.preventDefault();
            let self = this;

            firebase.auth().createUserWithEmailAndPassword(this.signup.email, this.signup.password).then(function(res){
                let user = firebase.auth().currentUser;console.log(user);

                user.sendEmailVerification().then(function() {
                  self.$router.replace('/signup/complete');
                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                });
            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
            });
        },
        signupWithGoogle: function(e) {
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        },
    },
}
</script>

<style scoped>

</style>
