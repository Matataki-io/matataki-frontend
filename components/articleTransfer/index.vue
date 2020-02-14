<template>
  <el-dialog :visible.sync="showModal" :lock-scroll="false" @close="change" width="375px" custom-class="br10">
    <div v-if="widgetModalStatus === 0" class="widget-writecontent">
      <p class="widget-title">
        {{ $t('p.articleTransferTitle') }}
      </p>
      <div class="widget-input-container">
        <el-input
          v-model="transferUsername"
          :placeholder="$t('p.articleTransferPlaceholder')"
          class="widget-input"
        />
        <!-- 搜索结果 -->
        <div v-if="searchUserList.length !== 0 && toUserInfoIndex === -1" class="widget-input-user">
          <div v-for="(item, index) in searchUserList" :key="item.id" @click="continueUser(index)">
            <avatar :src="searchUserAvatar(item.avatar)" class="widget-input-avater" />
            <span v-html="searchUserTitle(item.nickname || item.username)" class="search-result__tag " />
          </div>
        </div>
        <!-- 结果 -->
        <router-link v-if="toUserInfoIndex !== -1" :to="{name: 'user-id', params: {id: searchUserList[toUserInfoIndex].id}}" class="search-user" target="_blank">
          <avatar :src="searchUserAvatar(searchUserList[toUserInfoIndex].avatar)" class="search-user-avatar" />
          <span v-html="searchUserTitle(searchUserList[toUserInfoIndex].nickname || searchUserList[toUserInfoIndex].username)" class="search-result__tag " />
        </router-link>
        <span v-if="errorMessage" class="error-info">{{ $t('p.articleTransferNotUser') }}</span>
      </div>
      <div class="widget-footer">
        <a @click="reviewHelp" class="help" href="javascript:;">{{ $t('p.articleTransferHelp') }}</a>
        <a
          :class="[toUserInfoIndex === -1 && 'gray']"
          @click="transferArticle"
          class="create"
          href="javascript:;"
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
      <a @click="backPage" class="widget-help-button" href="javascript:;">
        {{ $t('p.articleTransferHelpBtn') }}
      </a>
    </div>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { xssFilter } from '@/utils/xss'
import avatar from '@/common/components/avatar'

export default {
  name: 'ArticleTransfer',
  components: {
    avatar
  },
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
      showModal: false,
      searchUserList: [], // 搜索结果
      toUserInfoIndex: -1 // 转让的对象
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
      const toUserInfoIndex = this.toUserInfoIndex

      if (toUserInfoIndex === -1) return
      const transferUsername = this.searchUserList[toUserInfoIndex].id
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

      this.searchUserList = [] // 搜索结果
      this.toUserInfoIndex = -1 // 转让的对象
    },
    async change(status) {
      this.showModal = false
      await this.$utils.sleep(300)
      !status && this.resetStatus()
    },
    changeTransferId: debounce(function () {
      const searchName = this.transferUsername.trim()
      if (!searchName) {
        this.errorMessage = false
        return
      }

      this.toUserInfoIndex = -1

      const params = {
        word: searchName,
        pagesize: 10
      }

      this.$API.search('user', params).then(res => {
        if (res.code === 0) {
          this.searchUserList = res.data.list
          if (res.data.list.length === 0) {
            // 没有结果
            this.errorMessage = true
          } else {
            // 有结果
            this.errorMessage = false
          }
        } else {
          // 失败
          this.errorMessage = false
          this.$message.warning(res.message)
        }
      }).catch(err => {
        // 出错
        console.log(err)
        this.searchUserList = []
        this.errorMessage = false
      })
    }, 300),
    continueUser(i) {
      this.toUserInfoIndex = i
    },
    searchUserAvatar(src) {
      return src ? this.$ossProcess(src, { h: 60 }) : ''
    },
    searchUserTitle(html) {
      return html ? xssFilter(html) : ''
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
