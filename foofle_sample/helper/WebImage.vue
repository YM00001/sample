<template>
    <!--
    <LazyImage
        :srcset="`${prefix}${src.src}`"
        :src="`${prefix}${src.src}`"
        alt="Fallback"
        @load="load"
        use-picture
    > -->
    <LazyImage
        :srcset="`${prefix}${src.src}`"
        :src="`${prefix}${src.src}`"
        alt="Fallback"
        @load="load"
        use-picture
        class="lazy-image-attach"
    >
        <source :srcset="`${prefix}${src.webp}`" />
    </LazyImage>
</template>

<script>
import LazyImage from "v-lazy-image";

export default {
    data() {
        return {
            prefix: 'https://storage.cloud.google.com/foofle_jp_public01/',
        }
    },
    props: [
        'src', 'eventName',
    ],
    methods: {
        load: function() {
            let ev = this.eventName || 'load';
            this.$eventHub.$emit(ev);
        }
    },
    components: {
        LazyImage,
    },
}
</script>

<style scoped>

</style>
