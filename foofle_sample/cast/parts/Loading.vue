<template>
    <div class="ffc-loading">
      <div class="ffc-loading-describe">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <p>Loading...</p>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
}
</script>

<style scoped>
/* Loading scoped */
.ffc-loading {
    position: fixed;
    bottom: 1.3rem;
    right: 1.3rem;
}

.ffc-loading p {
    color: var(--cl-blue);
    font-size: 1.2rem;
}

.ffc-loading-describe i {
    display: block;
    width: 2rem;
    height: 0.11rem;
    background: var(--cl-grad);
    position: absolute;
    top: 0.5rem;
    left: -2.5rem;
}

.ffc-loading-describe i:nth-child(1) {
    animation: rotation 1s ease infinite;
}

.ffc-loading-describe i:nth-child(2) {
    animation: rotation 2.2s linear infinite;
}

.ffc-loading-describe i:nth-child(3) {
    animation: rotation 3.8s linear infinite;
}

@keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
