<template>
    <div class="ffa-content column is-10 ffa-detail">
        <template v-if="!initial_loading">
            <h1 v-if="castdata.profile">{{ castdata.profile.name }}
                <fa v-if="castdata.conf_lock" :icon="['fas', 'lock']" :style="{ color: '#AAA'}"></fa>
            </h1>
            <div v-if="castdata.profile" class="header">
                <WebImage
                v-if="castdata.profile.img"
                class="top-thumbnail"
                :src="castdata.profile.img"
                ></WebImage>
                <div class="ffa-detail-prop">
                    <div class="">
                        <p>キャストID</p>
                        <p>{{ castid }}</p>
                    </div>
                    <div class="">
                        <p>ステータス</p>
                        <p>稼働中</p>
                    </div>
                    <div class="">
                        <p>Foofleページ</p>
                        <p><a href="">https://foofle.jp/{{ castid }}</a></p>
                    </div>
                </div>
                <div class="fake-order">
                    <h3>予約作成
                        <Tips
                        title="予約作成"
                        content="Foofle外のご予約を作成できます。"
                        ></Tips>
                    </h3>
                    <div class="form-parts">
                        <label for="">日付</label>
                        <select type="number" class="is-small ffa-is-small" v-model="fake_order.date">
                            <option v-for="item in schedule_fakeorder" :value="item.value">{{ item.display }}</option>
                        </select>
                    </div>
                    <div class="form-parts">
                        <label for="">開始</label>
                        <input type="number" class="is-small ffa-is-small" v-model="fake_order.from">
                    </div>
                    <div class="form-parts">
                        <label for="">終了</label>
                        <input type="number" class="is-small ffa-is-small" v-model="fake_order.to">
                    </div>
                    <div class="ffa-btn">
                        <p v-if="!fake_order.is_sending" @click="createFakeOrder">作成</p>
                        <Loading v-else></Loading>
                    </div>
                </div>
            </div>
            <div v-if="castdata.profile" class="ffa-tabs">
                <input id="tabs_schedule" type="radio" name="tab_item" checked>
                <label class="ffa-tab-item" for="tabs_schedule">スケジュール</label>
                <input id="tabs_reserve" type="radio" name="tab_item">
                <label class="ffa-tab-item" for="tabs_reserve">予約</label>
                <input id="tabs_profile" type="radio" name="tab_item">
                <label class="ffa-tab-item" for="tabs_profile">プロフィール</label>
                <input id="tabs_system" type="radio" name="tab_item">
                <label class="ffa-tab-item" for="tabs_system">料金システム</label>
                <input id="tabs_review" type="radio" name="tab_item">
                <label class="ffa-tab-item" for="tabs_review">レビュー</label>
                <input id="tabs_analysis" type="radio" name="tab_item">
                <label class="ffa-tab-item" for="tabs_analysis">分析</label>
                <input id="tabs_conf" type="radio" name="tab_item">
                <label class="ffa-tab-item" for="tabs_conf">設定</label>
                <div class="ffa-tab-content" id="tabs_schedule_content">
                    <div class="swiper-container" style="width:100%;">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide ffa-detail-schedule">
                                <p>今週</p>
                                <div>
                                    <div class="ffa-detail-schedule-block"
                                    v-for="item in schedule_display[0]"
                                    >
                                        <p>{{ item.md }}</p>
                                        <p>{{ item.day }}</p>
                                        <div>
                                            from
                                            <input class="is-small ffa-is-small" type="number"
                                            v-model="item.shift.from"
                                            >
                                            to
                                            <input class="is-small ffa-is-small" type="number"
                                            v-model="item.shift.to"
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide ffa-detail-schedule">
                                <p>翌週</p>
                                <div>
                                    <div class="ffa-detail-schedule-block"
                                    v-for="item in schedule_display[1]"
                                    >
                                        <p>{{ item.md }}</p>
                                        <p>{{ item.day }}</p>
                                        <div>
                                            from
                                            <input class="is-small ffa-is-small" type="number"
                                            v-model="item.shift.from"
                                            >
                                            to
                                            <input class="is-small ffa-is-small" type="number"
                                            v-model="item.shift.to"
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide ffa-detail-schedule">
                                <p>翌々週</p>
                                <div>
                                    <div class="ffa-detail-schedule-block"
                                    v-for="item in schedule_display[2]"
                                    >
                                        <p>{{ item.md }}</p>
                                        <p>{{ item.day }}</p>
                                        <div>
                                            from
                                            <input class="is-small ffa-is-small" type="number"
                                            v-model="item.shift.from"
                                            >
                                            to
                                            <input class="is-small ffa-is-small" type="number"
                                            v-model="item.shift.to"
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide ffa-detail-schedule">
                                <p>翌翌々週</p>
                                <div>
                                    <div class="ffa-detail-schedule-block"
                                    v-for="item in schedule_display[3]"
                                    >
                                        <p>{{ item.md }}</p>
                                        <p>{{ item.day }}</p>
                                        <div>
                                            from
                                            <input class="is-small ffa-is-small" type="number"
                                            v-model="item.shift.from"
                                            >
                                            to
                                            <input class="is-small ffa-is-small" type="number"
                                            v-model="item.shift.to"
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>
                    <div class="ffa-btn">
                        <p class="ffa-click" v-if="!is_loading" @click="submitScheduleData">保存</p>
                        <Loading v-else></Loading>
                    </div>
                </div>
                <div class="ffa-tab-content" id="tabs_reserve_content">
                    <template v-for="(item, key) in castdata.reserve">
                        <div class="ffa-stick">
                            <p class="ffa-status ffa-status-now">接客中</p>
                            <p>{{ key.toUpperCase() }}</p>
                            <p>{{ item.schedule.date.slice(-5) }} {{ item.schedule.start_at.slice(0, 2) }}:{{ item.schedule.start_at.slice(-2) }} {{ item.transportation.delivery_station.name }}</p>
                            <p>{{ item.course.min }}分コース</p>
                        </div>
                    </template>
                </div>
                <div class="ffa-tab-content" id="tabs_profile_content">
                    <table class="table is-fullwidth ffa-conf">
                        <thead>
                            <tr>
                                <th colspan="3">プロフィール画像</th>
                                <td colspan="3"></td>
                            </tr>
                        </thead>
                        <!--
                        <tbody>
                            <tr>
                                <td></td>
                                <td>
                                    <div>
                                        <p>1枚目</p>
                                        <img src="/img/partner/sample43.png" alt="">
                                        <input id="file1" type="file" name="" value="">
                                        <label for="file1">画像を選択</label>
                                        <p>someimage.png</p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p>2枚目</p>
                                        <img src="/img/partner/sample43.png" alt="">
                                        <input id="file2" type="file" name="" value="">
                                        <label for="file2">画像を選択</label>
                                        <p>未選択</p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p>3枚目</p>
                                        <img src="/img/partner/sample43.png" alt="">
                                        <input id="file3" type="file" name="" value="">
                                        <label for="file3">画像を選択</label>
                                        <p>未選択</p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p>4枚目</p>
                                        <img src="/img/partner/sample43.png" alt="">
                                        <input id="file4" type="file" name="" value="">
                                        <label for="file4">画像を選択</label>
                                        <p>未選択</p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p>5枚目</p>
                                        <img src="/img/partner/sample43.png" alt="">
                                        <input id="file5" type="file" name="" value="">
                                        <label for="file5">画像を選択</label>
                                        <p>未選択</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        -->
                        <tbody>
                            <tr>
                                <td>アイコン</td>
                                <td colspan="2" class="iconimg-inside-td">
                                    <WebImage
                                    v-if="castdata.profile.img"
                                    class="top-thumbnail"
                                    :src="castdata.profile.img"
                                    ></WebImage>
                                </td>
                                <td colspan="3">
                                    <!--
                                    <input id="file1" v-model="">
                                    <label for="file1">画像を選択</label> -->
                                    <div class="ffa-btn">
                                        <p @click="toggleCroppa('icon')">画像を変更</p>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    <div v-if="croppa.icon.is_show" class="croppa-modal">
                        <croppa v-model="croppa.icon.myCroppa"
                            :width="croppa.d_w"
                            :height="croppa.d_w"
                            :show-remove-button="true"
                            remove-button-color="#AAA"
                            placeholder="タップして画像を選択してください"
                            :show-loading="true"
                            :file-size-limit="2097152"
                            accept="image/png,image/jpeg"
                            @file-type-mismatch="onFileTypeMismatch"
                            @file-size-exceed="onFileSizeExceed"
                        ></croppa>
                        <div class="croppa-btn">
                            <div class="cancel"
                                @click="toggleCroppa('icon')"
                            >キャンセル</div>
                            <div class="fix"
                                @click="uploadImage('icon')"
                            >保存</div>
                        </div>
                    </div>
                    <table class="table is-fullwidth ffa-conf">
                        <thead>
                            <tr>
                                <th>プロフィール</th>
                                <td colspan="2"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <th>源氏名</th>
                                <td>
                                    <input class="is-small is-info" type="text" required
                                    v-model="castdata.profile.name"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>源氏名(英語表記)</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.profile.name_en"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>年齢</th>
                                <td>
                                    <input class="is-small is-info ffa-small" type="text"
                                    v-model="castdata.profile.years"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>スリーサイズ</th>
                                <td>
                                    B:<input class="is-small is-info ffa-small" type="text"
                                    v-model="castdata.profile.size_b"
                                    >
                                    W:<input class="is-small is-info ffa-small" type="text"
                                    v-model="castdata.profile.size_w"
                                    >
                                    H:<input class="is-small is-info ffa-small" type="text"
                                    v-model="castdata.profile.size_h"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>カップ数</th>
                                <td>
                                    <input class="is-small is-info ffa-small" type="text"
                                    v-model="castdata.profile.size_c"
                                    >カップ
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>身長</th>
                                <td>
                                    <input class="is-small is-info ffa-small" type="text"
                                    v-model="castdata.profile.size_t"
                                    >cm
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>Twitterアカウント</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.profile.twitter"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>職業</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.profile.job"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>出身地</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.profile.born"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>血液型</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.profile.blood"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>誕生日</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.profile.birthday"
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table is-fullwidth ffa-conf">
                        <thead>
                            <tr>
                                <th>補足情報</th>
                                <td colspan="2"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <th>主要稼働時間</th>
                                <td>
                                    <input class="is-small is-info ffa-small" type="text"
                                    v-model="castdata.profile.maintime_from"
                                    >～
                                    <input class="is-small is-info ffa-small" type="text"
                                    v-model="castdata.profile.maintime_to"
                                    >頃
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>主要稼働日</th>
                                <td>
                                    <div>
                                        <input class="ffa-chkbox" type="checkbox" id="is-weekday" value="平日"
                                        v-model="castdata.profile.mainday"
                                        >
                                        <label for="is-weekday">平日</label>
                                    </div>
                                    <div>
                                        <input class="ffa-chkbox" type="checkbox" id="is-holiday" value="休日"
                                        v-model="castdata.profile.mainday"
                                        >
                                        <label for="is-holiday">休日</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>髪色</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.sensitive.hair_color"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>乳首の色</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.sensitive.nipple_color"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>アンダーヘア</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.sensitive.underhair"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>タトゥー</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.sensitive.tatoo"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>ボディピアス</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.sensitive.piercing"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>傷・傷跡</th>
                                <td>
                                    <input class="is-small is-info" type="text"
                                    v-model="castdata.sensitive.scar"
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table is-fullwidth ffa-conf">
                        <thead>
                            <tr>
                                <th>タグ</th>
                                <td colspan="2"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="3">
                                    <ul class="ffa-tagselect-list ffa-tag-list">
                                        <li>
                                            <input id="a_1" type="checkbox" value="巨乳" v-model="castdata.tags">
                                            <label for="a_1">#巨乳</label>
                                        </li>
                                        <li>
                                            <input id="a_2" type="checkbox" value="大学生" v-model="castdata.tags">
                                            <label for="a_2">#大学生</label>
                                        </li>
                                        <li>
                                            <input id="a_3" type="checkbox" value="素人" v-model="castdata.tags">
                                            <label for="a_3">#素人</label>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table is-fullwidth ffa-conf">
                        <thead>
                            <tr>
                                <th>エリア設定</th>
                                <td colspan="2"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowspan="3"></td>
                                <td rowspan="3">
                                    <div class="ffa-search">
                                        <input type="text" placeholder="エリア検索" v-model="areas_query">
                                    </div>
                                    <ul class="ffa-tagpick-list">
                                        <Draggable @end="endAreaDrag" :options="{group: 'areas'}" data-area="areas">
                                            <li
                                            v-for="item in areas"
                                            :key="item.id"
                                            :data-id="item.id"
                                            :data-name="item.name"
                                            v-if="checkQuery(areas_query, item.name)">{{ item.name }}</li>
                                        </Draggable>
                                    </ul>
                                    <div class="ffa-search">
                                        <input type="text" placeholder="駅名検索" v-model="stations_query">
                                    </div>
                                    <ul class="ffa-tagpick-list">
                                        <Draggable @end="endAreaDrag" :options="{group: 'areas'}" data-area="stations">
                                            <li
                                            v-for="item in stations"
                                            :key="item.id"
                                            :data-id="item.id"
                                            :data-name="item.name"
                                            v-if="checkQuery(stations_query, item.name)">{{ item.name }}</li>
                                        </Draggable>
                                    </ul>
                                </td>
                                <td rowspan="3">
                                    <span>派遣NGエリア・駅</span>
                                    <ul class="ffa-tagpick-list">
                                        <Draggable @end="endAreaDrag" :options="{group: 'areas'}" data-area="ng_deliver">
                                            <li  v-for="(item, ind) in castdata.areas.ng_deliver"
                                            :key="item.id"
                                            :data-id="item.id"
                                            :data-name="item.name"
                                            >{{ item.name }}
                                            </li>
                                        </Draggable>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="ffa-btn">
                        <p class="ffa-click" v-if="!is_loading" @click="submitProfileData">保存</p>
                        <Loading v-else></Loading>
                    </div>
                </div>
                <div class="ffa-tab-content" id="tabs_system_content">
                    <CastDetailSystem
                        :castdata="castdata_for_child"
                    ></CastDetailSystem>
                </div>
                <div class="ffa-tab-content" id="tabs_review_content">
                    <template v-if="castdata.review">
                        <div v-for="(item, key) in castdata.review" class="ffa-stick">
                            <p v-if="!item.is_active" class="ffa-status ffa-status-safe">有効</p>
                            <p v-else class="ffa-status ffa-status-danger">削除</p>
                            <p>{{ getDisplay(item.created, '年月日') }}</p>
                            <p>{{ star(item.star) }}</p>
                            <p>{{ item.comment }}</p>
                            <p v-if="!item.is_delete_requested" class="ffa-stick-command ffa-click">削除依頼</p>
                            <template v-else-if="item.reason">
                                <p class="ffa-stick-command ffa-status-passive ffa-click">{{ item.is_active ? '削除不可' : '削除' }}</p>
                                <p class="ffa-stick-command-msg">{{ item.reason }}</p>
                            </template>
                            <template v-else>
                                <p class="ffa-stick-command ffa-status-passive ffa-click">依頼済み</p>
                                <p class="ffa-stick-command-msg">→現在削除審議中です。</p>
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <p>レビューがまだありません</p>
                    </template>
                </div>
                <div class="ffa-tab-content" id="tabs_analysis_content">
                    <p>準備中の機能です。ローンチまで少々お待ちください。</p>
                </div>
                <div class="ffa-tab-content" id="tabs_conf_content">
                    <table class="table is-fullwidth ffa-conf">
                        <thead>
                            <tr>
                                <th>個別権限設定</th>
                                <td>
                                    <div>
                                        <input id="permit_on" type="radio" name="radio109" :value="true" v-model="castdata.permission_lock">
                                        <label for="permit_on">ON</label>
                                    </div>
                                    <div>
                                        <input id="permit_off" type="radio" name="radio109" :value="false" v-model="castdata.permission_lock">
                                        <label for="permit_off">OFF</label>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <Permission
                        v-if="castdata.permission_lock"
                        :permissionData="castdata.permission"
                        @submit="submitPermission('set')"
                    ></Permission>
                    <table class="table is-fullwidth ffa-conf">
                        <thead>
                            <tr>
                                <th>その他</th>
                                <td colspan="2"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <th>NG顧客</th>
                                <td>
                                    <ul v-if="Object.keys(castdata.ng).length > 0">
                                        <li v-for="item in castdata.ng">
                                            <router-link to="`/reserve/${item.reserve_id}`">{{ item.reserve_id }}</router-link>
                                        </li>
                                    </ul>
                                    <template v-else>
                                        設定されていません
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>写メ日記投稿用アドレス</th>
                                <td>
                                    <input style="width:100%;" class="ffa-text" type="text"readonly
                                        :value="displayEmail"
                                        @click="selectAll"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>日記一括送信アドレス</th>
                                <td>
                                    <input style="width:100%;" class="ffa-text" type="text"
                                        v-model="castdata.email.deploy"
                                    >
                                    <div class="email-text-btn">
                                        <p class="ffa-click"
                                            @click="submitDeployEmail"
                                        >保存</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>退店処理</th>
                                <td>
                                    <p>退店処理の実行</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
        <AsyncLoading v-else></AsyncLoading>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import Swiper from 'swiper';
