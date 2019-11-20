<template>
    <div class="ff-tweet-list">
        <div class="tweet-thumnail">
            <img src="/img/guest/guest_default.png" alt="">
        </div>
        <div class="tweet-body">
            <div class="tweet-header">
                <span class="header-name">{{ review.guest_name }}</span> <span class="header-name"></span><span class="header-date">{{ getDisplayOnTweet(review.created) }}</span>
            </div>
            <div class="tweet-meta">
                <router-link :to="`/${review.cast_id}`" class="mention">@{{ review.cast_name }}</router-link>
                <Star :value="review.star"></Star>
            </div>
            <div class="tweet-content">
                <p>{{ review.comment }}</p>
            </div>
            <div class="tweet_footer">
                <div class="tweet-icon"
                    :class="{ 'is-favorite': is_favorite }"
                    @click="favorite(review.id)"
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
                    <span>{{ is_manual_favorite ? review.favorite + 1 : review.favorite }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import timeHelper from '../../../mixin/timeHelper.js';
import getTweet from '../../../mixin/getTweet.js';
import Star from './Star.vue';

export default {
    data() {
        return {
            is_manual_favorite: false,
        }
    },
    props: [
        'review',
    ],
    computed: {
        is_favorite: function() {
            if (this.review && this.review.hasOwnProperty('is_favorite') && this.review.is_favorite
                || this.is_manual_favorite) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        favorite: function(review_id) {
            let st = window.localStorage || null;
            let user = firebase.auth().currentUser;
            if (!this.is_favorite) {
                if (user) {
                    firebase.firestore().collection('guest').doc(user.uid).collection('favorite_review').doc(review_id)
                    .set({
                        id: review_id,
                        timestamp: this.getNow(),
                    });
                }
                this.setReviewFavorite(review_id);
                this.is_manual_favorite = true;
            }
        },
    },
    mixins: [
        timeHelper, getTweet,
    ],
    components: {
        Star,
    },
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

.tweet-thumnail img {
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
}

.header-id {
    max-width: 100%;
    padding-right: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--cl-text-grey);
    font-family: sans-serif;
}

.header-date {
    max-width: 100%;
    padding-right: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--cl-text-grey);
}

.tweet-body {
    width: 100%
}

.tweet-meta {
    padding: 0.3rem 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;

}

.tweet-meta a.mention {
    font-size: 1rem;
    font-family: sans-serif;
    color: #1DA1F2;
    margin-right: 1rem;
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
