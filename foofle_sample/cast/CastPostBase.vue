<template>
    <div v-if="cast" class="post-wrap">
        <div class="header">
            <fa :icon="['fas', 'times']" fixed-width
                @click="historyBack"
            ></fa>
            <p class="btn"
                @click="postTweet"
                :class="{ 'disabled': is_sending }"
            >ツイート</p>
            <Loading v-if="is_sending"></Loading>
        </div>
        <div class="main">
            <div class="icon">
                <WebImage
                    :src="cast.profile.img"
                ></WebImage>
            </div>
            <textarea
                placeholder="今何してる?"
                @keyup="autoGrow"
                v-model="caption"
            ></textarea>
        </div>
        <div v-if="is_image_active" class="image-thumbnail">
            <div v-for="(url, ind) in imageData">
                <img :src="url" alt="">
            </div>
        </div>
        <div v-if="videoInput" class="video-thumbnail">
            <video :src="videoData" type="video/"></video>
        </div>
        <div class="footer">
            <div class="counter">
                <Counter
                    :current-length="caption.length"
                    safe="#2CD8D5"
                ></Counter>
            </div>
            <div class="images"
                @click="openImage"
            >
                <input
                    type="file"
                    @change="changeImage"
                    ref="imageInput"
                    accept="image/png,image/jpeg"
                    style="height:1px;width:1px;overflow:hidden;margin-left:-99999px;position:absolute;"
                    multiple/>
                <fa v-if="is_image_disabled || !is_video_disabled" :icon="['far', 'images']" :style="{ color: !is_image_disabled ? '#2CD8D5' : '#EEE' }" size="lg"></fa>
                <fa v-if="!is_image_disabled && is_video_disabled":icon="['fas', 'times']" :style="{ color: '#2CD8D5' }" size="lg"
                    @click.stop="deleteImage"
                ></fa>
            </div>
            <div class="videos"
                @click="openVideo"
            >
                <input
                    type="file"
                    @change="changeVideo"
                    ref="videoInput"
                    accept="video/*"
                    style="height:1px;width:1px;overflow:hidden;margin-left:-99999px;position:absolute;" />
                <fa v-if="is_video_disabled || !is_image_disabled" :icon="['fas', 'video']" :style="{ color: !is_video_disabled ? '#2CD8D5' : '#EEE' }" size="lg"></fa>
                <fa v-if="!is_video_disabled && is_image_disabled":icon="['fas', 'times']" :style="{ color: '#2CD8D5' }" size="lg"
                    @click.stop="deleteVideo"
                ></fa>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import Counter from 'vue-twitter-counter';
import Loading from './parts/Loading.vue';

export default {
    data() {
        return {
            cast: null,
            caption: '',
            is_sending: false,
            imageInput: null,
            imageData: ['', '', ''],
            videoInput: null,
            videoData: null,
        }
    },
    computed: {
        is_image_active: function() {
            return this.imageData.some(item => item);
        },
        is_image_disabled: function() {
            if (!this.videoInput) {
                return false;
            } else {
                return true;
            }
        },
        is_video_disabled: function() {
            if (!this.imageInput) {
                return false;
            } else {
                return true;
            }
        },
    },
    mounted: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            let cast_id = window.localStorage['active_cast_id'] || null;
            axios({
                method: 'POST',
                url: '/api/cast/castinfo',
                data: {
                    cast_id: cast_id,
                },
            }).then((res) => {
                this.cast = res.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        autoGrow: function(e) {
            let el = e.target;
            el.style.height = '5px';
            el.style.height = `${el.scrollHeight + 20}px`;
        },
        historyBack: function() {
            this.$router.back();
        },
        openImage: function() {
            if (!this.is_image_disabled) {
                this.$refs.imageInput.click();
            }
        },
        changeImage:function(e) {
            if (e.target.files.length > 6) {

            } else {
                this.imageInput = e.target.files;
                for (let i = 0; i < this.imageInput.length; i++) {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        this.imageData.splice(i, 1, e.target.result);
                    }
                    reader.readAsDataURL(this.imageInput[i]);
                }
            }
        },
        deleteImage: function() {
            this.imageInput = null;
            this.imageData = ['', '', ''];
        },
        openVideo: function() {
            if (!this.is_video_disabled) {
                this.$refs.videoInput.click();
            }
        },
        changeVideo: function(e) {console.log(e);
            this.videoInput = e.target.files[0];
            let reader = new FileReader();
            reader.onload = (e) => {
                this.videoData = e.target.result;
            }
            reader.readAsDataURL(this.videoInput);
        },
        deleteVideo: function() {
            this.imageInput = null;
            this.imageData = null;
        },
        postTweet: function() {
            this.is_sending = true;
            let self = this;
            let cast_id = window.localStorage['active_cast_id'] || null;
            let fd = new FormData();
            fd.append('cast_id', cast_id);
            fd.append('comment', this.caption);

            if (this.imageInput) {
                Array.from(this.imageInput, (file) => {
                    fd.append('images[]', file);
                });
            } else {
                fd.append('images', null);
            }

            fd.append('video', this.videoInput || null);
            axios({
                method: 'POST',
                url: '/api/cast/postTweet',
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                data: fd,
            }).then((res) => {
                if (res.data === 'Success') {
                    self.$router.push('/cast/top')
                }console.log(res);
            }).catch((err) => {

            }).finally(() => {
                self.is_sending = false;
            });
        },
    },
    components: {
        Loading, Counter,
    },
}
</script>

<style scoped>
.post-wrap {
    background-color: #FFF;
}

.header {
    width: 100%;
    height: 40px;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--cl-border-light);
}

.header > p {
    color: #FFF;
    padding: 0.3rem 1rem;
    background-color: var(--cl-blue);
    border-radius: 3rem;
}

.main {
    display: flex;
    flex-wrap: nowrap;
    padding: 1rem 0.5rem;
}

.icon {
    width: 4rem;
    max-width: 52px;
    margin-right: 1rem;
}

.icon >>> img {
    width: 4rem;
    height: 4rem;
    max-width: 52px;
    max-height: 52px;
    border-radius: 84px;
}

.main textarea {
    width: calc(100% - 5rem);
    min-width: calc(100% - 52px - 1rem);
    font-family: sans-serif;
    border: none;
    resize: none;
    /* overflow-y: hidden; */
}

.main textarea:focus {
    outline: none;
}

.btn:hover {
    opacity: 0.8;
    cursor: pointer;
}

.btn.disabled {
    opacity: 0.4;
}

.btn.disabled:hover {
    opacity: 0.4;
    cursor: unset;
}

.footer {
    width: 100%;
    height: 42px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row-reverse;
    align-items: center;
    border-top: 1px solid var(--cl-grey);
    background: var(--cl-grad-light);
}

.footer > div {
    width: 48px;
    height: 42px;
    display: flex;
    justify-content : center;
    align-items: center;
    border-left: 1px solid var(--cl-grey);
    background-color: #FFF;
}

.VueTwitterCounter,
.VueTwitterCounter svg {
    width: 24px !important;
    height: 24px;
}

.image-thumbnail {
    width: 100%;
    padding-bottom: 1rem;
    padding-left: 5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
}

.image-thumbnail > div {
    width: 33%;
    position: relative;
}

.image-thumbnail > div > svg {
    position: absolute;
    top: 8px;
    right: 8px;
    opacity: 0.5;
}

.image-thumbnail img {
    max-width: 100%;
    border: 1px solid #FAFAFA;
}
</style>
