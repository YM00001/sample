<template>
    <div class="ffc-btn-wrap ffc-btn-swipe">
        <div>
            <p id="swipe_target" v-touch:start="start" v-touch:moving="move" v-touch:end="end"><slot></slot></p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            swipe: {
                el: null,
                is_gripped: false,
                grip_x: 0,
                width: null,
            },
        }
    },
    methods: {
        clearBtn: function() {
            this.swipe.is_gripped = false;
            this.swipe.grip_x = 0;
            this.swipe.el.style.transform = 'translate(0)';
        },
        end: function(e) {
            if ((e.screenX || e.changedTouches[0].screenX) - this.swipe.grip_x > this.swipe.width * 0.7) {
                this.swipe.el.style.transform = `translate(${this.swipe.width}px)`;
                this.$emit('swipe');
            } else {
                this.swipe.is_gripped = false;
                this.swipe.grip_x = 0;
                this.swipe.el.style.transform = 'translate(0)';
            }
        },
        start: function(e) {
            this.swipe.el = e.target;
            this.swipe.is_gripped = true;
            this.swipe.grip_x = e.screenX || e.changedTouches[0].screenX;
            this.swipe.width = e.target.clientWidth;
        },
        move: function(e) {
            if (this.swipe.is_gripped) {
                if (e.type === 'mousemove' && e.screenX - this.swipe.grip_x >= 0) {
                    this.swipe.el.style.transform = `translate(${e.screenX - this.swipe.grip_x}px)`;
                } else if ( e.type === 'touchmove' &&  e.changedTouches[0].screenX - this.swipe.grip_x >= 0) {
                    this.swipe.el.style.transform = `translate(${e.changedTouches[0].screenX - this.swipe.grip_x}px)`;
                }
            }
        },
    }
}
</script>

<style scoped>

</style>