import axios from 'axios';
import u from 'umbrellajs';
import Draggable from 'vuedraggable';

import CastDetailSystem from './inner/CastDetailSystem.vue';
import Permission from './inner/Permission.vue';
import Loading from './inner/PartnerLoading.vue';
import AsyncLoading from './inner/AsyncLoading.vue';

import GetMaster from '../../mixin/getMaster.js';
import timeHelper from '../../mixin/timeHelper.js';
import formatData from '../../mixin/formatData.js';

export default {
    data() {
        return {
            castid: this.$route.params.castid,
            initial_loading: true,
            fake_order: {
                date: '',
                from: '',
                to: '',
                is_sending: false,
            },
            castdata: {
                profile: {
                    name: '',
                    name_en: '',
                    years: '',
                    size_b: '',
                    size_w: '',
                    size_h: '',
                    size_c: '',
                    size_t: '',
                    twitter: '',
                    job: '',
                    born: '',
                    blood: '',
                    birthday: '',
                    maintime_from: '',
                    maintime_to: '',
                    mainday: [],
                },
                tags: [],
                sensitive: {
                    hair_color: '',
                    nipple_color: '',
                    tatoo: '',
                    piercing: '',
                    scar: '',
                    underhair: '',
                },
                subscription: {

                },
                areas: {
                    ng_deliver: [],
                },
                ng: {},
                conf_lock: false,
                permission_lock: false,
                email: {
                    'deploy': '',
                },
            },
            castdata_for_child: null,
            schedule: {},
            schedule_display: [],
            schedule_fakeorder: {},
            images: {
                icon: null,
            },
            can_edit_permission: false,
            is_loading: false,
            areas: [],
            areas_query: '',
            stations: [],
            stations_query: '',
            croppa: {
                icon: {
                    myCroppa: null,
                    is_show: false,
                },
                d_w: 200,
            },
        }
    },
    computed: {
        checkData: function() {
            if (this.castdata.profile) {
                return true;
            } else {
                return false;
            }
        },
        displayEmail: function() {
            if (this.castdata.email) {
                return `${this.castdata.email.localpart}@foofle.app`;
            } else {
                return '';
            }
        },
    },
    watch: {
        'castdata.permission_lock': function(val) {
            if (!val) {
                this.submitPermission('unset');
            }
        },
    },
    mounted: function() {
        this.croppa.d_w = window.innerHeight * 0.5;
        this.setBlankSchedule();
        this.fetchData().finally(() => {
            this.initial_loading = false;
        });
        this.getStations().then((arr) => {
            this.stations = arr;
        });
        this.getAreas().then((arr) => {
            this.areas = arr;
        });
        this.$nextTick(function () {
            var mySwiper = new Swiper ('.swiper-container', {
                direction: 'horizontal',
                speed: 100,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        })
    },
    methods: {
        setBlankSchedule: function() {
            let cal = (function() {
                let d = new Date(), obj = {}, arr = [[],[],[],[]], fo_arr = [],
                day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
                day_num = d.getDay();
                d.setDate(d.getDate() - day_num);

                for (let i = 0; i < 28; i++, d.setDate(d.getDate() + 1)) {
                    let data = {
                        md: `${d.getMonth()+1}/${d.getDate()}`,
                        day: day[d.getDay()],
                        shift: { from: null, to: null },
                    };
                    let key = `${d.getFullYear()}-${('00'+(d.getMonth()+1)).slice(-2)}-${('00'+d.getDate()).slice(-2)}`;
                    obj[key] = data.shift;
                    arr[Math.floor(i / 7)].push(data);

                    if (i === day_num) {
                        fo_arr.push({
                            display: `本日(${d.getMonth()+1}/${d.getDate()})`,
                            value: key,
                        });
                    } else if (i > day_num) {
                        fo_arr.push({
                            display: `${d.getMonth()+1}/${d.getDate()}`,
                            value: key,
                        });
                    }
                }
                return [obj, arr, fo_arr];
            })();
            this.schedule = cal[0];
            this.schedule_display = cal[1];
            this.schedule_fakeorder = cal[2];
            this.fake_order.date = this.schedule_fakeorder[0].value;
        },
        fetchData: function() {
            let self = this;
            return axios({
                method: 'post',
                url: '/api/partner/castdata',
                data: { castid: this.$route.params.castid }
            }).then((response) => {
                if (response.status === 200) {

                    // areaのbind
                    if (response.data.cast.hasOwnProperty('config') && response.data.cast.config.hasOwnProperty('areas')) {
                        for (let key in response.data.cast.config.areas) {
                            self.castdata.areas[key] = response.data.cast.config.areas[key];
                        }
                    }

                    // Profileのbind
                    if (response.data.cast.hasOwnProperty('profile')) {
                        for (let key in response.data.cast.profile) {
                            self.castdata.profile[key] = response.data.cast.profile[key];
                        }
                    }

                    // Sensitiveのbind
                    if (response.data.cast.hasOwnProperty('sensitive')) {
                        for (let key in response.data.cast.sensitive) {
                            self.castdata.sensitive[key] = response.data.cast.sensitive[key];
                        }
                    }

                    // Tagsのbind
                    if (response.data.cast.hasOwnProperty('tags')) {
                        self.castdata.tags = response.data.cast.tags;
                    }

                    // Scheduleのbind
                    if (response.data.cast.hasOwnProperty('schedule')) {
                        for (let key in response.data.cast.schedule) {
                            if (self.schedule.hasOwnProperty(key)) {
                                self.schedule[key].from = response.data.cast.schedule[key].from;
                                self.schedule[key].to = response.data.cast.schedule[key].to;
                            }
                        }
                    }

                    // Reserveのbind
                    if (response.data.cast.hasOwnProperty('reserve')) {
                        self.castdata.reserve = response.data.cast.reserve;
                    }

                    // Reviewのbind
                    if (response.data.cast.hasOwnProperty('review')) {
                        self.castdata.review = response.data.cast.review;
                    }

                    // PermissionのBind
                    if (response.data.cast.hasOwnProperty('permission')) {
                        self.castdata.permission = response.data.cast.permission;
                    }

                    // NgのBind
                    if (response.data.cast.hasOwnProperty('ng')) {
                        self.castdata.ng = response.data.cast.ng;
                    }

                    // conf_detailのBind
                    if (response.data.cast.hasOwnProperty('conf_lock')) {
                        self.castdata.conf_lock = response.data.cast.conf_lock;
                        self.castdata.permission_lock = response.data.cast.permission_lock;
                    }

                    // EamilのBind
                    if (response.data.cast.hasOwnProperty('email')) {
                        self.castdata.email = response.data.cast.email;
                    }

                    self.castdata_for_child = response.data.cast;
                }
                return Promise.resolve();
            }).catch((error) => {
                this.$eventHub.$emit('notification', {attr:'is-warning', message:`${error}データの取得に失敗しました。\n時間を空けてお試しください。`});
                return Promise.reject();
            });
        },
        selectAll: function(e) {
            e.preventDefault();
            e.target.select();
        },
        submitScheduleData: function(e) {
            e.preventDefault();
            this.is_loading = true;
            let self = this;

            axios({
                url: '/api/partner/castdata/schedule',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    castid: this.castid,
                    schedule: this.schedule,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                }
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
            }).finally(function (fin) {
                self.is_loading = false;
            });
        },
        endAreaDrag: function(e) {
            let from = e.from.dataset.area;
            let to = e.to.dataset.area;
            if (from === to) {
                return false;
            }

            let fromobj = (from === 'areas' || from === 'stations') ? null : this.castdata.areas[from];console.log(fromobj);
            if (fromobj) {
                for (let i = fromobj.length - 1; i >= 0; i--) {
                    if (e.item.dataset.id == fromobj[i].id) {
                        fromobj.splice(i, 1);
                        break;
                    }
                }
            }

            let toobj = (to === 'areas' || to === 'stations') ? null : this.castdata.areas[to];
            if (toobj) {
                let obj = {
                    id: e.item.dataset.id,
                    name: e.item.dataset.name,
                    is_area: from === 'areas',
                }
                toobj.push(obj);
            }

            u(e.item).remove();
        },
        submitProfileData: function(e) {
            e.preventDefault();
            this.is_loading = true;
            let self = this;

            axios({
                url: '/api/partner/castdata/profile',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    castid: this.castid,
                    profile: this.castdata.profile,
                    sensitive: this.castdata.sensitive,
                    areas: this.castdata.areas,
                    tags: this.castdata.tags,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                }
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
            }).finally(function (fin) {
                self.is_loading = false;
            });

        },
        createFakeOrder: function() {
            this.fake_order.is_sending = true;
            let self = this;

            axios({
                url: '/api/partner/fakeorder',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    castid: this.castid,
                    date: this.fake_order.date,
                    from: this.fake_order.from,
                    to: this.fake_order.to,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                }
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
            }).finally(function (fin) {
                self.fake_order.is_sending = false;
            });
        },
        toggleCroppa: function(type) {
            let obj = this.croppa[type];
            obj.is_show = !obj.is_show;
        },
        uploadImage: function(type) {
            let obj = this.croppa[type];
            let self = this;
            obj.myCroppa.generateBlob((blob) => {
                let fd = new FormData();
                fd.append('image', blob);
                fd.append('cast_id', this.castid);
                fd.append('type', type);
                axios({
                    method: 'POST',
                    url: '/api/partner/castdata/image',
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    },
                    data: fd,
                }).then((res) => {
                    obj.is_show = false;
                    self.fetchData();
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                }).catch((err) => {
                    self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
                });
            }, 'image/jpeg', 0.8);
        },
        onFileTypeMismatch: function() {

        },
        onFileSizeExceed: function() {

        },
        submitPermission: function(type) {
            this.is_loading = true;
            let self = this;
            axios({
                url: '/api/partner/castdata/permission',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    castid: this.castid,
                    permission: this.castdata.permission,
                    type: type,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                }
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
            }).finally(function (fin) {
                self.is_loading = false;
            });
        },
        submitDeployEmail: function() {
            let self = this;
            axios({
                url: '/api/partner/castdata/deployemail',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    castid: this.castid,
                    email: this.castdata.email.deploy,
                },
            })
            .then(function (response) {
                if (response.data === 'Success') {
                    self.$eventHub.$emit('notification', {attr:'is-success', message:'保存しました。'});
                } else {
                    self.$eventHub.$emit('notification', {attr:'is-warning', message:'保存に失敗しました。\n時間を空けてお試しください。'});
                }
            })
            .catch(function (error) {
                self.$eventHub.$emit('notification', {attr:'is-danger', message:'保存に失敗しました。\n通信状態を確認してください。'});
            }).finally(function (fin) {
                self.is_loading = false;
            });
        },
    },
    components: {
        Permission, Loading, CastDetailSystem, Draggable, AsyncLoading,
    },
    mixins: [
        GetMaster, timeHelper, formatData,
    ],
}
</script>

