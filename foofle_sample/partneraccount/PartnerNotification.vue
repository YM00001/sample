<template>
    <div class="notification"
        :class="{ 'notification-visible' : visible,
                  'notification-unvisible' : !visible,
                  'is-danger' : danger,
                  'is-primary' : primary }"
    >
        <button class="delete"
            @click="unvisibleElement"
        ></button>
        <slot></slot>
    </div>
</template>

<script>
import u from 'umbrellajs';

export default {
    data() {
        return {

        }
    },
    props: [
        'visible', 'danger', 'primary',
    ],
    methods: {
        unvisibleElement: function(e) {
            this.$emit('unvisible');
        },
    },
}
</script>

<style scoped>
.notification-drawing {
    display:none;
}

.notification {
    position: fixed;
    top: -300px;
    left: 0;
    right: 0;
}

.notification-visible {
    top: 0;
    animation: hello 1s;
}

.notification-unvisible {
    top: -300px;
    animation: goodbye 1s;
}

@keyframes hello {
    0% {
        top: -300px;
    }
    100% {
        top: 0;
    }
}

@keyframes goodbye {
    0% {
        
    }
    100% {
        top: -300px;
    }
}
</style>
