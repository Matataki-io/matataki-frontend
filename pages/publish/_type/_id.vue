<template>
  <div class="new-post" @click.stop="closeDropdown">
    <div class="edit-content">
      <div class="edit-head">
        <svg-icon class="back-icon" icon-class="back1" @click="backRouter" />
        <input
          v-model="title"
          :placeholder="$t('publish.titlePlaceholder')"
          class="edit-title"
          size="large"
          clearable
          maxlength="50"
        >
        <span class="save-tips" v-html="saveDraft" />
        <router-link
          :to="{ name: 'user-id-draft', params: { id: currentUserInfo.id } }"
          class="save-draft"
        >
          {{ $t("publish.draft") }}
        </router-link>
        <div class="import-button" @click="importVisible = true">
          <svg-icon class="import-icon" icon-class="import" />
          {{ $t("publish.importArticle") }}
        </div>

        <div
          v-loading.fullscreen.lock="fullscreenLoading"
          class="setting"
          @click="showSettingDialog('setting')"
        >
          {{ $t("setting") }}
        </div>

        <div
          v-loading.fullscreen.lock="fullscreenLoading"
          class="post"
          @click="showSettingDialog('publish')"
        >
          {{ $t("publish.publish") }}
        </div>
      </div>

      <client-only>
        <mavon-editor
          ref="md"
          v-model="markdownData"
          :box-shadow="false"
          :autofocus="false"
          :placeholder="editorPlaceholder"
          :style="editorStyle"
          class="editor"
          image-upload-action="customize"
          :image-upload-fn="imageUploadFn"
          :encryption="encryption"
          @tool-mobile-import="toolMobileImport"
        >
          <div slot="tool-mobile" class="draft-btn">
            <span class="draft-save-tips" v-html="saveDraft" />
            <router-link
              :to="{
                name: 'user-id-draft',
                params: { id: currentUserInfo.id },
              }"
              class="draft-save-draft"
            >
              {{ $t("publish.draft") }}
            </router-link>
          </div>

          <div slot="tool-view-mobile" class="draft-btn">
            <span class="draft-save-tips" v-html="saveDraft" />
            <router-link
              :to="{
                name: 'user-id-draft',
                params: { id: currentUserInfo.id },
              }"
              class="draft-save-draft"
            >
              {{ $t("publish.draft") }}
            </router-link>
          </div>
        </mavon-editor>
      </client-only>
    </div>

    <article-transfer
      v-if="isShowTransfer"
      v-model="transferModal"
      :article-id="Number($route.params.id)"
      :from="$route.params.type"
      @toggleDone="allowLeave = true"
    />
    <articleImport
      v-model="importVisible"
      :open-new-page="false"
      @res="importRes"
    />
    <statement :visible="statementVisible" @close="closeStatement" />
    <!-- 设置 发布 dialog -->
    <div v-show="settingDialog" class="set-m-dialog">
      <div class="set-dialog">
        <h1 class="set-title">
          {{ $t("basic-settings") }}
        </h1>
        <h4 class="set-subtitle">
          {{ $t("publish.coverTitle")
          }}<span class="remarks">{{ $t("publish.coverRecommendation") }}</span>
        </h4>
        <div class="set-content">
          <div class="cover">
            <img-upload
              v-show="!cover"
              :append-to-body="true"
              :img-upload-done="imgUploadDone"
              :aspect-ratio="2 / 1"
              :update-type="'artileCover'"
              class="cover-upload"
              @doneImageUpload="doneImageUpload"
            >
              <img
                slot="uploadButton"
                class="cover-add"
                src="@/assets/img/add.svg"
                alt="add"
              >
            </img-upload>

            <div v-show="cover">
              <img :src="coverEditor" class="cover-img" alt="cover">
            </div>
            <img
              v-show="cover"
              class="cover-remove"
              src="@/assets/img/del.svg"
              alt="remove"
              @click.prevent="removeCover"
            >
          </div>
        </div>
        <!-- tag -->
        <tagModule
          :tag-max-len="tagMaxLen"
          :tags="tags"
          @removeTag="removeTag"
          @addTag="addTag"
        />
        <h4 class="set-subtitle">
          {{ $t("link-fan-ticket") }}
        </h4>
        <div
          v-if="!isAssosiateWith"
          v-loading="alltokenLoading"
          class="set-content"
          style="display: flex; align-items: center"
        >
          <el-select
            v-model="assosiateWith"
            size="small"
            :placeholder="$t('please-choose')"
            style="width: 40%"
            filterable
          >
            <el-option
              v-for="item in allTokenOptions"
              :key="item.id"
              :label="item.symbol + '-' + item.name"
              :value="item.id"
            />
          </el-select>
          <el-button
            type="primary"
            size="small"
            style="margin-left: 0.5rem"
            @click="setAssosiateWith"
          >
            {{ $t("related") }}
          </el-button>
        </div>
        <div v-if="isAssosiateWith" class="set-content">
          <div class="img-container fl ac">
            <div class="overlay-box">
              <img :src="assosiateFanLogo" alt="logo">
            </div>
            <img
              class="related-btn"
              src="@/assets/img/del.svg"
              alt="remove"
              @click.prevent="cancelAssosiate"
            >
          </div>
        </div>
        <h4 class="set-subtitle">
          {{ $t("original-statement") }}
          <el-tooltip
            effect="dark"
            :content="
              $t(
                'to-set-the-copyright-information-of-your-article-it-cannot-be-modified-after-publishing'
              )
            "
            placement="top-start"
          >
            <svg-icon class="help-icon" icon-class="help" />
          </el-tooltip>
        </h4>
        <div class="set-content">
          <div class="post-content">
            <el-checkbox
              v-model="isOriginal"
              class="is-original"
              :disabled="$route.params.type === 'edit'"
              @change="originalChange"
            >
              {{ $t("publish.original") }}
            </el-checkbox>
            <div v-if="isOriginal" class="cc-licensing">
              <h3>
                {{ $t("creative-commons-license-agreement") }}
                <el-tooltip
                  effect="dark"
                  :content="$t('creative-commons-tips')"
                  placement="top-start"
                >
                  <i class="el-icon-info" />
                </el-tooltip>
              </h3>
              <h3>
                {{
                  $t(
                    "do-you-allow-this-work-to-be-reproduced-excerpted-mixed-or-re-created-by-others"
                  )
                }}
              </h3>
              <el-radio
                v-model="ccLicenseOptions.share"
                :disabled="$route.params.type === 'edit'"
                label="true"
              >
                {{ $t("allow") }}
              </el-radio>
              <br>
              <el-radio
                v-model="ccLicenseOptions.share"
                :disabled="$route.params.type === 'edit'"
                label="false"
              >
                {{ $t("not-allowed") }}
                <el-tooltip
                  effect="dark"
                  :content="
                    $t(
                      'others-can-no-longer-mix-convert-or-create-based-on-the-work-and-cannot-distribute-the-modified-work'
                    )
                  "
                  placement="top-start"
                >
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-radio>
              <br>
              <el-radio
                v-model="ccLicenseOptions.share"
                :disabled="$route.params.type === 'edit'"
                label="SA"
              >
                {{
                  $t(
                    "only-secondary-creation-authorized-by-this-agreement-is-allowed"
                  )
                }}
                <el-tooltip
                  effect="dark"
                  :content="$t('sa-tips')"
                  placement="top-start"
                >
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-radio>
              <el-checkbox
                v-model="ccLicenseOptions.commercialUse"
                :disabled="$route.params.type === 'edit'"
                class="is-original"
              >
                {{ $t("commercial-use-allowed") }}
              </el-checkbox>
              <p>
                {{ $t("the-authorization-terms-are") }}：
                {{ CCLicenseCredit.chinese }}
              </p>
            </div>
          </div>
        </div>
        <h1 class="set-title set-title-border">
          {{ $t("permission-settings") }}
        </h1>
        <h4 class="set-subtitle">
          {{ $t("reading-permission-settings") }}
          <el-tooltip
            effect="dark"
            :content="$t('read-permission-settings-tips')"
            placement="top-start"
          >
            <svg-icon class="help-icon" icon-class="help" />
          </el-tooltip>
        </h4>
        <div class="set-content">
          <el-radio
            v-model="readConfigRadio"
            :disabled="prohibitEditingPrices"
            label="all"
          >
            {{ $t("visible-to-all") }}
          </el-radio>
          <br>
          <!-- Fan票发行者特权功能 -->
          <div
            :class="noTokenAvailable && !prohibitEditingPrices && 'privileged'"
          >
            <el-radio
              v-model="readConfigRadio"
              :disabled="prohibitEditingPrices || noTokenAvailable"
              label="token"
            >
              {{ $t("visible-with-currency") }}
            </el-radio>
            <div
              class="privileged-guide"
              :class="
                noTokenAvailable && !prohibitEditingPrices && 'show-guide'
              "
            >
              <span>
                {{
                  $t("fan-ticket-issuer-and-collaborator-privilege-function")
                }}
              </span>
              <el-button size="small" type="warning" @click="openWj">
                {{ $t("apply-immediately") }}
              </el-button>
            </div>
          </div>
          <!-- label="cny" 不需要改为 MTTK积分 -->
          <el-radio
            v-model="readConfigRadio"
            :disabled="prohibitEditingPrices"
            label="cny"
          >
            {{ $t("payment-visible") }}
          </el-radio>

          <div class="post-content root-setting">
            <div style="max-width: 380px">
              <transition name="fade">
                <div v-show="readauThority" class="fl ac">
                  <div>
                    <h3>{{ $t("fan-ticket-type") }}</h3>
                    <el-select
                      v-model="readSelectValue"
                      size="small"
                      :placeholder="$t('please-choose')"
                      style="width: 100%"
                      filterable
                      :disabled="prohibitEditingPrices || noTokenAvailable"
                    >
                      <el-option
                        v-for="item in readSelectOptions"
                        :key="item.id"
                        :label="item.symbol + '-' + item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </div>
                  <div style="margin-left: 10px">
                    <h3>{{ $t("number-of-fan-tickets") }}</h3>
                    <el-input
                      v-model="readToken"
                      :min="1"
                      :max="100000000"
                      size="small"
                      :placeholder="$t('please-enter-the-quantity')"
                      :disabled="prohibitEditingPrices || noTokenAvailable"
                    />
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div v-show="paymentTokenVisible" class="fl ac">
                  <div>
                    <h3>{{ $t("payment-types") }}</h3>
                    <el-select
                      v-model="paymentSelectValue"
                      size="small"
                      :placeholder="$t('please-choose')"
                      style="width: 100%"
                      filterable
                      :disabled="prohibitEditingPrices"
                    >
                      <el-option
                        v-for="item in paymentSelectOptions"
                        :key="item.id"
                        :label="item.symbol + '-' + item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </div>
                  <div style="margin-left: 10px">
                    <h3>{{ $t("quantity-paid") }}</h3>
                    <el-input
                      v-model="paymentToken"
                      :min="1"
                      :max="100000000"
                      size="small"
                      :placeholder="$t('please-enter-content')"
                      :disabled="prohibitEditingPrices"
                    />
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div v-show="readauThority || paymentTokenVisible">
                  <h3>{{ $t("abstract") }}</h3>
                  <el-input
                    v-model="readSummary"
                    :autosize="{ minRows: 6, maxRows: 12 }"
                    size="small"
                    type="textarea"
                    :placeholder="$t('please-enter-content')"
                    maxlength="300"
                    show-word-limit
                    class="customize-input"
                  />
                </div>
              </transition>
            </div>
          </div>
        </div>
        <h4 class="set-subtitle">
          {{ $t("edit-permission-settings-experimental-function") }}
          <el-tooltip
            effect="dark"
            :content="$t('edit-permission-tips')"
            placement="top-start"
          >
            <svg-icon class="help-icon" icon-class="help" />
          </el-tooltip>
        </h4>
        <div class="set-content">
          <el-radio
            v-model="editConfigRadio"
            :disabled="prohibitEditingPrices"
            label="all"
          >
            {{ $t("only-you-can-edit") }}
          </el-radio>
          <br>
          <!-- Fan票发行者特权功能 -->
          <div
            :class="noTokenAvailable && !prohibitEditingPrices && 'privileged'"
          >
            <el-radio
              v-model="editConfigRadio"
              :disabled="prohibitEditingPrices || noTokenAvailable"
              label="token"
            >
              {{ $t("currency-can-be-edited") }}
            </el-radio>
            <div
              class="privileged-guide"
              :class="
                noTokenAvailable && !prohibitEditingPrices && 'show-guide'
              "
            >
              <span>
                {{
                  $t("fan-ticket-issuer-and-collaborator-privilege-function")
                }}
              </span>
              <el-button size="small" type="warning" @click="openWj">
                {{ $t("apply-immediately") }}
              </el-button>
            </div>
          </div>

          <div class="post-content root-setting">
            <div style="max-width: 380px">
              <transition name="fade">
                <div v-show="tokenEditAuthority" class="fl ac">
                  <div>
                    <h3>{{ $t("fan-ticket-type") }}</h3>
                    <el-select
                      v-model="editSelectValue"
                      size="small"
                      :placeholder="$t('please-choose')"
                      style="width: 100%"
                      filterable
                      :disabled="prohibitEditingPrices || noTokenAvailable"
                    >
                      <el-option
                        v-for="item in readSelectOptions"
                        :key="item.id"
                        :label="item.symbol + '-' + item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </div>
                  <div style="margin-left: 10px">
                    <h3>{{ $t("number-of-fan-tickets") }}</h3>
                    <el-input
                      v-model="editToken"
                      :min="1"
                      :max="100000000"
                      size="small"
                      :placeholder="$t('please-enter-content')"
                      :disabled="prohibitEditingPrices || noTokenAvailable"
                    />
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div v-show="buyEditAuthority" class="fl ac">
                  <div>
                    <h3>{{ $t("payment-types") }}</h3>
                    <el-select
                      v-model="paymentSelectValue"
                      size="small"
                      :placeholder="$t('please-choose')"
                      style="width: 100%"
                      filterable
                    >
                      <el-option
                        v-for="item in paymentSelectOptions"
                        :key="item.id"
                        :label="item.symbol + '-' + item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </div>
                  <div style="margin-left: 10px">
                    <h3>{{ $t("quantity-paid") }}</h3>
                    <el-input
                      v-model="editPaymentToken"
                      :min="1"
                      :max="100000000"
                      size="small"
                      :placeholder="$t('please-enter-content')"
                      :disabled="prohibitEditingPrices"
                    />
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <h4 class="set-subtitle">
          {{ $t("whether-to-make-the-article-history-public") }}
          <el-tooltip
            effect="dark"
            :content="$t('open-history-article-tips')"
            placement="top-start"
          >
            <svg-icon class="help-icon" icon-class="help" />
          </el-tooltip>
        </h4>
        <div class="set-content">
          <el-radio v-model="ipfs_hide" :label="true">
            {{ $t("only-visible-to-you") }}
          </el-radio>
          <br>
          <el-radio v-model="ipfs_hide" :label="false">
            {{ $t("publicly-visible") }}
          </el-radio>
        </div>

        <div>
          <h1 class="set-title set-title-border">
            {{ $t("publish-settings") }}
          </h1>
          <!-- 选择发布时间 -->
          <div v-if="$route.params.type !== 'edit'">
            <h4 class="set-subtitle">
              {{ $t("timed-release") }}
              <el-tooltip
                effect="dark"
                :content="$t('timed-release-tips')"
                placement="top-start"
              >
                <svg-icon class="help-icon" icon-class="help" />
              </el-tooltip>

              <el-switch
                v-model="timedForm.switch"
                class="timed-switch"
                active-color="#542DE0"
                inactive-color="#DBDBDB"
              />
            </h4>
            <div class="set-content timed-picker">
              <el-date-picker
                v-if="timedForm.switch"
                v-model="timedForm.date"
                size="small"
                type="datetime"
                :placeholder="$t('choose-date-and-time')"
                align="right"
                format="yyyy-MM-dd HH:mm"
                :picker-options="timedOptions"
              />
            </div>
          </div>

          <!-- 选择是否发文到GitHub -->
          <h4 class="set-subtitle">
            {{ $t("publish.whereToPublish") }}
            <el-tooltip
              class="max-width-80"
              effect="dark"
              placement="top-start"
            >
              <div slot="content">
                <div v-html="$t('publish.whereToPublishDescription')" />
                <a href="https://meta.io/p/8101" class="el-tooltip-link">{{
                  $t("publish.whereToPublishHelp")
                }}</a>
              </div>
              <svg-icon class="help-icon" icon-class="help" />
            </el-tooltip>
          </h4>
          <div class="set-content">
            <el-radio
              v-model="isIndiePost"
              :label="false"
              :disabled="$route.params.type === 'edit'"
            >
              {{ $t("publish.publishToIPFS") }}
            </el-radio>
            <br>
            <el-radio
              v-if="$route.params.type === 'edit'"
              v-model="isIndiePost"
              :label="true"
              :disabled="true"
            >
              {{ $t("publish.publishToGithub") }}
            </el-radio>
            <el-radio
              v-else-if="isIndieBlogCreated"
              v-model="isIndiePost"
              :label="true"
            >
              {{ $t("publish.publishToGithub") }}
            </el-radio>
            <el-tooltip
              v-else
              :content="$t('indie-blog.cannot-save-to-indie-blog')"
            >
              <el-radio v-model="isIndiePost" :label="true" :disabled="true">
                {{ $t("publish.publishToGithub") }}
              </el-radio>
            </el-tooltip>

            <transition name="fade">
              <div v-if="isIndiePost" style="margin: 10px 0">
                <el-checkbox v-model="indieSyncTags" :label="true">
                  {{ $t("publish.syncTagsToIndieBlog") }}
                </el-checkbox>
              </div>
            </transition>
          </div>
        </div>

        <div class="set-captcha">
          <vue-hcaptcha
            v-if="doINeedHCaptcha"
            ref="hCaptcha"
            :sitekey="hCaptchaSiteKey"
            :language="appLang"
            @verify="onCaptchaVerify"
            @expired="onExpire"
            @error="onError"
            @reset="onCaptchaReset"
          />
        </div>

        <div class="set-footer">
          <el-button v-if="isShowDraftPreview" size="medium" @click="goPreview">
            {{ $t("preview-now") }}
          </el-button>
          <!-- <router-link :to="{name: 'user-id-draft', params: {id: currentUserInfo.id}}">
            <el-button size="medium">
              返回草稿箱
            </el-button>
          </router-link> -->
          <template v-if="settingDialogMode === 'setting'">
            <el-button
              v-if="isShowTransfer"
              type="danger"
              size="medium"
              @click="delArticle"
            >
              {{ $t("delete-this") }}
            </el-button>
            <el-button
              v-if="isShowTransfer"
              type="danger"
              size="medium"
              @click="transferArticle"
            >
              {{ $t("transfer-draft") }}
            </el-button>
          </template>
          <el-button
            v-if="$route.params.type === 'edit'"
            size="medium"
            style="margin-left: 10px"
            @click="saveAsDraft"
          >
            {{ $t("save-as-draft") }}
          </el-button>
          <div class="publish-content">
            <el-button
              type="primary"
              size="medium"
              :class="
                $route.params.type === 'draft' &&
                  settingDialogMode === 'setting' &&
                  'set'
              "
              :disabled="!isCaptchaOK"
              @click="sendThePost"
            >
              {{ timedForm.switch ? $t("timed-release") : $t("publish-now") }}
            </el-button>
          </div>
        </div>

        <svg-icon
          class="close-icon"
          icon-class="close_thin"
          @click="settingDialog = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
