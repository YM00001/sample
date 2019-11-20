<template>
    <div class="ff-form-singleslider">
        <p class=""><span :class="{ 'is_text': valueMatched }">{{ value }}</span>{{ valueMatched ? '' : conf.unit }}</p>
        <div>
            <div :id="`ss_stick_${conf.name || 'item'}`"
                @click.self="click"
            >
                <i
                    :id="`ss_icon_${conf.name || 'item'}`"
                    :class="{ 'is_gripped': swipe.is_gripped }"
                    @mousedown.stop="start"
                    @mousemove.stop="move"
                    @mouseup.stop="end"
                    @mouseleave.stop="end"
                ></i>
                <div
                    :id="`ss_layer_${conf.name || 'item'}`"
                    @click.self="click"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
/* Dependences Vte(need Global Load) */
import u from 'umbrellajs';

export default {
    data() {
        return {
            swipe: {
                el: null,
                is_gripped: false,
                grip_x: 0,
            },
            icon: {
                move: 0,
                tmpmove: 0,
            },
            value_tmp: null,
        }
    },
    props: [
        'conf'
    ],
    mounted: function() {
        this.fetchData();
    },
    computed: {
        stick_el: function() {
            return this.conf ? document.getElementById(`${`ss_stick_${this.conf.name || 'item'}`}`) : null;
        },
        layer_el: function() {
            return this.conf ? document.getElementById(`${`ss_layer_${this.conf.name || 'item'}`}`) : null;
        },
        icon_el: function() {
            return this.conf ? document.getElementById(`${`ss_icon_${this.conf.name || 'item'}`}`) : null;
        },
        slider: function() {
            let snode = this.stick_el;
            return {
                start: 0,
                end: snode.offsetWidth,
            };
        },
        value: function() {
            let res;
            let mv = this.swipe.is_gripped ? this.icon.tmpmove : this.icon.move;
            if (mv === 0) {
                res = this.conf.min;
            } else if (mv >= this.slider.end) {
                res = this.conf.display[1] || this.conf.max;
            } else {
                let per = mv / this.slider.end;
                let tmp = (this.conf.max - this.conf.min) * per;
                res = tmp - (tmp % this.conf.lot) + this.conf.lot + this.conf.min;
            }
            if (this.value_tmp !== res) {
                this.$emit('change', res);
            }
            this.value_tmp = res;
            return res;
        },
        valueMatched: function() {
            return this.value === this.conf.display[1];
        },
    },
    methods: {
        fetchData: function() {
            if (this.conf.default) {
                let per = (this.conf.default  - this.conf.lot - this.conf.min) / (this.conf.max - this.conf.min);
                let os = this.stick_el.offsetWidth;
                this.icon.move = per * os;
                this.layer_el.style.width = `${per * os}px`;
                this.icon_el.style.transform = `translate(${per * os}px)`;
            }
        },
        checkRange: function(dist) {
            let point = this.icon.move + dist;
            return (0 <= point && point <= this.slider.end);
        },
        end: function(e) {
            if (this.swipe.is_gripped) {
                let dist = (e.screenX || e.changedTouches[0].screenX) - this.swipe.grip_x + this.icon.move;
                dist = dist > 0 ? dist : 0;
                dist = dist <= this.slider.end ? dist : this.slider.end;

                this.icon.move = dist;
                this.layer_el.style.width = `${dist}px`;
                this.swipe.el.style.transform = `translate(${dist}px)`;
                this.swipe.is_gripped = false;
                this.swipe.grip_x = 0;
            }
        },
        start: function(e) {
            this.swipe.el = e.target;
            this.swipe.is_gripped = true;
            this.swipe.grip_x = e.screenX || e.changedTouches[0].screenX;
        },
        move: function(e) {
            if (this.swipe.is_gripped) {
                if (e.type === 'mousemove' && this.checkRange(e.screenX - this.swipe.grip_x)) {
                    let newval = e.screenX - this.swipe.grip_x + this.icon.move;
                    this.icon.tmpmove = newval;
                    this.swipe.el.style.transform = `translate(${newval}px)`;
                    this.layer_el.style.width = `${newval}px`;
                } else if ( e.type === 'touchmove' &&  e.changedTouches[0].screenX - this.swipe.grip_x >= 0) {
                    this.swipe.el.style.transform = `translate(${e.changedTouches[0].screenX - this.swipe.grip_x}px)`;
                }
            }
        },
        click: function(e) {
            let dist = (e.screenX || e.changedTouches[0].screenX) - e.target.getBoundingClientRect().left;
            dist = Math.floor(dist * 10) / 10;
            this.icon.move = dist;
            this.icon_el.style.transform = `translate(${dist}px)`;
            this.layer_el.style.width = `${dist}px`;
        },
        getValue: function() {
            let mv = this.swipe.is_gripped ? this.icon.tmpmove : this.icon.move;
            if (mv === 0) {
                return this.conf.min;
            } else if (mv >= this.slider.end) {
                return this.conf.display[1] || this.conf.max;
            } else {
                let per = mv / this.slider.end;
                let tmp = (this.conf.max - this.conf.min) * per;
                return tmp - (tmp % this.conf.lot) + this.conf.lot + this.conf.min;
            }
        },
    },
}
</script>

<style scoped>

.ff-form-singleslider {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

.ff-form-singleslider > p {
    font-size: 1rem !important;
    width: 30%;
    order: 2;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.ff-form-singleslider > p > span {
    font-size: 1.4rem;
}

.ff-form-singleslider > p > span.is_text {
    font-size: 1rem;
}

.ff-form-singleslider > div {
    width: 70%;
    order: 1;
    padding: 1rem 0;
    display: flex;
    justify-content: center;
}

.ff-form-singleslider > div > div {
    width: calc(100% - 2rem);
    height: 6px;
    border-radius: 1rem;
    background-color: #FFF;
    border: 1px solid #00000044;
    position: relative;
}

.ff-form-singleslider > div > div > div {
    width: 0;
    height: 6px;
    border-radius: 1rem;
    background-color: var(--cl-pink);
    border: 1px solid #00000044;
    opacity: 0.5;
    position: absolute;
    top: -1px;
    left: 0;
    z-index: 1;
}

.ff-form-singleslider > div > div > i {
    cursor: pointer;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 1.8rem;
    background-color: var(--cl-pink);
    box-shadow: var(--mbs-level1);
    position: absolute;
    top: -0.75rem;
    left: -0.9rem;
    z-index: 2;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.ff-form-singleslider > div > div > i.is_gripped {
    box-shadow: var(--mbs-level2);
}
</style>
