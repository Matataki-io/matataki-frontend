<template>
  <div
    class="new-post"
    @click.stop="closeDropdown"
  >
    <div class="edit-content">
      <div class="edit-head">
        <svg-icon
          class="back-icon"
          icon-class="back1"
          @click="backRouter"
        />
        <input
          v-model="title"
          :placeholder="$t('publish.titlePlaceholder')"
          class="edit-title"
          size="large"
          clearable
          maxlength="50"
        >
        <span
          class="save-tips"
          v-html="saveDraft"
        />
        <router-link
          :to="{name: 'user-id-draft', params: {id: currentUserInfo.id}}"
          class="save-draft"
        >
          草稿
        </router-link>
        <div
          class="import-button"
          @click="importVisible = true"
        >
          <svg-icon
            class="import-icon"
            icon-class="import"
          />
          {{ $t('publish.importArticle') }}
        </div>

        <div
          v-loading.fullscreen.lock="fullscreenLoading"
          class="setting"
          @click="showSettingDialog('setting')"
        >
          {{ $t('setting') }}
        </div>

        <div
          v-loading.fullscreen.lock="fullscreenLoading"
          class="post"
          @click="showSettingDialog('publish')"
        >
          {{ $t('publish.publish') }}
        </div>
      </div>

      <no-ssr>
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
            <span
              class="draft-save-tips"
              v-html="saveDraft"
            />
            <router-link
              :to="{name: 'user-id-draft', params: {id: currentUserInfo.id}}"
              class="draft-save-draft"
            >
              草稿
            </router-link>
          </div>
  
          <div slot="tool-view-mobile" class="draft-btn">
            <span
              class="draft-save-tips"
              v-html="saveDraft"
            />
            <router-link
              :to="{name: 'user-id-draft', params: {id: currentUserInfo.id}}"
              class="draft-save-draft"
            >
              草稿
            </router-link>
          </div>
        </mavon-editor>
      </no-ssr>
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
    <statement
      :visible="statementVisible"
      @close="closeStatement"
    />
    <!-- 设置 发布 dialog -->
    <div v-show="settingDialog" class="set-m-dialog">
      <div class="set-dialog">
        <!-- <h3 v-if="isShowDraftPreview" class="set-title">
          预览设置
        </h3>
        <div v-if="isShowDraftPreview" class="set-content">
          <el-button round size="medium" @click="goPreview">
            立即预览
          </el-button>
          <el-button round size="medium" @click="copyPreview">
            复制链接
          </el-button>
          <p class="preview">将此链接发送给他人, 可以提前预览您还未发布的草稿(24h有效)</p>
        </div> -->
        
        <h1 class="set-title">
          基础设置
        </h1>
        <h4 class="set-subtitle">
          {{ $t('publish.coverTitle') }}
        </h4>
        <el-alert
          :title="$t('publish.coverRecommendation')"
          :closable="false"
          type="info"
          show-icon
        />
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
              <img
                :src="coverEditor"
                class="cover-img"
                alt="cover"
              >
            </div>
            <img
              v-show="cover"
              class="cover-btn"
              src="@/assets/img/del.svg"
              alt="remove"
              @click.prevent="removeCover"
            >
          </div>
        </div>
        <!-- tag -->
        <h4 class="set-subtitle">
          <!-- {{ $t('publish.tagTitle') }} -->
          添加标签<span class="tag">（还可以添加{{ tagMaxLen - tags.length }}个标签）</span>
        </h4>
        <div class="set-content">
          <ul class="tag-list">
            <li
              v-for="(item, index) in tags"
              :key="index"
              class="tag-item"
              @click="removeTag(index)"
            >
              {{ item }}
              <svg-icon icon-class="close_thin" class="icon" />
            </li>
            <li v-show="tags.length < tagMaxLen">
              <input
                ref="tagRef"
                v-model="tagVal"
                class="tag-input"
                type="text"
                maxlength="20"
                @keyup.enter="addTag"
              >
              <span class="tag-tip">按回车Enter创建标签</span>
            </li>
          </ul>
        </div>
        <h4 class="set-subtitle">
          关联 Fan 票
        </h4>
        <div v-if="!isAssosiateWith" class="set-content" style="display: flex;align-items: center;">
          <el-select
            v-model="assosiateWith"
            size="small"
            placeholder="请选择"
            style="width: 40%;"
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
            style="margin-left: 0.5rem;"
            @click="setAssosiateWith"
          >
            关联
          </el-button>
        </div>
        <div v-if="isAssosiateWith" class="set-content">
          <div class="img-container">
            <div
              class="overlay-box"
              :style="{backgroundImage: `url(${assosiateFanLogo})`}"
              @click="cancelAssosiate"
            >
              <div class="desc">
                <p>取消关联</p>
              </div>
            </div>
          </div>
        </div>
        <h4 class="set-subtitle">
          原创声明
          <el-tooltip
            effect="dark"
            content="来设置你的文章版权信息，发布后无法修改"
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
              {{ $t('publish.original') }}
            </el-checkbox>
            <div
              v-if="isOriginal"
              class="cc-licensing"
            >
              <h3>
                Creative Commons 授权许可协议
                <el-tooltip
                  effect="dark"
                  content="CC是一种公共著作权许可协议，其允许分发受著作权保护的作品。一个创作共享许可用于一个作者想给他人分享，使用，甚至创作派生作品的权利。"
                  placement="top-start"
                >
                  <i class="el-icon-info" />
                </el-tooltip>
              </h3>
              <h3>
                请问您允许本作品被别人转载、节选、混编、二次创作吗？
              </h3>
              <el-radio
                v-model="ccLicenseOptions.share"
                :disabled="$route.params.type === 'edit'"
                label="true"
              >
                允许
              </el-radio>
              <br>
              <el-radio
                v-model="ccLicenseOptions.share"
                :disabled="$route.params.type === 'edit'"
                label="false"
              >
                不允许
                <el-tooltip
                  effect="dark"
                  content="他人不能再混合、转换、或者基于该作品创作，且不能分发修改后的作品"
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
                仅允许采用本协议授权的二次创作
                <el-tooltip
                  effect="dark"
                  content="他人再混合、转换或者基于本作品进行创作，必须基于与原先许可协议相同的许可协议分发作品。"
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
                允许商业性使用
              </el-checkbox>
              <p>则授权条款为： {{ CCLicenseCredit.chinese }}</p>
            </div>
          </div>
        </div>
        <h1 class="set-title set-title-border">
          权限设置
        </h1>
        <h4 class="set-subtitle">
          阅读权限设置
          <el-tooltip
            effect="dark"
            content="添加限制条件后，读者只有在持有特定数量的Fan票后才可查看全文的。"
            placement="top-start"
          >
            <svg-icon
              class="help-icon"
              icon-class="help"
            />
          </el-tooltip>
        </h4>
        <div class="set-content">
          <el-radio v-model="readConfigRadio" label="all">
            所有人可见
          </el-radio>
          <br>
          <!-- Fan票发行者特权功能 -->
          <div :class="noTokenAvailable && !prohibitEditingPrices && 'privileged'">
            <el-radio
              v-model="readConfigRadio"
              :disabled="prohibitEditingPrices || noTokenAvailable"
              label="token"
            >
              持币可见
            </el-radio>
            <div class="privileged-guide" :class="noTokenAvailable && !prohibitEditingPrices && 'show-guide'">
              <span>
                Fan票发行者和协作者特权功能
              </span>
              <el-button
                size="small"
                type="warning"
                @click="openWj"
              >
                立即申请
              </el-button>
            </div>
          </div>
          <el-radio
            v-model="readConfigRadio"
            :disabled="prohibitEditingPrices"
            label="cny"
          >
            支付可见
          </el-radio>

          <div class="post-content root-setting">
            <div style="width: 380px;">
              <transition name="fade">
                <div
                  v-show="readauThority"
                  class="fl ac"
                >
                  <div>
                    <h3>Fan票类型</h3>
                    <el-select
                      v-model="readSelectValue"
                      size="small"
                      placeholder="请选择"
                      style="width: 100%;"
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
                  <div style="margin-left: 10px;">
                    <h3>持Fan票数量</h3>
                    <el-input
                      v-model="readToken"
                      :min="1"
                      :max="100000000"
                      size="small"
                      placeholder="请输入数量"
                      :disabled="prohibitEditingPrices || noTokenAvailable"
                    />
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div
                  v-show="paymentTokenVisible"
                  class="fl ac"
                >
                  <div>
                    <h3>支付类型</h3>
                    <el-select
                      v-model="paymentSelectValue"
                      size="small"
                      placeholder="请选择"
                      style="width: 100%;"
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
                  <div style="margin-left: 10px;">
                    <h3>支付数量</h3>
                    <el-input
                      v-model="paymentToken"
                      :min="1"
                      :max="100000000"
                      size="small"
                      placeholder="请输入内容"
                      :disabled="prohibitEditingPrices"
                    />
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div v-show="readauThority || paymentTokenVisible">
                  <h3>内容摘要</h3>
                  <el-input
                    v-model="readSummary"
                    :autosize="{ minRows: 6, maxRows: 12}"
                    size="small"
                    type="textarea"
                    placeholder="请输入内容"
                    maxlength="300"
                    show-word-limit
                  />
                </div>
              </transition>
            </div>
          </div>
        </div>
        <h4 class="set-subtitle">
          编辑权限设置(实验功能) <el-tooltip
            effect="dark"
            content="添加编辑权限后，读者在持有特定数量的Fan票或支付特定费用后可编辑文章。"
            placement="top-start"
          >
            <svg-icon
              class="help-icon"
              icon-class="help"
            />
          </el-tooltip>
        </h4>
        <div class="set-content">
          <el-radio v-model="editConfigRadio" label="all">
            仅自己可编辑
          </el-radio>
          <br>
          <!-- Fan票发行者特权功能 -->
          <div :class="noTokenAvailable && !prohibitEditingPrices && 'privileged'">
            <el-radio
              v-model="editConfigRadio"
              :disabled="prohibitEditingPrices || noTokenAvailable"
              label="token"
            >
              持币可编辑
            </el-radio>
            <div class="privileged-guide" :class="noTokenAvailable && !prohibitEditingPrices && 'show-guide'">
              <span>
                Fan票发行者和协作者特权功能
              </span>
              <el-button
                size="small"
                type="warning"
                @click="openWj"
              >
                立即申请
              </el-button>
            </div>
          </div>

          <div class="post-content root-setting">
            <div style="width: 380px;">
              <transition name="fade">
                <div
                  v-show="tokenEditAuthority"
                  class="fl ac"
                >
                  <div>
                    <h3>Fan票类型</h3>
                    <el-select
                      v-model="editSelectValue"
                      size="small"
                      placeholder="请选择"
                      style="width: 100%;"
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
                  <div style="margin-left: 10px;">
                    <h3>持Fan票数量</h3>
                    <el-input
                      v-model="editToken"
                      :min="1"
                      :max="100000000"
                      size="small"
                      placeholder="请输入内容"
                      :disabled="prohibitEditingPrices || noTokenAvailable"
                    />
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div
                  v-show="buyEditAuthority"
                  class="fl ac"
                >
                  <div>
                    <h3>支付类型</h3>
                    <el-select
                      v-model="paymentSelectValue"
                      size="small"
                      placeholder="请选择"
                      style="width: 100%;"
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
                  <div style="margin-left: 10px;">
                    <h3>支付数量</h3>
                    <el-input
                      v-model="editPaymentToken"
                      :min="1"
                      :max="100000000"
                      size="small"
                      placeholder="请输入内容"
                      :disabled="prohibitEditingPrices"
                    />
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <h4 class="set-subtitle">
          是否公开文章历史记录 <el-tooltip
            effect="dark"
            content="开启公开文章历史记录权限后，任何人都可以看到你这篇文章的历史版本。"
            placement="top-start"
          >
            <svg-icon
              class="help-icon"
              icon-class="help"
            />
          </el-tooltip>
        </h4>
        <div class="set-content">
          <el-radio v-model="ipfs_hide" :label="true">
            仅自己可见
          </el-radio>
          <br>
          <el-radio v-model="ipfs_hide" :label="false">
            公开可见
          </el-radio>
        </div>

        <div class="set-footer">
          <el-button v-if="isShowDraftPreview" size="medium" @click="goPreview">
            立即预览
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
              删除此篇
            </el-button>
            <el-button
              v-if="isShowTransfer"
              type="danger"
              size="medium" 
              @click="transferArticle"
            >
              转让草稿
            </el-button>
          </template>
          <el-button
            v-if="$route.params.type === 'edit'"
            size="medium"
            style="margin-left: 10px;"
            @click="saveAsDraft"
          >
            另存为草稿
          </el-button>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 10px;"
            :class="($route.params.type === 'draft' && settingDialogMode === 'setting') && 'set'"
            @click="sendThePost"
          >
            立即发布
          </el-button>
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
import throttle from 'lodash/throttle'
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash/debounce'
// import { toolbars } from '@/config/toolbars' // 编辑器配置
import { strTrim } from '@/utils/reg'