<style scoped>
/* Atoduke */
.header {
    display: flex;
    align-items: center;

}

.header picture {
    width: 20%;
    max-width: 140px;
    max-height: 140px;
}

.ffa-detail-prop {
    width: auto !important;
    display: flex;
    flex-wrap: wrap;
    margin-left: 30px;
    padding: 15px;
    box-shadow: var(--mbs-level1);
}

.fake-order {
    width: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content:center;
    margin-left: 30px;
    padding: 15px;
    box-shadow: var(--mbs-level1);
}

.fake-order h3{
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
}

.fake-order .form-parts {
    margin-bottom: 0.3rem;
}

/* Detail */
.ffa-detail {
    align-items: flex-start;
}

.top-thumbnail >>> img {
    object-fit: cover;
    border-radius: 100%;
}

.ffa-detail > img {
    width: 160px;
    height: auto;
}

.ffa-detail-prop {
    display: flex;
    flex-wrap: wrap;
    margin-left: 30px;
    padding: 15px;
    box-shadow: var(--mbs-level1);
}

.ffa-detail-prop > div {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    padding: 10px 0;
}

.ffa-detail-prop > div > p:nth-child(1){
    width: 25%;
}

.ffa-tabs {
    width: 100%;
    margin-top: 50px;
    padding-bottom: 40px;
    background-color: #fff;
    box-shadow: var(--mbs-level1);
}

