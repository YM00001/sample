<template>
    <div class="ff-tweet-list" v-if="cast.name">
        <div class="tweet-thumnail"
            @click="linkto(tweet.cast_id)"
        >
            <WebImage
                :src="cast.img"
                :eventName="eventName"
            ></WebImage>
        </div>
        <div class="tweet-body">
            <div class="tweet-header"
                @click="linkto(tweet.cast_id)"
            >
                <span class="header-name">{{ cast.name }}</span> <span class="header-id">@{{ cast.display_id }}</span><span class="header-date">{{ getDisplayOnTweet(tweet.timestamp) }}</span>
            </div>
            <div class="tweet-content">
                <p v-html="showContent(tweet.comment)"></p>
            </div>
            <div v-if="(tweet.imgs && tweet.imgs.length) || tweet.video" class="tweet-media">
                <div v-if="tweet.imgs" class="tweet-imgs" :class="`imgs-${tweet.imgs.length}`"
                    @click="showLightbox(tweet.imgs)"
                >
                    <WebImage v-for="(item, ind) in tweet.imgs" :key="item.src"
                        :src="item"
                        :eventName="eventName"
                    ></WebImage>
                </div>
            </div>
            <div class="tweet_footer">
                <div class="tweet-icon"
                    :class="{ 'is-favorite': is_favorite }"
                    @click="favorite(tweet.id)"
                >
                    <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                      <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
                        <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2"/>
                        <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>

                        <g id="grp7" opacity="0" transform="translate(7 6)">
                          <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
                          <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
                        </g>

                        <g id="grp6" opacity="0" transform="translate(0 28)">
                          <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
                          <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
                        </g>

                        <g id="grp3" opacity="0" transform="translate(52 28)">
                          <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
                          <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
                        </g>

                        <g id="grp2" opacity="0" transform="translate(44 6)">
                          <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
                          <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
                        </g>

                        <g id="grp5" opacity="0" transform="translate(14 50)">
                          <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
                          <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
                        </g>

                        <g id="grp4" opacity="0" transform="translate(35 50)">
                          <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
                          <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
                        </g>

                        <g id="grp1" opacity="0" transform="translate(24)">
                          <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
                          <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
                        </g>
                      </g>
                    </svg>
                    <span>{{ is_manual_favorite ? tweet.favorite + 1 : tweet.favorite }}</span>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import sanitizeHtml from 'sanitize-html';
import getTweet from '../../../mixin/getTweet.js';
import timeHelper from '../../../mixin/timeHelper.js';

export default {
    data() {
        return {
            cast: {},
            is_manual_favorite: false,
        }
    },
    props: [
        'tweet', 'eventName',
    ],
    computed: {
        conf: function() {
            return {
              allowedTags: ['span'],
              allowedAttributes: {
                'span': [ 'class' ]
              },
            }
        },
        is_favorite: function() {
            if (this.tweet && this.tweet.hasOwnProperty('is_favorite') && this.tweet.is_favorite
                || this.is_manual_favorite){
                return true;
            } else {
                return false;
            }
        },
    },
    watch: {
        tweet: function() {

        },
    },
    mounted: function() {
        this.fetchCastData();
    },
    methods: {
        showContent: function(str) {
            //:::::::::::::::://
            // use for v-html //
            //:::::::::::::::://
            if (!str) { return '' }
            str = str.replace(/([#＃][Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+)/gm, (p1) => {
                return `<span class="tweet-tag-link">${p1}</span>`
            });
            return sanitizeHtml(str, this.conf);
        },
        fetchCastData: function() {
            if (this.tweet) {
                let st = window.localStorage || null;
                let cast_id = this.tweet.cast_id;console.log(cast_id);
                let limit = this.getNow() - (7 * 24 * 60 * 60);
                if (st && st[`cast_profile_${cast_id}`] && st[`cast_profile_${cast_id}_timestamp`] > limit) {
                    this.cast = JSON.parse(st[`cast_profile_${cast_id}`]);
                } else if (st) {
                    firebase.firestore().collection('cast').doc(cast_id).onSnapshot((doc) => {
                        this.cast = doc.data().profile;
                        st[`cast_profile_${cast_id}`] = JSON.stringify(this.cast);
                        st[`cast_profile_${cast_id}_timestamp`] = this.getNow();
                    });
                } else {
                    firebase.firestore().collection('cast').doc(cast_id).onSnapshot((doc) => {
                        this.cast = doc.data().profile;
                    });
                }
            }
        },
        linkto: function(cast_id) {
            this.$router.push(`/${cast_id}`);
        },
        favorite: function(tweet_id) {
            let st = window.localStorage || null;
            let user = firebase.auth().currentUser;
            if (!this.is_favorite) {
                if (user) {
                    firebase.firestore().collection('guest').doc(user.uid).collection('favorite').doc(tweet_id)
                    .set({
                        id: tweet_id,
                        timestamp: this.getNow(),
                    });
                }
                this.setFavorite(tweet_id);
                this.is_manual_favorite = true;
            }
        },
        showLightbox: function(imgs, ind) {
            this.$eventHub.$emit('lightbox', imgs);
        },
    },
    mixins: [
        timeHelper, getTweet,
    ],
}
</script>

<style scoped>
.ff-tweet-list {
    width: 100%;
    display: flex;
    padding: 1rem 1.5rem 0.5rem 0.5rem;
    border-style: solid;
    border-color: var(--cl-border-light);
    border-width: 1px 0;
    background-color: #FFF;

    --cl-text: #555;
    --cl-text-grey: #AAA;
}

.ff-tweet-list,
.ff-tweet-list p
.ff-tweet-list span {

}

.tweet-thumnail {
    padding: 0 1rem 0 0;
}

.tweet-thumnail >>> img {
    width: 4rem;
    border-radius: 100vw;
}

.tweet-header {
    max-width: 100%;
    margin-bottom: 0.5rem;
}

.header-name {
    color: #555;
    font-weight: 600;
    max-width: 100%;
    padding-right: 0.5rem;
    text-overflow: ellipsis;
    font-family: sans-serif;
    font-size: 1rem;
}

.header-id {
    max-width: 100%;
    padding-right: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--cl-text-grey);
    font-family: sans-serif;
    font-size: 0.8rem;
}

