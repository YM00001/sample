<template>
    <ul class="wrapper">
        <li>
            <router-link to="/cast/top"><fa :icon="['fas', 'home']" size="lg"></fa></router-link>
        </li>
        <li>
            <router-link to="/cast/search"><fa :icon="['fas', 'search']" size="lg"></fa></router-link>
        </li>
        <li>
            <router-link to="/cast/schedule"><fa :icon="['far', 'clock']" size="lg"></fa></router-link>
        </li>
        <li>
            <router-link to="/cast/message"><fa :icon="['far', 'comment']" size="lg"></fa></router-link>
        </li>
    </ul>
</template>

<script>

export default {
    data() {
        return {

        }
    },
}
</script>

<style scoped>
.wrapper {
    background-color: #FFF;
    width: 100%;
    height: 48px;
    display: flex;
    position: fixed;
    left: 0;
    bottom: 0;
}

.wrapper li {
    width: calc(100% / 4);
    height: 100%;
}

.wrapper li a {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}


</style>
