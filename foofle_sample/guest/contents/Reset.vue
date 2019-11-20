<template>
    <div class="ff-content ff-contract">
        <h1>パスワードリセット</h1>
        <div class="ff-form-container">
            <form>
                <table>
                    <tr>
                        <td><label for="">メールアドレス</label></td>
                        <td><input type="email" required v-model="email"></td>
                    </tr>
                </table>
                <div class="ff-btn-wrap ff-at-simple">
                    <button class="ff-btn-text" type="button" name="button" @click="sendResetEmail">リセット</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
        }
    },
    methods: {
        sendResetEmail: function(e) {
            e.preventDefault();
            firebase.auth().sendPasswordResetEmail(this.email).then(function(res){
                // sent Email
                console.log('sent email');
            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
            });
        },
    },
}
</script>

<style scoped>

</style>