.ffa-tab-item {
    width: calc(100%/7);
    height: 50px;
    border-bottom: 3px solid var(--cl-blue);
    background-color: var(--cl-grey);
    line-height: 50px;
    text-align: center;
    display: block;
    float: left;
    text-align: center;
    transition: all 0.2s ease;
}

.ffa-tab-item:hover {
    opacity: 0.75;
}

.ffa-tabs input[name="tab_item"] {
    display: none;
}

.ffa-tabs .ffa-tab-content {
    display: none;
    padding: 40px 40px 0;
    clear: both;
    overflow: hidden;
}

#tabs_schedule:checked ~ #tabs_schedule_content,
#tabs_reserve:checked ~ #tabs_reserve_content,
#tabs_profile:checked ~ #tabs_profile_content,
#tabs_system:checked ~ #tabs_system_content,
#tabs_review:checked ~ #tabs_review_content,
#tabs_analysis:checked ~ #tabs_analysis_content,
#tabs_conf:checked ~ #tabs_conf_content {
    display: block;
}

.ffa-tabs input:checked + .ffa-tab-item {
    background-color: var(--cl-blue);
    color: #fff;
}

.ffa-detail-schedule {
    padding: 0 38px;
}

.ffa-detail-schedule p {
    width: 100%;
    text-align: center;
}

