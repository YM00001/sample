<template>
    <div class="ffa-sidemenu column is-2">
      <ul class="ffa-sidemenu-list">
        <li v-for="list in sidemenu">
            <router-link :to="list.path">{{ list.name }}</router-link>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: [
        'sidemenu',
    ],
}
</script>

<style scoped>
.ffa-sidemenu {
    height: 300px;
    background-color: var(--cl-grey);
}

.ffa-sidemenu-list li a {
    width: 100%;
    font-weight: 300;
    font-size: 0.9rem;
    padding: 14px 0;
    border-bottom: 1px solid var(--cl-border);
}
</style>
