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
export default {
    data() {
        return {

        }
    },
    methods: {
        submitData: function() {

        },
    },
}
</script>

<style scoped>

</style>
