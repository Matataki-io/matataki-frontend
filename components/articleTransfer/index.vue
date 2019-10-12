<template>
  <el-dialog :visible.sync="showModal" width="375px" :lock-scroll="false" custom-class="br10" @close="change">
    <div v-if="widgetModalStatus === 0" class="widget-writecontent">
      <p class="widget-title">
        {{ $t('p.articleTransferTitle') }}
      </p>
      <div class="widget-input-container">
        <el-input
          v-model="transferUsername"
          class="widget-input"
          :placeholder="$t('p.articleTransferPlaceholder')"
        />
        <div v-if="resultUser" class="widget-input-user" @click="continueUser">
          <div class="widget-input-avater">
            <img :src="userAvatar" alt="avatar">
          </div>
          <span>{{ searchUsernameInfo.nickname || searchUsernameInfo.username }}</span>
        </div>
        <span v-if="errorMessage" class="error-info">{{ $t('p.articleTransferNotUser') }}</span>
      </div>
      <div class="widget-footer">
        <a class="help" href="javascript:;" @click="reviewHelp">{{ $t('p.articleTransferHelp') }}</a>
        <a
          class="create"
          href="javascript:;"
          :class="[!buttonStatus && 'gray']"
          @click="transferArticle"
        >
          {{ $t('p.articleTransferBtn') }}</a>
      </div>
    </div>
    <div v-if="widgetModalStatus === 1" class="widget-help">
      <p class="widget-help-title">
        {{ $t('p.articleTransferHelpTitle') }}
      </p>
      <p class="widget-help-content">
        {{ $t('p.articleTransferHelpDes') }}
      </p>
      <br>
      <p class="widget-help-title">
        {{ $t('p.articleTransferHelpStepTitle') }}
      </p>
      <p class="widget-help-content">
        1.{{ $t('p.articleTransferHelpStepDes1') }}<br>
        2.{{ $t('p.articleTransferHelpStepDes2') }}<br>
        3.{{ $t('p.articleTransferHelpStepDes3') }}
      </p>
      <a class="widget-help-button" href="javascript:;" @click="backPage">
        {{ $t('p.articleTransferHelpBtn') }}
      </a>
    </div>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { strTrim } from '@/utils/reg'

export default {
  name: 'ArticleTransfer',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: Number,
      required: true
    },
    from: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 0 默认
      // 1 转让
      widgetModalStatus: 0,
      oldWidgetModalStatus: 0,
      transferUsername: '',
      errorMessage: false, // 错误信息 默认不显示
      resultUser: false, // 搜索结果  默认不显示
      buttonStatus: false, // 转让按钮 默认无法点击
      searchUsernameInfo: null, // 用户信息
      showModal: false
    }
  },
  computed: {
    userAvatar() {
      return this.$backendAPI.getAvatarImage(this.searchUsernameInfo.avatar)
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    },
    transferUsername() {
      this.changeTransferId()
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
      const transferUsername = this.searchUsernameInfo.id
      try {
        const res = await this.$backendAPI.transferOwner(
          this.from,
          this.articleId,
          transferUsername
        )
        if (res.status === 200 && res.data.code === 0) {
          this.$message.success(this.$t('p.articleTransferSuccess'))

          this.change(false)
          this.$emit('toggleDone')
          this.$router.push({ name: 'article' })
        } else {
          this.$message.warning(this.$t('p.articleTransferNotOpen'))
        }
      } catch (error) {
        console.log(error)
        this.$message.warning(this.$t('p.articleTransferNotOpen'))
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
      this.showModal = false
      await this.$utils.sleep(300)
      !status && this.resetStatus()
    },
    setSearchUserInfo(data) {
      this.searchUsernameInfo = data
    },
    changeTransferId: debounce(async function () {
      if (!strTrim(this.transferUsername)) {
        this.resultUser = false
        this.errorMessage = false
        return
      }
      try {
        // console.log(this.transferUsername)
        const res = await this.$backendAPI.searchUsername(this.transferUsername)
        // console.log(res)
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
