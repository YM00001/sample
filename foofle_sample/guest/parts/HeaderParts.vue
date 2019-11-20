<template>
    <header>
        <div class="header-wrap">
            <h1>FOOFLE</h1>
            <div v-if="!simpleHeader" class="icon left"
                @click="openSideMenu"
            >
                <fa :icon="['fas', 'ellipsis-h']" size="1x"></fa>
            </div>
            <div v-if="!simpleHeader" class="icon right">
                <fa :icon="['far', 'bell']" size="lg"></fa>
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
    methods: {
        openSideMenu: function() {
            this.$eventHub.$emit('openSideMenu');
        },
    },
    props: [
        'simpleHeader',
    ],
}
</script>

<style scoped>
/* Header */
header {
    width: 100%;
    height: 54px;
    background: var(--cl-grad);
    position: relative;
}

.header-wrap {
    width: 100%;
    height: 50px;
    background-color: #FFF;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

h1 {
    color: #000;
    font-size: 20px;
    letter-spacing: 9px;
    font-weight: 800;
}

.icon {
    position: absolute;
    width: 46px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.left {
    top: 4px;
    left: 12px;
}

.right {
    top: 4px;
    right: 12px;
}

</style>
