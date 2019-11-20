<template>
    <div class="ff-content ff-contract">
        <h3>プロフィール設定</h3>
        <ul class="config-list">
            <li>
                <label class="required">ニックネーム</label>
                <input type="text" placeholder="未設定" v-model="profile.name">
            </li>
            <li>
                <label class="required">性別</label>
                <select v-model="profile.gender">
                    <option value="男性">男性</option>
                    <option value="女性">女性</option>
                </select>
            </li>
            <li>
                <label class="required">生年月日</label>
                <input type="date" placeholder="未設定" v-model="profile.birthday">
            </li>
        </ul>
        <div class="btn-wrap">
            <Btn
                :disabled="is_invalid"
                @click="submitProfile"
            >保存</Btn>
        </div>
    </div>
</template>

<script>
import Btn from './inner/Btn.vue';

export default {
    data() {
        return {
            profile: {
                name: '',
                gender: '男性',
                birthday: '',
            },
        }
    },
    props: [
        'guest',
    ],
    computed: {
        is_invalid: function() {
            if (this.profile.name && this.profile.gender && this.profile.birthday) {
                return false;
            } else {
                return true;
            }
        },
    },
    watch: {
        guest: function() {
            if (this.guest) {
                this.profile.name = this.guest.name;
                this.profile.gender = this.guest.gender;
                this.profile.birthday = this.guest.year;
            }
        },
    },
    mounted: function() {
        let f = this.$route.query.f || false;
        if (f) {

        }
    },
    methods: {
        submitProfile: function() {
            let user = firebase.auth().currentUser;
            if (user) {console.log(user.uid);
                firebase.firestore().collection('guest').doc(user.uid).update({
                    'name': this.profile.name,
                    'year': this.profile.birthday,
                    'gender': this.profile.gender,
                    'profile_registed': true,
                });
            }
        },
    },
    components: {
        Btn,
    },
}
</script>

<style scoped>
h3 {
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 0.1rem;
    margin: 1rem 0;
    text-align: center;
}

.config-list {
    width: 100%;
}

.config-list li {
    width: 100%;
    padding: 0.3rem 1rem;
    background-color: #FFF;
    border-bottom: 1px solid #DDD;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.config-list li input {
    border: none;
    text-align: right;
    -webkit-appearance: none;
     -moz-appearance: none;
     appearance: none;
}

.config-list li input::placeholder {
    font-size: 1rem;
}

.config-list select {
    border: none;
    text-align: right;
}

.required:after {
    content: '必須';
    font-size: 0.8rem;
    color: var(--cl-pink);
    margin-left: 0.5rem;
}

.btn-wrap {
    width: 100%;
    text-align: center;
    padding: 1rem;
}
</style>
