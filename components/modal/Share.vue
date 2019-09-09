<template>
  <el-dialog
    :visible.sync="showModal"
    width="400px"
    :lock-scroll="false"
    custom-class="gray-bg br10 p-share"
    :show-close="false"
    center
    @close="change"
  >
    <div v-if="widgetModalStatus === 0" class="padding1">
      <div class="widget-content-button">
        <div class="widget-button" @click="createWidget">
          <div class="widget-button-img">
            <img src="@/assets/img/widget/widget.svg" alt="widget">
          </div>
          <p>创建widget</p>
        </div>
        <div class="widget-button" @click="widgetModalStatus = 4">
          <div class="widget-button-img">
            <img src="@/assets/img/widget/share.svg" alt="widget">
          </div>
          <p>生成长图</p>
        </div>
        <div class="widget-button" @click="copyCode(clipboard)">
          <div class="widget-button-img">
            <img src="@/assets/img/widget/link.svg" alt="link">
          </div>
          <p>复制邀请链接</p>
        </div>
      </div>
      <SocialShare v-if="socialShow" :article="article" />
    </div>
    <div v-if="widgetModalStatus === 1" class="padding1 widget-writecontent">
      <p class="widget-title">
        创建widget
      </p>
      <el-input
        v-model="widgetContent"
        type="textarea"
        placeholder="添加简介(选填)"
        :rows="4"
      />
      <div class="widget-footer">
        <a class="help" href="javascript:;" @click="reviewHelp">如何使用widget？</a>
        <a class="create" href="javascript:;" @click="createWidgetContent">创建widget</a>
      </div>
    </div>
    <div v-if="widgetModalStatus === 2" class="padding1 widget-help">
      <p class="widget-help-title">
        什么是文章widget
      </p>
      <p class="widget-help-content">
        widget功能可以为当前文章生成一个精美的展示卡片。您可以将widget代码复制到瞬MATATAKI的文章编辑器中，这样就可以在您的文章中插入精美的文章展示卡片。当然，您展示的文章卡片同样也会具有邀请链接的功能。
      </p>
      <br>
      <p class="widget-help-title">
        操作步骤
      </p>
      <p class="widget-help-content">
        1.你可以选择自定义展示卡片上的简介内容<br>
        2.点击“创建widget”按钮获取代码<br>
        3.点击“复制代码”按钮获取widget代码<br>
        4.粘贴代码到瞬MATATAKI编辑器中即可展示<br>
      </p>

      <a class="widget-help-button" href="javascript:;" @click="backPage">知道了</a>
    </div>
    <div v-if="widgetModalStatus === 3" class="padding1 widget-review">
      <p class="widget-title">
        widget预览
      </p>
      <div class="widget-review-content" v-html="widgetContentIframe" />
      <p class="widget-review-des">
        复制下面的代码并黏贴到您的网站来展示
      </p>
      <el-input
        id="codeIframe"
        v-model="widgetContentIframe"
        class="widget-textarea"
        type="textarea"
        placeholder=""
        :rows="4"
        @focus="selectValue($event)"
      />
      <div class="widget-footer">
        <a class="help" href="javascript:;" @click="reviewHelp">如何使用widget？</a>
        <a class="create" href="javascript:;" @click="copyCode(widgetContentIframe)">复制代码</a>
      </div>
    </div>
    <div v-if="widgetModalStatus === 4" class="padding2">
      <QRCodeDialog
        :share-info="{
          title: article.title,
          avatar: article.avatar,
          name: article.nickname || article.author,
          time: article.time,
          content: article.content,
          shareLink,
          cover
        }"
        @change="change"
      />
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import { strTrim } from '@/utils/reg' // 开发用
import QRCodeDialog from './QRCodeDialog'
import SocialShare from './SocialShare'
import { urlAddress } from '@/api/backend'
export default {
  name: 'ShareModal',
  components: {
    QRCodeDialog,
    SocialShare
  },
  props: {
    article: Object,
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false,
      amount: 0,
      comment: '',
      // 0 默认
      // 1 创建widget
      // 2 widget help
      // 3 review widget
      widgetModalStatus: 0,
      oldWidgetModalStatus: 0,
      widgetContent: '',
      widgetContentIframe: '',
      socialShow: false
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    clipboard() {
      const { article, currentUserInfo } = this
      const { protocol, host } = window.location
      // console.debug(this.article);
      const articleUrl = `${protocol}//${host}/p/${article.id}`
      const shareLink = this.isLogined ? `${articleUrl}/?invite=${currentUserInfo.id}&referral=${currentUserInfo.id}` : articleUrl
      return `《${article.title}》by ${article.username} \n${shareLink}\n瞬MATATAKI，发布瞬间，灵感永存 \n 点击链接首次登入可领取额外${this.$point.regInvitee}积分奖励！`
    },
    shareLink() {
      // 应产品需求 这里改为移动端的链接

      const { article, currentUserInfo } = this
      // const { protocol, host } = window.location
      // console.debug(this.article);
      // const articleUrl = `${protocol}//${host}/p/${article.id}`
      const articleUrl = `${process.env.WX_SHARE_HOST}/article/${article.id}`
      const shareLink = this.isLogined ? `${articleUrl}?invite=${currentUserInfo.id}&referral=${currentUserInfo.id}` : articleUrl
      return shareLink
    },
    id() {
      return this.article.id
    },
    cover() {
      if (!this.article) return ''
      return this.article.cover ? this.$API.getImg(this.article.cover) : ''
    },
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    },
    widgetModalStatus(newVal, oldVal) {
      // console.log(newVal, oldVal)
      this.oldWidgetModalStatus = oldVal
      // 如果显示创建widget 但是没有内容
      if (newVal === 3 && !this.widgetContent) {
        let invite = this.currentUserInfo.id
        invite = invite ? `&invite=${invite}&referral=${invite}` : ''
        this.widgetContentIframe = `<iframe width="100%" height="180" src='${urlAddress}/widget/?id=${this.id}${invite}' frameborder=0></iframe>`
      }
    },
    widgetContent(newVal) {
      let content = ''
      let invite = this.currentUserInfo.id
      invite = invite ? `&invite=${invite}&referral=${invite}` : ''
      // 去前后空格防止空内容
      if (strTrim(newVal)) content = `&content=${newVal}`
      this.widgetContentIframe = `<iframe width="100%" height="180" src='${urlAddress}/widget/?id=${this.id}${content}${invite}' frameborder=0></iframe>`
    }
  },
  mounted() {
    this.socialShow = true
  },
  methods: {
    createWidget() {
      this.widgetModalStatus = 1
    },
    reviewHelp() {
      this.widgetModalStatus = 2
    },
    backPage() {
      this.widgetModalStatus = this.oldWidgetModalStatus
    },
    createWidgetContent() {
      this.widgetModalStatus = 3
    },
    copyCode(code) {
      this.$copyText(code).then(
        () => {
          this.$message.success('复制成功')
        },
        () => {
          this.$message.error('复制失败')
        }
      )
    },
    selectValue(e) {
      event.currentTarget.select()
    },
    resetStatus() {
      this.widgetModalStatus = 0
      this.widgetContent = ''
      this.widgetContentIframe = ''
    },
    async change(status) {
      this.showModal = false
      await this.$utils.sleep(300)
      !status && this.resetStatus()
    }
  }
}
</script>

<style src="./share.less" scoped lang="less">
</style>


<style lang="less">
.p-share .el-dialog__header,
.p-share .el-dialog__body {
  padding: 0;
}
</style>