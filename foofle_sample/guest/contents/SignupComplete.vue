<template>
    <div class="ff-content ff-contract">
        <h1>確認のEmailを送信しました。</h1>
        <div class="ff-form-container">
            <p>メールアドレス認証URLをお送りしました。</p>
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
}
</script>

<style scoped>

</style>
