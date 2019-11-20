<template>
<div>
    <h4>基本料金</h4>
    <table class="price-table">
        <template v-if="cast">
            <tr v-for="(item, ind) in cast.config.course">
                <th>{{ item.min }}分</th>
                <td>{{ item.price }}円</td>
            </tr>
        </template>
    </table>
    <h4>基本プレイ</h4>
    <ul class="item-list">
        <template v-if="cast">
            <li v-for="(item, ind) in cast.config.service.standard">{{ item.name }}</li>
        </template>
    </ul>
    <h4>オプション</h4>
    <ul class="item-list">
        <template v-if="cast">
            <li v-for="(item, ind) in cast.config.service.options">
                {{ item.name }} {{ item.price }}円
            </li>
        </template>
    </ul>
    <h4>その他情報</h4>
    <table class="notice-table">
        <template v-if="cast">
            <tr v-if="service_category">
                <th>サービスカテゴリ</th>
                <td>{{ service_category[cast.config.service.service_category].name }}　</td>
            </tr>
            <tr>
                <th>出発エリア</th>
                <td>{{ cast.config.areas.basic.name }}</td>
            </tr>
            <tr>
                <th>支払い方法</th>
                <td>現金<template v-if="cast.config.can_cc">、クレジットカード</template></td>
            </tr>
        </template>
    </table>
</div>
</template>

<script>
import getMaster from '../../../mixin/getMaster.js';

export default {
    data() {
        return {
            service_category: null,
        }
    },
    props: [
        'cast',
    ],
    mounted: function() {
        this.getServiceCategory().then((res) => {
            this.service_category = res;
        });
    },
    mixins: [
        getMaster,
    ],
}
</script>

<style scoped>
table {
    width: 100%;
}

tr {
    border-color: var(--cl-border-light);
}

th {
    color: var(--cl-pink);
    width: 40%;
    padding: 0 1rem 0 2rem;
    vertical-align: middle;
    text-align: left;
}

td {
    width: 60%;
    font-size: 1.2rem;
    text-align: left;
    padding: 1rem 1rem;
}

h4 {
    background-color: var(--cl-pink);
    color: #FFF;
    display: inline-block;
    text-align: center;
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem 0.5rem 3rem;
}

.item-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

.item-list li {
    padding: 0.5rem 1rem;
}

.item-list, table {
    margin-bottom: 1rem;
}

.notice-table td {
    font-size: 1rem;
    padding: 0.5rem 1rem;
}

.price-table th {
    color: unset !important;
    font-size: 1.2rem;
    font-weight: bold;
}

.price-table td {
    color: var(--cl-pink) !important;
    font-size: 1.6rem !important;
    font-weight: bold;
}

tr:nth-child(2n+1) {
    background-color: var(--cl-grey-light);
}

</style>
