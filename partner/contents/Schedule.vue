<template>
    <div class="ffa-content column is-10 ffa-schedule">
      <h1>スケジュール</h1>
      <template v-if="!initial_loading">
          <div class="swiper-container" style="width:100%;">
              <div v-if="cast_list" class="swiper-wrapper">
                  <div class="swiper-slide ffa-detail-schedule">
                      <p>今週</p>
                      <table class="table is-fullwidth">
                          <thead>
                              <tr>
                                  <th>Name</th>
                                  <th v-for="(item, ind) in schedule_display[0]">
                                    {{ item.md }}<span>{{ item.day }}</span>
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(cast, ind) in cast_list">
                                  <th>{{ cast.profile.name }}</th>
                                  <td v-for="(item, ind) in schedule_display[0]">
                                      <input class="is-small ffa-is-small" type="text" v-model="item.shift[cast.id].from" @change="changed(cast.id)">
                                      <input class="is-small ffa-is-small" type="text" v-model="item.shift[cast.id].to" @change="changed(cast.id)">
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <div class="swiper-slide ffa-detail-schedule">
                      <p>翌週</p>
                      <table class="table is-fullwidth">
                          <thead>
                              <tr>
                                  <th>Name</th>
                                  <th v-for="(item, ind) in schedule_display[1]">
                                    {{ item.md }}<span>{{ item.day }}</span>
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(cast, ind) in cast_list">
                                  <th>{{ cast.profile.name }}</th>
                                  <td v-for="(item, ind) in schedule_display[1]">
                                      <input class="is-small ffa-is-small" type="text" v-model="item.shift[cast.id].from" @change="changed(cast.id)">
                                      <input class="is-small ffa-is-small" type="text" v-model="item.shift[cast.id].to" @change="changed(cast.id)">
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <div class="swiper-slide ffa-detail-schedule">
                      <p>翌々週</p>
                      <table class="table is-fullwidth">
                          <thead>
                              <tr>
                                  <th>Name</th>
                                  <th v-for="(item, ind) in schedule_display[2]">
                                    {{ item.md }}<span>{{ item.day }}</span>
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(cast, ind) in cast_list">
                                  <th>{{ cast.profile.name }}</th>
                                  <td v-for="(item, ind) in schedule_display[2]">
                                      <input class="is-small ffa-is-small" type="text" v-model="item.shift[cast.id].from" @change="changed(cast.id)">
                                      <input class="is-small ffa-is-small" type="text" v-model="item.shift[cast.id].to" @change="changed(cast.id)">
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <div class="swiper-slide ffa-detail-schedule">
                      <p>翌々々週</p>
                      <table class="table is-fullwidth">
                          <thead>
                              <tr>
                                  <th>Name</th>
                                  <th v-for="(item, ind) in schedule_display[3]">
                                    {{ item.md }}<span>{{ item.day }}</span>
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(cast, ind) in cast_list">
                                  <th>{{ cast.profile.name }}</th>
                                  <td v-for="(item, ind) in schedule_display[3]">
                                      <input class="is-small ffa-is-small" type="text" v-model="item.shift[cast.id].from" @change="changed(cast.id)">
                                      <input class="is-small ffa-is-small" type="text" v-model="item.shift[cast.id].to" @change="changed(cast.id)">
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
          </div>
          <div class="ffa-btn">
            <p class="ffa-click"
                :class="{ 'disabled' : !is_changed }"
                @click="submitSchedule"
            >保存</p>
          </div>
      </template>
      <AsyncLoading v-else></AsyncLoading>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import Swiper from 'swiper';
import axios from 'axios';

import AsyncLoading from './inner/AsyncLoading.vue';