.header-date {
    max-width: 100%;
    padding-right: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--cl-text-grey);
    font-size: 0.8rem;
}

.tweet-body {
    width: 100%;
}

.tweet-content {
    margin-bottom: 0.5rem;
}

.tweet-content p {
    font-size: 1.1rem;
    line-height: 1.3rem;
    font-family: sans-serif;
    white-space: pre-wrap;

}

.tweet_footer {
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
}

.tweet-icon {
    font-family: 'M plus 1P';
    color: var(--cl-text-grey);
    line-height: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.tweet-content {
    padding: 0.5rem 0;
}

.tweet-media {
    max-width: 100%;
    border: 1px solid #FAFAFA;
    margin: 1rem 0;
    padding: 0.5rem;
    border-radius: 0.5rem;
}

.tweet-imgs >>> img {
    width: 100%;
    height: 240px;
    max-height: 240px;
    object-fit: cover;
    background: url('/img/guest/img_placeholder.svg');
    background-size: 40px 40px;
    background-repeat: no-repeat;
    background-position: center;
}

.tweet-imgs.imgs-3 picture:nth-child(1) >>> img {
    width: 50%;
    height: 240px;
    margin-right: 2px;
    float: left;
}

.tweet-imgs.imgs-3 picture:nth-child(2) >>> img {
    width: calc(50% - 2px);
    height: 119px;
}

.tweet-imgs.imgs-3 picture:nth-child(3) >>> img {
    width: calc(50% - 2px);
    height: 120px;
}

.tweet-imgs.imgs-4 >>> img {
    width: calc(50% - 3px);
    height: 120px;
    margin-right: 1px;
}

.tweet-imgs.imgs-5 picture:nth-child(2) >>> img,
.tweet-imgs.imgs-5 picture:nth-child(3) >>> img,
.tweet-imgs.imgs-5 picture:nth-child(4) >>> img,
.tweet-imgs.imgs-5 picture:nth-child(5) >>> img {
    width: calc(50% - 3px);
    height: 120px;
    margin-right: 1px;
}

/* ::::::::   Favorite    ::::::::: */
svg {
  cursor: pointer;
  overflow: visible;
  width: 32px;
}
svg #heart {
  transform-origin: center;
  animation: animateHeartOut 0.3s linear forwards;
}
svg #main-circ {
  transform-origin: 29.5px 29.5px;
}

