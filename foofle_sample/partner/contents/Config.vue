<template>
    <div class="ffa-content column is-10">
      <h1>設定</h1>
      <table class="table is-fullwidth ffa-conf">
        <thead>
          <tr>
            <th>営業設定</th>
            <td colspan="2"></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <th>営業時間</th>
            <td>
              <div>
                <input class="is-small is-info ffa-small" type="number" name="open_at" :disabled="partner.config.is_24" v-model="partner.config.open_at"
                    @change="checkTime"
                >～
                <input class="is-small is-info ffa-small" type="number" name="close_at" :disabled="partner.config.is_24"v-model="partner.config.close_at"
                    @change="checkTime"
                >
              </div>
              <div>
                <input class="ffa-chkbox"type="checkbox" name="is_24open" value="false" id="is-24" v-model="partner.config.is_24">
                <label for="is-24">24時間営業</label>
              </div>
            </td>
          </tr>
          <tr>
            <td></td>
            <th>派遣可能場所</th>
            <td>
              <div>
                  <template v-for="item in master.delivery_type">
                     <input class="ffa-chkbox" type="checkbox" :value="item.id" :id="`delivery_type_${item.id}`" v-model="partner.config.delivery_type">
                     <label :for="`delivery_type_${item.id}`" style="margin-right: 0.5rem;">{{ item.name }}</label>
                  </template>
              </div>
            </td>
          </tr>
          <tr>
            <td></td>
            <th>決済方法</th>
            <td>
              <div>
                <input class="ffa-chkbox"type="checkbox" name="can_ccpayment" id="is-cc" v-model="partner.config.can_cc">
                <label for="is-cc">クレジットカード事前決済を受け付ける</label>
              </div>
              <span>決済用URL</span><input class="is-small is-info ffa-text" type="url" name="ccpayment_url" v-model="partner.config.cc_url" :disabled="!partner.config.can_cc">
            </td>
          </tr>
          <tr>
            <td></td>
            <th>アウトコール電話番号</th>
            <td>
              <input class="is-small is-info ffa-text" type="phone" name="outcall_number" v-model="partner.config.outcall_number">
            </td>
          </tr>
          <tr>
            <td></td>
            <th>予約インターバル</th>
            <td>
              <input class="is-small is-info ffa-small" type="number" name="interval" v-model="partner.config.interval"
                @change="checkNumber"
              >分
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-conf">
        <thead>
          <tr>
            <th>コース設定</th>
            <td colspan="3"></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <th>料金・時間</th>
            <td colspan="2">
              <div v-for="(item, index) in partner.config.course">
                <input class="is-small is-info ffa-small" type="number" name="course"
                    v-model="item.min"
                >分<input class="is-small is-info ffa-small" type="number"
                    v-model="item.price"
                >円
                <span class="ffa-click" @click="addCourseRow" v-if="partner.config.course.length === (index + 1)">+</span>
              </div>
            </td>
          </tr>
          <tr>
            <td rowspan="3"></td>
            <th rowspan="3">サービス設定</th>
            <td><span>基本サービス</span></td>
            <td>
              <ul class="ffa-tag-list">
                <li v-for="(item, ind) in partner.config.service.standard">
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
                  <Draggable @end="endServiceDrag" :options="{group: 'options'}" data-area="master">
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
                  <Draggable @end="endServiceDrag" :options="{group: 'options'}" data-area="additional">
                      <li  v-for="(item, ind) in partner.config.service.additional"
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
                  <Draggable @end="endServiceDrag" :options="{group: 'options'}" data-area="options">
                      <li  v-for="(item, ind) in partner.config.service.options"
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
              <input class="is-small is-info ffa-small" type="number" v-model="partner.config.additional_point">%付与する
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-conf">
        <thead>
          <tr>
            <th>エリア設定</th>
            <td colspan="2"></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="3"></td>
            <td rowspan="3">
              <div class="ffa-search">
                <input type="text" placeholder="エリア検索" v-model="areas_query">
              </div>
              <ul class="ffa-tagpick-list">
                  <Draggable @end="endAreaDrag" :options="{group: 'areas'}" data-area="areas">
                      <li
                        v-for="item in areas"
                        :key="item.id"
                        :data-id="item.id"
                        :data-name="item.name"
                        v-if="checkQuery(areas_query, item.name)">{{ item.name }}</li>
                  </Draggable>
              </ul>
              <div class="ffa-search">
                <input type="text" placeholder="駅名検索" v-model="stations_query">
              </div>
              <ul class="ffa-tagpick-list">
                  <Draggable @end="endAreaDrag" :options="{group: 'areas'}" data-area="stations">
                      <li
                        v-for="item in stations"
                        :key="item.id"
                        :data-id="item.id"
                        :data-name="item.name"
                        v-if="checkQuery(stations_query, item.name)">{{ item.name }}</li>
                  </Draggable>
              </ul>
            </td>
            <td>
              <span>基本出発エリア</span>
              <ul class="ffa-tag-list">
                  <li>{{ partner.config.areas.basic.name }}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <span>派遣可能エリア</span>
              <ul class="ffa-tagpick-list">
                  <Draggable @end="endAreaDrag" :options="{group: 'areas'}" data-area="can_deliver">
                      <li v-for="item in partner.config.areas.can_deliver"
                            :key="item.id"
                            :data-id="item.id"
                            :data-name="item.name"
                        >{{ item.name }}
                      </li>
                  </Draggable>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <span>派遣NGエリア・駅</span>
              <ul class="ffa-tagpick-list">
                  <Draggable @end="endAreaDrag" :options="{group: 'areas'}" data-area="ng_deliver">
                      <li  v-for="(item, ind) in partner.config.areas.ng_deliver"
                            :key="item.id"
                            :data-id="item.id"
                            :data-name="item.name"
                        >{{ item.name }}
                      </li>
                  </Draggable>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-conf">
        <thead>
          <tr>
            <th>通知設定</th>
            <td colspan="2"></td>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <th>予約成立時の電話通知</th>
                <td>
                    <input id="notice1" type="radio" value="1" v-model="partner.config.notification.call_on_reserve">
                    <label for="notice1">通知する</label>
                    <input id="notice2" type="radio" value="0" v-model="partner.config.notification.call_on_reserve">
                    <label for="notice2">通知しない</label>
                </td>
            </tr>
          <tr>
            <td></td>
            <th>ご予約の成立</th>
            <td>
                <input class="is-small is-info ffa-text" type="email" name="" v-model="partner.config.notification.reserve"
                    @change="checkEmail"
                >
            </td>
          </tr>
          <tr>
            <td></td>
            <th>対応が必要なご予約</th>
            <td>
                <input class="is-small is-info ffa-text" type="email" name="" v-model="partner.config.notification.needtoaction"
                    @change="checkEmail"
                >
            </td>
          </tr>
          <tr>
            <td></td>
            <th>お支払い情報</th>
            <td>
                <input class="is-small is-info ffa-text" type="email" name="" v-model="partner.config.notification.payment"
                    @change="checkEmail"
                >
            </td>
          </tr>
          <tr>
            <td></td>
            <th>重要なお知らせ</th>
            <td>
                <input class="is-small is-info ffa-text" type="email" name="" v-model="partner.config.notification.important"
                    @change="checkEmail"
                >
            </td>
          </tr>
          <tr>
            <td></td>
            <th>キャンペーンのお知らせ</th>
            <td>
                <input class="is-small is-info ffa-text" type="email" name="" v-model="partner.config.notification.campaign"
                    @change="checkEmail"
                >
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-conf">
        <thead>
          <tr>
            <th>店舗設定</th>
            <td colspan="2"></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <th>店舗名</th>
            <td>
                {{ partner.name }}
            </td>
          </tr>
          <tr>
            <td></td>
            <th>営業電話番号</th>
            <td>
                {{ partner.sales_number }}
            </td>
          </tr>
          <tr v-if="master.service_category[partner.service_category]">
            <td></td>
            <th>提供サービス</th>
            <td>
                {{ master.service_category[partner.service_category].name }}
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-conf">
        <thead>
          <tr>
            <th>アカウント設定</th>
            <td colspan="2"></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <th>代表メールアドレス</th>
            <td>
                {{ partner.email }}
            </td>
          </tr>
          <tr>
            <td></td>
            <th>パスワード</th>
            <td>
                ********<span class="ffa-click" style="margin-left: 10px">変更する</span>
            </td>
          </tr>
          <tr>
            <td></td>
            <th>ご担当者様</th>
            <td>
                <input class="is-small is-info ffa-small" type="text" v-model="secure.manager_name">様
            </td>
          </tr>
          <tr>
            <td></td>
            <th>サポート連絡用番号</th>
            <td>
                <input type="phone" class="is-small is-info ffa-text" v-model="secure.manager_phone">
            </td>
          </tr>
          <tr>
            <td></td>
            <th>コントラクト</th>
            <td>
                {{ secure.contract === 'normal' ? 'パートナー店舗' : 'ゴールドパートナー店舗' }}
            </td>
          </tr>
          <tr>
              <td></td>
              <td>公開設定</td>
              <td>
                  <input id="public1" type="radio" value="1" v-model="partner.config.is_public">
                  <label for="public1">公開</label>
                  <input id="public2" type="radio" value="0" v-model="partner.config.is_public">
                  <label for="public2">非公開</label>
              </td>
          </tr>
          <tr>
            <td></td>
            <th>アカウントの状態</th>
            <td>
                正常
            </td>
          </tr>
        </tbody>
      </table>
      <div class="ffa-btn">
        <p v-if="!loading" @click="submitData" class="ffa-click">保存</p>
        <Loading v-else></Loading>
      </div>
    </div>