export default {
    data() {
        return {
            schedule: {},
            schedule_display: {},
            cast_list: [],
            at_changed: [],
            initial_loading: true,
        }
    },
    computed: {
        is_changed: function() {
            return !!this.at_changed.length;
        },
    },
    created: function() {
        let cal = (function() {
            let d = new Date(), obj = {}, arr = [[],[],[],[]],
            day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            d.setDate(d.getDate() - d.getDay());

            for (let i = 0; i < 28; i++, d.setDate(d.getDate() + 1)) {
                let data = {
                    md: `${d.getMonth()+1}/${d.getDate()}`,
                    day: day[d.getDay()],
                    shift: {},
                };
                let key = `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`;
                obj[key] = data.shift;
                arr[Math.floor(i / 7)].push(data);
            }
            return [obj, arr];
        })();
        this.schedule = cal[0];
        this.schedule_display = cal[1];
    },
    mounted: function() {
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            speed: 100,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
        });
        this.fetchData().finally(() => {
            this.initial_loading = false;
        });
    },
    methods: {
        fetchData: function() {
            let self = this;
            return axios({
                method: 'GET',
                url: '/api/partner/castlist',
            }).then((res) => {
                let list = res.data;
                for (let i = 0; i < list.length; i++) {
                    if (list[i].hasOwnProperty('schedule')) {
                        for (let key in list[i].schedule) {
                            if (self.schedule.hasOwnProperty(key)) {
                                self.schedule[key][list[i].id] = {
                                    from: list[i].schedule[key].from,
                                    to: list[i].schedule[key].to,
                                };
                            }
                        }
                        for (let key in self.schedule) {
                            if (!self.schedule[key].hasOwnProperty(list[i].id)) {
                                self.schedule[key][list[i].id] = {
                                    from: null,
                                    to: null,
                                };
                            }
                        }
                    } else {
                        for (let key in self.schedule) {
                            self.schedule[key][list[i].id] = {
                                from: null,
                                to: null,
                            };
                        }
                    }
                }
                self.cast_list = list;
            }).finally(() => {
                return Promise.resolve();
            });
        },
        changed: function(cid) {
            if (!this.at_changed.some(item => item === cid)) {
                this.at_changed.push(cid);
            }
        },
        submitSchedule: function() {
            if (this.is_changed) {
                let self = this;
                let promises = [];

                for (let i = 0; i < this.at_changed.length; i++) {
                    let data = {};
                    for (let key in this.schedule) {
                        data[key] = this.schedule[key][this.at_changed[i]];
                    }

                    promises.push(
                        axios({
                            url: '/api/partner/castdata/schedule',
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            data: {
                                castid: this.at_changed[i],
                                schedule: data,
                            },
                        })
                    );
                }
                Promise.all(promises).then((res) => {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                    self.at_changed = [];
                }).catch((err) => {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                });
            }
        },
    },
    components: {
        AsyncLoading,
    },
}
</script>

<style scoped>
.ffa-schedule p {
    text-align: center;
}

.ffa-schedule .swiper-container {
    width: 100%;
    margin-top: 10px;
}

.ffa-schedule swiper-slide {
    width: 100%;
}

.ffa-schedule table {
    margin-top: 30px;
}

.ffa-schedule table thead th:not([all]) {
    font-size: 0.8rem;
    text-align: center;
    vertical-align: bottom;
}

.ffa-schedule table thead th span {
    font-size: 0.8rem;
    display: block;
    width: 100%;
}

.ffa-schedule table tbody th:not([all]) {
    font-size: 0.9rem;
    word-break: keep-all;
    vertical-align: middle;
    width: auto;
}

.ffa-schedule table tbody td {
    width: calc(90% / 7);
}

.ffa-schedule table th:nth-child(2n),
.ffa-schedule table td:nth-child(2n) {
    background-color: var(--cl-grey);
}

.ffa-schedule table tbody tr:hover th,
.ffa-schedule table tbody tr:hover td {
    color: #FFF;
    background-color: var(--cl-green);
}

.ffa-schedule table input {
    width: 100%;
    margin-bottom: 3px;
    text-align: center;
}

.ffa-schedule .swiper-button-next,
.ffa-schedule .swiper-button-prev {
    top: 20px;
    width: 15px;
    height: 24px;
    background-size: 15px 24px;
}
.ffa-schedule .swiper-button-next {
    right: 40%;
}
.ffa-schedule .swiper-button-prev {
    left: 40%;
}

.disabled {
    opacity: 0.4;
}
.disabled:hover {
    opacity: 0.4;
    cursor: unset;
}
</style>
