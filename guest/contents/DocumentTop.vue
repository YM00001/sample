<template>
    <div class="docs">
        <h1>ヘルプ</h1>
        <ul>
            <li>
                <p @click="toggleWindow('about')">FOOFLEについて</p>
                <transition name="slide">
                    <ul v-if="toggle.about">
                        <li><router-link to="/document/doc1">何ができるの?</router-link></li>
                        <li><router-link to="/document/doc2">FOOFLEを利用するメリット</router-link></li>
                        <li><router-link to="/document/doc3">ご利用の流れ</router-link></li>
                    </ul>
                </transition>
            </li>
            <li>
                <p @click="toggleWindow('reserve')">予約について</p>
                <transition name="slide">
                    <ul v-if="toggle.reserve">
                        <li><router-link to="/document/doc4">予約の取り方</router-link></li>
                        <li><router-link to="/document/doc5">予約の確認方法</router-link></li>
                        <li><router-link to="/document/doc6">予約のキャンセル</router-link></li>
                    </ul>
                </transition>
            </li>
            <li>
                <p @click="toggleWindow('fee')">料金について</p>
                <transition name="slide">
                    <ul v-if="toggle.fee">
                        <li><router-link to="/document/">料金の概要</router-link></li>
                        <li><router-link to="/document/">支払い方法について</router-link></li>
                        <li><router-link to="/document/">交通費について</router-link></li>
                        <li><router-link to="/document/">エリア・駅情報</router-link></li>
                    </ul>
                </transition>
            </li>
            <li>
                <p @click="toggleWindow('review')">レビューについて</p>
                <transition name="slide">
                    <ul v-if="toggle.review">
                        <li><router-link to="/document/">FOOFLEレビューの特徴</router-link></li>
                        <li><router-link to="/document/">レビューの投稿方法</router-link></li>
                        <li><router-link to="/document/">レビュー投稿ガイドライン</router-link></li>
                    </ul>
                </transition>
            </li>
            <li>
                <p @click="toggleWindow('point')">ポイントについて</p>
                <transition name="slide">
                    <ul v-if="toggle.point">
                        <li><router-link to="/document/">ポイント概要</router-link></li>
                        <li><router-link to="/document/">ポイントの貯め方</router-link></li>
                        <li><router-link to="/document/">ポイントの利用方法</router-link></li>
                    </ul>
                </transition>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            toggle: {
                about: false,
                reserve: false,
                fee: false,
                review: false,
                point: false,
            },
        }
    },
    methods: {
        toggleWindow: function(type) {
            this.toggle[type] = !this.toggle[type];
        },
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

.docs > ul {
    width: 100;
    background-color: #FFF;
}

.docs > ul > li {
    text-align: center;
    border-style: solid;
    border-color: var(--cl-grey-light);
    border-width: 1px 0 0;
    margin-top: -1px;
}

.docs > ul > li > p {
    font-size: 1rem;
    padding: 1rem 0;
}

.docs > ul > li > ul {
    display: nne;
    background-color: var(--cl-grey-light);
}

.docs > ul > li > ul > li {
    width: 100%;
}

.docs > ul > li > ul > li > a {
    width: 100%;
    padding: 1rem;
}

.slide-enter-active, .slide-leave-active {
  transition: opacity .2s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