.ffa-detail-schedule > div {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
}

.ffa-detail-schedule-block {
    margin-top: 20px;
    padding: 10px;
}

.swiper-slide:nth-child(2n+1) .ffa-detail-schedule-block:nth-child(2n),
.swiper-slide:nth-child(2n) .ffa-detail-schedule-block:nth-child(2n+1) {
    background-color: var(--cl-grey);
}

.ffa-detail-schedule-block div {
    margin-top: 10px;
}

.ffa-detail-schedule-block input {
    font-size: 14px;
    line-height: 14px;
    width: 100%;
    text-align: center;
    border: 1px solid var(--cl-blue);
    border-radius: 3px;
}

.ffa-detail .swiper-button-next,
.ffa-detail .swiper-button-prev {
    top: 20px;
    width: 15px;
    height: 24px;
    background-size: 15px 24px;
}
.ffa-detail .swiper-button-next {
    right: 40%;
}
.ffa-detail .swiper-button-prev {
    left: 40%;
}

#tabs_profile_content table:first-child tr th:first-child {
    width: 160px;
}

#tabs_profile_content table:first-child td > div{
    width: 140px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.ffa-tagpick-list > div {
    width: 100%;
    height: 100%;
}

.ffa-tagselect-list {
    width: 100%;
    height: auto;
    padding: 10px;
}

input::placeholder {
    font-size: 1rem;
}

.iconimg-inside-td >>> img {
    width: 120px;
}

.email-text-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.2rem;
}

.email-text-btn p {
    font-size: 0.8rem;
}

/* Croppa */
.croppa-modal {
    width: 100%;
    height: 100vh;
    background-color: #000000aa;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.croppa-container {
    align-self: unset !important;
}

.croppa-container >>> canvas {
    border-radius: 100rem;
}

.croppa-btn {
    width: 100%;
    position: absolute;
    top: 3rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
}

.croppa-btn > div {
    border-radius: 100rem;
}

.croppa-btn > div:hover {
    cursor: pointer;
    opacity: 0.8;
}

.croppa-btn > div.fix {
    color: #FFF;
    background: #FFF;
    background: var(--cl-blue);
    padding: 1rem 3rem;
}

.croppa-btn > div.cancel {
    color: #FFF;
    background-color: #AAA;
    padding: 1rem;
    margin-right: 2rem;
}
</style>
