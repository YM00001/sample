<template>
    <div class="btn-wrap">
        <div class="btn-wrap-inner"
            @click="click"
        >
            <fa :icon="icon" size="2x" :style="{ color: 'white' }"></fa>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: [
        'icon',
    ],
    methods: {
        click: function() {
            this.$emit('click');
        },
    }
}
</script>

<style scoped>
.btn-wrap {
    background: var(--cl-grad);
    box-shadow: var(--mbs-level1);
    width: 60px;
    height: 60px;
    position: fixed;
    bottom: 60px;
    right: 20px;
    border-radius: 60px;
}

.btn-wrap-inner {
    background-color: #FFFFFF66;
    border-radius: 100%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
