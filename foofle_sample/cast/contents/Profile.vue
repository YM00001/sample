<template>
    <div class="">
        <ConfigHeader
            :title="title"
            :cast="cast"
        ></ConfigHeader>
        <template v-if="cast">
            <div class="profile-container">
                <div class="profile-wrap">
                    <div class="profile-left">
                        <WebImage
                            :src="cast.profile.img"
                        ></WebImage>
                        <p class="str-btn" @click="toggleCroppa">画像の変更</p>
                    </div>
                    <div class="profile-right">
                        <div>
                            <label>名前</label>
                            <input type="text" :value="cast.profile.name" readonly>
                        </div>
                        <div>
                            <label>ID</label>
                            <input type="text" v-model="cast.profile.display_id">
                        </div>
                    </div>
                </div>
                <div class="profile-wrap">
                    <label>自己紹介</label>
                    <textarea v-model="cast.profile.introduction"></textarea>
                </div>
                <div class="btn-wrap">
                    <p class="str-btn" @click="submitTextProfile">保存</p>
                </div>
            </div>
            <div class="profile-container">
                <h4>Q&A</h4>
                <table>
                    <template v-for="(item, key, ind) in master_profile_question">
                    <tr v-if="!cast.profile.qanda.some(ins => ins.id === item.id)">
                        <th>{{ item.name }}</th>
                        <td>
                            <input type="text" placeholder="未回答" v-model="item.answer"/>
                        </td>
                    </tr>
                    </template>
                    <template v-if="master_profile_question">
                        <tr v-for="(item, ind) in cast.profile.qanda">
                            <th>{{ master_profile_question[item.id].name }}</th>
                            <td>
                                <input type="text" placeholder="未回答" v-model="item.answer"/>
                            </td>
                        </tr>
                    </template>
                </table>
                <div class="btn-wrap">
                    <p class="str-btn" @click="submitTextProfile">保存</p>
                </div>
            </div>
        </template>
        <div v-if="is_show" class="croppa-modal">
            <croppa v-model="myCroppa"
                :width="d_w"
                :height="d_w"
                :show-remove-button="true"
                remove-button-color="#AAA"
                placeholder="タップして画像を選択してください"
                :show-loading="true"
                :file-size-limit="2097152"
                accept="image/png,image/jpeg"
                @file-type-mismatch="onFileTypeMismatch"
                @file-size-exceed="onFileSizeExceed"
            ></croppa>
            <div class="croppa-btn">
                <div class="cancel"
                    @click="toggleCroppa"
                >キャンセル</div>
                <div class="fix"
                    @click="uploadImage"
                >保存</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import ConfigHeader from '../parts/ConfigHeaderParts.vue';
import getMaster from '../../mixin/getMaster.js';

export default {
    data() {
        return {
            master_profile_question: {},
            profile_quesition: {},
            myCroppa: null,
            is_show: false,
            d_w: 200,
        }
    },
    props: [
        'title', 'cast',
    ],
    mounted: function() {
        this.d_w = window.innerWidth * 0.8;
        this.getProfileQuestion().then((res) => {
            this.master_profile_question = res;
        });
    },
    methods: {
        toggleCroppa: function() {
            if (this.is_show) {
                this.is_show = false;
            } else {
                this.is_show = true;
            }
        },
        onFileTypeMismatch: function() {

        },
        onFileSizeExceed: function() {

        },
        uploadImage: function() {
            this.myCroppa.generateBlob((blob) => {
                let fd = new FormData();
                fd.append('image_profile', blob);
                fd.append('id', this.cast.id);
                axios({
                    method: 'POST',
                    url: '/api/cast/profile/image',
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    },
                    data: fd,
                }).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            }, 'image/jpeg', 0.8);
        },
        submitTextProfile: function() {
            let castData = this.cast;
            for (let key in this.master_profile_question) {
                let item = this.master_profile_question[key];
                if (item.answer) {
                    castData.profile.qanda.push({
                        id: item.id,
                        answer: item.answer,
                    });
                }
            }
            axios({
                method: 'POST',
                url: '/api/cast/profile',
                data: castData,
            }).then((res) => {
                if (res.data === 'Success') {
                    console.log('OK');
                }
            }).catch((res) => {

            });
        },
    },
    mixins: [
        getMaster,
    ],
    components: {
        ConfigHeader,
    },
}
</script>

<style scoped>
.profile-container {
    width: 100%;
    background-color: #FFF;
    margin-bottom: 1rem;
    padding: 1rem;
}

input {
    outline:  none !important;
    font-size: 1rem !important;
    height: 2rem !important;
}

input[readonly] {
    border: none;
}

textarea {
    font-size: 1rem;
    font-weight: 300;
    font-family: 'M plus 1p',sans-serif;
}

textarea:focus {
    outline: none;
}

input::placeholder,
teextarea::placeholder {
    font-size: 1rem !important;
}

.profile-wrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

.profile-left {
    width: 40%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 1rem;
}

.profile-left >>> img {
    width: 100%;
    border-radius: 100%;
    margin-bottom: 1rem;
}

.profile-right {
    width: 60%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
}

.profile-right > div {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem
}

.profile-right input {
    width: 100%;
}

.profile-wrap textarea {
    width: 100%;
    height: 8rem;
}

table {
    width: 100%;
}

th {
    color: var(--cl-red) !important;
    width: 30%;
    text-align: left;
    vertical-align: middle;
}

td {
    width: 70%;
    padding: 0.3rem 0;
}

td input {
    width: 100%;
}

.click:hover {
    cursor: pointer;
}

canvas {
    border-radius: 100rem;
}

.croppa-modal {
    width: 100%;
    height: 100vh;
    background-color: #000000aa;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.croppa-container {
    align-self: unset !important;
}

.croppa-btn {
    width: 100%;
    position: absolute;
    top: 3rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
}

.croppa-btn > div {
    border-radius: 100rem;
}

.croppa-btn > div:hover {
    cursor: pointer;
    opacity: 0.8;
}

.croppa-btn > div.fix {
    color: #FFF;
    background: #FFF;
    background: var(--cl-blue);
    padding: 1rem 3rem;
}

.croppa-btn > div.cancel {
    color: #FFF;
    background-color: #AAA;
    padding: 1rem;
    margin-right: 2rem;
}

.click {
    color: var(--cl-blue);
}

.str-btn {
    color: #FFF;
    background: #2CD8D5;
    background: var(--cl-blue);
    padding: 0.3rem 1rem;
    border-radius: 3rem;
}

.str-btn:hover {
    cursor: pointer;
    opacity: 0.8;
}

.btn-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1.5rem 0 0;
}

.btn-wrap > .str-btn {
    padding: 0.5rem 2rem;
}
</style>
