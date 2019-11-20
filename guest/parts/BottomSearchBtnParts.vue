<template>
    <div class="btn-wrap" v-if="can_use">
        <div class="btn" @click="click">
            <fa :icon="['fas', 'sliders-h']" :style="{ color: '#FFF' }" size="2x"></fa>
        </div>

        <SearchWindow
            :class="{ 'is_open': is_open }"
            @close="click"
        ></SearchWindow>
    </div>
</template>

<script>
import SearchWindow from '../contents/inner/SearchWindow.vue';

export default {
    data() {
        return {
            is_open : false,
            can_use: true,
        }
    },
    mounted: function() {
        let st = window.localStorage || null;
        if (!st) {
            this.can_use = false;
        }
    },
    methods: {
        click: function() {
            if (this.is_open) {
                this.is_open = false;
            } else {
                this.is_open = true;
            }
        },
    },
    components: {
        SearchWindow,
    },
}
</script>

<style scoped>
.btn-wrap {
    position: fixed;
    bottom: 56px;
    right: 18px;
    z-index: 15;
}

.btn {
    background: var(--cl-pink);
    background: var(--cl-grad-layer);
    width: 54px;
    height: 54px;
    border-radius: 54px;
    box-shadow: var(--mbs-level1);
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn:hover {
    cursor: pointer;
}
</style>
