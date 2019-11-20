<template>
    <VueEasyLightbox
        id="lightbox"
        :visible="is_visible"
        :imgs="imgs"
        :index="index"
        @hide="handleHide"
    ></VueEasyLightbox>
</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox';

export default {
    data() {
        return {
            is_visible: false,
            imgs: [],
            index: 0,
        }
    },
    mounted: function() {
        this.$eventHub.$on('lightbox', (imgs, ind) => {
            this.index = ind || 0;
            this.imgs = imgs || [];
            if (imgs.length > 0) {
                if (typeof imgs[0] === 'string') {
                    this.imgs = imgs;
                } else {
                    this.imgs = [];
                    for (let i = 0; i < imgs.length; i++) {
                        this.imgs.push(`https://storage.cloud.google.com/foofle_public01/${imgs[i].src}`);
                    }
                }
                this.is_visible = true;
            }
        });
    },
    methods: {
        handleHide: function() {
            this.is_visible = false;
        },
    },
    components: {
        VueEasyLightbox,
    },
}
</script>

<style scoped>

</style>
