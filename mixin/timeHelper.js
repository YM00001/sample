let p = i => ('00' + i).slice(-2);

export default {
    methods: {
        getNow: function() {
            let d = new Date();
            return Math.floor(new Date().getTime() / 1000);
        },
        getDisplay: function(timestamp, format = '') {
            timestamp = timestamp || this.getNow();
            let d = new Date(timestamp * 1000);
            let day = ['日','月','火','水','木','金','土',];
            /*
            display: `${d.getMonth() + 1}/${d.getDate()} (${day[d.getDay()]})`;
            date: `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`;
            */
            let ans;
            let mn = d.getHours() < 6;
            switch(format) {
                case 'm/d':
                    ans =  `${d.getMonth() + 1}/${d.getDate()}`;
                    break;
                case 'm/d-d':
                    ans =  `${d.getMonth() + 1}/${d.getDate()} (${day[d.getDay()]})`;
                    break;
                case '8digit':
                    ans = `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
                    break;
                case '年月日':
                    ans = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
                    break;
                case '4digit':
                    ans = mn ? `${p(d.getHours() + 6)}${p(d.getMinutes())}` : `${p(d.getHours())}${p(d.getMinutes())}`;
                    break;
                case 'HH:MM':
                    ans = `${d.getHours()}:${p(d.getMinutes())}`;console.log(d.getTime());
                    break;
                case 'a':
                    break;
            }
            return ans;
        },
        getDisplayOnTweet: function(timestamp) {
            // seconds, minutes, hours, days, weeks, month, date
            let now = this.getNow();
            if (!timestamp) { return now }
            let minus = now - timestamp;
            if (minus < 60) {
                return `${minus}秒`;
            } else if (minus < (60 * 60)) {
                return `${Math.ceil(minus / 60)}分`;
            } else if (minus < (60 * 60 * 24)) {
                return `${Math.ceil(minus / 60 / 60)}時間`;
            } else if (minus < (60 * 60 * 24 * 7)) {
                return `${Math.ceil(minus / 60 / 60 / 24)}日`;
            } else if (minus < (60 * 60 * 24 * 30)) {
                return `${Math.ceil(minus / 60 / 60 / 24 / 7)}週間`;
            } else if (minus < (60 * 60 * 24 * 365)) {
                return `${Math.ceil(minus / 60 / 60 / 24 / 30)}か月`;
            } else {
                return this.getDisplay(timestamp, '年月日');
            }
        },
        digitToTimestamp: function(digit) {
            if (digit.length === 4) {
                let hours = digit.slice(0, 2);
                let date = 1;
                if (hours > 23) {
                    hours -= 24;
                    date++;
                }
                let mins = digit.slice(-2);
                let d = new Date(`${('00'+date).slice(-2)} Jan 2019 ${hours}:${mins}:00 UTC`);
                return Math.floor(d.getTime() / 1000);
            } else if (digit.length === 8) {
                let years = digit.slice(0, 4);
                let month = digit.slice(5, 2);
                let date = digit.slice(-2);
                let d = new Date(`${date} ${month} ${years}`);
                return Math.floor(d.getTime() / 1000);
            }
        },
        calcDuration: function(a_4digit, b_4digit) {
            let minus = this.digitToTimestamp(a_4digit) - this.digitToTimestamp(b_4digit);
            minus *= minus < 0 ? -1 : 1;
            return minus / 60 / 60;
        },
    },
}
