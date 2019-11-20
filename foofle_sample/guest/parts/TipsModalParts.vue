<template>
    <transition>
        <div v-if="is_open" class="modal-screen" @click.self="click">
            <div class="modal-content">
                <div class="header">
                    <h5>{{ title }}</h5>
                    <fa :icon="['fas', 'times']" size="lg"
                        :style="{ color: '#FFF'}"
                        @click="click"
                    ></fa>
                </div>
                <div class="body">
                    <p>{{ content }}</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            title: null,
            content: null,
            is_open: false,
        }
    },
    mounted: function() {
        this.$eventHub.$on('openTips', (title, content) => {
            this.is_open = true;
            this.title = title;
            this.content = content;
        });
    },
    methods: {
        click: function() {
            if (this.is_open) {
                this.is_open = false;
            } else {
                this.is_open = true;
            }
        },
    }
}
</script>

<style scoped>
.modal-screen {
    background-color: #000000AA;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
}

.modal-content {
    background-color: #FFF;
    background-color: var(--cl-grey-light);
    width: 80%;
    height: 70vh;
    border-radius: 10px;
    box-shadow: var(--mbs-level2);
}

.modal-content .header {
    width: 100%;
    padding-bottom: 2rem;
    position: relative;
    display: flex;
    flex-wrap: wrap;

}

.modal-content .header:before {
    content: 'HINT';
    display: flex;
    color: #FFF;
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 0.4rem;
    width: 100%;
    height: 36px;
    border-radius: 10px 10px 0 0;
    background: var(--cl-blue);
    background: var(--cl-grad-layer);
    justify-content: flex-start;
    align-items: center;
    padding-left: 1rem;
}

.modal-content .header svg {
    position: absolute;
    top: 10px;
    right: 16px;
}

.modal-content .header h5 {
    display: inline-block;
    width: 100%;
    background-color: #FFF;
    padding: 1rem;
    border-bottom: 3px dotted var(--cl-pink);
    font-size: 1.2rem;
}

.modal-content .header:after {
    content: '＼解説／';
    color: var(--cl-pink);
    position: absolute;
    bottom: 0;
    left: 1rem;
}

.modal-content .body {
    padding: 0 1rem 1rem;
    overflow-y: scroll;
}

.modal-content .body p {
    line-height: 1.4rem;
}
</style>
