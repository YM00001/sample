import u from 'umbrellajs';

let toggleMessage = (() => {
    let msg = function(msg) {
        return `<p class="validjs_error" style="color:var(--cl-red);">${msg}</p>`;
    }
    return (e, flag, text) => {
        let el = u(e.target).parent().children('.validjs_error');
        if (flag) {
            if (el.length) {
                el.each((node) => {
                    node.remove();
                });
            }
        } else {
            if (!el.length) {
                u(e.target).parent().append(msg(text));
            }
        }
        return flag;
    }
})();

export default {
    methods: {
        checkEmail: (e) => {
            let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let flag = reg.test(e.target.value);
            return toggleMessage(e, flag, 'メールアドレスの形式が正しくありません。');
        },
        checkTime: (e) => {
            let reg = /^[0-9]{4}$/;
            let flag = reg.test(e.target.value);
            return toggleMessage(e, flag, '半角数字4桁で入力してください。<0000～3600>');
        },
        checkNumber: (e) => {
            let reg = /^[0-9]*$/;
            let flag = reg.test(e.target.value);
            return toggleMessage(e, flag, '半角数字で入力してください。');
        },

    },
}
