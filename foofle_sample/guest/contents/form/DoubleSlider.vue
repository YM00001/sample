<template>
    <div class="ff-form-doubleslider">
        <p class=""><span :class="{ 'is_text': valueMinMatched }">{{ valueMin }}</span>{{ valueMinMatched ? '' : conf.unit }}</p>
        <div class="">
            <div
                :id="`ds_stick_${conf.name || 'item'}`"
                @click.self="click"
            >
                <i
                    :id="`ds_icon_1_${conf.name || 'item'}`"
                    :class="{ 'is_gripped': ins[0].swipe.is_gripped }"
                    @mousedown.stop="start(0, $event)"
                    @mousemove.stop="move(0, $event)"
                    @mouseup.stop="end(0, $event)"
                    @mouseleave.stop="end(0, $event)"
                ></i>
                <i
                    :id="`ds_icon_2_${conf.name || 'item'}`"
                    :class="{ 'is_gripped': ins[1].swipe.is_gripped }"
                    @mousedown.stop="start(1, $event)"
                    @mousemove.stop="move(1, $event)"
                    @mouseup.stop="end(1, $event)"
                    @mouseleave.stop="end(1, $event)"
                ></i>
                <div
                    :id="`ds_layer_${conf.name || 'item'}`"
                    @click.self="click"
                ></div>
            </div>
        </div>
        <p class=""><span :class="{ 'is_text': valueMaxMatched }">{{ valueMax }}</span>{{ valueMaxMatched ? '' : conf.unit }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ins: [
                {
                    swipe: {
                        el: null,
                        is_gripped: false,
                        grip_x: 0,
                    },
                    icon: {
                        move: 0,
                        tmpmove: 0,
                    },
                },
                {
                    swipe: {
                        el: null,
                        is_gripped: false,
                        grip_x: 0,
                    },
                    icon: {
                        move: 0,
                        tmpmove: 0,
                    },
                }
            ],
        }
    },
    props: [
        'conf'
    ],
    watch: {
        conf: function() {
            this.fetchData();
        },
    },
    mounted: function() {
        this.fetchData();
    },
    computed: {
        stick_el: function() {
            return this.conf ? document.getElementById(`${`ds_stick_${this.conf.name || 'item'}`}`) : null;
        },
        layer_el: function() {
            return this.conf ? document.getElementById(`${`ds_layer_${this.conf.name || 'item'}`}`) : null;
        },
        icon_el: function() {
            return [
                this.conf ? document.getElementById(`${`ds_icon_1_${this.conf.name || 'item'}`}`) : null,
                this.conf ? document.getElementById(`${`ds_icon_2_${this.conf.name || 'item'}`}`) : null,
            ];
        },
        slider: function() {
            let snode = this.stick_el;
            return {
                start: 0,
                end: snode.offsetWidth,
            };
        },
        valueMin: function() {
            let mv = this.ins[0].swipe.is_gripped ? this.ins[0].icon.tmpmove : this.ins[0].icon.move;
            if (mv === 0) {
                return this.conf.display[0] || this.conf.min;
            } else {
                let per = mv / this.slider.end;
                let tmp = (this.conf.max - this.conf.min) * per;
                return tmp - (tmp % this.conf.lot) + this.conf.lot + this.conf.min;
            }
        },
        valueMax: function() {
            let mv = this.ins[1].swipe.is_gripped ? this.ins[1].icon.tmpmove : this.ins[1].icon.move;
            if (mv === 0) {
                return this.conf.min;
            } else if (mv >= this.slider.end) {
                return this.conf.display[1] || this.conf.min;
            } else {
                let per = mv / this.slider.end;
                let tmp = (this.conf.max - this.conf.min) * per;
                return tmp - (tmp % this.conf.lot) + this.conf.lot + this.conf.min;
            }
        },
        valueMinMatched: function() {
            return this.valueMin === this.conf.display[0];
        },
        valueMaxMatched: function() {
            return this.valueMax === this.conf.display[1];
        },
    },
    methods: {
        fetchData: function() {
            if (this.conf) {
                let os = this.stick_el.offsetWidth;
                for (let i = 0; i < 2; i++) {
                    let per = (this.conf.default[i] - this.conf.lot - this.conf.min) / (this.conf.max - this.conf.min);
                    this.ins[i].icon.move = per * os;
                    this.icon_el[i].style.transform = `translate(${per * os}px)`;
                }
                this.layer_el.style.width = `${this.ins[1].icon.move - this.ins[0].icon.move}px`;
                this.layer_el.style.transform = `translate(${this.ins[0].icon.move}px)`;
            }
        },
        checkRange(ind, dist) {
            let point = this.ins[ind].icon.move + dist;
            if (ind === 0) {
                return (0 <= point && point <= this.ins[1].icon.move);
            } else {
                return (this.ins[0].icon.move <= point && point <= this.slider.end);
            }
        },
        end: function(ind, e) {
            if (this.ins[ind].swipe.is_gripped) {
                let dist = (e.screenX || e.changedTouches[0].screenX) - this.ins[ind].swipe.grip_x + this.ins[ind].icon.move;
                dist = dist > 0 ? dist : 0;
                dist = dist <= this.slider.end ? dist : this.slider.end;

                this.ins[ind].icon.move = dist;
                this.layer_el.style.width = `${dist}px`;
                if (ind === 0) {
                    this.layer_el.style.width = `${this.ins[1].icon.move - this.ins[0].icon.move}px`;
                    this.layer_el.style.transform = `translate(${dist}px)`;
                } else {
                    this.layer_el.style.width = `${this.ins[1].icon.move - this.ins[0].icon.move}px`;
                }
                this.ins[ind].swipe.el.style.transform = `translate(${dist}px)`;
                this.ins[ind].swipe.is_gripped = false;
                this.ins[ind].swipe.grip_x = 0;
            }
        },
        start: function(ind, e) {
            this.ins[ind].swipe.el = e.target;
            this.ins[ind].swipe.is_gripped = true;
            this.ins[ind].swipe.grip_x = e.screenX || e.changedTouches[0].screenX;
        },
        move: function(ind, e) {
            if (this.ins[ind].swipe.is_gripped) {
                if (e.type === 'mousemove' && this.checkRange(ind, e.screenX - this.ins[ind].swipe.grip_x)) {
                    let newval = e.screenX - this.ins[ind].swipe.grip_x + this.ins[ind].icon.move;
                    this.ins[ind].icon.tmpmove = newval;
                    this.ins[ind].swipe.el.style.transform = `translate(${newval}px)`;

                    if (ind === 0) {
                        this.layer_el.style.width = `${this.ins[1].icon.move - this.ins[0].icon.tmpmove}px`;
                        this.layer_el.style.transform = `translate(${newval}px)`;
                    } else {
                        this.layer_el.style.width = `${this.ins[1].icon.tmpmove - this.ins[0].icon.move}px`;
                    }

                } else if ( e.type === 'touchmove' &&  e.changedTouches[0].screenX - this.ins[ind].swipe.grip_x >= 0) {
                    this.ins[ind].swipe.el.style.transform = `translate(${e.changedTouches[0].screenX - this.ins[ind].swipe.grip_x}px)`;
                }
            }
        },
        click: function(e) {
            /*
            let dist = (e.screenX || e.changedTouches[0].screenX) - e.target.getBoundingClientRect().left;
            this.icon.move = dist;
            this.icon_el.style.transform = `translate(${dist}px)`;
            this.layer_el.style.width = `${dist}px`;
            */
            let dist = (e.screenX || e.changedTouches[0].screenX) - e.target.getBoundingClientRect().left;
            if (dist < this.ins[0].icon.move) {
                this.ins[0].icon.move = dist;
                this.icon_el[0].style.transform = `translate(${dist}px)`;
                this.layer_el.style.width = `${this.ins[1].icon.move - this.ins[0].icon.move}px`;
                this.layer_el.style.transform = `translate(${dist}px)`;
            } else if (dist > this.ins[1].icon.move ) {
                this.ins[1].icon.move = dist;
                this.icon_el[1].style.transform = `translate(${dist}px)`;
                this.layer_el.style.width = `${this.ins[1].icon.move - this.ins[0].icon.move}px`;
            }
        },
        getValue: function() {
            /*
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
            */
            return {
                min: this.valueMin === this.conf.display[0] ? this.conf.min : this.valueMin,
                max: this.valueMax === this.conf.display[1] ? this.conf.max : this.valueMax,
            };
        },
    },
}
</script>

