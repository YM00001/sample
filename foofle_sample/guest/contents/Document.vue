<template>
    <div class="docs">
        <template v-if="!initial_loading">
            <h1>{{ context.title }}</h1>
            <div v-html="context.content" class="content">
            </div>
            <AreaInfo
                v-if="context.hasOwnProperty('area_info') && context.area_info"
            ></AreaInfo>
            <div class="nav">
                <p class="prev">
                    <router-link v-if="prev" :to="`/document/${prev.id}`">{{ prev.title }}</router-link>
                </p>
                <p class="next">
                    <router-link v-if="next" :to="`/document/${next.id}`">{{ next.title }}</router-link>
                </p>
            </div>
            <div class="common-nav">
                <router-link to="/document">ヘルプトップ</router-link>
            </div>
        </template>
        <Loading v-else></Loading>
    </div>
</template>

<script>
import getDoc from '../../mixin/getDoc.js';
import Loading from './inner/Loading.vue';

import AreaInfo from './document/AreaInfo.vue';

export default {
    data() {
        return {
            initial_loading: true,
            doc_id: null,
            context: null,
            next: null,
            prev: null,
        }
    },
    watch: {
        '$route.params.docid': function() {
            this.fetchData().finally(() => {
                this.initial_loading = false;
            });
        },
    },
    mounted: function() {
        this.fetchData().finally(() => {
            this.initial_loading = false;
        });
    },
    methods: {
        fetchData: function() {
            this.initial_loading = true;
            this.doc_id = this.$route.params.docid;
            return this.getGuestDoc(this.doc_id).then((res) => {
                this.context = res;
                return Promise.resolve(res);
            }).then((val) => {
                let promises = [];
                if (val.prev_doc_id) {
                    promises.push(
                        this.getGuestDoc(val.prev_doc_id).then((res) => {
                            this.prev = res;
                            return Promise.resolve();
                        })
                    );
                } else {
                    promises.push((() => {
                        this.prev = null;
                        return true;
                    })());
                }
                if (val.next_doc_id) {
                    promises.push(
                        this.getGuestDoc(val.next_doc_id).then((res) => {
                            this.next = res;
                            return Promise.resolve();
                        })
                    );
                } else {
                    promises.push((() => {
                        this.next = null;
                        return true;
                    })());
                }
                return Promise.all(promises);
            });
        },
    },
    mixins: [
        getDoc,
    ],
    components: {
        Loading, AreaInfo,
    },
}
</script>

<style scoped>
.docs h1 {
    font-size: 1.2rem;
    text-align: center;
    letter-spacing: 0.1rem;
    margin: 1rem 0;
}

.docs >>> .ld-wrap {
    margin-top: 3rem;
}

.docs .nav {
    width: 100%;
    display: flex;
    flex-wrap: no-wrap;
    justify-content: space-between;
    padding: 1rem;
    background-color: #FFF;
}

.docs .nav p {
    width: 40%;
}

.docs .nav p.prev a:before {
    content: '←'
}

.docs .nav p.next {
    text-align: right;
}

.docs .nav p.next a:after {
    content: '→'
}

.docs .common-nav {
    width: 100%;
    text-align: center;
    padding: 1rem;
    background-color: #FFF
}

</style>

<style>
.docs .content {
    background-color: #FFF;
    padding: 1rem 0.5rem;
}

.docs .content h2 {
    font-size: 1.1rem;
    font-weight: normal;
    margin-bottom: 0.3rem;
}

.docs .content p {
    line-height: 1.4rem;
    margin-bottom: 1rem;
}
</style>
