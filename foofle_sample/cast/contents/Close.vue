<template>
    <div class="ffc-wrapper ffc-fix ffc-fix-close">
        <div class="ffc-fix-title">
            <p>{{ reserve.id }}</p>
            <h2>お疲れ様でした！</h2>
        </div>
        <template v-if="!is_answered">
            <p>今回のお客様はいかがでしたか？<br />評価してください</p>
            <div class="ffc-fix-review">
                <div class="ffc-fix-review-yes">
                    <input id="review-yes" type="radio" name="thanks" value="0" v-model="is_bad">
                    <label for="review-yes" @click="answer"><i></i></label>
                </div>
                <div class="ffc-fix-review-no">
                    <input id="review-no" type="radio" name="thanks" value="1" v-model="is_bad">
                    <label for="review-no"><i></i></label>
                </div>
            </div>
            <transition name="fade">
                <p v-if="is_bad == 1">BADの理由を教えてください</p>
            </transition>
            <transition name="fade">
                <span v-if="is_bad == 1">複数選択可</span>
            </transition>
            <transition name="fade">
                <div v-if="is_bad == 1" class="ffc-fix-review-list">
                    <div class="ffc-fix-review-item"
                        v-for="(item, key) in master_bad_category"
                    >
                        <input :id="`reason_${key}`" type="checkbox" :value="key" v-model="bad_category">
                        <label :for="`reason_${key}`">{{ item.name }}</label>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="is_bad == 1" class="ffc-btn-wrap">
                    <p>OK</p>
                </div>
            </transition>
        </template>
        <transition name="fade">
            <p v-if="is_answered" class="ffc-fix-review-msg">ご回答ありがとうございました</p>
        </transition>
        <template v-if="is_answered">
            <div class="ffc-fix-close-home">
                <router-link to="/cast/top">TOPに戻る</router-link>
            </div>
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import GetMaster from '../../mixin/getMaster.js';

export default {
    data() {
        return {
            master_bad_category: {},
            bad_category: [],
            is_bad: null,
            is_answered: false,
        }
    },
    props: [
        'reserve',
    ],
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            let self = this;
            this.getGuestReviewBadCategory().then((res) => {console.log(res);
                self.master_bad_category = res;
            });
        },
        answer: function(e) {
            axios({
                method: 'POST',
                url: '/api/cast/reserve/review',
                data: {
                    rid: this.$route.params.rid,
                    is_bad: this.is_bad,
                    bad_category: this.bad_cateogry,
                },
            }).then((res) => {
                this.is_answered = true;
            }).catch((err) => {
                this.is_answered = true;
            });
        },
    },
    mixins: [
        GetMaster,
    ],
}
</script>

<style scoped>
/* Close scoped */
.ffc-fix-close .ffc-fix-title h2 {
    font-size: 2.3rem;
}

.ffc-fix-review {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
}

.ffc-fix-review input[type="radio"],
.ffc-fix-review-list input[type="checkbox"] {
    display: none;
}

.ffc-fix-review label:focus {
    outline: none;
}

.ffc-fix-review > div > label {
    display: block;
    width: 100%;
    background-color: #FFF;
    border-radius: 5rem;
    padding: 0.5rem 5rem;
}

.ffc-fix-review > div i {
    background: url('/img/cast/icons.png');
    background-size: 400%;
    display: block;
    width: 3rem;
    height: 3rem;
}

.ffc-fix-review > div.ffc-fix-review-yes {
    margin-right: 1rem;
}

.ffc-fix-review > div.ffc-fix-review-yes > label {
    border: 1px solid var(--cl-green);
}

.ffc-fix-review > div.ffc-fix-review-yes i {
    background-position: 0.2rem 3rem;
}

.ffc-fix-review > div.ffc-fix-review-yes > input:checked + label {
    background-color: var(--cl-green);
}

.ffc-fix-review > div.ffc-fix-review-yes > input:checked + label > i {
    background-position: 3rem 3rem;
}

.ffc-fix-review > div.ffc-fix-review-no > label {
    border: 1px solid var(--cl-red);
}

.ffc-fix-review > div.ffc-fix-review-no i {
    background-position: 7.4rem 3rem;
}

.ffc-fix-review > div.ffc-fix-review-no input:checked i {
    background-position: 7.4rem 3rem;
}

.ffc-fix-review > div.ffc-fix-review-no > input:checked + label {
    background-color: var(--cl-red);
}

.ffc-fix-review > div.ffc-fix-review-no > input:checked + label > i {
    background-position: 3rem 7rem;
}

.ffc-fix-review ~ span {
    color: var(--cl-red);
    width: 100%;
    display: block;
    text-align: center;
    padding: 0.5rem 0;
}

.ffc-fix-review-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 2rem;
}

.ffc-fix-review-item input[type='checkbox'] + label {
    display: block;
    background-color: #FFF;
    font-size: 1.5rem;
    padding: 0.5rem 1.5rem;
    border: 1px solid var(--cl-red);
    border-radius: 3rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}

.ffc-fix-review-item input[type='checkbox']:checked + label {
    color: #FFF;
    background-color: var(--cl-red);
}

.ffc-fix-review-msg {
    margin: 0 0 3rem;
}

span.ffc-fix-close-next {
    color: unset;
    font-size: 1.3rem;
}

.ffc-fix-close-home {
    width: 100%;
    text-align: center;
    padding: 3rem 0;
}

.ffc-fix-close-home a {
    font-size: 1.3rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
