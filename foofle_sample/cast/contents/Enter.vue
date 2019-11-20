<template>
    <div class="ffc-wrapper ffc-fix ffc-fix-enter">
        <div class="ffc-fix-title">
            <p>{{ reserve.id }}</p>
            <h2>入室</h2>
        </div>
        <div class="ffc-check-btn">
            <input id="confirm1" type="checkbox" v-model="confirm1">
            <label for="confirm1"><span>{{ reserve.course.min }}分コース</span>を確認します</label>
        </div>
        <div class="ffc-check-btn" v-if="!reserve.fee.is_cc">
            <input id="confirm2" type="checkbox" v-model="confirm2">
            <label for="confirm2"><span>{{ reserve.fee.recieve_fee }}円</span>を受け取ります</label>
        </div>
        <div class="ffc-check-btn" v-else>
            <input id="confirm3" type="checkbox" v-model="confirm3" disabled>
            <label for="confirm3">代金はお支払い済みです。</label>
        </div>
        <transition name="toggle">
            <p class="ffc-fix-enter-message" v-if="is_confirmed">
                お客様から<span>4桁</span>の暗証番号を聞きます<br>入力するとタイマーがスタートします
            </p>
        </transition>
        <Pin @enteredPin="enter" v-if="is_confirmed" ref="pin"></Pin>

    </div>
</template>

<script>
import axios from 'axios';

import Pin from './inner/Pin.vue';

export default {
    data() {
        return {
            confirm1: false,
            confirm2: false,
            confirm3: true,
        }
    },
    props: [
        'reserve',
    ],
    computed: {
        is_confirmed: function() {
            return this.confirm1 && (this.reserve.fee.is_cc || this.confirm2);
        },
    },
    methods: {
        enter: function(e) {
            let self = this;
            axios({
                method: 'POST',
                url: '/api/cast/reserve/start',
                data: { rid: this.$route.params.rid, pin: e },
            }).then((res) => {
                if (res.data === 'Success') {
                    self.$router.replace(`/cast/${self.$route.params.rid}/timer`);
                } else if (res.data === 'Invalid') {
                    self.$refs.pin.clearPin();
                }
            }).catch((err) => {

            })
        }
    },
    components: {
        Pin,
    }
}
</script>

<style scoped>
/* enter scoped */
.ffc-check-btn {
    width: 100%;
    padding: 0 2rem;
    margin-bottom: 1rem;
}

.ffc-check-btn span{
    color: var(--cl-red);
    font-weight: 500;
}

.ffc-check-btn input[type='checkbox'] {
    display: none;
}

.ffc-check-btn input[type='checkbox'] + label {
    font-size: 1.5rem;
    display: block;
    word-break: break-all;
    position: relative;
    padding-left: 3rem;
}

.ffc-check-btn input[type='checkbox']:checked + label {
    color: var(--cl-border);
    text-decoration: line-through var(--cl-blue);
}

.ffc-check-btn input[type='checkbox']:checked + label span {
    font-size: unset;
    font-weight: 100;
    color: var(--cl-border);
}

.ffc-check-btn input[type='checkbox'] + label span {
    font-size: 2rem;
}

.ffc-check-btn input[type='checkbox'] + label:before,
.ffc-check-btn input[type='checkbox']:checked + label:after {
   content: '';
   display: block;
   width: 2rem;
   height: 2rem;
   border: 0.2rem solid var(--cl-border);
   border-radius: 5rem;
   position: absolute;
   left: 0;
   top: 0.3rem;
}

.ffc-check-btn input[type='checkbox']:checked + label:before {
    border-color: var(--cl-blue);
}

.ffc-check-btn input[type='checkbox']:checked + label:after {
   content: '✔';
   color: var(--cl-blue);
   font-size: 2.5rem;
   border: none;
   left: 0.2rem;
   top: -0.3rem;
}

.ffc-fix-enter .passive {
    opacity: 0.5;
}

.ffc-fix-enter .passive input {
    pointer-events : none;
}

.ffc-fix-enter p.ffc-fix-enter-message {
    padding-top: 5rem;
}

.toggle-enter-active, .toggle-leave-active {
  transition: opacity .5s;
}
.toggle-enter, .toggle-leave-to {
  opacity: 0;
}
</style>
