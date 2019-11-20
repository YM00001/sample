<template>
    <div v-if="castdata">
        <p class="is_lock">
            独自設定中のため店舗設定が上書きされません。<br />
            解除する場合は「店舗設定で上書きする」を押してください。
        </p>
        <table class="table is-fullwidth ffa-conf">
            <thead>
                <tr>
                    <th>コース設定</th>
                    <td colspan="2"></td>
                    <td class="restore"><span class="ffa-click" @click="restoreData">店舗設定で上書きする</span></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <th>料金・時間</th>
                    <td colspan="2">
                        <div v-for="(item, index) in castdata.config.course">
                          <input class="is-small is-info ffa-small" type="number" name="course"
                              v-model="item.min"
                          >分<input class="is-small is-info ffa-small" type="number"
                              v-model="item.price"
                          >円
                          <span class="ffa-click" @click="addCourseRow" v-if="castdata.config.course.length === (index + 1)">+</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td rowspan="3"></td>
                    <th rowspan="3">サービス設定</th>
                    <td><span>基本サービス</span></td>
                    <td>
                        <ul class="ffa-tag-list">
                            <li v-for="(item, ind) in castdata.config.service.standard">
                                <input type="checkbox" :id="'item' + item.id" v-model="item.is_enable">
                                <label :for="'item' + item.id">{{ item.name }}</label>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">
                        <div class="ffa-search">
                            <input class="" type="text" name="" value="">
                        </div>
                        <ul class="ffa-tagpick-list">
                            <Draggable @end="endDrag" :options="{group: 'options'}" data-area="master">
                                <li  v-for="(item, ind) in master.options"
                                      v-if="!item.is_unable"
                                      :key="item.id"
                                      :data-id="item.id"
                                      :data-name="item.name"
                                      :data-price="item.price"
                                  >{{ item.name }}
                                    <input class="is-small is-info ffa-small" type="number" v-model="item.price"">
                                </li>
                            </Draggable>
                        </ul>
                    </td>
                    <td>
                        <span>追加基本サービス</span>
                        <ul class="ffa-tagpick-list">
                            <Draggable @end="endDrag" :options="{group: 'options'}" data-area="additional">
                                <li  v-for="(item, ind) in castdata.config.service.additional"
                                      :key="item.id"
                                      :data-id="item.id"
                                      :data-name="item.name"
                                      :data-price="item.price"
                                  >{{ item.name }}
                                    <input class="is-small is-info ffa-small" type="number" v-model="item.price">
                                </li>
                            </Draggable>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>オプションサービス</span>
                        <ul class="ffa-tagpick-list ffa-can-input">
                            <Draggable @end="endDrag" :options="{group: 'options'}" data-area="options">
                                <li  v-for="(item, ind) in castdata.config.service.options"
                                      :key="item.id"
                                      :data-id="item.id"
                                      :data-name="item.name"
                                      :data-price="item.price"
                                  >{{ item.name }}
                                    <input class="is-small is-info ffa-small" type="number" v-model="item.price">
                                </li>
                            </Draggable>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <th>ポイント設定</th>
                    <td colspan="2">
                        <input class="is-small is-info ffa-small" type="number" v-model="castdata.config.additional_point">%付与する
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <th>クレジットカード決済</th>
                    <td colspan="2">
                        <input id="can_cc" class="ffa-chkbox" type="checkbox" v-model="castdata.config.can_cc">
                        <label for="can_cc">受け付ける</label>
                    </td>
                </tr>
                <tr>
                  <td></td>
                  <th>派遣可能場所</th>
                  <td colspan="2">
                    <div>
                        <template v-for="item in master.delivery_type">
                           <input class="ffa-chkbox" type="checkbox" :value="item.id" :id="`delivery_type_${item.id}`" v-model="castdata.config.delivery_type">
                           <label :for="`delivery_type_${item.id}`" style="margin-right: 0.5rem;">{{ item.name }}</label>
                        </template>
                    </div>
                  </td>
                </tr>
            </tbody>
        </table>
        <div class="ffa-btn">
            <p v-if="!is_loading" @click="submitData">保存</p>
            <Loading v-else></Loading>
        </div>
    </div>
