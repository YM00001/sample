<template>
    <div class="ff-content ff-contract">
        <div>
            <p @click="signinWithGoogle">Googleでログイン</p>
        </div>
        <h1>ログイン</h1>
        <div class="ff-form-container">
            <form>
                <table>
                    <tr>
                        <td><label for="">メールアドレス</label></td>
                        <td><input type="email" required v-model="signin.email"></td>
                    </tr>
                    <tr>
                        <td><label for="">パスワード</label></td>
                        <td><input type="password" required v-model="signin.password"></td>
                    </tr>
                </table>
                <div class="ff-btn-wrap ff-at-simple">
                    <button class="ff-btn-text" type="button" name="button" @click="signinWithEmail">ログイン</button>
                </div>
            </form>
            <router-link to="/signin/reset">パスワードリセット</router-link>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            signin: {
                email: '',
                password: '',
                password_confirm: '',
            },
        }
    },
    methods: {
        signinWithEmail: function(e) {
            e.preventDefault();
            let self = this;
            firebase.auth().signInWithEmailAndPassword(this.signin.email, this.signin.password).then(function(res){
                window.location = '/account';
            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorMessage);
            });
        },
        signinWithGoogle: function(e) {
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        },
    },
}
</script>

<style scoped>

</style>