<style scoped>

.ff-form-doubleslider {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

.ff-form-doubleslider > p {
    width: 20%;
    font-size: 1rem !important;
    text-align: center
}

.ff-form-doubleslider > p > span {
    font-size: 1.4rem;
}

.ff-form-doubleslider > p > span.is_text {
    font-size: 1rem;
}

.ff-form-doubleslider > div {
    width: 65%;
    padding: 1rem 0;
    display: flex;
    justify-content: center;
}

.ff-form-doubleslider > div > div {
    width: calc(100% - 1.5rem);
    height: 6px;
    border-radius: 1rem;
    background-color: #FFF;
    border: 1px solid #00000044;
    position: relative;

}

.ff-form-doubleslider > div > div > div {
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

.ff-form-doubleslider > div > div > i {
    cursor: pointer;
    width: 1.4rem;
    height: 2rem;
    border-radius: 1.8rem;
    background-color: var(--cl-pink);
    box-shadow: var(--mbs-level1);
    position: absolute;
    top: -0.8rem;
    left: -0.9rem;
    z-index: 2;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.ff-form-doubleslider > div > div > i:nth-child(2) {
    top: -0.8rem;
    left: -0.9rem;
    transform: translate(30px);
}

.ff-form-doubleslider > div > div > i.is_gripped {
    box-shadow: var(--mbs-level2);
}
</style>
