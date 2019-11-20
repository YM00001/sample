<template>
    <div class="notif-wrap"
        v-if="len"
        :class="{'fadein' : queue[0].fadein, 'fadeout' : queue[0].fadeout }"
    >
        <div class="notification"
            v-if="len"
            :class="queue[0].attr"
        >
          <button class="delete" @click="dequeue"></button>
          {{ queue[0].message }}
        </div>
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
.notif-wrap {
    width: 100%;
    position: fixed;
    bottom: 30px;
    left: 0;
}

.notification {
    width: 300px;
    right: -400px;
    bottom: 10px;
    position: absolute;
}

.fadein > div {
    right: 10px;
    animation: fadein .5s;
}

.fadeout > div {
    right: -400px;
    animation: fadeout .5s;
}

@keyframes fadein {
    0% {
        right: -400px;
    }
    100% {
        right: 10px;
    }
}

@keyframes fadeout {
    0% {
        right: 10px;
    }
    100% {
        right: -400px;
    }
}
</style>
