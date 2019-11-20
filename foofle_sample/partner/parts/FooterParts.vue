<template>
    <footer>
      <div class="ffa-container">
        <p>&copy;2019 Foofle.com</p>
      </div>
    </footer>
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
/* Footer */
footer {
    width: 100%;
    background-color: var(--cl-grey);
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    z-index: 15;
}

footer p {
    font-size: 0.8rem;
    text-align: right;
}
</style>
