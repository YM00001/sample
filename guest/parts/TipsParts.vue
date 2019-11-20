<template>
    <div class="tips-wrap">
        <div class="tips-btn"
            @click="click"
        >
            <fa :icon="['fas', 'question']" :style="{ color: '#DDD'}" size="xs"></fa>
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
        'title', 'content',
    ],
    methods: {
        click: function() {
            this.$eventHub.$emit('openTips', this.title, this.content);
        },
    },
}
</script>

<style scoped>
.tips-wrap {
    display: inline;
    position: absolute;
    transform: translate(0.3rem, -0.3rem);
}

.tips-btn {
    background: #FFF;
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #DDD;
}

.tips-btn:hover {
    cursor: pointer;
    background: #AAA;
}
</style>
