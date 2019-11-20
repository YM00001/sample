<template>
    <div>
        <div class="ffc-block" v-if="cast">
            <h2 class="ffc-ribbon">スケジュール</h2>
            <div class="ffc-card">
                <div class="ffc-card-header">
                    <p>今週のスケジュール</p>
                </div>
                <table class="schedule-table">
                    <template v-for="(item, key) in calendar_tw">
                        <tr :class="{ 'vacation' : !cast.schedule.hasOwnProperty(item.full_date) }">
                            <td class="sign"><span>●</span></td>
                            <th>{{ item.date }}<br /><span>{{ item.day }}</span></th>
                            <td v-if="!is_editing" class="data">
                                {{ cast.schedule.hasOwnProperty(item.full_date)
                                    ? `${displayTime(cast.schedule[item.full_date].from)}～${displayTime(cast.schedule[item.full_date].to)}`
                                    : '未提出' }}
                                <ul v-if="cast.reserve.hasOwnProperty(item.full_date)" class="schedule-reserve">
                                    <li v-for="(ritem, rkey) in cast.reserve[item.full_date]">
                                        <template v-if="ritem.hasOwnProperty('is_fake') && ritem.is_fake">
                                            <router-link to="">
                                                <fa :icon="['fas', 'calendar-check']" :style="{ color: 'CCCCCC' }"></fa>
                                                {{ displayTime(ritem.from_bind) }}
                                            </router-link>
                                        </template>
                                        <template v-else>
                                            <router-link :to="`/cast/${rkey}`">
                                                <fa :icon="['fas', 'calendar-check']" :style="{ color: '2CD8D5' }"></fa>
                                                {{ displayTime(ritem.from_bind) }}
                                            </router-link>
                                        </template>
                                    </li>
                                </ul>
                            </td>
                            <td v-else class="data">
                                <input type="number" v-model="item.schedule.from">～
                                <input type="number" v-model="item.schedule.to">
                            </td>
                        </tr>
                    </template>
                </table>
                <div class="schedule-btn"
                    v-if="is_editing"
                >
                    <div class="cancel"
                        @click="endEditing"
                    >キャンセル</div>
                    <div class="fix"
                        :class="{ 'disabled' : is_sending }"
                        @click="submitSchedule"
                    >保存</div>
                </div>
            </div>
            <transition name="fade">
                <div class="ffc-card">
                    <div class="ffc-card-header"
                        @click="toggleNextWeek"
                    >
                        <p>来週以降のスケジュール</p>
                        <fa class="navi" :icon="toggleIcon(is_nw_open)" :style="{ color: '#444444' }" size="lg"></fa>
                    </div>
                    <table class="schedule-table"
                        v-if="is_nw_open"
                    >
                        <template v-for="(item, key) in calendar_nw">
                            <tr class="vacation">
                                <td class="sign"><span>●</span></td>
                                <th>{{ item.date }}<br /><span>{{ item.day }}</span></th>
                                <td v-if="!is_editing" class="data">未提出</td>
                                <td v-else class="data">
                                    <input type="number" v-model="item.schedule.from">～
                                    <input type="number" v-model="item.schedule.to">
                                </td>
                            </tr>
                        </template>
                    </table>
                    <div class="schedule-btn"
                        v-if="is_editing && is_nw_open"
                    >
                        <div class="cancel"
                            @click="endEditing"
                        >キャンセル</div>
                        <div class="fix"
                            :class="{ 'disabled' : is_sending }"
                            @click="submitSchedule"
                        >保存</div>
                    </div>
                </div>
            </transition>
        </div>
        <EditButton
            v-if="!is_editing"
            :icon="['fas', 'bullhorn']"
            @click="startEditing"
        ></EditButton>
        <Loading v-if="is_sending"></Loading>
    </div>
</template>

<script>
import axios from 'axios';
import EditButton from '../parts/EditButtonParts.vue';
import Loading from '../parts/Loading.vue';

