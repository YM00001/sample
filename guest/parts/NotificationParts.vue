<template>
    <div class="notice-wrap"
        v-if="len"
        :class="{'fadein' : queue[0].fadein, 'fadeout' : queue[0].fadeout }"
    >
        <fa v-if="queue[0].hasOwnProperty('icon') && queue[0].icon === 'success'"
            :icon="['far', 'check-circle']" class="attention" size="2x"
            :style="{ color: '#3ae6fa'}"
        ></fa>
        <fa v-else
            :icon="['fas', 'exclamation-triangle']" class="attention" size="2x"
            :style="{ color: '#ff2d94'}"
        ></fa>
        <div class=notice>
            <p>{{ queue[0].message }}</p>
        </div>
        <fa :icon="['fas', 'times']" style="" class="close" size="2x"
            @click="dequeue"
        ></fa>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queue: [],
        }
    },
    computed: {
        len: function() {
            return this.queue.length;
        },
    },
    mounted: function() {
        let self = this;
        this.$eventHub.$on('notification', (val) => {
            if (this.len) {
                // Exist in queue
                val.fadein = false;
                val.fadeout = false;
                this.queue.push(val);

            } else {
                // No items exist
                val.fadein = true;
                val.fadeout = false;
                this.queue.push(val);

                val.timer = window.setTimeout(() => {
                    val.fadeout = true;
                    window.setTimeout(() =>{
                        self.queue.shift();
                        self.$eventHub.$emit('renotice');
                    }, 1000);
                }, 10000);
            }
        });
        this.$eventHub.$on('renotice', () => {
            if (this.len) {
                this.queue[0].fadein = true;
                this.queue[0].timer = window.setTimeout(() => {
                    this.queue[0].fadeout = true;
                    window.setTimeout(() =>{
                        self.queue.shift();
                        self.$eventHub.$emit('renotice');
                    }, 1000);
                }, 10000);
            }
        });
    },
    methods: {
        dequeue: function(e) {
            let self = this;
            window.clearTimeout(this.queue[0].timer)
            this.queue[0].fadeout = true;
            window.setTimeout(() =>{
                self.queue.shift();
                self.$eventHub.$emit('renotice');
            }, 1000);
        },
    },
}
</script>

<style scoped>
.notice-wrap {
    width: 100%;
    background-color: #FFF;
    padding: 1.5rem 3rem 1.5rem 4rem;
    box-shadow: var(--mbs-level1);
    position: relative;
    position: fixed;
    z-index: 100;
}

.attention {
    position: absolute;
    top: 1rem;
    left: 1rem;
}

.close {
    position: absolute;
    top: 1rem;
    right: 1rem;
}

.fadein {
    right: 0px;
    animation: fadein .5s;
}

.fadeout {
    right: -100vw;
    animation: fadeout .5s;
}

@keyframes fadein {
    0% {
        right: -100vw;
    }
    100% {
        right: 0px;
    }
}

@keyframes fadeout {
    0% {
        right: 0px;
    }
    100% {
        right: -100vw;
    }
}
</style>
