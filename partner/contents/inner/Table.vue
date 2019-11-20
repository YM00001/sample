<template>
    <div class="table-wrapper">
        <div class="ffa-control">
            <div class="ffa-control-sort ffa-click">
                絞り込み
            </div>
            <div class="ffa-control-search">
                <input class="input is-info is-small" type="text" name="" value="">
            </div>
        </div>
        <table class="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th v-for="val in defines">{{ val.header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :data-id="item.id" @click="action">
                    <td v-for="define in defines">{{ define.callback ? define.callback(item[define.field]) : item[define.field] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: [
        'defines', 'items', 'callback',
    ],
    methods: {
        action: function(e) {
            if (this.callback) {
                this.callback(e);
            }
        },
    }
}
</script>

<style scoped>
.table-wrapper {
    width: 100%;
}

.ffa-control {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    position: relative;
}

.ffa-control-sort {
    color: var(--cl-border);
    font-weight: 300;
    font-family: 'M plus 1p', sans-serif;
    padding: 5px 30px;
    border: 1px solid var(--cl-border);
    background-color: var(--cl-grey);
}

.ffa-control-search {
    position: absolute;
    right: 0;
}

.ffa-control-search input {
    padding-left: 2rem;
}

.ffa-control-search:after {
    content: '';
    width: 1.2rem;
    height: 1.2rem;
    background: url('/img/partner/search_orange.png');
    background-size: cover;
    position: absolute;
    left: 0.2rem;
    top: 0.3rem;
}
</style>