</template>

<script>
import u from 'umbrellajs';
import axios from 'axios';
import GetMaster from '../../../mixin/getMaster.js';
import Loading from './PartnerLoading.vue';
import Draggable from 'vuedraggable';

export default {
    data() {
        return {
            castid: this.$route.params.castid,
            master: {
                options: {},
                service_category: {},
                delivery_type: [],
            },
            config: {
                service: {
                    standard: [],
                    additional: [],
                    options: [],
                },
                can_cc: '',
                delivery_type: [],
                additional_point: 0,
                course: [],
            },
            is_loading: false,
        }
    },
    props: [
        'castdata',
    ],
    created: function() {
        // this.fetchData();
        this.getPlayOptions().then((res) => {
            this.master.options = res;
        });
        this.getDeliveryType().then((res) => {
            this.master.delivery_type = res;
        });
        this.getServiceCategory().then((res) => {
            this.master.service_category = res;
        });
    },
    methods: {
        fetchData: function() {

        },
        addCourseRow: function() {
            let arr = this.castdata.config.course;
            arr.push({
                minutes: null,
                price: null,
            });
        },
        endDrag: function(e) {
            let from = e.from.dataset.area;
            let to = e.to.dataset.area;
            if (from === to) {
                return false;
            }

            let fromobj = from === 'master' ? this.master.options : this.castdata.config.service[from];
            if (fromobj instanceof Array) {
                for (let i = fromobj.length - 1; i >= 0; i--) {
                    if (e.item.dataset.id == fromobj[i].id) {
                        fromobj.splice(i, 1);
                        break;
                    }
                }
            } else {
                delete fromobj[e.item.dataset.id];
            }

            let toobj = to === 'master' ? this.master.options : this.castdata.config.service[to];
            let obj = {
                id: e.item.dataset.id,
                name: e.item.dataset.name,
                price: e.item.dataset.price,
            };

            if (toobj instanceof Array) {
                toobj.push(obj);
            } else {
                toobj[e.item.dataset.id] = obj;
            }
            u(e.item).remove();
        },
        restoreData: function(e) {
            if (window.confirm('店舗設定で上書きします。')) {
                let self = this;
                axios({
                    method: 'post',
                    url: '/api/partner/store/system',
                    data: { castid: this.$route.params.castid, },
                }).then((response) => {
                    console.log(response);
                    if (response.status === 'Success') {
                        window.location.reload();
                    }
                }).catch((error) => {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'データの上書きに失敗しました。\n時間を空けてお試しください。'});
                });
            }
        },
        submitData: function(e) {
            e.preventDefault();
            this.is_loading = true;
            let self = this;

            axios({
                url: '/api/partner/castdata/system',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    castid: this.castid,
                    config: this.config,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                }
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
            }).finally(function (fin) {
                self.is_loading = false;
            });
        },
    },
    components: {
        Loading, Draggable,
    },
    mixins: [
        GetMaster,
    ],
}
</script>

<style scoped>
.ffa-tagpick-list > div {
    width: 100%;
    height: 100%;
}

.ffa-tagpick-list input {
    display: none;
}

.ffa-tagpick-list.ffa-can-input input {
    display: inline;
    margin-right: 16px;
}

.ffa-tagpick-list.ffa-can-input li {
    position: relative;
}

.ffa-tagpick-list.ffa-can-input li:after {
    content: '円';
    font-size: 12px;
    position: absolute;
    right: 7px;
    bottom: 3px;
}

.restore {
    text-align: right;
}

.is_lock {
    font-size: 0.8rem;
    width: 100%;
    text-align: right;
    color: var(--cl-red);
}
</style>
