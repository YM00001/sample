<template>
    <div class="ffa-signup ffa-container">
        <div class="ffa-signup-wrapper">
            <h1>パートナー店舗様無料アカウント作成</h1>
            <form>
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>店舗情報入力</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                          <th>店舗名</th>
                          <td>
                              <input class="input" type="text" name="name" v-model="signup.name" required/>
                          </td>
                        </tr>
                        <tr>
                          <th>サービスカテゴリ</th>
                          <td>
                              <div class="select is-rounded">
                                  <select name="category" v-model="signup.service_category" required>
                                      <option disabled value="0">選択してください</option>
                                      <option v-for="(item, ind) in master.service_category"
                                        :value="item.id">
                                          {{ item.name }}
                                      </option>
                                  </select>
                              </div>
                          </td>
                        </tr>
                        <tr>
                          <th>サービスジャンル</th>
                          <td>
                              <div class="select is-rounded">
                                  <select name="genre" v-model="signup.service_genre" required>
                                      <option disabled value="0">選択してください</option>
                                      <template v-for="(item, ind) in master.service_genre">
                                          <option
                                              v-if="item.category_id === signup.service_category"
                                              :value="item.id">
                                              {{ item.name }}
                                          </option>
                                      </template>
                                  </select>
                              </div>
                          </td>
                        </tr>
                        <tr>
                          <th>主要出発エリア</th>
                          <td>
                              <div class="td-inner">
                                  <label>都道府県</label>
                                  <div class="select is-rounded">
                                      <select name="area" v-model="signup.state" required
                                            @change="getAreaInfo"
                                      >
                                          <option disabled value="0">選択してください</option>
                                          <option v-for="(item, ind) in master.state"
                                            v-if="item.is_launched"
                                            :value="item.name">
                                              {{ item.name }}
                                          </option>
                                      </select>
                                  </div>
                              </div>
                              <div class="td-inner">
                                  <label>エリア</label>
                                  <div class="select is-rounded">
                                      <select name="area" v-model="area_index" required>
                                          <option disabled value="0">{{ signup.state ? (area_loading ? '読み込み中' : '選択してください') : '都道府県を選択してください' }}</option>
                                          <template v-for="(item, ind) in master.area">
                                              <option
                                                v-if="item.is_special && item.state === signup.state"
                                                :value="ind">
                                                  {{ item.name }}
                                              </option>
                                          </template>
                                          <option value="others"
                                            v-if="master.area.length"
                                          >その他</option>
                                      </select>
                                  </div>
                              </div>
                              <div class="td-inner"
                                v-if="area_index === 'others'"
                              >
                                  <label>小エリア</label>
                                  <div class="select is-rounded">
                                      <select name="area" v-model="smallarea_index">
                                          <option disabled value="0">選択してください</option>
                                          <template v-for="(item, ind) in master.area">
                                              <option
                                                v-if="!item.is_special && item.state === signup.state"
                                                :value="ind">
                                                  {{ item.name }}
                                              </option>
                                          </template>
                                      </select>
                                  </div>
                              </div>
                          </td>
                        </tr>
                        <tr>
                          <th>お客様向け電話番号</th>
                          <td><input class="input" type="tel" name="phone" v-model="signup.phone" required/></td>
                        </tr>
                        <tr>
                          <th>店舗URL</th>
                          <td><input class="input" type="url" name="url" v-model="signup.url" /></td>
                        </tr>
                        <tr>
                          <th>ご担当者様氏名</th>
                          <td><input class="input" type="text" name="manager_name" v-model="signup.manager_name" required/></td>
                        </tr>
                        <tr>
                          <th>ご担当者様電話番号</th>
                          <td><input class="input" type="tel" name="manager_phone" v-model="signup.manager_phone" required/></td>
                        </tr>
                        <tr>
                          <th>メールアドレス</th>
                          <td>
                              <input class="input" type="email" name="email" v-model="signup.email" required
                                :class="{ 'is-danger' : signup.email_invalid }"
                                @keyup="validEmail"
                              />
                              <p class="ffa-signup-validation">メールアドレスの形式が正しくありません。</p>
                          </td>
                        </tr>
                        <tr>
                          <th>パスワード</th>
                          <td>
                              <input class="input" type="password" name="password" v-model="signup.password" required
                                :class="{ 'is-danger' : signup.password_invalid_length }"
                                @keyup="validPasswordLength"
                              />
                              <p class="ffa-signup-validation">パスワードは8文字以上で入力してください。</p>
                          </td>
                        </tr>
                        <tr>
                          <th>パスワード(確認用)</th>
                          <td>
                              <input class="input" type="password" name="password_confirm" v-model="signup.password_confirm" required
                                :class="{ 'is-danger' : signup.password_invalid_match }"
                                @keyup="validPasswordMatch"
                              />
                              <p class="ffa-signup-validation">パスワードが一致しません。</p>
                          </td>
                        </tr>
                    </tbody>
                </table>
                <div class="ffa-signup-terms-wrap">
                    <h2>利用規約</h2>
                    <div class="ffa-signup-terms">
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
                      ■オナクラ・ハンドサービの広告表記に関して
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
                    <div class="ffa-signuo-terms-agree">
                        <input id="agreement" type="checkbox" name="agreement" v-model="signup.agreement">
                        <label for="agreement">利用規約に同意する</label>
                    </div>
                </div>
                <div class="ffa-btn-wrap">
                    <p
                    v-if="!loading"
                    :class="{ 'ffa-status-passive' : !checkForm }"
                    @click="submitData"
                    >アカウント作成</p>
                    <Loading v-else></Loading>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import u from 'umbrellajs';
