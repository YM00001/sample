export default {
    methods: {
        currency: function(value) {
            if (value) {
                value = value-0;
                return value.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
            } else {
                return '￥0';
            }
        },
        percentage: function(value) {
            if (value) {
                return `${value * 100}%`;
            } else {
                return '';
            }
        },
        star: function(value) {
            if (value % 1 === 0) {
                return `${value}.0`;
            } else {
                return value;
            }
        },
    },
}
