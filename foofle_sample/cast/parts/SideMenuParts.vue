<template>
    <div class="wrapper">
        <div class="screen" v-if="is_open"
            @click="close"
        ></div>
        <transition name="slide">
            <div class="nav-wrapper" v-if="cast && is_open">
                <ul class="account">
                    <template>
                        <li @click="toggleAccount">
                            <WebImage
                                :src="cast.profile.img"
                            ></WebImage>
                            <span>{{ cast.profile.name }}</span>
                            <fa class="angle"
                                v-if="!this.is_account_open"
                                :icon="['fas', 'angle-down']"
                            ></fa>
                            <fa class="angle" v-else
                                :icon="['fas', 'angle-up']"
                            ></fa>
                        </li>
                    </template>

                </ul>
                <ul class="nav">
                    <li><router-link to="/cast/config/profile">プロフィール設定</router-link></li>
                    <li><router-link to="">設定</router-link></li>
                    <li class="can-click" @click="signout">サインアウト</li>
                </ul>
            </div>
        </transition>
        <fa class="close" :icon="['fas', 'times']" :style="{ color: 'white' }" fixed-width @click="close" v-if="is_open"></fa>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            is_open: false,
            is_account_open: false,
        }
    },
    props: [
        'cast',
    ],
    mounted: function() {
        this.$eventHub.$on('openSideMenu', () => {
            this.is_open = true;
        });
    },
    methods: {
        close: function() {
            this.is_open = false;
        },
        toggleAccount: function() {
            if (this.is_account_open) {
                this.is_account_open = false;
            } else {
                this.is_account_open = true;
            }
        },
        signout: function() {
            axios({
                method: 'get',
                url: '/api/cast/signout',
            }).then((res) => {
                if (res.data === 'Flush') {
                    window.location = '/cast/account/login';
                }
            }).catch((error) => {
                console.log(error);
            });
        },
    },
}
</script>

<style scoped>
.wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: -100vw;
    z-index: 20;
}

.screen {
    width: 100vh;
    height: 100vh;
    background-color: #00000077;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 21;
}

.nav-wrapper {
    width: 65vw;
    height: 100vh;
    background-color: var(--cl-grey);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 22;
    box-shadow: 4px 0px 11px 0px #00000099;
}

.close {
    position: fixed;
    width: 2rem;
    height: 2rem;
    top: 1rem;
    right: 1rem;
    z-index: 22;
}

.account {
    margin-bottom: 1rem;
}

.account > li {
    width: 100%;
    display: flex;
    padding: 1rem 1rem;
    margin-top: -1px;
    align-items: center;
    border-style: solid;
    border-color: var(--cl-border-light);
    border-width: 1px 0;
    position: relative;
    background-color: #FFF;
}

.account > li >>> img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 2.5rem;
}

.account > li > span {
    display: block;
    margin-left: 1rem;
}

.angle {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}

.nav > li {
    width: 100%;
    padding: 0.7rem 2rem;
    margin-top: -1px;
    border-style: solid;
    border-color: var(--cl-border-light);
    border-width: 1px 0;
    position: relative;
    background-color: #FFF;
}

.nav > li > a {
    width: 100%;
    height: 100%;
}

.slide-enter-active {
  animation: slide .5s;
}

.slide-leave-active {
  animation: slide .5s reverse;
}

@keyframes slide {
  0% {
    transform: translateX(-65vw);
  }
  100% {
    transform: translateX(0);
  }
}

.can-click:hover {
    cursor: pointer;
}

</style>