import { convertLicenseToChinese, CreativeCommonsLicenseGenerator } from '@/utils/creative_commons'
import imgUpload from '@/components/imgUpload' // 图片上传
import articleTransfer from '@/components/articleTransfer'

import articleImport from '@/components/article_import/index.vue'
import statement from '@/components/statement/index.vue'

import { toPrecision, precision } from '@/utils/precisionConversion'
import { getCookie } from '@/utils/cookie'
import { CNY } from '@/components/exchange/consts.js'

export default {
  layout: 'empty',
  name: 'NewPost',
  components: {
    imgUpload,
    articleTransfer,
    articleImport,
    statement,
  },
  data() {
    return {
      prompt: false,
      title: '',
      author: '',
      markdownData: '',
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
        commercialUse: false
      },
      showModal: false, // 弹框显示
      modalText: {
        text: [this.$t('publish.modalTextText')], // 退出
        button: [this.$t('publish.modalTextButton1'), this.$t('publish.modalTextButton2')]
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
      encryption: '\n\n[read hold="SYMBOL amount"]\n\n隐藏内容\n> [📔使用说明](https://www.yuque.com/matataki/matataki/giw9u4)\n\n[else]\n\n预览内容\n\n[/read]\n',
      settingDialog: false, // 设置 发布页面dialog
      settingDialogMode: '', // setting publish
      // 阅读权限
      readConfigRadio: 'all',
      // 编辑权限
      editConfigRadio: 'all',
      ipfs_hide: true,
      editorPlaceholder: ''
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'metamask/account', 'isMe']),
    coverEditor() {
      return this.cover ? this.$ossProcess(this.cover) : ''
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
        NoDerivativeWorks
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
        const token = this.readSelectOptions.filter(list => list.id === this.readSelectValue)
        if(token.length === 0) return []
        // 目前只用上传一种数据格式
        tokenArr = [{
          tokenId: token[0].id,
          amount: toPrecision(this.readToken, 'cny', token[0].decimals)
        }]
      }
      return tokenArr
    },
    /** 持币编辑 */
    editRequireToken() {
      let tokenArr = []
      if (this.tokenEditAuthority) {
        // 持通证
        // 获取当前选择的通证种
        const token = this.readSelectOptions.filter(list => list.id === this.editSelectValue)
        if(token.length === 0) return []
        // 目前只用上传一种数据格式
        tokenArr = [{
          tokenId: token[0].id,
          amount: toPrecision(this.editToken, 'cny', token[0].decimals)
        }]
      }
      return tokenArr
    },
    requireBuy() {
      if (this.paymentToken === 0) return null
      if (!this.paymentTokenVisible) {
        return null
      } else {
        let tokenArr = []
        const token = this.paymentSelectOptions.filter(list => list.id === this.paymentSelectValue)
        if(token.length === 0) return []
        // 目前只用上传一种数据格式
        tokenArr = [{
          tokenId: token[0].id,
          amount: toPrecision(this.paymentToken, 'cny', token[0].decimals)
        }]
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
          price: toPrecision(this.editPaymentToken, 'cny', 4) // 默认四位小数
        }
        return data
      }
    },
    paymentSelectOptions() {
      return [
        CNY,
        ...this.readSelectOptions,
      ]
    },
    noTokenAvailable() {
      return !this.readSelectOptions || this.readSelectOptions.length === 0
    }
  },
  watch: {
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
      }
    },
    // 监听tag设置width
    tagVal(val) {
      const tag = this.$refs.tagRef
      const width = (val.length + 1 ) * 12

      if (val && width > 104) {
        tag.style.width = (width <= 282 ? width : 282) + 'px'
      } else {
        tag.style.width = '104px'
      }
    },
    // 协议
    CCLicenseCredit() { this.updateDraftWatch() },
    // 阅读权限  单选 设置持币 设置持币类型 设置持币数量
    readConfigRadio(val) {
      this.readauThority = val === 'token'
      this.paymentTokenVisible = val === 'cny'

      this.updateDraftWatch()
    },
    readauThority() { this.updateDraftWatch() },
    readSelectValue() { this.updateDraftWatch() },
    readToken() { this.updateDraftWatch() },

    // 阅读权限 支付阅读
    paymentTokenVisible() { this.updateDraftWatch() },
    paymentToken() { this.updateDraftWatch() },

    // 摘要
    readSummary() { this.updateDraftWatch() },

    // 编辑权限 单选 设置复选 选择框 数量
    editConfigRadio(val) {
      this.tokenEditAuthority = val === 'token'
      this.updateDraftWatch()
    },
    tokenEditAuthority() { this.updateDraftWatch() },
    editSelectValue() { this.updateDraftWatch() },
    editToken() { this.updateDraftWatch() },
    assosiateWith() { this.updateDraftWatch() },
    
    // 是否公开
    ipfs_hide() { this.updateDraftWatch() }
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
        })
      }
    } else {
      console.log('路由错误')
      this.$router.push({ name: 'publish-type-id', params: { type: 'draft', id: 'create' } })
    }

    this.getBindableTokenList()
    this.getAllTokens()
    // this.setToolBar()
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
      if (this.assosiateWith === null) this.$message({
        showClose: false,
        message: '请选择你要关联的 Fan 票',
        type: 'error'
      })
      else {
        let token = this.allTokenOptions.find(option => option.id === Number(this.assosiateWith))
        if (!token) return this.$message.error(`找不到ID为：${this.assosiateWith} 的Fan票`)
        this.isAssosiateWith = true
        this.assosiateFanName = token.name
        this.assosiateFanLogo = this.$API.getImg(token.logo)
      }
    },
    // 取消关联
    cancelAssosiate() {
      this.isAssosiateWith = false
      this.assosiateWith = null
    },
    // 设置编辑器提示字
    setEditorPlaceholder() {
      const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
      if (clientWidth < 768) {
        this.editorPlaceholder = this.$t('publish.contentPlaceholderMobile')
      } else {
        this.editorPlaceholder = this.$t('publish.contentPlaceholder')
      }
    },
    _resizeEditor() {
      const clientHeight = document.body.clientHeight || document.documentElement.clientHeight
      const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
      this.editorStyle = {
        height: `${clientHeight - (clientWidth < 768 ? 47 : 60)}px`
      }
    },
    // watch 监听草稿更新
    updateDraftWatch() {
      if (!this.autoUpdateDfaft) return
      this.updateDraftFunc()
    },
    // 更新草稿方法
    updateDraftFunc: debounce(function () {
      const {
        title,
        markdownData: content,
        fissionFactor,
        cover,
        tags
      } = this
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
          ipfs_hide : 0,
          requireToken : [], // 阅读 持币
          requireBuy : [], // 阅读 购买
          editRequireToken : [], // 编辑 持币
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
          ipfs_hide : 0,
          requireToken : [], // 阅读 持币
          requireBuy : [], // 阅读 购买
          editRequireToken : [], // 编辑 持币
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
      return this.allowLeave || (!strTrim(this.title) && !strTrim(this.markdownData))
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
        } else this.$message({ showClose: true, message: res.message, type: 'warning'})
      } catch (e) {
        console.log('err', e)
      }
      // 获取文章信息
      await this.$API.getCanEditPost(id).then(res => {
        // console.log('获取文章信息:', id, res)
        if (res.code === 0) {
          this.fissionNum = res.data.fission_factor / 1000
          this.signature = res.data.sign
          this.cover = res.data.cover
          this.signId = res.data.id
          this.isOriginal = Boolean(res.data.is_original)
          this.authorId = res.data.uid
          this.ipfs_hide = Boolean(res.data.ipfs_hide)
          this.prohibitEditingPrices = this.$route.params.type === 'edit' && !this.isMe(res.data.uid)

          this.tags = res.data.tags.map(i => i.name)

          this.assosiateWith = res.data.assosiate_with
          if (this.assosiateWith) {
            this.setAssosiateWith()
          }

          this.setCCLicense(res.data.cc_license)
          
          // 持通证阅读
          if (res.data.tokens && res.data.tokens.length !== 0) {
            this.readauThority = true
            this.readToken = precision(res.data.tokens[0].amount, 'cny', res.data.tokens[0].decimals)
            this.readSummary = res.data.short_content
            // this.readSelectOptions = res.data.tokens
            this.readSelectValue = res.data.tokens[0].id
          }

          // 持通证编辑
          if (res.data.editTokens && res.data.editTokens.length !== 0) {
            this.tokenEditAuthority = true
            this.editToken = precision(res.data.editTokens[0].amount, 'cny', res.data.editTokens[0].decimals)
            this.editSelectValue = res.data.editTokens[0].id
          }


          // 付费阅读
          if (res.data.prices && res.data.prices.length !== 0) {
            this.paymentTokenVisible = true
            this.paymentToken = precision(res.data.prices[0].price, res.data.prices[0].platform, res.data.prices[0].decimals)
            this.readSummary = res.data.short_content
            this.paymentSelectValue = res.data.prices[0].token_id
          }

          // 付费编辑
          if (res.data.editPrices && res.data.editPrices.length !== 0) {
            this.buyEditAuthority = true
            this.editPaymentToken = precision(res.data.editPrices[0].price, res.data.editPrices[0].platform, res.data.editPrices[0].decimals)
            this.paymentSelectValue = ''
          }

          // 有 持通证阅读 || 付费阅读 展示单选区域
          if (this.paymentTokenVisible)
            this.readConfigRadio = 'cny'
          else if (this.readauThority)
            this.readConfigRadio = 'token'
          else this.readConfigRadio = 'all'

          //有 持通证编辑 || 付费编辑
          if (this.buyEditAuthority)
            this.editConfigRadio = 'cny'
          else if (this.tokenEditAuthority)
            this.editConfigRadio = 'token'
          else this.editConfigRadio = 'all'

        } else {
          this.$message({ showClose: true, message: res.message, type: 'error' })
          this.$router.push({ path: '/article' })
        }
      }).catch(err => {
        console.error(err)
        this.$message.error(this.$t('error.getArticleInfoError'))
        this.$router.push({ path: '/article' })
      })
    },
    // 得到草稿箱内容 by id
    async getDraft(id) {
      await this.$API.getDraft({ id }).then(res => {
        if (res.code === 0) {
          let { data } = res
          this.fissionNum = data.fission_factor ? data.fission_factor / 1000 : 2
          this.cover = data.cover
          this.title = data.title
          this.markdownData = data.content
          this.id = data.id
          this.isOriginal = Boolean(data.is_original)
          this.commentPayPoint = data.comment_pay_point

          this.tags = data.tags
          this.assosiateWith = data.assosiate_with
          this.ipfs_hide = Boolean(data.ipfs_hide)


          this.setCCLicense(data.cc_license)

          // 持通证阅读
          if (data.require_holdtokens.length !== 0) {
            this.readauThority = true
            this.readToken = precision(data.require_holdtokens[0].amount, 'CNY', 4)
            this.readSummary = data.short_content
            this.readSelectValue = data.require_holdtokens[0].token_id
          }

          // 付费阅读
          if (data.require_buy.length !== 0) {
            this.paymentTokenVisible = true
            this.paymentToken = precision(data.require_buy[0].amount, 'CNY', 4)
            this.readSummary = data.short_content
            this.paymentSelectValue = data.require_buy[0].token_id
          }

          // 持通证编辑
          if (data.editor_require_holdtokens.length !== 0) {
            this.tokenEditAuthority = true
            this.editToken = precision(data.editor_require_holdtokens[0].amount, 'CNY', 4)
            this.editSelectValue = res.data.editor_require_holdtokens[0].token_id
          }

          // 暂无付费编辑

          // 有 持通证阅读 || 付费阅读 展示单选区域
          if (this.paymentTokenVisible)
            this.readConfigRadio = 'cny'
          else if(this.readauThority)
            this.readConfigRadio = 'token'
          else this.readConfigRadio = 'all'

          //有 持通证编辑 || 付费编辑
          if (this.buyEditAuthority) this.editConfigRadio = 'cny'
          else if (this.tokenEditAuthority) this.editConfigRadio = 'token'
          else this.editConfigRadio = 'all'

        } else {
          console.log(res.message)
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
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
          id: id
        }
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
        }
        else this.$message.error(res.message)
      }
      catch (e) {
        console.error(e)
        this.$message.error(this.$t('error.fail'))
      }
    },
    /**
     * 获取所有token
     */
    async getAllTokens() {
      const pagesize = 999
      await this.$API.allToken({ pagesize }).then(res => {
        if (res.code === 0) {
          // 如果有的话，吧自己发行的Fan票放到第一位
          this.allTokenOptions = this.topOwnToken(res.data.list)
          // 检查用户有没有发Fan票，如果有的话，就填写进表单中
          const isNewArticle = this.$route.params.type === 'draft' && this.$route.params.id === 'create'
          if (isNewArticle && this.isMe({...this.allTokenOptions[0]}.uid)) {
            this.assosiateWith = this.allTokenOptions[0].id
            this.setAssosiateWith()
          }
        }
      }).catch(err => console.log(err))
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
          tokens: []
        }
      } else {
        let tokenArr = []
        if (this.readauThority) { // 持通证
          // 获取当前选择的通证种
          const token = this.readSelectOptions.filter(list => list.id === this.readSelectValue)
          // 目前只用上传一种数据格式
          tokenArr = [
            {
              tokenId: token[0].id,
              amount: toPrecision(this.readToken, 'cny', token[0].decimals)
            }
          ]
        }
        data = {
          signId: id,
          tokens: tokenArr
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
          price: toPrecision(this.paymentToken, 'cny', 4) // 默认四位小数
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
          desc: 'whatever'
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

      article.cc_license = this.isOriginal ? this.CCLicenseCredit.license : null
      article.requireBuy = this.requireBuy
      article.requireToken = this.requireToken

      //编辑权限
      article.editRequireToken = this.editRequireToken
      article.editRequireBuy = this.editRequireBuy

      // 设置积分
      article.commentPayPoint = this.commentPayPoint
      article.ipfs_hide = this.ipfs_hide
      try {
        // 取消钱包签名, 暂注释后面再彻底删除 start
        const response = await this.$API.publishArticle({ article })
        if (response.code !== 0) throw new Error(response.message)

        // 关联文章  草稿发布时发布引用的文章
        const data = {
          signId: response.data
        }
        if (this.$route.params.id) {
          const res = await this.$API.draftsReferencesPublish(this.$route.params.id, data)
          if (res.code === 0) {
            // 发送完成开始设置阅读权限 因为需要返回的id
            const promiseArr = []
            if (this.readauThority) promiseArr.push(this.postMineTokens(response.data)) // 持通证阅读
            if (this.paymentTokenVisible) promiseArr.push(this.articlePrices(response.data)) // 支付通证
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
      }
    },
    // 自动创建草稿
    async autoCreateDraft(article) {
      this.saveDraft = '保存中...'
      // 设置文章标签 🏷️
      this.allowLeave = true
      await this.$API.createDraft(article).then(res => {
        if (res.code === 0) {
          this.saveDraft = '文章自动保存至'
          // console.log(this.$route)
          this.$route.params.id = res.data
          this.id = res.data
          // console.log(this.$route)
          const url = window.location.origin + '/publish/draft/' + res.data
          history.replaceState({}, '', url)

        } else this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      }).catch(err => {
        console.log(err)
        this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
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

      const { failed, success } = this
      try {
        const res = await this.$API.editArticle({ article })
        if (res.code === 0) {
          // 如果不是自己的文章，不设置阅读权限
          if(!this.isMe(this.authorId)) {
            success(res.data)
            this.fullscreenLoading = false // remove full loading
            return
          }
          // 发送完成开始设置阅读权限 因为需要返回的id
          const promiseArr = []
          promiseArr.push(this.postMineTokens(res.data)) // 持通证阅读
          promiseArr.push(this.articlePrices(res.data)) // 支付通证
          Promise.all(promiseArr).then(() => {
            success(res.data)
            this.fullscreenLoading = false // remove full loading
          }).catch(err => {
            console.log('err', err)
            this.$message.error(err)
            this.fullscreenLoading = false // remove full loading
          })
        } else {
          this.$message({ showClose: true, message: res.message, type: 'error' })
          throw new Error(res.message)
        }
      } catch (error) {
        console.error(error)
        this.fullscreenLoading = false // remove full loading
        failed(error)
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
        } else this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      } catch (error) {
        this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      }
    },
    // 发布||修改按钮
    sendThePost() {
      // 没有登录 点击发布按钮都提示登录  编辑获取内容的时候会被前面的func拦截并返回home page
      if (!getCookie('ACCESS_TOKEN')) {
        this.$store.commit('setLoginModal', true)
        return 
      }

      // 标题或内容为空时
      if (!strTrim(this.title) || !strTrim(this.markdownData)) return this.failed(this.$t('warning.titleOrContent'))

      // 没有封面 (开发者模式不强制封面 浪费oss空间)
      if (!this.isDevelopmentMode && !this.cover) {
        this.failed(this.$t('warning.cover'))
        return
      }

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
        title,
        markdownData: content,
        fissionFactor,
        cover
      } = this
      const { name: author } = currentUserInfo
      const isOriginal = Number(this.isOriginal)

      // url draft edit
      // 草稿发送
      const draftPost = () => {
        if (this.readauThority) {
          if (!this.readSelectValue) return this.$message({ showClose: true, message: '请选择持通证类型', type: 'warning'})
          else if (!(Number(this.readToken) > 0)) return this.$message({ showClose: true, message: '持通证数量设置不能小于0', type: 'warning'})
          else if (!this.readSummary) return this.$message({ showClose: true, message: '请填写摘要', type: 'warning'})
        }
        
        // 持Fan票编辑
        if (this.tokenEditAuthority) {
          if (!this.editSelectValue) return this.$message({ showClose: true, message: '请选择持通证类型', type: 'warning'})
          else if (!(Number(this.editToken) > 0)) return this.$message({ showClose: true, message: '持通证数量设置不能小于0', type: 'warning'})
        }

        if (this.paymentTokenVisible) {
          if (this.$utils.isNull(this.paymentSelectValue)) return this.$message({ showClose: true, message: '请选择支付类型', type: 'warning'})
          else if (!(Number(this.paymentToken) > 0)) return this.$message({ showClose: true, message: '支付数量设置不能小于0', type: 'warning'})
          else if (!this.readSummary) return this.$message({ showClose: true, message: '请填写摘要', type: 'warning'})
        }

        // 付费编辑
        if (this.buyEditAuthority) {
          if (this.$utils.isNull(this.paymentSelectValue)) return this.$message({ showClose: true, message: '请选择支付类型', type: 'warning'})
          else if (!(Number(this.editPaymentToken) > 0)) return this.$message({ showClose: true, message: '支付数量设置不能小于0', type: 'warning'})
        }

        // 发布文章
        this.fullscreenLoading = true

        const data = { title, author, content }
        // this.fullscreenLoading = false // remove full loading

        this.publishArticle({
          author,
          title,
          data,
          fissionFactor,
          cover,
          isOriginal,
          shortContent: (this.readauThority || this.paymentTokenVisible) ? this.readSummary : ''
        })
      }
      // 编辑发送
      const editPost = () => {
        if (this.readauThority) {
          if (!this.readSelectValue) return this.$message({ showClose: true, message: '请选择持通证类型', type: 'warning'})
          else if (!(Number(this.readToken) > 0)) return this.$message({ showClose: true, message: '持通证数量设置不能小于0', type: 'warning'})
          else if (!this.readSummary) return this.$message({ showClose: true, message: '请填写摘要', type: 'warning'})
        }

        // 持Fan票编辑
        if (this.tokenEditAuthority) {
          if (!this.editSelectValue) return this.$message({ showClose: true, message: '请选择持通证类型', type: 'warning'})
          else if (!(Number(this.editToken) > 0)) return this.$message({ showClose: true, message: '持通证数量设置不能小于0', type: 'warning'})
        }
        // 支付可见
        if (this.paymentTokenVisible) {
          if (this.$utils.isNull(this.paymentSelectValue)) return this.$message({ showClose: true, message: '请选择支付类型', type: 'warning'})
          else if (!(Number(this.paymentToken) > 0)) return this.$message({ showClose: true, message: '支付数量设置不能小于0', type: 'warning'})
          else if (!this.readSummary) return this.$message({ showClose: true, message: '请填写摘要', type: 'warning'})
        }

        // 付费编辑
        if (this.buyEditAuthority) {
          if (!this.paymentSelectValue) return this.$message({ showClose: true, message: '请选择支付类型', type: 'warning'})
          else if (!(Number(this.editPaymentToken) > 0)) return this.$message({ showClose: true, message: '支付数量设置不能小于0', type: 'warning'})
        }

        this.fullscreenLoading = true
        const data = { title, author, content }
        this.editArticle({
          signId: this.signId,
          author,
          title,
          data,
          fissionFactor,
          cover,
          isOriginal,
          shortContent: (this.readauThority || this.paymentTokenVisible) ? this.readSummary : ''
        })
      }

      if (type === 'draft') draftPost()
      else if (type === 'edit') editPost()
      else draftPost() // 错误的路由, 当发布文章处理
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
    originalChange(val) { if (val) this.statementVisible = true },
    closeDropdown() {
      this.transferButton = false
      this.readContent = false
    },
    importRes(res) {
      this.title = res.title
      this.markdownData = res.content
      this.cover = res.cover
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
          this.$message({ showClose: true, message: res.message, type: 'success'})
          this.$router.push({
            name: 'article'
          })
        }
      }

      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del()
      }).catch(() => {
      })

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
          this.$message({ showClose: true, message: res.message, type: 'error' })
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
        this.$message({ showClose: true, message: '先写点什么吧!', type: 'warning'})
        return
      }

      const res = this.previewSetId(this.$route.params.id)
      if (res) {
        window.open(`${window.location.origin}/preview/${this.$route.params.id}`)
      }
    },
    // 复制预览链接
    async copyPreview() {
      const id = this.$route.params.id
      if (id === 'create' || !Number(id)) {
        this.$message({ showClose: true, message: '先写点什么吧!', type: 'warning'})
        return
      }

      const res = this.previewSetId(this.$route.params.id)
      if (res) {
        this.$copyText(`${window.location.origin}/preview/${this.$route.params.id}`).then(
          () => this.$message({
            showClose: true,
            message: this.$t('success.copy'),
            type: 'success'
          }),
          () => this.$message({ showClose: true, message: this.$t('error.copy'), type: 'error' })
        )
      }
    },
    // 添加标签
    addTag() {
      const val = this.tagVal.trim()
      if (val) {
        this.tags.push(val)
        this.tagVal = ''
      }
    },
    // 删除标签
    removeTag(i) {
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
          assosiate_with: this.assosiateWith
        }

        data = this.draftFactory(data)

        let promiseArr = [
          this.$API.createDraft(data),
          // this.$API.delArticle({ id: this.$route.params.id }) // 创建完成 不删除文章
        ]
        Promise.all(promiseArr).then(res => {
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
        }).catch(e => {
          console.log(e)
        })
      }

      this.$confirm('是否另存为草稿?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirmSaveAsDraft()
      }).catch(() => {})

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
          }
        ]
      }

      // 编辑权限
      data.editRequireToken = this.editRequireToken

      // 设置摘要
      if (this.readauThority || this.paymentTokenVisible) {
        data.short_content = this.readSummary
      }
      return data
    },
    toolMobileImport() {
      this.importVisible = true
    },
    /** 吧自己的Fan票排到最前面 */
    topOwnToken(tokenList) {
      for (let i = 0; i < tokenList.length; i++) {
        if(this.isMe(tokenList[i].uid)) {
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
        if (!previewContent.innerHTML) {
          this.allowLeave = true
          setTimeout(() => {
            window.location.reload()
          }, 300)
        }
      }, 1000)
    },
    openWj() {
      window.open('/token', '_blank')
    }
  }
}
</script>

<style scoped lang="less" src="../Publish.less"></style>
<style lang="less" src="../index.less"></style>