<template>
    <div class="ffa-content column is-10">
        <h1>届出確認書の提出</h1>
        <div v-if="partnerData">
            <table class="license-table">
                <tr>
                    <th>サービスカテゴリ</th>
                    <td>{{ displayCategory }}</td>
                </tr>
                <tr>
                    <th>届出確認書のステータス</th>
                    <td>
                        <p>{{ displayStatus }}</p>
                        <div class="upload">
                            <label for="license">ファイルを選択</label>
                            <input id="license" type="file" name="license_file"
                                @change="selectFiles"
                                accept="image/png,image/jpeg,application/pdf"
                                multiple
                            >
                            <p class="filename">
                                <template v-for="item in files_input">{{ item.name }}<br /></template>
                            </p>
                            <p class="notice">※.pdf/.jpg/.pngのみアップロード可能です。</p>
                        </div>
                    </td>
                </tr>
            </table>
            <div class="ffa-btn">
              <p v-if="!loading" @click="submitData" class="ffa-click">保存</p>
              <Loading v-else></Loading>
            </div>
        </div>
        <AsyncLoading v-else></AsyncLoading>
    </div>
</template>

<script>
import axios from 'axios';
import getMaster from '../../mixin/getMaster.js';
import Loading from './inner/PartnerLoading.vue';
import AsyncLoading from './inner/AsyncLoading.vue';

export default {
    data() {
        return {
            loading: false,
            files_input: null,
            files_data: [,,,,,],
            service_category: null,
        }
    },
    props: [
        'partnerData',
    ],
    computed: {
        displayStatus: function() {
            if (this.partnerData) {
                let status = {
                    'submitted': '提出済み',
                    'unsubmitted': '未提出',
                    'rejected': '内容の確認ができませんでした。',
                };
                return status[this.partnerData.license_file];
            } else {
                return '';
            }
        },
        displayCategory: function() {
            if (this.partnerData && this.service_category) {
                return this.service_category[this.partnerData.config.service.service_category].name;
            } else {
                return '';
            }
        },
    },
    mounted: function() {
        this.getServiceCategory().then((res) => {
            this.service_category = res;
        });
    },
    methods: {
        selectFiles: function(e) {
            if (e.target.files.length > 6) {

            } else {
                this.files_input = e.target.files;
                for (let i = 0; i < this.files_input.length; i++) {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        this.files_data.splice(i, 1, e.target.result);
                    }
                    reader.readAsDataURL(this.files_input[i]);
                }
            }
            console.log(this.files_input);
        },
        submitData: function() {
            this.loading = true;
            let self = this;

            let fd = new FormData();
            if (this.files_input) {
                Array.from(this.files_input, (file) => {
                    fd.append('license_file[]', file);
                });
            }
            console.log(fd);
            axios({
                method: 'POST',
                url: '/api/partner/licensefile',
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                data: fd,
            }).then((res) => {
                console.log(res);
                if (res.data === 'Success') {
                    self.files_input = null;
                    self.$eventHub.$emit('fetchPartnerData');
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'アップロードしました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-danger', message:'アップロードに失敗しました。\n通信状態を確認してください。'});
                }
            }).catch((err) => {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'アップロードに失敗しました。\n通信状態を確認してください。'});
            }).finally(() => {
                self.loading = false;
            });
        }
    },
    mixins: [
        getMaster,
    ],
    components: {
        Loading, AsyncLoading,
    },
}
</script>

<style scoped>
.license-table {
    width: 100%;
    margin: 0 auto;
}

.license-table th,
.license-table td {
    border: 1px solid var(--cl-border);
    padding: 1rem 0.5rem;
    vertical-align: middle;
}

.license-table th {
    width: 30%;
}

.license-table td {
    width: 70%;
}

.license-table td div {
    padding: 0.3rem;
}

.upload {
    margin-top: 1rem;
}

.upload label {
    font-size: 0.8rem;
    color: #FFF;
    background: green;
    background: var(--cl-green);
    margin-right: 0.3rem;
    padding: 0.2rem 1rem;
    line-height: 1.5rem;
}

.upload .filename {
    display: block;
    margin-top: 0.5rem;
}
.upload .notice {
    font-size: 0.7rem;
    margin-top: 1rem;
}
</style>
