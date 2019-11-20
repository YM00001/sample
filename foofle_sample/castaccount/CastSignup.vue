<template>
    <div class="ffc-wrapper ffc-signup-wrapper">
        <h1 class="ffc-ribbon">アカウント無料作成</h1>
        <span>名前・生年月日他このページでご入力頂く情報は、<br />アカウントの管理のためにのみ使用し、一切公開されません。</span>
        <form>
            <div class="ffc-block">
                <h3>お名前(本名・漢字)</h3>
                <input class="input" type="text" placeholder="佐藤 愛子" required
                    v-model="signup.name"
                >
            </div>
            <div class="ffc-block">
                <h3>お名前(本名・英語)</h3>
                <input class="input" type="text" placeholder="Aiko Sato" required
                    v-model="signup.name_en"
                >
            </div>
            <div class="ffc-block">
                <h3>生年月日</h3>
                <input class="input" type="date"
                    v-model="signup.birthday"
                >
            </div>
            <div class="ffc-block ffc-jc-around ffc-ribbon-minus">
                <h3>性別</h3>
                <div class="ffc-radio-btn">
                    <input id="female" type="radio" name="gender" value="1" required
                        v-model="signup.gender"
                    >
                    <label for="female">女性</label>
                </div>
                <div class="ffc-radio-btn">
                    <input id="male" type="radio" name="gender" value="2" required disabled
                        v-model="signup.gender"
                    >
                    <label for="male">男性</label>
                </div>
            </div>
            <div class="ffc-block">
                <h3>メールアドレス</h3>
                <input class="input is-fullwidth" type="text" readonly required
                    v-model="signup.email_modified"
                >
            </div>
            <div class="ffc-block">
                <h3>電話番号</h3>
                <input class="input is-fullwidth" type="phone" placeholder="09012345678" required
                    v-model="signup.number"
                >
            </div>
            <div class="ffc-block">
                <h3>パスワード</h3>
                <input class="input is-fullwidth" type="password" requierd
                    v-model="signup.password"
                    :class="{ 'is-danger' : signup.password_invalid_length }"
                    @keyup="validPasswordLength"
                >
                <p class="signup-validation">パスワードは8文字以上で入力してください。</p>
            </div>
            <div class="ffc-block">
                <label>確認のためもう一度入力してください。</label>
                <input class="input" type="password" required
                    v-model="signup.password_confirm"
                    :class="{ 'is-danger' : signup.password_invalid_match }"
                    @keyup="validPasswordMatch"
                >
                <p class="signup-validation">パスワードが一致しません。</p>
            </div>
            <div class="ffc-signup-terms-wrap">
                <h2 class="ffc-ribbon">利用規約</h2>
                <div class="ffc-signup-terms">
                      【 広告掲載基準 】
                  ■掲載可能な店舗・法人
                  (性)風俗営業店の場合、適切な(性)風俗営業開始届出を提出している店舗、もしくは法人であること。
                  また、各種諸法規及び公序良俗に抵触しないと判断された店舗・法人のみとします。
                  ■掲載不可な店舗・法人
                  上記の「掲載可能な店舗・法人」の条件に反すると判断された店舗・法人。
                  ×適切な(性)風俗営業開始届出を提出していない店舗・法人×従業員に売春を斡旋している店舗・法人×未成年の雇用を容認・黙認している店舗・法人×外国人を雇用している店舗・法人×暴利・暴力店と思われる店舗・法人×スカウト会社及びスカウトマンと思われる店舗・法人×その他諸法及び公序良俗に抵触する店舗・法人×媒体の広告掲載規定に従わない店舗・法人×女性ユーザーからクレームが多数ある店舗・法人×媒体側でダミー店と判断された店舗・法人×営業実態が明確でない店舗・法人×有料営業広告への掲載がない店舗・法人
                  ※掲載期間中であっても上記に抵触する場合、掲載を中止させて頂きます。

                  ■アダルトグッズモニターの取り扱いについて
                  アダルトグッズモニター、及び類似する業種に関しては、法人・個人を問わず掲載を不可とします。
                  ■出会い喫茶（カフェ）の取り扱いについて
                  出会い喫茶（カフェ）に関しては、法人・個人を問わず掲載を不可とします。
                  ■交際クラブの取り扱いについて
                  交際クラブに関しては、法人・個人を問わず掲載を不可とします。
                  【 各業種の取り扱いについて 】
                  ■各業種の取り扱いについて
                  掲載に関しては有料営業広告への掲載が必須となります。
                  有料営業広告への掲載がない場合、どの業種でも掲載は不可となります。（新店を除く）
                  掲載につきましては審査があります。
                  審査結果によっては掲載不可となりますのであらかじめご了承ください。
                  ■エステの取り扱いについて
                  風俗営業の届出のないエステ店の掲載に関しては下記の書類が必要となります。
                  ・法人の場合…「会社登記簿謄本」の写しと誓約書　・個人の場合…「代表者の身分証」の写しと誓約書
                  ■ライブチャットの取り扱いについて
                  ライブチャットの掲載に関しては下記の書類が必要となります。
                  ・法人の場合…「映像送信型性風俗特殊営業」の届出の写し、「会社登記簿謄本」の写しと誓約書
                  ・個人の場合…「映像送信型性風俗特殊営業」の届出の写し「代表者の身分証」の写しと誓約書
                  ■テレフォンレディーの取り扱いについて
                  テレフォンレディーの掲載に関しては下記の書類が必要となります。
                  ・法人の場合…「無店舗型電話異性紹介営業」の届出の写し、「会社登記簿謄本」の写しと誓約書
                  ・個人の場合…「無店舗型電話異性紹介営業」の届出の写し「代表者の身分証」の写しと誓約書
                  ■プロダクションの取り扱いについて
                  プロダクションの掲載に関しては下記の書類が必要となります。
                  ・法人の場合…「会社登記簿謄本」の写しと誓約書
                  ・個人の場合…「代表者の身分証」の写しと誓約書
                  ※スカウト会社及びスカウトマンと思われるプロダクションは掲載を不可とします。
                  ■オナクラ・ハンドサービスの取り扱いについて
                  ・オナクラ・ハンドサービスの掲載に関しては、有料営業広告媒体の出稿状況をみて、審査させて頂きます。
                  　原則として、最低５媒体以上の有料営業広告の掲載及びオナクラの明記があることが必須となります。
                  ・オナクラ・ハンドサービスは、他業種での掲載を不可とします。
                  ・サイト内で営業ホームページ（男性向け）の開示を必須とします。
                  ・媒体側でダミー店と判断された場合、掲載期間中であっても掲載を中止させて頂きます。
                  【 広告表記に関する広告規定 】
                  ■給与・給与保証の表記について
                  給与・給与保証表記の金額上限を設けませんが、条件等の詳細な表記がなく非現実的な金額や女性ユーザーのクレーム等による虚偽表現の可能性のある場合は掲載期間中であっても掲載を中止させて頂く場合があります。
                  掲載開始前および掲載中の店舗様で虚偽表現の可能性のある場合は審査を実施させていただきテキスト・バナーの修正をお願いすることがありますのでご協力をお願い致します。
                  ■面接交通費、入店祝い金、給与保証の表記について
                  面接交通費、入店祝い金、給与保証の表記については女性がもらえる具体的な条件等を明確に表記してください。
                  条件等の表記がなく、非現実的な金額や女性ユーザーのクレーム等による虚偽表現の可能性のある場合は掲載期間中であっても掲載を中止させて頂く場合があります。
                  ■業種の表記について
                  メインサービスと異なる業種の表記・登録は原則不可とします。
                  ■掲載店名の表記について
                  ・原則、実際に営業している店名及び、グループ名のみ表記可能です。
                  ・店名に地名や業種名を付加する事は可能です。
                  ・実際には営業していない募集店名の表記は不可とします。
                  ■アダルトグッズモニターの取り扱いについて
                  アダルトグッズモニター、及び類似する業種に関しては、法人・個人
                  を問わず掲載を不可とします。
                  ■オナクラ・ハンドサービスの広告表記に関して
                  ・「お話するだけ」という表記は一切不可とします。
                  ・「見るだけ」のみの表記は不可とします。必ず「ハンドサービスがある」旨を表記してください。
                  ■使用禁止ワードについて
                  「ロリ(LOLI/ろり)」を含む類似文言に関しましては使用禁止とさせていただきます。
                  ※ユーザーページ上で類似文言の記載が有る場合も都度弊社にて修正または削除致します。
                  【 禁止事項 】
                  ■当サイトの運営を妨げる行為、著作権等の権利を侵害する行為
                  ■当サイトの運営を妨げる行為、 不利益などの損害を与える行為
                  ■公序良俗に反する行為もしくはそのおそれのある行為
                  ■犯罪的行為もしくは犯罪的行為に結びつく行為、またはそのおそれのある行為
                  ■アダルト的なものにあたる画像をアップロードする行為
                  ■面接した女の子を他店へ紹介する行為や、同じグループ内の店舗でまわしあう行為
                  【 各料金プランの広告規定と取り扱いについて 】
                  ■スタンダードプランでのグループ名での広告掲載は不可とします。
                  グループ名での掲載はエリアバナープラン以上のプランとなります。
                  ※「○○グループ△△店」等の表記はスタンダードプランでも表記可能です。
              </div>
              <div class="ffc-signup-terms-agree">
                  <input id="terms_agree" class="ffc-check-circle" type="checkbox"
                    v-model="signup.agreement"
                  >
                  <label for="terms_agree">利用規約に同意する</label>
              </div>
          </div>
          <div class="ffc-btn-wrap"
            :class="{ 'passive' : is_loading }"
          >
              <button type="submit"
                @click="submitData"
              >アカウント作成</button>
          </div>
      </form>
      <Loading v-if="is_loading"></Loading>
    </div>
