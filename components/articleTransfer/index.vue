<template>
  <m-dialog v-model="showModal" :title="$t('p.articleTransferTitle')" width="600px" class="transfer-dialog">
    <el-form
      ref="form"
      v-show="widgetModalStatus === 0"
      @submit.native.prevent
      label-width="70px"
    >
      <el-form-item label="接受对象">
        <el-input
          v-model="transferUsername"
          :placeholder="$t('p.articleTransferPlaceholder')"
          size="small"
          style="z-index: 2;"
        />
        <!-- 搜索结果 -->
        <div v-if="searchUserList.length !== 0 && toUserInfoIndex === -1" class="transfer—search__list">
          <div v-for="(item, index) in searchUserList" :key="item.id" @click="continueUser(index)">
            <avatar :src="searchUserAvatar(item.avatar)" class="transfer—search__list__avatar" />
            <span v-html="searchUserTitle(item.nickname || item.username)" class="search-result__tag " />
          </div>
        </div>
      </el-form-item>

      <!-- 结果 -->
      <transition name="result">
        <el-form-item v-if="toUserInfoIndex !== -1" label="" prop="">
          <router-link v-if="toUserInfoIndex !== -1" :to="{name: 'user-id', params: {id: searchUserList[toUserInfoIndex].id}}" class="search-user" target="_blank">
            <avatar :src="searchUserAvatar(searchUserList[toUserInfoIndex].avatar)" class="search-user-avatar" />
            <span v-html="searchUserTitle(searchUserList[toUserInfoIndex].nickname || searchUserList[toUserInfoIndex].username)" class="search-result__tag " />
            <div @click="closeUser" class="gift-ful">
              <i class="el-icon-close" />
            </div>
          </router-link>
        </el-form-item>
      </transition>
      <a @click="widgetModalStatus = 1" class="transfer-help" href="javascript:;">{{ $t('p.articleTransferHelp') }}</a>
      <el-form-item>
        <div class="form-button">
          <el-button :disabled="toUserInfoIndex === -1" @click="submitForm('form')" type="primary" size="small">
            {{ $t('p.articleTransferBtn') }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <div v-show="widgetModalStatus === 1" class="widget-help">
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
      <div class="form-button">
        <el-button @click="widgetModalStatus = 0" type="primary" size="small">
          {{ $t('p.articleTransferHelpBtn') }}
        </el-button>
      </div>
    </div>
  </m-dialog>
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
      widgetModalStatus: 0,
      transferUsername: '',
      showModal: false,
      searchUserList: [], // 搜索结果
      toUserInfoIndex: -1 // 转让的对象
    }
  },
  watch: {
    showModal(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      if (!newVal) {
        this.resetStatus()
      }
      this.showModal = newVal
    },
    transferUsername() {
      this.searchUser()
    }
  },
  methods: {
    submitForm(formName) {
      // 这里没有用表单验证
      if (this.toUserInfoIndex === -1) {
        this.$message.warning('请选择用户')
      } else {
        this.transferArticle()
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 转让文章
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
          this.$router.push({ name: 'article' })
        } else {
          this.$message.warning(this.$t('p.articleTransferNotOpen'))
        }
      } catch (error) {
        console.log(error)
        this.$message.warning(this.$t('p.articleTransferNotOpen'))
      }
    },
    // 重置状态
    resetStatus() {
      this.widgetModalStatus = 0
      this.transferUsername = ''

      this.searchUserList = [] // 搜索结果
      this.toUserInfoIndex = -1 // 转让的对象
    },
    // 搜索用户
    searchUser: debounce(function () {
      const searchName = this.transferUsername.trim()
      if (!searchName) return

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
            this.$message.warning('没有搜索结果')
          }
        } else {
          // 失败
          this.$message.warning(res.message)
        }
      }).catch(err => {
        // 出错
        console.log(err)
        this.searchUserList = []
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
    },
    // 取消搜索后的用户
    closeUser(e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.toUserInfoIndex = -1
      this.searchUserList = []
      return false
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
