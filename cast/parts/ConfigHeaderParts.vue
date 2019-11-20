<template>
    <header>
      <div class="ffc-header">
        <div class="title">
            <WebImage v-if="cast"
                :src="cast.profile.img"
            ></WebImage>
            <p>{{ title }}</p>
        </div>
        <div class="icon"
            @click="openSideMenu"
        >
            <fa :icon="['fas', 'ellipsis-h']" :style="{ color: '#444' }" size="lg"></fa>
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
        'title', 'cast',
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
    justify-content: flex-start;
    align-items: center;
    background: #FFF;
    position: relative;
    border-bottom: 1px solid var(--cl-border-light);
}

.title {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    padding-left: 1rem;
}

.title >>> img {
    width: 3rem;
    height: 3rem;
    border-radius: 4rem;
    margin-right: 1rem;
}

.title > p {
    font-size: 1.2rem;
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
