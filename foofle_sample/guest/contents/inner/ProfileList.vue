<template>
    <router-link v-if="cast" :to="`/${cast.id}`" class="profile-list">
        <div class="profile-left">
            <WebImage
                :src="cast.profile.img"
            ></WebImage>
        </div>
        <div class="profile-right">
            <p v-if="checkEasyStatus(cast)" class="label">現在待機中</p>
            <h5>{{ cast.profile.name }}</h5>
            <p>{{ master_category ? master_category[cast.config.service.service_category].name : '' }} {{ cast.config.areas.basic.name }}発
                <span>{{ getTodaySchedule(cast) }}</span>
            </p>
            <p>{{ cast.profile.years ? `${cast.profile.years}歳` : '' }} <a v-for="tag in cast.tags" class="hashtag">#{{ tag }}</a></p>
        </div>
    </router-link>
</template>

<script>
import getMaster from '../../../mixin/getMaster.js';

export default {
    data() {
        return {
            master_category: null,
        }
    },
    props: [
        'cast',
    ],
    computed: {
        today: function() {
            let d = new Date();
            if (d.getHours() < 6) {
                d.setDate(d.getDate() - 1);
            }
            return `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`;
        },
        now: function() {
            let d = new Date();
            if (d.getHours() < 6) {
                return `${(d.getHours() + 24)}${('00' + d.getMinutes()).slice(-2)}'`;
            } else {
                return `${('00' + d.getHours()).slice(-2)}${('00' + d.getMinutes()).slice(-2)}`;
            }
        }
    },
    mounted: function() {
        this.getServiceCategory().then((res) => {
            this.master_category = res;
        });
    },
    methods: {
        getTodaySchedule: function(item) {
            if (item.hasOwnProperty('schedule') && item.schedule.hasOwnProperty(this.today)) {
                let obj = item.schedule[this.today];
                let view = (d) => `${d.slice(0,2)}:${d.slice(-2)}`;
                return `${view(obj.from)}～${view(obj.to)}`;
            } else {
                return 'お休み';
            }
        },
        checkEasyStatus: function(item) {
            if (item.hasOwnProperty('schedule') && item.schedule.hasOwnProperty(this.today)) {
                let obj = item.schedule[this.today];
                if (obj.from < this.now && this.now < obj.to) {
                    if (item.hasOwnProperty('reserve') && item.reserve.hasOwnProperty(this.today)) {
                        let obj = item.reserve[this.schedule];
                        for (let key in obj) {
                            if (obj[key].from_bind < this.now && this.now < obj[key].to_bind) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
    },
    mixins: [
        getMaster,
    ],
}
</script>

<style scoped>
.profile-list {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    background-color: #FFF;
    margin-top: -1px;
    padding: 0.2rem 1rem;
    border: 1px solid var(--cl-border-light);
}

.profile-left {
    width: 78px;
    padding: 0.3rem 0;
}

.profile-left >>> img {
    width: 64px;
    border-radius: 72px;
}

.profile-right {
    width: calc(100% - 72px);
    padding-left: 0.5rem;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    position: relative;
}

.profile-right h5 {
    width: 100%;
    font-size: 1.4rem;
    margin: 0.8rem 0 0.5rem 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

.profile-right p {
    width: 100%;
    padding-bottom: 0.2rem;
    font-size: 0.9rem;
}

.profile-right span {
    padding-left: 1rem;
}

.profile-right span.is_commute {
    font-size: 1.1rem;
}

.profile-right span.is_vacation {
    font-size: 1rem;
}

.profile-right p.label {
    font-size: 1rem;
    width: unset;
    display: inline-block;
    color: #FFF;
    background: red;
    background: var(--cl-grad-layer);
    padding: 0.2rem 1rem;
    border-radius: 10rem;
    position: absolute;
    top: 0.3rem;
    right: 0;
    opacity: 1;
}

.profile-right a.hashtag {
    margin-right: 0.3rem;
}
</style>
