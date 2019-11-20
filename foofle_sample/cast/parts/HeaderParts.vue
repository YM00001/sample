<template>
    <header>
      <div class="ffc-header">
        <img src="/img/cast/header_logo.png" alt="">
        <div class="icon"
            v-if="!is_auth"
            @click="openSideMenu"
        >
            <fa :icon="['fas', 'ellipsis-h']" :style="{ color: 'white' }" size="lg"></fa>
        </div>
      </div>
    </header>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: [
        'is_auth',
    ],
    methods: {
        openSideMenu: function() {
            this.$eventHub.$emit('openSideMenu');
        },
    },
}
</script>

<style scoped>
.ffc-header {
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--cl-grad);
    position: relative;
}

.ffc-header img {
    width: 30%;
}

.ffc-header .icon {
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
}

.ffc-header .icon:hover {
    cursor: pointer;
}
</style>
