<template>
    <ul class="wrapper">
        <li>
            <router-link to="/top?p=timeline">
                <fa :icon="['far', 'heart']" size="lg"></fa>
                <p>お気に入り</p>
            </router-link>
        </li>
        <li>
            <router-link to="/top?p=search">
                <fa :icon="['fas', 'search']" size="lg"></fa>
                <p>さがす</p>
            </router-link>
        </li>
        <li>
            <router-link to="/top?p=nomination">
                <fa :icon="['fas', 'venus-mars']" size="lg"></fa>
                <p>逆指名</p>
            </router-link>
        </li>
        <li>
            <router-link to="/top?p=reserve">
                <fa :icon="['fas', 'book']" size="lg"></fa>
                <p>マイリスト</p>
            </router-link>
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
    z-index: 50;
}

.wrapper li {
    width: calc(100% / 4);
    height: 100%;
}

.wrapper li a {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.wrapper li a p {
    width: 100%;
    text-align: center;
}


</style>
