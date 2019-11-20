<template>
    <div class="ffc-fix-pin">
        <input id="el0" type="number" v-model="bit[0]" @keyup="next" @keydown="bs">
        <input id="el1" type="number" v-model="bit[1]" @focus="focus" @keyup="next" @keydown="bs">
        <input id="el2" type="number" v-model="bit[2]" @focus="focus" @keyup="next" @keydown="bs">
        <input id="el3" type="number" v-model="bit[3]" @focus="focus" @keyup="commit" @keydown="bs">
    </div>
</template>

<script>
import axios from 'umbrellajs';
export default {
    data() {
        return {
            bit: ['', '', '', ''],
        }
    },
    computed: {
        digit: function() {
            return `${this.bit[0]}${this.bit[1]}${this.bit[2]}${this.bit[3]}`;
        },
        checkDigit: function() {
            return this.digit.length === 4 && this.bit.filter((item) => item).length === 4;
        },
    },
    methods: {
        focus: function(e) {
            let el = e.target;
            if (!el.previousElementSibling.value) {
                el.previousElementSibling.focus();
            }
        },
        next: function(e) {
            let el = e.target;
            let reg = /(\d{1})/;
            if (reg.test(e.key)) {
                el.nextElementSibling.focus();
            }
        },
        bs: function(e) {
            let el = e.target;
            let ind = el.id.match(/(\d)/)[1];
            if (e.key === 'Backspace') {
               if (this.bit[ind]) {
                   this.bit[ind] = '';
               } else {
                   if (el.previousElementSibling) {
                       el.previousElementSibling.focus();
                   }
               }
           }
       },
       commit: function(e) {
           if (!this.checkDigit) {
               this.bit.forEach((val) => val = '');
           }
           e.target.blur();
           this.$emit('enteredPin', this.digit);
       },
       clearPin: function() {
           this.bit = ['', '', '', ''];
       },
    },
}
</script>

<style scoped>

/* Pin scoped */
.ffc-fix-pin {
    padding: 2rem 0 1rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
}

.ffc-fix-pin input[type='number'] {
    font-size: 4rem;
    font-weight: 500;
    line-height: 4rem;
    width: 4rem;
    height: 4.5rem;
    margin: 0 0.4rem;
    border: none;
    border-bottom: 3px solid var(--cl-blue);
    border-radius: 0;
    background-color: transparent;
    text-align: center;
}

.ffc-fix-pin input[type='number']:focus {
    outline: none;
}
</style>
