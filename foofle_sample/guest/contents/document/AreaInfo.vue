<template>
    <div class="area-info">
        <div v-if="!initial_loading">
            <div class="area-header">
                <label>都道府県</label>
                <select v-model="state_selected" @change="getStationInfo">
                    <option value="0">選択してください</option>
                    <option v-for="item in state" :value="item.name">
                        {{ item.name }}
                    </option>
                </select>
            </div>
            <div v-if="state_selected != 0">
                <table class="area-table">
                    <caption>
                        {{ state_selected }}の特別エリア一覧
                    </caption>
                    <tr>
                        <th>エリア名称</th>
                        <th>対象駅</th>
                    </tr>
                    <template v-for="item in area">
                        <tr v-if="item.state === state_selected && item.is_special">
                            <th>{{ item.name }}</th>
                            <td>
                                <template v-for="ins in station">
                                    <span v-if="ins.area_id === item.id">{{ ins.name }}</span>
                                </template>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
        </div>
        <Loading v-else></Loading>
    </div>
</template>

<script>
import getMaster from '../../../mixin/getMaster.js';
import Loading from '../inner/Loading.vue';

export default {
    data() {
        return {
            state: [],
            area: [],
            station: [],
            state_selected: 0,
            initial_loading: true,
        }
    },
    mounted: function() {
        Promise.all([this.getState(), this.getAreas()]).then((res) =>{
            this.state = res[0];
            this.area = res[1];
            return true;
        }).finally(() => {
            this.initial_loading = false;
        });
    },
    methods: {
        getStationInfo: function() {
            let state = this.state_selected;
            if (state && state != 0) {
                this.getStationsFilterByState(state).then((res) => {
                    this.station = res;
                });
            }
        },
    },
    mixins: [
        getMaster,
    ],
    components: {
        Loading,
    },
}
</script>

<style scoped>
.area-info {
    margin: 0;
    padding: 1rem 0.3rem 2rem;
    background-color: #FFF;
}

.area-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
}

.area-header label {
    margin-right: 1rem;
}

.area-table {
    width: 100%;
}

.area-table caption {
    color: var(--cl-pink);
    padding: 1rem;
    font-size: 1.2rem;
    letter-spacing: 0.1rem;
}

.area-table th,
.area-table td {
    padding: 0.5rem 0.5rem;
    vertical-align: middle;
    border: 1px solid #AAA;
}

.area-table tr:nth-child(2) {
    background: #444;
    background: var(--cl-pink);
}

.area-table tr:nth-child(2) th {
    font-size: 1rem;
    color: #FFF;
    font-weight: 300;
}

.area-table th {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--cl-pink);
    word-break: keep-all;
}

.area-table td {
    line-height: 1.4rem;
}

.area-table td span {
    display: inline-block;
    word-break: keep-all;
    margin-right: 1rem;
}
</style>
