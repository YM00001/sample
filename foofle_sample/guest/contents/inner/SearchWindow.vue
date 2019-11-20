<template>
    <div class="search-wrap"
        @click.self="close"
    >
        <div class="ff-search-wrap">
            <div class="sw-header-wrap">
                <div class="sw-header">
                    <div class="ff-search-title">
                        <fa :icon="['fas', 'sliders-h']" size="lg"></fa>
                        <h3>絞り込み設定<Tips title="絞り込み設定" content="表示するキャストの条件を設定することができます。"></Tips></h3>
                    </div>
                    <div class="ff-search-command">
                        <fa :icon="['fas', 'times']" size="lg"
                        @click="close"
                        ></fa>
                    </div>
                </div>
            </div>
            <table>
                <tr>
                    <th>サービス<Tips></Tips></th>
                    <td colspan="2">
                        <ul>
                            <li class="ff-btn ff-form-btnck"
                                v-for="(item, ind) in master_service_category"
                            >
                                <input v-model="condition.service_category" :id="`service_${ind}`" type="checkbox" name="service_category" :value="item.id">
                                <label :for="`service_${ind}`">{{ item.name }}</label>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>利用場所<Tips></Tips></th>
                    <td colspan="2">
                        <ul>
                            <li class="ff-btn ff-form-btnck"
                                v-for="(item, ind) in master_delivery_type"
                            >
                                <input v-model="condition.delivery_type" :id="`delivery_${ind}`" type="checkbox" name="delivery_type" :value="item.id">
                                <label :for="`delivery_${ind}`">{{ item.name }}</label>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th :rowspan="(state && state !== 'null') ? 2 : 1">利用場所<Tips></Tips></th>
                    <th>都道府県</th>
                    <td>
                        <select v-model="state">
                            <option
                                v-for="(item ,ind) in master_state"
                                :value="item.name">{{ item.name }}</option>
                        </select>
                    </td>
                </tr>
                <tr v-if="(state && state !== 'null')">
                    <th>駅</th>
                    <td>
                        <ul class="ff-search-suggest">
                            <li
                                :data-json="JSON.stringify({'add':'松戸市松戸','area_id':1,'area_name':'松戸','id':'1132009','is_core':true,'is_launched':true,'lat':35.784472,'lon':139.900779,'name':'松戸','state':'千葉県'})"
                            >松戸</li>
                        </ul>
                        <div class="ff-form-search">
                            <input class="" type="text" placeholder="希望の駅を検索できます" v-model="station_search_query">
                            <fa :icon="['fas', 'search']"></fa>
                        </div>
                        <ul class="ff-search-list" v-if="station_search_query">
                            <template v-for="(item,ind) in master_station">
                                <li v-if="checkQuery(station_search_query, item.name) && item.state === state">{{ item.name }}</li>
                            </template>
                        </ul>
                        <div class="ff-search-fixed-item"
                            v-if="condition.delivery_area"
                        >
                            <p>選択中：</p>
                            <div>
                                {{ condition.delivery_area.name }}
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>予算<Tips></Tips></th>
                    <td colspan="2">
                        <SingleSlider
                            :conf="fee_options"
                            ref="fee"
                        ></SingleSlider>
                    </td>
                </tr>
                <tr>
                    <th>年齢<Tips></Tips></th>
                    <td colspan="2">
                        <DoubleSlider
                            :conf="yo_options"
                            ref="year"
                        ></DoubleSlider>
                    </td>
                </tr>
            </table>
            <div class="btn-wrap">
                <Btn
                    @click="commitCondition"
                >設定する</Btn>
            </div>
        </div>
    </div>
</template>

<script>
import getMaster from '../../../mixin/getMaster.js';

import Btn from './Btn.vue';
import SingleSlider from '../form/SingleSlider.vue';
import DoubleSlider from '../form/DoubleSlider.vue';