export default {
    data() {
        return {
            calendar_tw: [],
            calendar_nw: [],
            is_editing: false,
            is_nw_open: false,
            is_sending: false,
        }
    },
    props: [
        'cast',
    ],
    mounted: function() {
        let d = new Date();
        let days = ['日', '月', '火', '水', '木', '金', '土'];
        if (d.getHours() < 6) { d.setDate(d.getDate() - 2); }
        else { d.setDate(d.getDate() - 1); }
        for (let i = 0; i < 7; i++) {
            d.setDate(d.getDate() + 1);
            this.calendar_tw.push({
                full_date: `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`,
                date: `${d.getMonth()+1}/${d.getDate()}`,
                day: days[d.getDay()],
                schedule: {
                    from: null,
                    to: null,
                },
            });
        }
        for (let i = 0; i < 21; i++) {
            d.setDate(d.getDate() + 1);
            this.calendar_nw.push({
                full_date: `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`,
                date: `${d.getMonth()+1}/${d.getDate()}`,
                day: days[d.getDay()],
                schedule: {
                    from: null,
                    to: null,
                },
            });
        }
    },
    methods: {
        displayTime: function(digit) {
            if (!digit || digit === 'null') {
                return '';
            } else {
                return `${digit.slice(0,2)}:${digit.slice(-2)}`;
            }
        },
        startEditing: function() {
            if (!this.is_sending) {
                this.is_editing = true;
            }
        },
        endEditing: function() {
            if (!this.is_sending) {
                this.is_editing = false;
            }
        },
        submitSchedule: function() {
            if (!this.is_sending) {
                this.is_sending = true;
                let self = this;
                let tmparr = this.calendar_tw.concat(this.calendar_nw);
                let sdata = {};
                for (let i = 0; i < tmparr.length; i++) {
                    sdata[tmparr[i].full_date] = tmparr[i].schedule;
                }
                axios({
                    method: 'POST',
                    url: '/api/cast/schedule',
                    data: {
                        cast_id: this.cast.id,
                        schedule: sdata,
                    },
                }).then((res) => {
                    if (res.data === 'Success') {
                        console.log(sdata);
                    }
                }).catch((err) => {

                }).finally(() => {
                    window.location.reload();
                    self.is_editing = false;
                    self.is_sending = false;
                });
            }
        },
        toggleIcon: function(flg) {
            return flg ? ['fas', 'angle-up'] : ['fas', 'angle-down'];
        },
        toggleNextWeek: function() {
            if (this.is_nw_open) {
                this.is_nw_open = false;
            } else {
                this.is_nw_open = true;
            }
        }
    },
    components: {
        EditButton, Loading,
    }
}
</script>

<style scoped>
.schedule-table {
    width: 100%;
    margin: 1.5rem auto 0;
}

.schedule-table tr {
    height: auto;
}

.schedule-table tr:nth-child(2n + 1) {
    background-color: #FEFEFE;
}

.schedule-table th,
.schedule-table td {
    font-size: 1.2rem;
    height: auto;
}

.schedule-table th {
    color: var(--cl-blue);
    width: 15%;
    line-height: 1rem;
    font-weight: 500;
    padding: 1rem 0;
    vertical-align: middle;
}

.schedule-table th span {
    color: var(--cl-blue);
    font-size: 0.9rem;
}

.schedule-table td {
    vertical-align: middle;
    text-align: center;
}

.schedule-table td input {
    font-size: 1.2rem;
    text-align: center;
    height: 2rem;
    width: 6rem;
}

.schedule-table td.data {
    width: 75%;
    padding: 1rem 0;
}

.schedule-table td.data .schedule-reserve {
    width: 100%;
    margin-top: 0.6rem;
}

.schedule-table td.data .schedule-reserve li {
    display: inline-block;
    background-color: #FFF;
    box-shadow: var(--mbs-level1);
    border-radius: 0.3rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
}
.schedule-table td.data .schedule-reserve li svg {
    margin-right: 0.2rem;
}

.schedule-table td.sign {
    width: 15%;
}

.schedule-table td.sign span {
    font-size: 1.5rem;
    display: inline-block;
    color: var(--cl-blue);
    height: 100%;
    position: relative;
}

.schedule-table td.sign span:after {
    content: '';
    display: block;
    background-color: var(--cl-blue);
    width: 2px;
    height: calc(100% + 3rem);
    position: absolute;
    top: 0.75rem;
    left: calc(0.75rem - 1px);
}

.schedule-table tr.vacation th,
.schedule-table tr.vacation th span,
.schedule-table tr.vacation td.sign span {
    color: #CCC;
}

.schedule-table tr.vacation td.sign span:after {
    background-color: #CCC;
}

.schedule-table tr:last-child td.sign span:after {
    display: none;
}

.ffc-card-header {
    width: 100%;
    position: relative;
}

.ffc-card-header p {
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
}

.ffc-card-header svg {
    position: absolute;
    top: 0;
    right: 1rem;
}

.schedule-btn {
    width: 100%;
    top: 3rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    margin: 1rem 0;
}

.schedule-btn > div {
    border-radius: 100rem;
}

.schedule-btn > div.disabled {
    opacity: 0.4;
}

.schedule-btn > div:hover {
    cursor: pointer;
    opacity: 0.8;
}

.schedule-btn > div.fix {
    color: #FFF;
    background: #FFF;
    background: var(--cl-blue);
    padding: 1rem 3rem;
}

.schedule-btn > div.cancel {
    color: #FFF;
    background-color: #AAA;
    padding: 1rem;
    margin-right: 2rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
