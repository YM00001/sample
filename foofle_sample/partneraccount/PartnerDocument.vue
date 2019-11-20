<template>
    <div class="document-wrap">
        <header>
            <h1>FOOFLE</h1>
            <ul>
                <li><a>無料店舗登録</a></li>
                <li><a>お問い合わせ</a></li>
                <li><a>店舗様ログイン</a></li>
            </ul>
        </header>
        <div class="document-container">
            <ul class="document-outline">
                <li>
                    <p @click="toggleWindow('introduction')">イントロダクション</p>
                    <transition name="slide">
                        <ul v-if="toggle.introduction">
                            <li><a>FOOFLEの概要</a></li>
                            <li><a>ご利用料金</a></li>
                        </ul>
                    </transition>
                </li>
                <li>
                    <p @click="toggleWindow('start')">FOOFLEをはじめる</p>
                    <transition name="slide">
                        <ul v-if="toggle.start">
                            <li><a>会員登録</a></li>
                            <li><a>届出確認書の提出</a></li>
                            <li><a>店舗情報の設定</a></li>
                            <li><a>サービス料金の設定</a></li>
                            <li><a>エリアと交通費</a></li>
                        </ul>
                    </transition>
                </li>
                <li>
                    <p @click="toggleWindow('cast')">キャストの管理</p>
                    <transition name="slide">
                        <ul v-if="toggle.cast">
                            <li><a>キャスト管理の概要</a></li>
                            <li><a>キャストアカウントの作成(新規)</a></li>
                            <li><a>キャストアカウントの紐付け</a></li>
                            <li><a>キャストの設定</a></li>
                            <li><a>店舗情報の上書き設定</a></li>
                            <li><a>シフト管理</a></li>
                            <li><a>権限の設定</a></li>
                            <li><a>つぶやきのメール投稿設定</a></li>
                        </ul>
                    </transition>
                </li>
                <li>
                    <p @click="toggleWindow('reserve')">予約の管理</p>
                    <transition name="slide">
                        <ul v-if="toggle.reserve">
                            <li><a>予約の通知</a></li>
                            <li><a>予約の対応</a></li>
                            <li><a>予約のキャンセル</a></li>
                            <li><a>FOOFLE外の予約に対応する</a></li>
                            <li><a>予約に関する注意事項</a></li>
                        </ul>
                    </transition>
                </li>
                <li>
                    <p @click="toggleWindow('payment')">お支払い</p>
                    <transition name="slide">
                        <ul v-if="toggle.payment">
                            <li><a>売上の確認</a></li>
                        </ul>
                    </transition>
                </li>
                <li>
                    <p @click="toggleWindow('api')">API</p>
                    <transition name="slide">
                        <ul v-if="toggle.api">
                            <li><a>概要</a></li>
                            <li><a>ID・PWDの発行</a></li>
                            <li><a>APIドキュメント</a></li>
                        </ul>
                    </transition>
                </li>
                <li>
                    <p @click="toggleWindow('terms')">利用規約</p>
                    <transition name="slide">
                        <ul v-if="toggle.terms">
                            <li><a>ガイドライン概要</a></li>
                            <li><a>パートナー利用規約</a></li>
                            <li><a>パートナー禁止事項</a></li>
                            <li><a>反社会的勢力の排除に関する同意</a></li>
                        </ul>
                    </transition>
                </li>
                <li>
                    <p @click="toggleWindow('support')">サポート</p>
                    <transition name="slide">
                        <ul v-if="toggle.support">
                            <li><a>サポートを受ける</a></li>
                        </ul>
                    </transition>
                </li>
            </ul>
            <div class="document-content">
                <h1>FOOFLEについて</h1>
                <div class="document-text">
                    <p>ここではFOOFLEの概要をご説明します。</p>
                    <p>FOOFLEは新世代型の集客媒体です。もちろんそのなｋには店舗様の営業をサポートする様々な仕組みをご用意しておりますし、間違いなくお役に立てることと存じますぞ。<br />その他にもたくさんの機能を持った非常に楽しいコンテンツ盛りだくさんでおお送りいたします。</p>
                    <h2>ご利用料金</h2>
                    <p>料金はFOOFLE上で成約したご予約の金額に応じて発生する従量課金制となっております。</p>
                    <p>
                        成約金額の10%をご利用手数料として頂戴いたします。
                    </p>
                    <ul class="note">
                        <li>別途消費税を頂戴します。</li>
                        <li>成約金額には交通費を含みます。</li>
                        <li>成約金額にはポイントの発行額・利用額は含みません。</li>
                    </ul>
                    <h2>お支払いサイクル</h2>
                    <p>
                        お支払いは週に1回お願いしております。毎週金曜日締め(土曜日午前6時までに成立したご予約が対象)、翌々週金曜日がお支払い期日となります。ご利用料金が確定いたしましたら管理画面でご確認いただけます。なおご利用料金の確定に1～2日程度かかる場合がございます。
                    </p>
                    <p>
                        締日時点でのご利用料金が1万円未満の場合、次回決済へ残高を繰り越します。ご利用料金が1万円を超えた週のサイクルでお支払いいただきます。
                    </p>
                    <h2>ご利用料金がマイナスになった場合</h2>
                    <p>
                        お客様のポイント利用により店舗様のご利用料金がマイナスになる場合がございます(店舗様に一時的にご負担いただいている状態)。締日時点でこのような状態の場合、FOOFLEよりマイナス分のお支払いをいたします。お支払いのタイミング・日時・方法などにつきましてはサポートより都度ご連絡を差し上げます。
                    </p>
                    <p>
                        なお、マイナス残高が1万円未満の場合は通常サイクルと同様に次回決済へ繰り越しを行います。あらかじめご了承くださいませ。
                    </p>
                    <h2></h2>
                    <p>
                        基本コース料金、ならびにオプション料金の設定をしていただけます。
                    </p>
                    <h2>交通費について</h2>
                    <p>
                        FOOFLEではお客様によりわかりやすく、かつシンプルにご利用いただくため、交通費についてFOOFLEで定める計算方法に基づいてのみ請求を行うことができます。そのため店舗様独自での交通費の設定はできかねますことをご了承ください。次に交通費の計算について説明いたします。
                    </p>
                    <h2>交通費の計算</h2>
                    <p>
                        交通費は店舗様の出発エリアとお客様が利用するホテル(または自宅)の最寄り駅の2点間の距離に基づき計算を行います。
                    </p>
                    <table>
                        <tr>
                            <th>時間帯区分</th>
                            <th>距離あたり交通費</th>
                            <th>深夜加算</th>
                        </tr>
                        <tr>
                            <th>通常(5時～23時)</th>
                            <td>280円</td>
                            <td>0円</td>
                        </tr>
                        <tr>
                            <th>深夜(23～29時)</th>
                            <td>364円</td>
                            <td>500円</td>
                        </tr>
                    </table>
                    <ul class="note">
                        <li>上記金額は片道料金です。</li>
                        <li>上記金額は税込金額です。</li>
                        <li>時間帯区分につきましてはご予約時点でのサービス開始時刻およびサービス終了時刻に基づき計算を行います。</li>
                        <li>サービス開始時刻とサービス終了時刻が通常の時間帯、深夜の時間帯にまたがる場合にはそれぞれで計算を行います。(往路は通常料金、復路は深夜料金など)。</li>
                    </ul>
                    </p>
                    <h2>特別エリアの例外</h2>
                    <p>
                        店舗様の出発エリアが特別エリアかつ、お客様のご利用場所が同一エリアの場合は特例として距離別交通費が0円となります。ただし深夜加算は発生いたします。
                    </p>
                    <p>
                        交通費の計算につきましては2点間の緯度・経度をもとに直線距離で計算を行っております。地形や交通状況につきましては考慮しておりません。交通費シミュレータをご用意しておりますので、ぜひご活用くださいませ。
                    </p>
                    <p class="alert">
                        交通費の金額が不十分だと感じる場合には、あらかじめ不足分を乗せたサービス料金の設定をお願いいたします。なお、お客様からFOOFLEシステムで表示された以上の金額を受け取ることは固くお断り致しております。お客様に安心してご利用いただくためのルールとなっておりますため、ご理解いただきますようお願い申し上げます。
                    </p>
                    <h2>ポイントについて</h2>
                    <p>お客様はFOOFLEが実施するキャンペーンやサービスのご利用でポイントを獲得することができます。このポイントで1pt＝1円相当としてご利用料金の割引を受けることができます。</p>
                    <p>
                        お客様がポイントを利用した場合、ポイント分を差し引いた金額が店舗様が受け取る金額となります。差し引かれた金額はFOOFLEから店舗様にお支払いするものとし、原則店舗様のご利用料金と相殺します。
                    </p>
                    <p class="alert">
                        お客様のポイント利用を拒否することはできかねます。すべての店舗・すべてのキャストでポイントが使用できることが、FOOFLEの訴求点の1つであることをご理解いただきますようお願い申し上げます。
                    </p>
                    <p>
                        店舗様にてポイントを発行することができます。サービス代金に対する割合(1%から、1%単位)を設定することができます。発行したポイント分はご利用料金として決済に計上いたします。キャストごとに異なるポイント設定も可能です。詳しくは設定の項目をご確認ください。
                    </p>
                    <h2>禁止事項</h2>
                    <p>
                        パートナー店舗様につきまして、お客様の安心・安全なご利用を妨げる恐れがございますため、以下の行為はご遠慮ください。また在籍キャストが禁止行為を行わないようご指導いただきますようお願い申し上げます。
                    </p>
                    <ul>
                        <li>FOOFLEシステムで表示された金額以上の金銭をお客様へ要求すること</li>
                        <li>予約の遂行に不必要なお客様への連絡(営業行為を含む)</li>
                        <li>FOOFLEで予約したお客様に対し、FOOFLE介さず直接店舗へ連絡することを推奨する行為</li>
                        <li>事実と異なる情報の掲示</li>
                        <li>振替行為</li>
                        <li>時短行為</li>
                        <li>本番行為の勧誘および勧誘とみられる恐れのある行為</li>
                        <li>一般エステ店において、性的なサービスの提供</li>
                        <li>虚偽の情報に基づくアカウントの作成</li>
                        <li>同一店舗で複数アカウントの作成</li>
                    </ul>
                    <h2>逆指名機能</h2>
                    <p>FOOFLEのコンテンツのひとつ、逆指名機能についてご説明いたします。</p>
                    <p>
                        逆指名機能とは、お客様がサービスの内容・日時・キャストのタイプなどの希望条件を提示し、その条件からキャストがお客様を指名します。お客様は指名のあったキャストの中から、もっとも気に入ったキャストを選んで予約を入れることができます。
                    </p>
                    <p>
                        逆指名を受けたお客様は必ずしも予約を入れなければいけないわけではありませんが、お客様とキャストの接点を作ることができます。実際にご予約に至った場合は、通常のご予約と同じフローでご対応ください。
                    </p>
                    <p>
                        なお逆指名の操作はキャストアカウントからのみ行える機能です。店舗様管理画面からは操作いただけません。
                    </p>
                    <h2>予約の通知</h2>
                    <p>
                        お客様から店舗様が管理するキャストにご予約が入りますと、FOOFLEより店舗様へご連絡をいたします。
                    </p>
                    <h2>メールによる通知</h2>
                    <p>
                        ご登録いただいているメールアドレスへ予約の確認メールをお送りいたします。
                    </p>
                    <h2>電話による通知</h2>
                    <p>
                        ご登録いただいている営業用の電話番号へ荷電いたします。電話をお取りになりますと自動音声メッセージが流れますのですぐにお切りいただいて構いません。ご予約の内容は管理画面からご確認ください。
                    </p>
                    <h2>予約内容の確認</h2>
                    <ul class="bread-nav">
                        <li>店舗管理画面</li>
                        <li>予約管理</li>
                        <li>該当の予約をクリック</li>
                    </ul>

                    <h2>予約の対応</h2>
                    <h2>１.ご予約内容の確認</h2>
                    <p>
                        ご予約が入りましたらまず<span class="empha">日時・場所(最寄り駅)・キャスト</span>をご確認ください。派遣に問題がなければお客様指定の日時に間に合うよう派遣の手配をお願いいたします。
                    </p>
                    <p class="alert">
                        万が一キャストを派遣できない事情がございましたら、速やかにキャンセル頂きますようお願いいたします。キャンセルにつきましてはこちらをご覧ください。
                    </p>
                    <p>
                        なおご予約時点では利用予定の最寄り駅のみ表示されます。これはお客様の利用において、ホテルが決まっていないユースケースに対応するためでございます。お客様がご希望の時間にサービスが開始できるようホテル情報の表示前の派遣もご検討ください。
                    </p>
                    <h2>２.派遣場所の確認</h2>
                    <p>
                        お客様が派遣場所を入力すると予約情報が更新されます。このとき<span class="empha">システムによる通知はございません</span>のでご注意ください。
                    </p>
                    <p>
                        また在室確認は店舗様のご判断で行ってください。FOOFLEではお客様が入力したデータをそのまま店舗様にお伝えしているのみとなりますことをご理解くださいませ。
                    </p>
                    <h2>３.派遣・サービスの開始</h2>
                    <p>
                        サービスの開始時にはPINの入力が必要です。PINはお客様の端末からのみ確認できます。
                    </p>
                    <p>
                        PINをキャストが入力すると、ご予約情報のサービス開始時刻が更新されます。
                    </p>
                    <p>
                        PINの入力を店舗様管理画面より代理で行うこともできます。インコール時にお客様から聞いたPINをキャストに聞くなどで対応いただけます。
                    </p>
                    <h2>４.サービスの終了</h2>
                    <p>
                        サービス終了後のご対応は各店舗様
                    </p>
                    <h2>ご予約のキャンセル</h2>
                    <h2>店舗様によるキャンセル</h2>
                    <p>キャストを派遣できない事情がある場合には速やかなキャンセル処理をお願いいたします。</p>
                    <ul class="bread-nav">
                        <li>予約管理</li>
                        <li>該当の予約をクリック</li>
                        <li>画面右上プルダウン「予約のキャンセル」</li>
                    </ul>
                    <p>キャンセル理由を選択して、キャンセル実行をクリックしてください。</p>
                    <p>店舗様都合のキャンセルの場合、ご利用料金の返金はいたしかねます。キャンセルが発生しないようシフト情報を常に最新にするなどのご対応をお願いいたします。</p>
                    <h2>お客様によるキャンセル</h2>
                    <p>
                        お客様の都合によりご予約がキャンセルされる場合がございます。ご予約がキャンセルされた場合にはメールでお知らせいたします。
                    </p>
                    <p>お客様都合のキャンセルの場合にはご利用料金の返金をいたします。またキャンセル料につきましては、利用規約に基づきお客様から徴収することはできかねますことを何卒ご理解くださいませ。</p>
                    <h2>FOOFLE外の予約情報の入力</h2>
                    <p>FOOFLEは登録されているシフトをもとに、自動でご予約可能時間をお客様に表示いたします。FOOFLE上で受け付けた予約の時間はBusyとして予約できない状態になりますが、それ以外の時間はすべてご予約を受け付けます。そのため店舗様が直接受けたご予約やキャストの休憩時間など、ご予約を受け付けない時間の設定が必要になります。</p>
                    <h2>API概要</h2>
                    <p>FOOFLEではより円滑にご利用いただくため店舗様向けのAPIを公開しております。</p>
                    <h3>現在APIで行っていただける設定</h3>
                    <table>
                        <tr>
                            <th>キャスト設定</th>
                            <td>シフトの更新　BUSY情報の更新</td>
                        </tr>
                    </table>
                    <p>

                    </p>
                    <h2>ID・PWDの発行</h2>
                    <p>APIをご利用いただくためにAPI専用のIDとPWDを発行します。これはログインのIDとパスワードとは別のものになります。</p>
                    <p>API-PWDはセキュリティ対策のため一度しか表示されません。メモやコピーをするなどして厳重に保管してください。</p>
                    <h2>ID-PWDの更新</h2>
                    <p>ID・PWDを更新すると更新前のID・PWDは利用できなくなります。</p>
                    <p>セキュリティ対策のため定期的なID・PWDの更新をおすすめいたします。またPWDを紛失した場合は、更新することで新しいID-PWDでAPIをご利用いただけます。</p>
                    <h2>APIドキュメント</h2>
                    <h2>シフトの更新</h2>
                    <table>
                        <tr>
                            <th>操作</th>
                            <td colspan="3">POST /api/update_schedule</td>
                        </tr>
                        <tr>
                            <th>目的</th>
                            <td colspan="3">キャストのシフトの更新</td>
                        </tr>
                        <tr>
                            <th>リソースURI</th>
                            <td colspan="3">https://foofle.app/api/update_schedule</td>
                        </tr>
                        <tr rowspan="7">
                            <th rowspan="7">要求ペイロード</th>
                            <th>プロパティ</th>
                            <th>データ型</th>
                            <th>説明</th>
                        </tr>
                        <tr>
                            <td>client_id</td>
                            <td>String</td>
                            <td>クライアントID</td>
                        </tr>
                        <tr>
                            <td>client_secret</td>
                            <td>String</td>
                            <td>クライアントシークレット</td>
                        </tr>
                        <tr>
                            <td>cast_id</td>
                            <td>String</td>
                            <td>キャストID。'C0XXXXXX'の形式。</td>
                        </tr>
                        <tr>
                            <td>date</td>
                            <td>String</td>
                            <td>更新する日付。'YYYY-MM-DD'の形式。(例：2019年10月1日 → '2019-10-01')</td>
                        </tr>
                        <tr>
                            <td>start_time</td>
                            <td>String</td>
                            <td>シフトの開始時刻。'HHMM'の形式。'0600'～'3000'の範囲。(例: 午前9時 → '0900')</td>
                        </tr>
                        <tr>
                            <td>end_time</td>
                            <td>String</td>
                            <td>シフトの終了時刻。'HHMM'の形式。'0600'～'3000'の範囲。(例: 午後9時 → '2100')</td>
                        </tr>
                        <tr>
                            <th>Content-type</th>
                            <td colspan="3">application/json</td>
                        </tr>
                        <tr>
                            <th>応答ペイロード</th>
                            <td colspan="3">なし</td>
                        </tr>
                        <tr>
                            <th>正常なHTTP応答コード</th>
                            <td colspan="3">200</td>
                        </tr>
                        <tr>
                            <th>エラーのHTTP応答コード</th>
                            <td colspan="3">
                                <ul>
                                    <li>500 Bad Request - 要求されたペイロードが不正な場合に返します。</li>
                                    <li>404 Not Found - 要求されたキャスト情報が見つからない場合に返します。</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>備考</th>
                            <td colspan="3">
                                <ul>
                                    <li>FOOFLEでは1日に1つのシフトのみ設定できます。</li>
                                    <li>すでにシフトが設定されている場合は新しい情報でUpdateされます。</li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            toggle: {
                introduction: false,
                start: false,
                cast: false,
                reserve: false,
                payment: false,
                api: false,
                terms: false,
                support: false,
            },
        }
    },
    methods: {
        toggleWindow: function(name) {
            this.toggle[name] = !this.toggle[name];
        }
    },
}
</script>

