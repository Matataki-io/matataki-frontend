<template>
  <Modal
    v-model="transferModalCopy"
    class="widget"
    width="375"
    class-name="widget-flex"
    footer-hide
    :closable="false"
    @on-visible-change="change"
  >
    >
    <div v-if="widgetModalStatus === 0" class="widget-writecontent">
      <p class="widget-title">转让文章的ownership</p>
      <div class="widget-input-container">
        <van-field
          v-model="transferUsername"
          class="widget-input"
          placeholder="请输入想要转让的用户名"
          @input="changeTransferId"
        />
        <div v-if="resultUser" class="widget-input-user" @click="continueUser">
          <div class="widget-input-avater">
            <img v-lazy="userAvatar" :src="userAvatar" alt="avatar" />
          </div>
          <span>{{ searchUsernameInfo.nickname || searchUsernameInfo.username }}</span>
        </div>
        <span v-if="errorMessage" class="error-info">用户不存在</span>
      </div>
      <div class="widget-footer">
        <a class="help" href="javascript:;" @click="reviewHelp">如何转让ownership？</a>
        <a
          class="create"
          href="javascript:;"
          :class="[!buttonStatus && 'gray']"
          @click="transferArticle"
          >转让文章</a
        >
      </div>
    </div>
    <div v-if="widgetModalStatus === 1" class="widget-help">
      <p class="widget-help-title">什么是文章权限转移</p>
      <p class="widget-help-content">
        使用此功能可以将文章的署名权和收益权转移给另一名用户。接受权限转移的选项默认为关闭状态，需要在设置中手动开启。可转移对象为已发表文章和草稿箱中的文章。请勿滥用此功能！
      </p>
      <br />
      <p class="widget-help-title">转移步骤</p>
      <p class="widget-help-content">
        1.在搜索框中完整输入对方昵称<br />
        2.请仔细核对被转移账户的信息<br />
        3.核对后点击“转让文章”来移交权限
      </p>
      <a class="widget-help-button" href="javascript:;" @click="backPage">知道了</a>
    </div>
  </Modal>
</template>

<script>
import { sleep } from '@/common/methods'
import { strTrim } from '@/common/reg'
import debounce from 'lodash/debounce'

export default {
  name: 'ArticleTransfer',
  props: ['transferModal', 'articleId', 'from'],
  data() {
    return {
      transferModalCopy: this.transferModal,
      // 0 默认
      // 1 转让
      widgetModalStatus: 0,
      oldWidgetModalStatus: 0,
      transferUsername: '',
      errorMessage: false, // 错误信息 默认不显示
      resultUser: false, // 搜索结果  默认不显示
      buttonStatus: false, // 转让按钮 默认无法点击
      searchUsernameInfo: null // 用户信息
    }
  },
  computed: {
    userAvatar() {
      return this.$backendAPI.getAvatarImage(this.searchUsernameInfo.avatar)
    }
  },
  watch: {
    transferModal(newVal) {
      this.transferModalCopy = newVal
    }
  },
  methods: {
    reviewHelp() {
      this.widgetModalStatus = 1
    },
    backPage() {
      this.widgetModalStatus = this.oldWidgetModalStatus
    },
    async transferArticle() {
      if (!this.buttonStatus) return
      let transferUsername = this.searchUsernameInfo.id
      try {
        const res = await this.$backendAPI.transferOwner(
          this.from,
          this.articleId,
          transferUsername
        )
        if (res.status === 200 && res.data.code === 0) {
          this.$toast({ duration: 1000, position: 'bottom', message: '转让成功,自动返回首页' })
          this.change(false)
          this.$router.push({ name: 'home' })
        } else {
          this.$toast({ duration: 1000, position: 'bottom', message: '对方未开启转让权限' })
        }
      } catch (error) {
        console.log(error)
        this.$toast({ duration: 1000, position: 'bottom', message: '对方未开启转让权限' })
      }
    },
    resetStatus() {
      this.widgetModalStatus = 0
      this.transferUsername = ''
      this.errorMessage = false
      this.resultUser = false
      this.buttonStatus = false
      this.searchUsernameInfo = null
    },
    async change(status) {
      this.transferModalCopy = status
      this.$emit('changeTransferModal', status)
      await sleep(300)
      !status && this.resetStatus()
    },
    setSearchUserInfo(data) {
      this.searchUsernameInfo = data
    },
    changeTransferId: debounce(async function() {
      if (!strTrim(this.transferUsername)) {
        this.resultUser = false
        this.errorMessage = false
        return
      }
      try {
        console.log(this.transferUsername)
        const res = await this.$backendAPI.searchUsername(this.transferUsername)
        console.log(res)
        if (res.status === 200 && res.data.code === 0) {
          this.setSearchUserInfo(res.data.data)
          this.resultUser = true
          this.errorMessage = false
        } else {
          this.resultUser = false
          this.errorMessage = true
          this.buttonStatus = false
        }
      } catch (error) {
        console.log(error)
        this.resultUser = false
        this.errorMessage = true
        this.buttonStatus = false
      }
    }, 300),
    continueUser() {
      this.resultUser = false
      this.buttonStatus = true
    }
  }
}
</script>

<style lang="less">
/*样式覆盖*/
.widget-flex {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
<style src="./index.less" scoped lang="less"></style>