div.is-favorite svg #heart {
  transform: scale(0.2);
  fill: #E2264D;
  animation: animateHeart 0.3s linear forwards 0.25s;
}
div.is-favorite svg #main-circ {
  transition: all 2s;
  animation: animateCircle 0.3s linear forwards;
  opacity: 1;
}
div.is-favorite svg #grp1 {
  opacity: 1;
  transition: 0.1s all 0.3s;
}
div.is-favorite svg #grp1 #oval1 {
  transform: scale(0) translate(0, -30px);
  transform-origin: 0 0 0;
  transition: 0.5s transform 0.3s;
}
div.is-favorite svg #grp1 #oval2 {
  transform: scale(0) translate(10px, -50px);
  transform-origin: 0 0 0;
  transition: 1.5s transform 0.3s;
}
div.is-favorite svg #grp2 {
  opacity: 1;
  transition: 0.1s all 0.3s;
}
div.is-favorite svg #grp2 #oval1 {
  transform: scale(0) translate(30px, -15px);
  transform-origin: 0 0 0;
  transition: 0.5s transform 0.3s;
}
div.is-favorite svg #grp2 #oval2 {
  transform: scale(0) translate(60px, -15px);
  transform-origin: 0 0 0;
  transition: 1.5s transform 0.3s;
}
div.is-favorite svg #grp3 {
  opacity: 1;
  transition: 0.1s all 0.3s;
}
div.is-favorite svg #grp3 #oval1 {
  transform: scale(0) translate(30px, 0px);
  transform-origin: 0 0 0;
  transition: 0.5s transform 0.3s;
}
div.is-favorite svg #grp3 #oval2 {
  transform: scale(0) translate(60px, 10px);
  transform-origin: 0 0 0;
  transition: 1.5s transform 0.3s;
}
div.is-favorite svg #grp4 {
  opacity: 1;
  transition: 0.1s all 0.3s;
}
div.is-favorite svg #grp4 #oval1 {
  transform: scale(0) translate(30px, 15px);
  transform-origin: 0 0 0;
  transition: 0.5s transform 0.3s;
}
div.is-favorite svg #grp4 #oval2 {
  transform: scale(0) translate(40px, 50px);
  transform-origin: 0 0 0;
  transition: 1.5s transform 0.3s;
}
div.is-favorite svg #grp5 {
  opacity: 1;
  transition: 0.1s all 0.3s;
}
div.is-favorite svg #grp5 #oval1 {
  transform: scale(0) translate(-10px, 20px);
  transform-origin: 0 0 0;
  transition: 0.5s transform 0.3s;
}
div.is-favorite svg #grp5 #oval2 {
  transform: scale(0) translate(-60px, 30px);
  transform-origin: 0 0 0;
  transition: 1.5s transform 0.3s;
}
div.is-favorite svg #grp6 {
  opacity: 1;
  transition: 0.1s all 0.3s;
}
div.is-favorite svg #grp6 #oval1 {
  transform: scale(0) translate(-30px, 0px);
  transform-origin: 0 0 0;
  transition: 0.5s transform 0.3s;
}
div.is-favorite svg #grp6 #oval2 {
  transform: scale(0) translate(-60px, -5px);
  transform-origin: 0 0 0;
  transition: 1.5s transform 0.3s;
}
div.is-favorite svg #grp7 {
  opacity: 1;
  transition: 0.1s all 0.3s;
}
div.is-favorite svg #grp7 #oval1 {
  transform: scale(0) translate(-30px, -15px);
  transform-origin: 0 0 0;
  transition: 0.5s transform 0.3s;
}
div.is-favorite svg #grp7 #oval2 {
  transform: scale(0) translate(-55px, -30px);
  transform-origin: 0 0 0;
  transition: 1.5s transform 0.3s;
}
div.is-favorite svg #grp2 {
  opacity: 1;
  transition: 0.1s opacity 0.3s;
}
div.is-favorite svg #grp3 {
  opacity: 1;
  transition: 0.1s opacity 0.3s;
}
div.is-favorite svg #grp4 {
  opacity: 1;
  transition: 0.1s opacity 0.3s;
}
div.is-favorite svg #grp5 {
  opacity: 1;
  transition: 0.1s opacity 0.3s;
}
div.is-favorite svg #grp6 {
  opacity: 1;
  transition: 0.1s opacity 0.3s;
}
div.is-favorite svg #grp7 {
  opacity: 1;
  transition: 0.1s opacity 0.3s;
}

@keyframes animateCircle {
  40% {
    transform: scale(10);
    opacity: 1;
    fill: #DD4688;
  }
  55% {
    transform: scale(11);
    opacity: 1;
    fill: #D46ABF;
  }
  65% {
    transform: scale(12);
    opacity: 1;
    fill: #CC8EF5;
  }
  75% {
    transform: scale(13);
    opacity: 1;
    fill: transparent;
    stroke: #CC8EF5;
    stroke-width: 0.5;
  }
  85% {
    transform: scale(17);
    opacity: 1;
    fill: transparent;
    stroke: #CC8EF5;
    stroke-width: 0.2;
  }
  95% {
    transform: scale(18);
    opacity: 1;
    fill: transparent;
    stroke: #CC8EF5;
    stroke-width: 0.1;
  }
  100% {
    transform: scale(19);
    opacity: 1;
    fill: transparent;
    stroke: #CC8EF5;
    stroke-width: 0;
  }
}
@keyframes animateHeart {
  0% {
    transform: scale(0.2);
  }
  40% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes animateHeartOut {
  0% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
/* ::::::::::::::::::::::::::::::::: */
</style>
<style>
.tweet-tag-link {
    color: #1DA1F2;
    font-size: 1rem;
    font-weight: normal;
    font-family: sans-serif;
    font-style: italic;
}
.tweet-tag-link:hover {
    cursor: pointer;
}
</style>