export default {
    data() {
        return {
            master_station: [],
            master_state: [],
            master_service_category: [],
            master_delivery_type: [],
            station_search_query: '',
            state: null,
            condition: {
                delivery_area: null,
                delivery_type: [1,2,3],
                service_category: [1,2,3,4],
                schedule: {
                    date: null,
                    start_at: null,
                    is_soon: null,
                },
                fee_max: 20000,
                year_max: 35,
                year_min: 20,
                tags: [],
            },

        }
    },
    computed: {
        fee_options: function() {
            return {
                name: 'fee',
                lot: 1000,
                max: 50000,
                min: 3000,
                unit: '円',
                display: {
                    1: '上限なし',
                },
                default: this.condition.fee_max,
            }
        },
        yo_options: function() {
            return {
                name: 'yo',
                lot: 1,
                min: 18,
                max: 50,
                unit: '歳',
                display: {
                    0: '下限なし',
                    1: '上限なし',
                },
                default: [this.condition.year_min, this.condition.year_max],
            }
        },
    },
    mounted: function() {
        this.getServiceCategory().then((res) => {
            this.master_service_category = res;
        });
        this.getState().then((res) => {
            this.master_state = res;
        });
        this.getStations().then((res) => {
            this.master_station = res;
        });
        this.getDeliveryType().then((res) => {
            this.master_delivery_type = res;
        });
        this.fetchCondition();
    },
    methods: {
        fetchCondition: function() {
            let st = window.localStorage;
            try {
                if (st) {
                    if (st.hasOwnProperty('search_condition')) {
                        this.condition = JSON.parse(st['search_condition']);
                    }
                    if (st.hasOwnProperty('state')) {
                        this.state = st['state'];
                    }
                }
            } catch(e) {

            }
        },
        commitCondition: function() {
            let st = window.localStorage;
            if (st) {
                this.condition.fee_max = this.$refs.fee.getValue();
                let year = this.$refs.year.getValue();
                this.condition.year_min = year.min;
                this.condition.year_max = year.max;
                st['search_condition'] = JSON.stringify(this.condition);
                st['state'] = this.state;
                this.$emit('close');
                this.$eventHub.$emit('notification', { message: '保存しました。', icon: 'success'});
            }
        },
        close: function() {
            this.$emit('close');
        },
    },
    mixins: [
        getMaster,
    ],
    components: {
        Btn, SingleSlider, DoubleSlider,
    },
}
</script>

<style scoped>
.search-wrap {
    width: 100%;
    height: 100vh;
    background-color: #00000077;
    position: fixed;
    top: 0;
    right: -100%;
    z-index: 52;
    transform: translateX(0);
    transition: transform .3s;
}

.search-wrap.is_open {
    transform: translateX(-100%);
}

.ff-search-wrap {
    background: #FFF;
}

.btn-wrap {
    width: 100%;
    text-align: center;
    padding: 1.5rem;
}

.sw-header-wrap {
    width: 100%;
    height: 54px;
    background: #FFF;
    background: var(--cl-pink);
    background: var(--cl-grad);
    position: relative;
}

.sw-header {
    background: #FFF;
    width: 100%;
    height: 50px;
    padding: 1rem 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
}

.ff-search-title {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

.sw-header h3 {
    color: #000;
    font-size: 1.2rem;
    width: 100%;
    margin-left: 0.5rem;
    text-align: center;
    position: relative;
}

.ff-search-command {
    position: absolute;
    top: 18px;
    right: 18px;
}

.ff-search-body-row-header h4 {
    font-size: 1rem;
    margin-bottom: 0.2rem;
}

tr {
    border-style: solid;
    border-width: 1px 0 0;
    border-color: var(--cl-border-light);
}

th {
    color: var(--cl-pink);
    word-break: keep-all;
    padding: 0 1rem 0 2rem;
    vertical-align: middle;
    text-align: left;
}

td {
    width: 100%;
    font-size: 1.2rem;
    text-align: left;
    padding: 1rem 1rem;
}

td > ul {
    display: flex;
    flex-wrap: wrap;
}

td > select {
    font-size: 1.2rem;
    width: 100%;
    border-color: var(--cl-border);
    border-radius: 0.3rem;
}

.ff-search-list {
    width: 100%;
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
}

.ff-search-suggest {
    width: 100%;
    margin-bottom: 0.5rem;
    display: flex;
    flex-wrap: wrap;
}

.ff-search-list li,
.ff-search-suggest li,
.ff-search-fixed-item div {
    font-size: 1.2rem;
    padding: 0.4rem 0.6rem;
    margin: 0 0.3rem 0.3rem 0;
    border: 1px solid var(--cl-border);
    border-radius: 0.3rem;
}

.ff-search-fixed-item {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0.5rem;
}

.ff-search-fixed-item p {
    font-size: 1rem;
    margin-right: 1rem;
}

.ff-search-fixed-item div {
    color: #FFF;
    background-color: var(--cl-pink);
    border-color: var(--cl-pink);
}

</style>