import axios from 'axios';
import Loading from './PartnerLoading.vue';
import GetMaster from '../mixin/getMaster.js';

export default {
    data() {
        return {
            signup: {
                name: null,
                service_category: 0,
                service_genre: 0,
                area: 0,
                state: '',
                phone: null,
                url: null,
                manager_name: null,
                manager_phone: null,
                email: null,
                email_invalid: false,
                password: '',
                password_confirm: '',
                password_invalid_length: false,
                password_invalid_match: false,
                agreement: false,
            },
            area_index: 0,
            smallarea_index: null,
            master: {
                service_category: [],
                service_genre: [],
                area: [],
                state: [],
            },
            loading: false,
            area_loading: false,
        }
    },
    created: function() {
        this.getState().then((res) => {
            this.master.state = res;
        })
        this.getServiceCategory().then((res) => {
            this.master.service_category = res;
        });
        this.getServiceGenre().then((res) => {
            this.master.service_genre = res;
        });
    },
    computed: {
        checkForm: function () {
            let flg = true;
            let ref = this.signup;

            if (!ref.name || !ref.service_category || !ref.service_genre || !ref.state || !ref.phone || !ref.manager_name || !ref.manager_phone
                || ref.email_invalid || ref.password_invalid_length || ref.password_invalid_match || !ref.agreement) {
                flg = false;
            }
            return flg;
        },
    },
    methods: {
        getAreaInfo: function() {
            this.area_loading = true;
            this.getAreas({state: this.signup.state}).then((res) => {
                this.master.area = res;
                this.area_loading = false;
            });
        },
        validEmail: function () {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            this.signup.email_invalid = !(re.test(this.signup.email));
            return re.test(this.signup.email);
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
                if (this.area_index === 'others' && this.smallarea_index) {
                    this.signup.area = this.master.area[this.smallarea_index];
                } else {
                    this.signup.area = this.master.area[this.area_index];
                }

                axios({
                    url: '/api/partner/signup',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: this.signup,
                })
                .then(function (response) {
                    if (response.status === 200) {
                        self.$router.push(`/partner/account/signup/complete?email=${self.signup.email}`);
                    }
                    self.loading = false;
                })
                .catch(function (error) {
                    self.loading = false;
                });
            } else {
                this.loading = false;
            }
        }
    },
    components: {
        Loading,
    },
    mixins: [
        GetMaster,
    ],
}
</script>

<style scoped>
/* signup scoped */
.ffa-signup {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    position: relative;
    padding-top: 40px;
}

.ffa-signup-wrapper {
    width: 70%;
}

.ffa-signup-img-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ffa-signup img {
    width: 200px;
    margin-bottom: 20px;
}

.ffa-signup h1 {
    width: 100%;
    text-align: center;
    margin-bottom: 26px;
}

.ffa-signup table th {
    vertical-align: middle;
}

.ffa-signup table td:nth-child(2) {
    width: 540px;
}

.ffa-signup input:not([type="checkbox"]) {
    width: 100%;
}

.ffa-signup select,
.ffa-signup option {
    font-family: 'M plus 1p';
    font-weight: 300;
}

.ffa-signup-terms-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px 20px;
    margin-bottom: 20px;
}

.ffa-signup h2 {
    font-size: 1rem;
}

.ffa-signup-terms {
    width: 100%;
    height: 300px;
    border: 1px solid var(--cl-border);
    background-color: var(--cl-grey);
    padding: 6px;
    margin-bottom: 30px;
    overflow-y: scroll;
}

.ffa-signup .ffa-btn-wrap {
    display: flex;
    justify-content: center;
    padding: 0 0 20px;
    margin-bottom: 40px;
}

.ffa-signup .ffa-btn-wrap p {
    padding: 10px 30px;
}

.ffa-signup .ffa-btn-wrap p:hover {
    cursor: pointer;
    opacity: 0.75;
}

.ffa-signup .ffa-btn-wrap p  {
    color: #FFF;
    background-color: var(--cl-blue);
}

.ffa-signup .ffa-btn-wrap p.ffa-status-passive  {
    color: unset;
    background-color: var(--cl-grey);
}

.ffa-signup-validation {
    display: none;
}

.ffa-signup input.is-danger ~ p.ffa-signup-validation {
    color: #ff3860;
    display: block;
}

.ffa-signup .td-inner {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.2rem;
}

.ffa-signup .td-inner label {
    margin-right: 1rem;
}
</style>
