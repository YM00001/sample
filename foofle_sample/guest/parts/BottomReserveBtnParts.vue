<template>
    <div>
        <div v-if="!is_nominated" class="btn-wrap">
            <a :href="`/request/${ cast_id }`" class="btn">
                <fa :icon="['fas', 'mobile-alt']" :style="{ color: '#FFF' }" size="2x"></fa>
            </a>
        </div>
        <div v-else class="btn-wrap">
            <a :href="`/request/${ cast_id }`" class="btn btn-nominated">
                <fa :icon="['fas', 'mobile-alt']" :style="{ color: '#FFF' }" size="2x"></fa>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cast_id: '',
        }
    },
    props: [
        'nomination',
    ],
    watch: {
        nomination: function() {

        }
    },
    computed: {
        is_nominated: function() {
            if (!this.nomination) {
                return false;
            } else if (this.nomination.cast.some(item => item.id === this.cast_id)) {
                return true
            } else {
                return false;
            }
        },
    },
    mounted: function() {
        this.cast_id = this.$route.params.castid;
        this.$eventHub.$on('nominatedCast', () => {
            this.is_nominated = true;
        });
    },
    methods: {

    },
}
</script>

<style scoped>
.btn-wrap {
    position: fixed;
    bottom: 56px;
    right: 18px;
    z-index: 50;
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

.btn.btn-nominated {
    background: var(--cl-pink);
}
</style>