<style scoped>
    .document-wrap {
        width: 100%;
        height: auto;
        background: #FFF;
        background: linear-gradient(-225deg, #ff2d940A 0%, #3ae6fa0A 100%);
        position: relative;
        padding: 82px;
    }

    .document-wrap:before,
    .document-wrap:after {
        content: '';
        width: 12px;
        height: 100%;
        background: linear-gradient(-225deg, #ff2d94 0%, #3ae6fa 100%);;
        position: absolute;
    }

    .document-wrap:before {
        top: 0;
        left: 0;
    }

    .document-wrap:after {
        top: 0;
        right: 0;
    }

    .document-container {
        width: 1280px;
        min-height: 100vh;
        margin: 0 auto;
    }

    header {
        width: 100%;
        height: 48px;
        background: #FFF;
        padding: 0 2rem;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
    }

    header h1 {
        color: #000;
        font-size: 20px;
        letter-spacing: 9px;
        font-weight: 800;
        margin: 0;
    }

    header ul {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
    }

    header li {
        padding: 0 1rem;
        word-break: keep-all;
    }

    header li a {
        font-size: 0.9rem;
    }

    .document-container {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: flex-start;
    }

    .document-container > ul {
        width: 240px;
        background-color: #FFF;
    }

    .document-container > ul > li {
        text-align: center;
        border-style: solid;
        border-color: #EEE;
        border-width: 1px 0 0;
        margin-top: -1px;
    }

    .document-container > ul > li > p {
        font-size: 0.8rem;
        padding: 1rem 0;
    }

    .document-container > ul > li > ul {
        display: nne;
        background-color: var(--cl-grey-light);
    }

    .document-container > ul > li > ul > li {
        width: 100%;
    }

    .document-container > ul > li > ul > li > a {
        font-size: 0.8rem;
        background-color: #FDFDFD;
        width: 100%;
        padding: 0.8rem 1rem;
    }

    .slide-enter-active, .slide-leave-active {
        transition: opacity .2s;
    }
    .slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    .document-content {
        width: 972px;
        background-color: #FFF;
        padding: 3rem;
    }

    .document-content h1 {
        margin-bottom: 3rem;
    }

    .document-text p {
        font-size: 0.9rem;
        line-height: 1.4rem;
        margin-bottom: 2rem;
    }

    .document-text h2 {
        font-size: 1rem;
    }

    .document-text h2:before {
        content: '|';
        font-weight: bold;
        margin-right: 0.5rem;
        color: #FC2F95;
    }

    .document-text table {
        width: 100%;
        margin-bottom: 24px;
    }

    .document-text td, .document-text th {
        font-size: 0.8rem;
        padding: 0.5rem;
        border: 1px solid var(--cl-border);
    }

    .document-text th {
        background-color: #FAFEFF;
        word-break: keep-all;
    }

    .document-text td li {
        list-style: circle;
        margin-left: 1rem;
        margin-bottom: 0.3rem;
        font-size: 0.8rem;
    }

    .document-text .note {

    }

    .document-text .note li {
        list-style-type: circle;
        margin-left: 1rem;
        margin-bottom: 0.3rem;
        font-size: 0.7rem;
    }

    .document-text li {
        list-style: circle;
        font-size: 0.9rem;
        margin-left: 1rem;
        margin-bottom: 0.3rem;
    }

    .document-text span.empha {
        font-size: 0.9rem;
        font-weight: 500;
        color: #000;
        text-decoration: underline;
    }

    .document-text .alert {
        padding: 1rem;
        border-radius: 5px;
        border: 1px solid #FC2F95;
        background-color: #FC2F950a;
    }
</style>