</template>

<script>
import axios from 'axios';
import Loading from '../cast/parts/Loading.vue';

export default {
    data() {
        return {
            signup: {
                name: '',
                name_en: '',
                birthday: '',
                gender: 1,
                number: '',
                agreement: false,
                email_modified: '',
                password: '',
                password_confirm: '',
                password_invalid_length: false,
                password_invalid_match: false,
                token: this.$route.params.token,
            },
            is_loading: false,
        }
    },
    computed: {
        birthday_serial: function() {
            return Date.parse(this.signup.birthday) / 1000;
        },
        checkForm: function () {
            let flg = true;
            let ref = this.signup;

            if (!ref.name || !ref.name_en || !ref.birthday || !ref.gender || !ref.number || !ref.agreement
                || ref.password_invalid_length || ref.password_invalid_match) {
                flg = false;
            }
            return flg;
        },
    },
    created: function() {
        this.checkToken();
    },
    methods: {
        checkToken: function() {
            let self = this;
            axios({
                url: '/api/cast/emailauth',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: { token: this.$route.params.token },
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data.msg !== 'Confirm') {
                    self.$router.replace('/cast/account/login');
                } else {
                    self.allow = true;
                    self.signup.email_modified = response.data.email;
                }
            })
            .catch(function (error) {
                self.$router.replace('/cast/account/login');
            });
        },
        validPasswordLength: function() {
            this.signup.password_invalid_length = !(this.signup.password.length > 7);
            return this.signup.password.length > 7;
        },
        validPasswordMatch: function() {
            this.signup.password_invalid_match = !(this.signup.password === this.signup.password_confirm);
            return this.signup.password === this.signup.password_confirm;
        },
        submitData: function(e) {
            e.preventDefault();
            this.loading = true;

            let flg = false;
            let self = this;
            if (this.checkForm) {
                // Valid
                axios({
                    url: '/api/cast/signup',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: this.signup,
                })
                .then(function (response) {
                    if (response.status === 200) {
                        self.$router.push('/cast/account/login?signup=1');
                        console.log('success');
                    }
                    self.loading = false;
                })
                .catch(function (error) {
                    self.loading = false;
                });
            } else {
                this.loading = false;
            }
        },
    },
    components: {
        Loading,
    },
}
</script>

<style scoped>
.ffc-signup-wrapper {
    padding-bottom: 5rem;
}

.ffc-signup-wrapper input:not(.ffc-input-short) {
    width: 100%;
}

.ffc-signup-terms-wrap {
    margin-top: 2rem;
}

.ffc-signup-terms {
    width: calc(100% - 2rem);
    height: 60vh;
    margin: 0 1rem;
    padding: 1rem;
    overflow-y: scroll;
    border: 1px solid var(--cl-border-light);
    background-color: #FFF;
}

.ffc-signup-terms-agree {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;
}

.ffc-signup-wrapper > span {
    display: block;
    width: 100%;
    text-align: center;
    margin: 2rem 0;
}

input::placeholder {
    color: var(--cl-pink);
    opacity: 0.5;
}

.signup-validation {
    display: none;
}

.is-danger ~ .signup-validation {
    color: #ff3860;
    display: block;
}

.passive > button {
    background: unset;
    background-color: var(--cl-grey);
}

</style>
