<template>
    <div class="btn"
        :class="{ 'is-disabled' : disabled, 'is_clicked' : clicked }"
        @click="emitEvent">
        <fa v-if="fa"
            :icon="fa"
            :style="{ color: color || '#000' }"
        ></fa>
        <slot></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            clicked: false,
        }
    },
    props: [
        'fa', 'color', 'event', 'disabled',
    ],
    methods: {
        emitEvent: function() {
            if (this.disabled) {
                this.$emit(this.event ? `${this.event}_disabled` : 'click_disabled');
            } else {
                this.$emit(this.event || 'click');
            }
        }
    },
}
</script>

<style scoped>
.btn {
    color: #FFF;
    background: #f37dff;
    background: var(--cl-grad-layer);
    padding: 0.5rem 1rem;
    border-radius: 100rem;
    display: inline-block;
    justify-content: center;
    align-items: center;
}

.btn:hover {
    cursor: pointer;
    opacity: 0.8;
}

.btn.is-disabled,
.btn.is-clicked {
    opacity: 0.2;
}
</style>
