<template>
    <div class="ld-wrap">
        <img src="/img/guest/loading.svg" alt="">
        <p>{{ text || 'Loading' }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: [
        'text',
    ],
}
</script>

<style scoped>
.ld-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.ld-wrap img {
    width: 80px;
}

.ld-wrap p {
    letter-spacing: 0.3rem;
    font-size: 1rem;
    margin-top: 0.5rem;
}
</style>