let mavonEditor = {
  mavonEditor: null,
}
if (process.client) {
  mavonEditor = require('@matataki/editor')
}

// import '@matataki/editor/dist/css/index.css'
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
import throttle from 'lodash/throttle'
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash/debounce'
// import { toolbars } from '@/config/toolbars' // 编辑器配置
import { strTrim } from '@/utils/reg'

import {
  convertLicenseToChinese,
  CreativeCommonsLicenseGenerator,
} from '@/utils/creative_commons'
import imgUpload from '@/components/imgUpload' // 图片上传
import articleTransfer from '@/components/articleTransfer'

import articleImport from '@/components/article_import/index.vue'
import statement from '@/components/statement/index.vue'

import { toPrecision, precision } from '@/utils/precisionConversion'
import { getCookie } from '@/utils/cookie'
import { CNY } from '@/components/exchange/consts.js'

import tagModule from '@/components/publish_page/tag'

function newDatePicker(time) {
  const date = new Date()
  date.setSeconds(0)
  date.setMilliseconds(0)
  date.setTime(date.getTime() + time)
  return date
}

export default {
  name: 'NewPost',
  components: {
    'mavon-editor': mavonEditor.mavonEditor,
    imgUpload,
    articleTransfer,
    VueHcaptcha,
    articleImport,
    statement,
    tagModule,
  },
  layout: 'empty',
  data() {
    return {
      prompt: false,
      title: '',
      author: '',
      markdownData: '',
      doINeedHCaptcha: false,
      fissionFactor: 2000,
      // toolbars: {},
      screenWidth: 1000,
      fissionNum: 2,
      cover: '',
      signId: '',
      id: '',
      isOriginal: false, // 是否原创
      imgUploadDone: 0,
      ccLicenseOptions: {
        share: 'false',
        commercialUse: false,
      },
      hCaptchaData: {
        expired: false,
        token: null,
        eKey: null,
        error: null,
      },
      showModal: false, // 弹框显示
      modalText: {
        text: [this.$t('publish.modalTextText')], // 退出
        button: [
          this.$t('publish.modalTextButton1'),
          this.$t('publish.modalTextButton2'),
        ],
      },
      modalMode: null, // header 判断点击的 back 还是 home
      tags: [], // 标签
      tagVal: '', // 标签内容
      tagMaxLen: 10, // 最大标签数
      articleData: {}, // 文章数据
      transferButton: false, // 转让按钮
      transferModal: false, // 转让弹框
      allowLeave: false, // 允许离开
      saveInfo: {},
      importVisible: false, // 导入
      statementVisible: false, // 原创声明
      commentPayPoint: 1,
      autoUpdateDfaft: false, // 是否自动更新草稿
      saveDraft: '文章自动保存至',
      assosiateFan: '',
      assosiateFanName: '',
      assosiateFanLogo: '',
      assosiateWith: null,
      isAssosiateWith: false,
      readContent: false,
      readauThority: false, // 持通证阅读
      tokenEditAuthority: false,
      buyEditAuthority: false,
      readToken: 1, // 阅读token数量
      editToken: 1, // 编辑token数量
      readSelectOptions: [], // 阅读tokenlist
      allTokenOptions: [], // 全部 token list
      readSelectValue: '', // 阅读tokenlist show value
      editSelectValue: '', // 编辑tokenlist show value
      paymentTokenVisible: false, // 支付可见
      paymentToken: 0, // 支付token
      editPaymentToken: 0, // 编辑文章需支付token数量
      paymentSelectValue: '', // 支付tokenlist show value
      readSummary: '',
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,
      editorStyle: {},
      fullscreenLoading: false,
      resizeEvent: null,
      authorId: 0,
      prohibitEditingPrices: false,
      // 加密语法
      encryption:
        '\n\n[read hold="SYMBOL amount"]\n\n隐藏内容\n> [📔使用说明](https://www.yuque.com/matataki/matataki/giw9u4)\n\n[else]\n\n预览内容\n\n[/read]\n',
      settingDialog: false, // 设置 发布页面dialog
      settingDialogMode: '', // setting publish
      // 阅读权限
      readConfigRadio: 'all',
      // 编辑权限
      editConfigRadio: 'all',
      ipfs_hide: true,
      // 是否为发布到独立子站的文章
      isIndiePost: false,
      // 是否同步标签到独立子站
      indieSyncTags: false,
      editorPlaceholder: '',
      alltokenLoading: true,
      timedForm: {
        switch: false,
        date: '',
      },
      timedOptions: {
        shortcuts: [
          {
            text: '一小时后',
            onClick(picker) {
              picker.$emit('pick', newDatePicker(3600 * 1000))
            },
          },
          {
            text: '明天',
            onClick(picker) {
              picker.$emit('pick', newDatePicker(3600 * 1000 * 24))
            },
          },
          {
            text: '后天',
            onClick(picker) {
              picker.$emit('pick', newDatePicker(3600 * 1000 * 48))
            },
          },
          {
            text: '一周后',
            onClick(picker) {
              picker.$emit('pick', newDatePicker(3600 * 1000 * 24 * 7))
            },
          },
        ],
      },
      isIndieBlogCreated: false,
    }
  },
  head() {
    return {
      title: '瞬MATATAKI - 创作',
      link: [
        // { rel: 'stylesheet', type: 'text/css', href: '/@matataki/editor/index.css' }, // editor css
      ],
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'metamask/account', 'isMe']),
    coverEditor() {
      return this.cover ? this.$ossProcess(this.cover) : ''
    },
    hCaptchaSiteKey() {
      return process.env.VUE_APP_HCAPTCHA_SITE_KEY
    },
    isCaptchaOK() {
      // 如果是白名单，则为 true
      // if (!this.doINeedHCaptcha) return true
      // return !this.hCaptchaData.expired && Boolean(this.hCaptchaData.token)

      return true
    },
    isShowTransfer() {
      return this.$route.params.type === 'draft'
    },
    // 显示预览链接
    isShowDraftPreview() {
      return this.$route.params.type === 'draft'
    },
    isDevelopmentMode() {
      return process.env.NODE_ENV !== 'production'
    },
    CCLicenseCredit() {
      if (!this.isOriginal) return null //非原创不适用
      let ShareAlike = false
      const Noncommercial = !this.ccLicenseOptions.commercialUse
      let NoDerivativeWorks = false
      if (this.ccLicenseOptions.share === 'false') NoDerivativeWorks = true
      if (this.ccLicenseOptions.share === 'SA') ShareAlike = true
      const license = CreativeCommonsLicenseGenerator({
        ShareAlike,
        Noncommercial,
        NoDerivativeWorks,
      })
      const chinese = convertLicenseToChinese(license)
      const url = `https://creativecommons.org/licenses/${license.toLowerCase()}/4.0/deed.zh`
      return { license, chinese, url }
    },
    requireToken() {
      let tokenArr = []
      if (this.readauThority) {
        // 持通证
        // 获取当前选择的通证种
        const token = this.readSelectOptions.filter(
          (list) => list.id === this.readSelectValue
        )
        if (token.length === 0) return []
        // 目前只用上传一种数据格式
        tokenArr = [
          {
            tokenId: token[0].id,
            amount: toPrecision(this.readToken, 'cny', token[0].decimals),
          },
        ]
      }
      return tokenArr
    },
    /** 持币编辑 */
    editRequireToken() {
      let tokenArr = []
      if (this.tokenEditAuthority) {
        // 持通证
        // 获取当前选择的通证种
        const token = this.readSelectOptions.filter(
          (list) => list.id === this.editSelectValue
        )
        if (token.length === 0) return []
        // 目前只用上传一种数据格式
        tokenArr = [
          {
            tokenId: token[0].id,
            amount: toPrecision(this.editToken, 'cny', token[0].decimals),
          },
        ]
      }
      return tokenArr
    },
    requireBuy() {
      if (this.paymentToken === 0) return null
      if (!this.paymentTokenVisible) {
        return null
      } else {
        let tokenArr = []
        const token = this.paymentSelectOptions.filter(
          (list) => list.id === this.paymentSelectValue
        )
        if (token.length === 0) return []
        // 目前只用上传一种数据格式
        tokenArr = [
          {
            tokenId: token[0].id,
            amount: toPrecision(this.paymentToken, 'cny', token[0].decimals),
          },
        ]
        return tokenArr
      }
    },
    /** 付费编辑 */
    editRequireBuy() {
      if (this.editPaymentToken === 0) return null
      if (!this.buyEditAuthority) {
        return null
      } else {
        const data = {
          price: toPrecision(this.editPaymentToken, 'cny', 4), // 默认四位小数
        }
        return data
      }
    },
    paymentSelectOptions() {
      return [CNY, ...this.readSelectOptions]
    },
    noTokenAvailable() {
      return !this.readSelectOptions || this.readSelectOptions.length === 0
    },
    appLang() {
      return getCookie('language')
    },
  },
  watch: {
    'timedForm.dateText': function (val) {
      console.log(JSON.stringify(val))
    },
    fissionNum() {
      this.fissionFactor = this.fissionNum * 1000
    },
    title(val) {
      this.updateDraftWatch()
      // 观察标题，且仅用于开发模式
      if (val === '扯淡' && this.isDevelopmentMode) {
        this.generateBullshit()
      }
    },
    markdownData() {
      this.updateDraftWatch()
    },
    commentPayPoint() {
      this.updateDraftWatch()
    },
    coverEditor() {
      this.updateDraftWatch()
    },
    isOriginal() {
      this.updateDraftWatch()
    },
    // 标签改变
    tags: {
      deep: true,
      handler() {
        this.updateDraftWatch()
      },
    },
    // 协议
    CCLicenseCredit() {
      this.updateDraftWatch()
    },
    // 阅读权限  单选 设置持币 设置持币类型 设置持币数量
    readConfigRadio(val) {
      console.log('val', val)
      this.readauThority = val === 'token'
      this.paymentTokenVisible = val === 'cny'

      this.updateDraftWatch()
    },
    readauThority() {
      this.updateDraftWatch()
    },
    readSelectValue() {
      this.updateDraftWatch()
    },
    readToken() {
      this.updateDraftWatch()
    },

    // 阅读权限 支付阅读
    paymentTokenVisible() {
      this.updateDraftWatch()
    },
    paymentToken() {
      this.updateDraftWatch()
    },

    // 摘要
    readSummary() {
      this.updateDraftWatch()
    },

    // 编辑权限 单选 设置复选 选择框 数量
    editConfigRadio(val) {
      this.tokenEditAuthority = val === 'token'
      this.updateDraftWatch()
    },
    tokenEditAuthority() {
      this.updateDraftWatch()
    },
    editSelectValue() {
      this.updateDraftWatch()
    },
    editToken() {
      this.updateDraftWatch()
    },
    assosiateWith() {
      this.updateDraftWatch()
    },

    // 是否公开
    ipfs_hide() {
      this.updateDraftWatch()
    },
  },
  created() {
    // 编辑文章不会自动保存
    if (this.$route.params.type === 'edit') this.saveDraft = ''

    if (process.browser) {
      this._resizeEditor()
      this.resizeEvent = throttle(this._resizeEditor, 300)
      window.addEventListener('resize', this.resizeEvent)

      this.setEditorPlaceholder()
    }
  },
  mounted() {
    if (this.assosiateWith) {
      this.setAssosiateWith()
    }

    // TODO: Hide HCapthca
    // this.$API.doINeedHCaptcha().then((_doINeedHCaptcha) => {
    //   this.doINeedHCaptcha = _doINeedHCaptcha
    // })

    const { type, id } = this.$route.params

    if (type === 'draft' && id === 'create') {
      // 创建新草稿
      this.autoUpdateDfaft = true
    } else if (type === 'draft' && id !== 'create') {
      // 编辑草稿
      this.getDraft(id)
    } else if (type === 'edit') {
      const { hash } = this.$route.query
      // 编辑文章
      if (process.browser) {
        this.$nextTick(() => {
          this.setArticleDataById(hash, id)
          this.isIndiePost = hash.startsWith('Gh')
        })
      }
    } else {
      console.log('路由错误')
      this.$router.push({
        name: 'publish-type-id',
        params: { type: 'draft', id: 'create' },
      })
    }

    this.getBindableTokenList()
    this.getAllTokens()
    // this.setToolBar()
    this.getIndieBlogStatus()
  },
  beforeRouteLeave(to, from, next) {
    // 只有编辑页面使用
    if (this.$route.params.type === 'edit') {
      if (this.changed()) return next()
      if (window.confirm(this.$t('publish.modalTextText'))) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },
  beforeMount() {
    window.addEventListener('beforeunload', this.unload)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.unload)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },

  methods: {
    ...mapActions(['getSignatureOfArticle']),
    // 关联 Fan 票
    setAssosiateWith() {
      if (this.assosiateWith === null)
        this.$message({
          showClose: false,
          message: '请选择你要关联的 Fan 票',
          type: 'error',
        })
      else {
        let token = this.allTokenOptions.find(
          (option) => option.id === Number(this.assosiateWith)
        )
        if (!token)
          return this.$message.error(
            `找不到ID为：${this.assosiateWith} 的Fan票`
          )
        this.isAssosiateWith = true
        this.assosiateFanName = token.name
        this.assosiateFanLogo = this.$API.getImg(token.logo)
      }
    },
    onCaptchaVerify(token, eKey) {
      this.hCaptchaData = { token, eKey, expired: false }
    },
    onExpire() {
      this.hCaptchaData = { token: null, eKey: null, expired: true }
    },
    onError(err) {
      this.hCaptchaData = { token: null, eKey: null, expired: true }
      console.error('captcha error: ', err)
    },
    // 当hCaptcha状态重置时，重置hCaptchaData对象的值
    onCaptchaReset() {
      this.hCaptchaData = {
        expired: false,
        token: null,
        eKey: null,
        error: null,
      }
    },
    // 取消关联
    cancelAssosiate() {
      this.isAssosiateWith = false
      this.assosiateWith = null
    },
    // 设置编辑器提示字
    setEditorPlaceholder() {
      const clientWidth =
        document.body.clientWidth || document.documentElement.clientWidth
      if (clientWidth < 768) {
        this.editorPlaceholder = this.$t('publish.contentPlaceholderMobile')
      } else {
        this.editorPlaceholder = this.$t('publish.contentPlaceholder')
      }
    },
    _resizeEditor() {
      const clientHeight =
        document.body.clientHeight || document.documentElement.clientHeight
      const clientWidth =
        document.body.clientWidth || document.documentElement.clientWidth
      this.editorStyle = {
        height: `${clientHeight - (clientWidth < 768 ? 47 : 60)}px`,
      }
    },
    // watch 监听草稿更新
    updateDraftWatch() {
      if (!this.autoUpdateDfaft) return
      this.updateDraftFunc()
    },
    // 更新草稿方法
    updateDraftFunc: debounce(function () {
      const { title, markdownData: content, fissionFactor, cover, tags } = this
      const is_original = Number(this.isOriginal)
      const { type, id } = this.$route.params

      if (type === 'draft' && id === 'create') {
        // console.log('创建草稿')
        let data = {
          title,
          content,
          fissionFactor,
          cover,
          is_original,
          tags,
          assosiate_with: this.assosiateWith,
          commentPayPoint: 0,
          short_content: '',
          cc_license: this.isOriginal ? this.CCLicenseCredit.license : '',
          ipfs_hide: 0,
          requireToken: [], // 阅读 持币
          requireBuy: [], // 阅读 购买
          editRequireToken: [], // 编辑 持币
        }
        this.autoCreateDraft(this.draftFactory(data))
      } else if (type === 'draft' && id !== 'create') {
        // console.log('更新草稿')
        // 草稿箱编辑 更新
        let data = {
          id: this.id,
          title,
          content,
          fissionFactor,
          cover,
          is_original,
          tags,
          assosiate_with: this.assosiateWith,
          commentPayPoint: 0,
          short_content: '',
          cc_license: this.isOriginal ? this.CCLicenseCredit.license : '',
          ipfs_hide: 0,
          requireToken: [], // 阅读 持币
          requireBuy: [], // 阅读 购买
          editRequireToken: [], // 编辑 持币
        }
        this.autoUpdateDraft(this.draftFactory(data))
      }
    }, 500),
    unload($event) {
      // 只有编辑页面使用
      if (this.$route.params.type === 'edit') {
        if (!this.allowLeave) {
          // 刷新页面 关闭页面有提示
          // https://jsfiddle.net/jbf4vL7h/29/
          const confirmationMessage = 'o/'
          $event.returnValue = confirmationMessage // Gecko, Trident, Chrome 34+
          return confirmationMessage // Gecko, WebKit, Chrome <34
        }
      }
    },
    changed() {
      // 如果允许关闭 或者 内容都为空
      return (
        this.allowLeave || (!strTrim(this.title) && !strTrim(this.markdownData))
      )
    },
    // 通过ID拿数据
    async setArticleDataById(hash, id) {
      try {
        const res = await this.$API.getIpfsData(hash, true)
        if (res.code === 0) {
          // 设置文章内容
          this.title = res.data.title
          this.markdownData = res.data.content
          this.renderMarkdown()
        } else
          this.$message({
            showClose: true,
            message: res.message,
            type: 'warning',
          })
      } catch (e) {
        console.log('err', e)
      }
      // 获取文章信息
      await this.$API
        .getCanEditPost(id)
        .then((res) => {
          // console.log('获取文章信息:', id, res)
          if (res.code === 0) {
            this.fissionNum = res.data.fission_factor / 1000
            this.signature = res.data.sign
            this.cover = res.data.cover
            this.signId = res.data.id
            this.isOriginal = Boolean(res.data.is_original)
            this.authorId = res.data.uid
            this.ipfs_hide = Boolean(res.data.ipfs_hide)
            this.prohibitEditingPrices =
              this.$route.params.type === 'edit' && !this.isMe(res.data.uid)

            this.tags = res.data.tags.map((i) => i.name)

            this.assosiateWith = res.data.assosiate_with
            if (this.assosiateWith && this.allTokenOptions.length > 0) {
              this.setAssosiateWith()
            }

            this.setCCLicense(res.data.cc_license)

            // 持通证阅读
            if (res.data.tokens && res.data.tokens.length !== 0) {
              this.readauThority = true
              this.readToken = precision(
                res.data.tokens[0].amount,
                'cny',
                res.data.tokens[0].decimals
              )
              this.readSummary = res.data.short_content
              // this.readSelectOptions = res.data.tokens
              this.readSelectValue = res.data.tokens[0].id
            }

            // 持通证编辑
            if (res.data.editTokens && res.data.editTokens.length !== 0) {
              this.tokenEditAuthority = true
              this.editToken = precision(
                res.data.editTokens[0].amount,
                'cny',
                res.data.editTokens[0].decimals
              )
              this.editSelectValue = res.data.editTokens[0].id
            }

            // 付费阅读
            if (res.data.prices && res.data.prices.length !== 0) {
              this.paymentTokenVisible = true
              this.paymentToken = precision(
                res.data.prices[0].price,
                res.data.prices[0].platform,
                res.data.prices[0].decimals
              )
              this.readSummary = res.data.short_content
              this.paymentSelectValue = res.data.prices[0].token_id
            }

            // 付费编辑
            if (res.data.editPrices && res.data.editPrices.length !== 0) {
              this.buyEditAuthority = true
              this.editPaymentToken = precision(
                res.data.editPrices[0].price,
                res.data.editPrices[0].platform,
                res.data.editPrices[0].decimals
              )
              this.paymentSelectValue = ''
            }

            // 有 持通证阅读 || 付费阅读 展示单选区域
            if (this.paymentTokenVisible) this.readConfigRadio = 'cny'
            else if (this.readauThority) this.readConfigRadio = 'token'
            else this.readConfigRadio = 'all'

            //有 持通证编辑 || 付费编辑
            if (this.buyEditAuthority) this.editConfigRadio = 'cny'
            else if (this.tokenEditAuthority) this.editConfigRadio = 'token'
            else this.editConfigRadio = 'all'
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error',
            })
            this.$router.push({ path: '/article' })
          }
        })
        .catch((err) => {
          console.error(err)
          this.$message.error(this.$t('error.getArticleInfoError'))
          this.$router.push({ path: '/article' })
        })
    },
    // 得到草稿箱内容 by id
    async getDraft(id) {
      await this.$API
        .getDraft({ id })
        .then((res) => {
          if (res.code === 0) {
            let { data } = res
            this.fissionNum = data.fission_factor
              ? data.fission_factor / 1000
              : 2
            this.cover = data.cover
            this.title = data.title
            this.markdownData = data.content
            this.id = data.id
            this.isOriginal = Boolean(data.is_original)
            this.commentPayPoint = data.comment_pay_point

            this.tags = data.tags
            this.assosiateWith = data.assosiate_with
            this.ipfs_hide = Boolean(data.ipfs_hide)

            if (
              this.allTokenOptions.length !== 0 &&
              this.assosiate_with !== undefined
            ) {
              this.setAssosiateWith()
            }

            this.setCCLicense(data.cc_license)

            // 持通证阅读
            if (data.require_holdtokens.length !== 0) {
              this.readauThority = true
              this.readToken = precision(
                data.require_holdtokens[0].amount,
                'CNY',
                4
              )
              this.readSummary = data.short_content
              this.readSelectValue = data.require_holdtokens[0].token_id
            }

            // 付费阅读
            if (data.require_buy.length !== 0) {
              this.paymentTokenVisible = true
              this.paymentToken = precision(
                data.require_buy[0].amount,
                'CNY',
                4
              )
              this.readSummary = data.short_content
              this.paymentSelectValue = data.require_buy[0].token_id
            }

            // 持通证编辑
            if (data.editor_require_holdtokens.length !== 0) {
              this.tokenEditAuthority = true
              this.editToken = precision(
                data.editor_require_holdtokens[0].amount,
                'CNY',
                4
              )
              this.editSelectValue =
                res.data.editor_require_holdtokens[0].token_id
            }

            // 暂无付费编辑

            // 有 持通证阅读 || 付费阅读 展示单选区域
            if (this.paymentTokenVisible) this.readConfigRadio = 'cny'
            else if (this.readauThority) this.readConfigRadio = 'token'
            else this.readConfigRadio = 'all'

            //有 持通证编辑 || 付费编辑
            if (this.buyEditAuthority) this.editConfigRadio = 'cny'
            else if (this.tokenEditAuthority) this.editConfigRadio = 'token'
            else this.editConfigRadio = 'all'
          } else {
            console.log(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.autoUpdateDfaft = true
        })
    },
    // 错误提示
    failed(error) {
      console.error('发送失败', error)
      this.$message.error(error)
    },
    // 跳转页面
    jumpToArticle(id) {
      this.$router.push({
        name: 'p-id',
        params: {
          id: id,
        },
      })
    },
    // 成功提示
    success(hash, msg = this.$t('success.public')) {
      this.$message.success(msg)
      this.jumpToArticle(hash)
    },
    /** 获取可选的Token */
    async getBindableTokenList() {
      try {
        const res = await this.$API.getBindableTokenList()
        if (res.code === 0) {
          // 如果有的话，吧自己发行的Fan票放到第一位
          this.readSelectOptions = this.topOwnToken(res.data)
        } else this.$message.error(res.message)
      } catch (e) {
        console.error(e)
        this.$message.error(this.$t('error.fail'))
      }
    },
    /**
     * 获取所有token
     */
    async getAllTokens() {
      const pagesize = 999
      await this.$API
        .allToken({ pagesize })
        .then((res) => {
          this.alltokenLoading = false
          if (res.code === 0) {
            // 如果有的话，吧自己发行的Fan票放到第一位
            this.allTokenOptions = this.topOwnToken(res.data.list)
            // 检查用户有没有发Fan票，如果有的话，就填写进表单中
            const isNewArticle =
              this.$route.params.type === 'draft' &&
              this.$route.params.id === 'create'
            if (isNewArticle && this.isMe({ ...this.allTokenOptions[0] }.uid)) {
              this.assosiateWith = this.allTokenOptions[0].id
            }
            if (this.assosiateWith) this.setAssosiateWith()
          }
        })
        .catch((err) => console.log(err))
    },
    // 文章持通证阅读
    async postMineTokens(id) {
      let data = null
      const { type } = this.$route.params
      // 如果是编辑 并且没有设置 传递空数组
      // 如果是发布文章 没有设置不会进入这里
      if (type === 'edit' && !this.readauThority) {
        data = {
          signId: id,
          tokens: [],
        }
      } else {
        let tokenArr = []
        if (this.readauThority) {
          // 持通证
          // 获取当前选择的通证种
          const token = this.readSelectOptions.filter(
            (list) => list.id === this.readSelectValue
          )
          // 目前只用上传一种数据格式
          tokenArr = [
            {
              tokenId: token[0].id,
              amount: toPrecision(this.readToken, 'cny', token[0].decimals),
            },
          ]
        }
        data = {
          signId: id,
          tokens: tokenArr,
        }
      }

      const res = await this.$API.addMineTokens(data)
      if (res.code === 0) return res.message
      else throw res.message
    },
    // 文章支付阅读
    async articlePrices(id) {
      const { type } = this.$route.params
      // 如果是编辑 并且没有设置 删除
      // 如果是发布文章 没有设置不会进入这里
      if (type === 'edit' && !this.paymentTokenVisible) {
        const res = await this.$API.articlePricesDelete(id)
        if (res.code === 0) return res.message
        else throw res.message
      } else {
        const data = {
          price: toPrecision(this.paymentToken, 'cny', 4), // 默认四位小数
        }
        const res = await this.$API.articlePrices(id, data)
        if (res.code === 0) return res.message
        else throw res.message
      }
    },
    // 发送文章到ipfs
    async sendPost({ title, author, content }) {
      try {
        const res = await this.$API.sendPost({
          title,
          author,
          content,
          desc: 'whatever',
        })
        if (res.code === 0) return res
        else {
          this.failed(this.$t('error.sendPostIpfsFail'))
          return false
        }
      } catch (error) {
        console.log('sendPost error', error)
        this.failed('上传ipfs失败')
        return false
      }
    },
    // 发布文章
    async publishArticle(article) {
      // 设置文章标签 🏷️
      article.tags = this.tags

      // 关联 Fan 票
      article.assosiateWith = this.assosiateWith

      article.cc_license = this.isOriginal
        ? this.CCLicenseCredit.license
        : null
      article.requireBuy = this.requireBuy
      article.requireToken = this.requireToken

      // 编辑权限
      article.editRequireToken = this.editRequireToken
      article.editRequireBuy = this.editRequireBuy

      // 设置积分
      article.commentPayPoint = this.commentPayPoint
      article.ipfs_hide = this.ipfs_hide
      article.hCaptchaData = this.hCaptchaData

      // 设置文章保存位置
      article.indie_post = this.isIndiePost

      // 设置是否同步标签到个人子站
      /* 必须同时指定了发送到 Github 和选择了同步标签，才发送此属性为 true */
      article.indie_sync_tags = this.isIndiePost && this.indieSyncTags

      try {
        // 取消钱包签名, 暂注释后面再彻底删除 start
        const response = await this.$API.publishArticle({ article })
        if (response.code !== 0) throw new Error(response.message)

        // 关联文章  草稿发布时发布引用的文章
        const data = {
          signId: response.data,
        }
        if (this.$route.params.id) {
          const res = await this.$API.draftsReferencesPublish(
            this.$route.params.id,
            data
          )
          if (res.code === 0) {
            // 发送完成开始设置阅读权限 因为需要返回的id
            const promiseArr = []
            if (this.readauThority)
              promiseArr.push(this.postMineTokens(response.data)) // 持通证阅读
            if (this.paymentTokenVisible)
              promiseArr.push(this.articlePrices(response.data)) // 支付通证
            promiseArr.push(this.delDraft(this.$route.params.id)) // 删除草稿
            await Promise.all(promiseArr) // 上面的方法里面判断了code 所以这里就不需要判断了
            this.success(response.data)
            this.fullscreenLoading = false // remove full loading
          } else {
            throw new Error(res.message)
          }
        } else {
          throw new Error('没有文章ID')
        }
      } catch (error) {
        console.log(error)
        this.fullscreenLoading = false // remove full loading
        this.$message.error(error.toString())
        // 失败后重置hCaptcha状态
        this.$refs.hCaptcha.reset()
      }
    },
    // 定时发布文章
    async timedPublish() {
      if (!this.id) {
        this.fullscreenLoading = false
        this.$message.warning('创建定时任务的草稿不存在')
        return
      }
      if (!this.timedForm.date) {
        this.fullscreenLoading = false
        this.$message.warning('请填写发布时间')
        return
      }
      try {
        const result = await this.$API.timedPublishArticle(
          this.id,
          this.timedForm.date,
          this.hCaptchaData
        )
        this.fullscreenLoading = false
        if (result.code === 0) {
          this.$message.success('成功创建定时发布任务')
          this.$router.push({
            name: 'user-id-draft',
            params: { id: this.currentUserInfo.id },
          })
        } else this.$message.error(result.message)
      } catch (e) {
        this.fullscreenLoading = false
        console.error(e)
        this.$message.error(`错误：${e.toString()}`)
      }
    },
    // 自动创建草稿
    async autoCreateDraft(article) {
      this.saveDraft = '保存中...'
      // 设置文章标签 🏷️
      this.allowLeave = true
      await this.$API
        .createDraft(article)
        .then((res) => {
          if (res.code === 0) {
            this.saveDraft = '文章自动保存至'
            // console.log(this.$route)
            this.$route.params.id = res.data
            this.id = res.data
            // console.log(this.$route)
            const url = window.location.origin + '/publish/draft/' + res.data
            history.replaceState({}, '', url)
          } else
            this.saveDraft =
              '<span style="color: red">文章自动保存失败,请重试</span>'
        })
        .catch((err) => {
          console.log(err)
          this.saveDraft =
            '<span style="color: red">文章自动保存失败,请重试</span>'
        })
    },
    // 编辑文章
    async editArticle(article) {
      // 设置文章标签 🏷️
      article.tags = this.tags

      // 关联 Fan 票
      article.assosiateWith = this.assosiateWith

      article.requireBuy = this.requireBuy
      article.requireToken = this.requireToken

      // 编辑权限
      article.editRequireToken = this.editRequireToken
      article.editRequireBuy = this.editRequireBuy
      // History 权限
      article.ipfs_hide = this.ipfs_hide
      article.hCaptchaData = this.hCaptchaData
      // 文章保存位置
      article.indie_post = this.isIndiePost

      const { failed, success } = this
      try {
        const res = await this.$API.editArticle({ article })
        if (res.code === 0) {
          // 如果不是自己的文章，不设置阅读权限
          if (!this.isMe(this.authorId)) {
            success(res.data)
            this.fullscreenLoading = false // remove full loading
            return
          }
          // 发送完成开始设置阅读权限 因为需要返回的id
          const promiseArr = []
          promiseArr.push(this.postMineTokens(res.data)) // 持通证阅读
          promiseArr.push(this.articlePrices(res.data)) // 支付通证
          Promise.all(promiseArr)
            .then(() => {
              success(res.data)
              this.fullscreenLoading = false // remove full loading
            })
            .catch((err) => {
              console.log('err', err)
              this.$message.error(err)
              this.fullscreenLoading = false // remove full loading
            })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
          })
          throw new Error(res.message)
        }
      } catch (error) {
        console.error(error)
        this.fullscreenLoading = false // remove full loading
        failed(error)
        // 失败后重置hCaptcha状态
        this.$refs.hCaptcha.reset()
        throw error
      }
    },
    // 删除草稿
    async delDraft(id) {
      if (!id) throw this.$t('error.deleteDraft')
      else {
        const res = await this.$API.delDraft({ id })
        if (res.code === 0) return res.message
        else throw res.message
      }
    },
    // 更新草稿
    async autoUpdateDraft(article) {
      this.allowLeave = true
      this.saveDraft = '保存中...'
      try {
        const res = await this.$API.updateDraft(article)
        if (res.code === 0) {
          this.saveDraft = '文章自动保存至'
        } else
          this.saveDraft =
            '<span style="color: red">文章自动保存失败,请重试</span>'
      } catch (error) {
        this.saveDraft =
          '<span style="color: red">文章自动保存失败,请重试</span>'
      }
    },
    // 发布||修改按钮
    async sendThePost() {
      // 没有登录 点击发布按钮都提示登录  编辑获取内容的时候会被前面的func拦截并返回home page
      if (!getCookie('ACCESS_TOKEN')) {
        this.$store.commit('setLoginModal', true)
        return
      }

      // 标题或内容为空时
      if (!strTrim(this.markdownData)) {
        this.failed(this.$t('warning.titleOrContent'))
        return
      }

      // 没有封面 (开发者模式不强制封面 浪费oss空间)
      // 取消强制上传封面
      // if (!this.cover) {
      //   this.failed(this.$t('warning.cover'))
      //   return
      // }

      // 用户不填写裂变系数则默认为2
      if (this.fissionFactor === '') this.fissionFactor = 2

      // 检查阅读权限 如果当前是全部可见 修改复选框
      if (this.readConfigRadio === 'all') {
        this.readauThority = false
        this.paymentTokenVisible = false
      }

      // 检查编辑权限 如果当前是全部可见 修改复选框
      if (this.editConfigRadio === 'all') {
        this.tokenEditAuthority = false
        this.buyEditAuthority = false
      }

      this.allowLeave = true
      const { type } = this.$route.params

      const {
        currentUserInfo,
        markdownData: content,
        fissionFactor,
        cover,
      } = this
      let title = await this.processEmptyTitle('post')
      const { name: author } = currentUserInfo
      const isOriginal = Number(this.isOriginal)

      // url draft edit
      // 草稿发送
      const draftPost = async () => {
        if (this.readauThority) {
          if (!this.readSelectValue)
            return this.$message({
              showClose: true,
              message: '请选择持通证类型',
              type: 'warning',
            })
          else if (!(Number(this.readToken) > 0))
            return this.$message({
              showClose: true,
              message: '持通证数量设置不能小于0',
              type: 'warning',
            })
          else if (!this.readSummary)
            return this.$message({
              showClose: true,
              message: '请填写摘要',
              type: 'warning',
            })
        }

        // 持Fan票编辑
        if (this.tokenEditAuthority) {
          if (!this.editSelectValue)
            return this.$message({
              showClose: true,
              message: '请选择持通证类型',
              type: 'warning',
            })
          else if (!(Number(this.editToken) > 0))
            return this.$message({
              showClose: true,
              message: '持通证数量设置不能小于0',
              type: 'warning',
            })
        }

        if (this.paymentTokenVisible) {
          if (this.$utils.isNull(this.paymentSelectValue))
            return this.$message({
              showClose: true,
              message: '请选择支付类型',
              type: 'warning',
            })
          else if (!(Number(this.paymentToken) > 0))
            return this.$message({
              showClose: true,
              message: '支付数量设置不能小于0',
              type: 'warning',
            })
          else if (!this.readSummary)
            return this.$message({
              showClose: true,
              message: '请填写摘要',
              type: 'warning',
            })
        }

        // 付费编辑
        if (this.buyEditAuthority) {
          if (this.$utils.isNull(this.paymentSelectValue))
            return this.$message({
              showClose: true,
              message: '请选择支付类型',
              type: 'warning',
            })
          else if (!(Number(this.editPaymentToken) > 0))
            return this.$message({
              showClose: true,
              message: '支付数量设置不能小于0',
              type: 'warning',
            })
        }

        // 发布文章
        this.fullscreenLoading = true

        const data = { title, author, content }
        // this.fullscreenLoading = false // remove full loading

        if (this.timedForm.switch) {
          // 更新草稿
          await this.processEmptyTitle('time')
          await this.timedPublish()
        } else {
          const _shortContent = this.generateShortContent()
          this.publishArticle({
            author,
            title,
            data,
            fissionFactor,
            cover,
            isOriginal,
            shortContent:
              this.readauThority || this.paymentTokenVisible
                ? this.readSummary
                : _shortContent,
          })
        }
      }
      // 编辑发送
      const editPost = () => {
        if (this.readauThority) {
          if (!this.readSelectValue)
            return this.$message({
              showClose: true,
              message: '请选择持通证类型',
              type: 'warning',
            })
          else if (!(Number(this.readToken) > 0))
            return this.$message({
              showClose: true,
              message: '持通证数量设置不能小于0',
              type: 'warning',
            })
          else if (!this.readSummary)
            return this.$message({
              showClose: true,
              message: '请填写摘要',
              type: 'warning',
            })
        }

        // 持Fan票编辑
        if (this.tokenEditAuthority) {
          if (!this.editSelectValue)
            return this.$message({
              showClose: true,
              message: '请选择持通证类型',
              type: 'warning',
            })
          else if (!(Number(this.editToken) > 0))
            return this.$message({
              showClose: true,
              message: '持通证数量设置不能小于0',
              type: 'warning',
            })
        }
        // 支付可见
        if (this.paymentTokenVisible) {
          if (this.$utils.isNull(this.paymentSelectValue))
            return this.$message({
              showClose: true,
              message: '请选择支付类型',
              type: 'warning',
            })
          else if (!(Number(this.paymentToken) > 0))
            return this.$message({
              showClose: true,
              message: '支付数量设置不能小于0',
              type: 'warning',
            })
          else if (!this.readSummary)
            return this.$message({
              showClose: true,
              message: '请填写摘要',
              type: 'warning',
            })
        }

        // 付费编辑
        if (this.buyEditAuthority) {
          if (!this.paymentSelectValue)
            return this.$message({
              showClose: true,
              message: '请选择支付类型',
              type: 'warning',
            })
          else if (!(Number(this.editPaymentToken) > 0))
            return this.$message({
              showClose: true,
              message: '支付数量设置不能小于0',
              type: 'warning',
            })
        }

        this.fullscreenLoading = true
        const data = { title, author, content }
        // 摘要
        const _shortContent = this.generateShortContent()
        this.editArticle({
          signId: this.signId,
          author,
          title,
          data,
          fissionFactor,
          cover,
          isOriginal,
          shortContent:
            this.readauThority || this.paymentTokenVisible
              ? this.readSummary
              : _shortContent,
        })
      }

      if (type === 'draft') await draftPost()
      else if (type === 'edit') editPost()
      else await draftPost() // 错误的路由, 当发布文章处理
    },
    // 图片上传的回调方法
    async imageUploadFn(file) {
      try {
        const res = await this.$API.ossUploadImage('article', file)
        if (res.code === 0) {
          return this.$API.getImg(res.data)
        } else {
          console.log(res.message)
        }
        return
      } catch (e) {
        console.log(e)
      }
    },
    // setToolBar() {
    //   this.toolbars = Object.assign(toolbars.public, toolbars.pc)
    // },
    // 上传完成
    doneImageUpload(res) {
      // console.log(res);
      this.imgUploadDone += Date.now()
      this.cover = res.data.data.cover
    },
    // 删除cover
    removeCover() {
      this.cover = ''
    },
    // head 返回
    headerBackFunc() {
      this.modalMode = 'back'
      this.headLeavePageFunc()
    },
    // head 返回首页
    headerHomeFunc() {
      this.modalMode = 'home'
      this.headLeavePageFunc()
    },
    // head 离开页面方法
    headLeavePageFunc() {
      if (!strTrim(this.title) && !strTrim(this.markdownData)) {
        this.allowLeave = true
        this.leavePage()
      } else this.showModal = true
    },
    // 关闭modal
    changeInfo(status) {
      this.showModal = status
    },
    // modal 同意
    modalCancel() {
      this.showModal = false
      this.allowLeave = true
      this.leavePage()
    },
    // 离开页面
    leavePage() {
      if (this.modalMode === 'back') this.$router.go(-1)
      else if (this.modalMode === 'home') this.$router.push({ path: '/' })
      else this.$router.go(-1)
    },
    // 关闭原创声明框
    closeStatement(val) {
      // console.log(val)
      this.isOriginal = val
      this.statementVisible = false
    },
    // 原创改变 true 才显示原创声明
    originalChange(val) {
      if (val) this.statementVisible = true
    },
    closeDropdown() {
      this.transferButton = false
      this.readContent = false
    },
    importRes(res) {
      this.title = res.title
      this.markdownData = res.content
      this.cover = res.cover

      // max tags 10
      if (res.tags) {
        const tags = res.tags.split(',')
        this.tags = tags.slice(0, 10)
      } else {
        this.tags = []
      }
    },
    async generateBullshit() {
      const 扯淡生成器 = import('@/api/bullshit-generator.js')
      this.title = '【扯淡警告】只是一篇用来开发测试的文章'
      this.cover = '/image/2019/11/20/ebf10fad1a4a2e8e77f33140a1411b09.jpg'
      const { 生成文章 } = await 扯淡生成器
      this.markdownData = 生成文章()
    },
    // 显示设置 发布dialog
    showSettingDialog(val) {
      this.settingDialogMode = val
      this.settingDialog = true
    },
    // 删除这篇 文章||草稿
    delArticle() {
      // 判断有没有id
      const id = this.$route.params.id
      if (id === 'create' || !Number(id)) return

      const del = async () => {
        let res = null
        if (this.$route.params.type === 'edit') {
          // res = await this.$utils.factoryRequest(this.$API.delArticle({ id }))
        } else if (this.$route.params.type === 'draft') {
          res = await this.$utils.factoryRequest(this.$API.delDraft({ id }))
        } else {
          //
        }
        if (res) {
          this.allowLeave = true
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success',
          })
          this.$router.push({
            name: 'article',
          })
        }
      }

      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          del()
        })
        .catch(() => {})
    },
    // 文章 || 草稿 转让
    transferArticle() {
      const id = this.$route.params.id
      if (id === 'create' || !Number(id)) return

      this.transferModal = true
    },
    // 返回上一页
    backRouter() {
      this.$router.go(-1)
    },

    // 允许草稿预览
    async previewSetId(id) {
      try {
        const res = await this.$API.previewSetId({ id })
        if (res.code === 0) {
          return true
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
          })
          return false
        }
      } catch (e) {
        console.log(e)
        return false
      }
    },
    // 立即预览
    async goPreview() {
      const id = this.$route.params.id
      if (id === 'create' || !Number(id)) {
        this.$message({
          showClose: true,
          message: '先写点什么吧!',
          type: 'warning',
        })
        return
      }

      const res = this.previewSetId(this.$route.params.id)
      if (res) {
        window.open(
          `${window.location.origin}/preview/${this.$route.params.id}`
        )
      }
    },
    // 复制预览链接
    async copyPreview() {
      const id = this.$route.params.id
      if (id === 'create' || !Number(id)) {
        this.$message({
          showClose: true,
          message: '先写点什么吧!',
          type: 'warning',
        })
        return
      }

      const res = this.previewSetId(this.$route.params.id)
      if (res) {
        this.$copyText(
          `${window.location.origin}/preview/${this.$route.params.id}`
        ).then(
          () =>
            this.$message({
              showClose: true,
              message: this.$t('success.copy'),
              type: 'success',
            }),
          () =>
            this.$message({
              showClose: true,
              message: this.$t('error.copy'),
              type: 'error',
            })
        )
      }
    },
    // 添加标签
    addTag(data) {
      // 判断重复标签
      let tag = this.tags.find((i) => i === data.tag)
      if (tag) {
        this.$message({
          showClose: true,
          message: '标签重复了哦~',
          type: 'warning',
        })
      } else {
        this.tags.push(data.tag)
      }
    },
    // 删除标签
    removeTag(data) {
      let i = data.index
      this.tags.splice(i, 1)
    },
    // 另存为草稿
    saveAsDraft() {
      const confirmSaveAsDraft = () => {
        const {
          title, // 标题
          markdownData: content, // 内容
          fissionFactor, // 系数
          cover, // 封面
          tags, // 标签
        } = this

        const is_original = Number(this.isOriginal) // 原创声明

        let data = {
          title,
          content,
          cover,
          fissionFactor,
          is_original,
          tags,
          commentPayPoint: 0,
          short_content: '',
          cc_license: this.isOriginal ? this.CCLicenseCredit.license : '',
          ipfs_hide: 0,
          requireToken: [],
          requireBuy: [],
          editRequireToken: [],
          assosiate_with: this.assosiateWith,
        }

        data = this.draftFactory(data)

        let promiseArr = [
          this.$API.createDraft(data),
          // this.$API.delArticle({ id: this.$route.params.id }) // 创建完成 不删除文章
        ]
        Promise.all(promiseArr)
          .then((res) => {
            // 判断是否错误
            for (let i = 0; i < res.length; i++) {
              if (res[i].code !== 0) {
                this.$message.error(res[i].message)
                return
              }
            }

            // 操作完成后
            this.allowLeave = true
            this.$message.success(res[0].message)
            // this.$router.push({name: 'user-id-draft', params: {id: Number(this.currentUserInfo.id)}})
            console.log(res)
          })
          .catch((e) => {
            console.log(e)
          })
      }

      this.$confirm('是否另存为草稿?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          confirmSaveAsDraft()
        })
        .catch(() => {})
    },
    // 设置协议
    setCCLicense(cc) {
      // 不允许商业使用 复选框
      if (cc === 'BY-NC') {
        // 允许
        this.ccLicenseOptions.share = 'true'
        this.ccLicenseOptions.commercialUse = false
      } else if (cc === 'BY-NC-ND') {
        // 不允许
        this.ccLicenseOptions.share = 'false'
        this.ccLicenseOptions.commercialUse = false
      } else if (cc === 'BY-NC-SA') {
        // 允许采用本协议授权的二次创作
        this.ccLicenseOptions.share = 'SA'
        this.ccLicenseOptions.commercialUse = false
        // 允许商业使用 复选框
      } else if (cc === 'BY') {
        // 允许
        this.ccLicenseOptions.share = 'true'
        this.ccLicenseOptions.commercialUse = true
      } else if (cc === 'BY-ND') {
        // 不允许
        this.ccLicenseOptions.share = 'false'
        this.ccLicenseOptions.commercialUse = true
      } else if (cc === 'BY-SA') {
        // 允许采用本协议授权的二次创作
        this.ccLicenseOptions.share = 'SA'
        this.ccLicenseOptions.commercialUse = true
      } else {
        //
        console.log('未知协议不处理', cc)
      }
      console.log('当前协议', cc)
    },
    // 草稿对象加工
    draftFactory(data) {
      // 设置ipfs显示
      data.ipfs_hide = Boolean(this.ipfs_hide)

      // 阅读权限设置
      data.requireToken = this.requireToken

      // 支付阅读
      if (this.paymentTokenVisible) {
        data.requireBuy = [
          {
            tokenId: 0, // 默认四位小数
            amount: toPrecision(this.paymentToken, 'cny', 4), // 默认四位小数
          },
        ]
      }

      // 编辑权限
      data.editRequireToken = this.editRequireToken

      // 设置摘要
      const _shortContent = this.generateShortContent()
      data.short_content =
        this.readauThority || this.paymentTokenVisible
          ? this.readSummary
          : _shortContent

      return data
    },
    toolMobileImport() {
      this.importVisible = true
    },
    /** 吧自己的Fan票排到最前面 */
    topOwnToken(tokenList) {
      for (let i = 0; i < tokenList.length; i++) {
        if (this.isMe(tokenList[i].uid)) {
          tokenList.unshift(tokenList.splice(i, 1)[0])
          break
        }
      }
      return tokenList
    },
    // hack render markdown
    renderMarkdown() {
      setTimeout(() => {
        let previewContent = document.querySelector('#previewContent')
        // console.log('innerHTML', previewContent.innerHTML)

        let errorTips = `
          <span class="error-tips">发生了一些意料之外的错误，请尝试刷新或者改变左侧内容重新渲染界面！<br/><a onClick="window.location.reload();">立即刷新</a></span>
        `

        if (!previewContent.innerHTML) {
          this.allowLeave = true
          previewContent.innerHTML = errorTips
        }
      }, 1000)
    },
    openWj() {
      window.open('/token', '_blank')
    },
    // 生成简介
    generateShortContent() {
      try {
        let dom = document.querySelectorAll('#previewContent p') // 有些导入的文章是 Section 等标签包裹的，所以选择所有 P
        let domList = [...dom].filter((i) => !!i.innerText.trim()) // 过滤一些没有内容的
        const str = domList.reduce((t, c) => {
          return `${t} ${c.innerText}`
        }, '')
        // console.log(str)
        return str.trim().slice(0, 300)
      } catch (e) {
        console.log('e', e.toString())
        return '...'
      }
    },
    // 处理空标题 如果没有 Title 自动生成默认标题 发布时间 + “by” + 发布者username
    async processEmptyTitle(type) {
      let { title } = this
      let _title

      if (!title.trim()) {
        let _time = this.moment().format('YYYY.MM.DD HH:mm')
        let _username =
          this.currentUserInfo.nickname || this.currentUserInfo.name
        _title = `${_time} by ${_username}`
      } else {
        _title = title
      }

      // post // 发布文章处理空Title
      if (type === 'time') {
        // time 发布定时文章
        const { markdownData: content, fissionFactor, cover, tags } = this
        const is_original = Number(this.isOriginal)

        let data = {
          id: this.id,
          title: _title,
          content,
          fissionFactor,
          cover,
          is_original,
          tags,
          assosiate_with: this.assosiateWith,
          commentPayPoint: 0,
          short_content: '',
          cc_license: this.isOriginal ? this.CCLicenseCredit.license : '',
          ipfs_hide: 0,
          requireToken: [], // 阅读 持币
          requireBuy: [], // 阅读 购买
          editRequireToken: [], // 编辑 持币
        }
        await this.autoUpdateDraft(this.draftFactory(data))
      }

      return _title
    },
    /** 获取用户的独立子站状态 */
    async getIndieBlogStatus() {
      try {
        const res = await this.$API.getIndieBlogSiteStatus()
        this.isIndieBlogCreated = res && res.code !== 10021
      } catch (e) {
        this.isIndieBlogCreated = false
        console.log(e.message)
      }
    },
  },
}
</script>

<style scoped lang="less" src="../Publish.less"></style>
<style lang="less" src="../index.less"></style>
