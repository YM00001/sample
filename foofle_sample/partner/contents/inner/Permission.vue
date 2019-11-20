<template>
    <div v-if="permissionData">
      <table class="table is-fullwidth ffa-permission">
        <thead>
          <tr>
            <th>スケジュール</th>
            <td>編集許可</td>
            <td>閲覧許可</td>
            <td>閲覧拒否</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>スケジュールの新規作成</th>
            <td><input type="radio" name="radio1" value="2" v-model="permissionData.schedule.create"></td>
            <td><input type="radio" name="radio1" value="1" v-model="permissionData.schedule.create"></td>
            <td></td>
          </tr>
          <tr>
            <th>スケジュールの編集</th>
            <td><input type="radio" name="radio2" value="2" v-model="permissionData.schedule.edit"></td>
            <td><input type="radio" name="radio2" value="1" v-model="permissionData.schedule.edit"></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-permission">
        <thead>
          <tr>
            <th>予約</th>
            <td>編集許可</td>
            <td>閲覧許可</td>
            <td>閲覧拒否</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>予約マージンの編集</th>
            <td><input type="radio" name="radio3" value="2" v-model="permissionData.reserve.margin"></td>
            <td><input type="radio" name="radio3" value="1" v-model="permissionData.reserve.margin"></td>
            <td><input type="radio" name="radio3" value="0" v-model="permissionData.reserve.margin"></td>
          </tr>
          <tr>
            <th>NG顧客の設定</th>
            <td><input type="radio" name="radio22" value="2" v-model="permissionData.reserve.ng"></td>
            <td><input type="radio" name="radio22" vlaue="1" v-model="permissionData.reserve.ng"></td>
            <td><input type="radio" name="radio22" value="0" v-model="permissionData.reserve.ng"></td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-permission">
        <thead>
          <tr>
            <th>プロフィール</th>
            <td>編集許可</td>
            <td>閲覧許可</td>
            <td>閲覧拒否</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>プロフィール画像の編集</th>
            <td><input type="radio" name="radio4" value="2" v-model="permissionData.profile.image"></td>
            <td><input type="radio" name="radio4" value="1" v-model="permissionData.profile.image"></td>
            <td></td>
          </tr>
          <tr>
            <th>プロフィール文章の編集</th>
            <td><input type="radio" name="radio5" value="2" v-model="permissionData.profile.text"></td>
            <td><input type="radio" name="radio5" value="1" v-model="permissionData.profile.text"></td>
            <td></td>
          </tr>
          <tr>
            <th>補足情報の編集</th>
            <td><input type="radio" name="radio6" value="2" v-model="permissionData.profile.note"></td>
            <td><input type="radio" name="radio6" value="1" v-model="permissionData.profile.note"></td>
            <td></td>
          </tr>
          <tr>
            <th>エリア設定の編集</th>
            <td><input type="radio" name="radio7" value="2" v-model="permissionData.profile.area"></td>
            <td><input type="radio" name="radio7" value="1" v-model="permissionData.profile.area"></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-permission">
        <thead>
          <tr>
            <th>料金システム</th>
            <td>編集許可</td>
            <td>閲覧許可</td>
            <td>閲覧拒否</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>料金・時間の編集</th>
            <td><input type="radio" name="radio8" value="2" v-model="permissionData.system.price"></td>
            <td><input type="radio" name="radio8" value="1" v-model="permissionData.system.price"></td>
            <td></td>
          </tr>
          <tr>
            <th>基本プレイの編集</th>
            <td><input type="radio" name="radio9" value="2" v-model="permissionData.system.standard"></td>
            <td><input type="radio" name="radio9" value="1" v-model="permissionData.system.standard"></td>
            <td></td>
          </tr>
          <tr>
            <th>オプションプレイの編集</th>
            <td><input type="radio" name="radio10" value="2" v-model="permissionData.system.option"></td>
            <td><input type="radio" name="radio10" value="1" v-model="permissionData.system.option"></td>
            <td></td>
          </tr>
          <tr>
            <th>基本エリア・派遣エリア設定の編集</th>
            <td><input type="radio" name="radio11" value="2" v-model="permissionData.system.area"></td>
            <td><input type="radio" name="radio11" value="1" v-model="permissionData.system.area"></td>
            <td></td>
          </tr>
          <tr>
            <th>派遣NGエリア設定の編集</th>
            <td><input type="radio" name="radio111" value="2" v-model="permissionData.system.ng"></td>
            <td><input type="radio" name="radio111" value="1" v-model="permissionData.system.ng"></td>
            <td><input type="radio" name="radio111" value="0" v-model="permissionData.system.ng"></td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-permission">
        <thead>
          <tr>
            <th>レビュー</th>
            <td>編集許可</td>
            <td>閲覧許可</td>
            <td>閲覧拒否</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>非公開レビューの閲覧</th>
            <td></td>
            <td><input type="radio" name="radio12" value="1" v-model="permissionData.review.closed"></td>
            <td><input type="radio" name="radio12" value="0" v-model="permissionData.review.closed"></td>
          </tr>
          <tr>
            <th>レビューへの返信</th>
            <td><input type="radio" name="radio13" value="2" v-model="permissionData.review.reaction"></td>
            <td><input type="radio" name="radio13" value="1" v-model="permissionData.review.reaction"></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <table class="table is-fullwidth ffa-permission">
        <thead>
          <tr>
            <th>分析</th>
            <td>編集許可</td>
            <td>閲覧許可</td>
            <td>閲覧拒否</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>キャストスコア</th>
            <td></td>
            <td><input type="radio" name="radio14" value="1" v-model="permissionData.analysis.score"></td>
            <td><input type="radio" name="radio14" value="0" v-model="permissionData.analysis.score"></td>
          </tr>
        </tbody>
      </table>
      <div class="ffa-btn">
          <p v-if="!disabled" @click="submitData">保存</p>
          <Loading v-else></Loading>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import Loading from './PartnerLoading.vue';

export default {
    data() {
        return {
        }
    },
    props: [
        'permissionData', 'disabled',
    ],
    methods: {
        submitData: function() {
            this.$emit('submit');
        },
    },
    components: {
        Loading,
    }
}
</script>

<style scoped>

</style>