</template>

<script>
import u from 'umbrellajs';
import axios from 'axios';
import Draggable from 'vuedraggable';
import FormValidation from '../../mixin/formValidation.js';
import GetMaster from '../../mixin/getMaster.js';
import Loading from './inner/PartnerLoading.vue';

export default {
    data() {
        return {
            master: {
                options: {},
                service_category: {},
                delivery_type: {},
            },
            stations: [],
            stations_query: '',
            areas: [],
            areas_query: '',
            extra: {
                options: [],
            },
            partner: {
                name: '',
                sales_number: '',
                service_category: 0,
                email: '',
                url: '',
                config: {
                    open_at: null,
                    close_at: null,
                    is_24: false,
                    is_public: true,
                    can_cc: false,
                    cc_url: null,
                    outcall_number: 0,
                    interval: 0,
                    course: [],
                    delivery_type: [],
                    service: {
                        standard: [],
                        additional: [],
                        options: [],
                    },
                    areas: {
                        basic: '',
                        can_deliver: [],
                        ng_deliver: [],
                    },
                    additional_point: 0,
                    notification: {
                        call_on_reserve: null,
                        reserve: '',
                        needtoaction: '',
                        payment: '',
                        important: '',
                        campaign: '',
                    },
                },
            },
            secure: {
                manager_name: '',
                manager_phone: '',
                contract: '',
            },
            loading: false,
        }
    },
    created: function() {
        this.fetchData();
        this.getPlayOptions().then((arr) => {
            this.master.options = arr;
        });
        this.getServiceCategory().then((arr) => {
            this.master.service_category = arr;
        });
        this.getDeliveryType().then((arr) => {
            this.master.delivery_type = arr;
        });
        this.getStations().then((arr) => {
            this.stations = arr;
        });
        this.getAreas().then((arr) => {
            this.areas = arr;
        });
    },
    methods: {
        fetchData: function() {
            axios({
                method: 'get',
                url: '/api/partner/config',
            }).then((response) => {
                if (response.status === 200) {
                    this.partner = response.data.partner;
                    this.secure = response.data.secure;
                }
            }).then(() => {
                // First Fetch
                if (!this.partner.config.service.standard.length) {
                    let sc = this.partner.config.service.service_category;
                    for (let key in this.master.options) {
                        if (this.master.options[key].standard === sc) {
                            this.partner.config.service.standard.push(this.master.options[key]);
                        }
                    }
                }

            }).catch((error) => {
                this.$eventHub.$emit('notification', {attr:'is-warning', message:'データの取得に失敗しました。\n時間を空けてお試しください。'});
            });
        },
        endAreaDrag: function(e) {
            let from = e.from.dataset.area;
            let to = e.to.dataset.area;
            if (from === to) {
                return false;
            }

            let fromobj = (from === 'areas' || from === 'stations') ? this[from] : this.partner.config.areas[from];console.log(fromobj);
            if (fromobj) {
                for (let i = fromobj.length - 1; i >= 0; i--) {
                    if (e.item.dataset.id == fromobj[i].id) {
                        fromobj.splice(i, 1);
                        break;
                    }
                }
            }

            let toobj = (to === 'areas' || to === 'stations') ? this[to] : this.partner.config.areas[to];console.log(toobj);
            if (toobj && (to === 'areas' || to === 'stations')) {
                let obj = {
                    id: e.item.dataset.id,
                    name: e.item.dataset.name,
                    is_area: from === 'areas',
                }
                toobj.unshift(obj);
            } else {
                let obj = {
                    id: e.item.dataset.id,
                    name: e.item.dataset.name,
                    is_area: from === 'areas',
                }
                toobj.push(obj);
            }

            u(e.item).remove();
        },
        endServiceDrag: function(e) {
            let from = e.from.dataset.area;
            let to = e.to.dataset.area;
            if (from === to) {
                return false;
            }

            let fromobj = from === 'master' ? this.master.options : this.partner.config.service[from];
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

            let toobj = to === 'master' ? this.master.options : this.partner.config.service[to];
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
        addCourseRow: function() {
            let arr = this.partner.config.course;
            arr.push({
                min: null,
                price: null,
            });
        },
        submitData: function(e) {
            e.preventDefault();
            this.loading = true;
            let self = this;

            // Valid
            axios({
                url: '/api/partner/config',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    partner: this.partner,
                    secure: this.secure,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                }
                self.loading = false;
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
                self.loading = false;
            });
        },
    },
    components: {
        Draggable, Loading,
    },
    mixins: [
        FormValidation, GetMaster,
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

</style>
