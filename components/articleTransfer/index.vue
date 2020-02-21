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
        <!-- 常用候选对象列表 -->
        <template v-if="historyUser.length !== 0">
          <el-tag v-for="item in historyUser" :key="item.id" @click="continueUser(item)" type="info" class="history-user__tag">
            {{
              (item.nickname || item.username).length > 20
                ? `${(item.nickname || item.username).slice(0, 20)}...`
                : item.nickname || item.username
            }}
          </el-tag>
        </template>
        <!-- 搜索结果 -->
        <div v-if="searchUserList.length !== 0 && $utils.isNull(toUserInfo)" class="transfer—search__list">
          <div v-for="item in searchUserList" :key="item.id" @click="continueUser(item)">
            <avatar :src="searchUserAvatar(item.avatar)" class="transfer—search__list__avatar" />
            <span v-html="searchUserTitle(item.nickname || item.username)" class="search-result__tag " />
          </div>
        </div>
      </el-form-item>

      <!-- 结果 -->
      <transition name="result">
        <el-form-item v-if="!$utils.isNull(toUserInfo)" label="" prop="">
          <router-link :to="{name: 'user-id', params: {id: toUserInfo.id}}" class="search-user" target="_blank">
            <avatar :src="searchUserAvatar(toUserInfo.avatar)" class="search-user-avatar" />
            <span v-html="searchUserTitle(toUserInfo.nickname || toUserInfo.username)" class="search-result__tag " />

            <div @click="closeUser" class="gift-ful">
              <i class="el-icon-close" />
            </div>
          </router-link>
        </el-form-item>
      </transition>
      <a @click="widgetModalStatus = 1" class="transfer-help" href="javascript:;">{{ $t('p.articleTransferHelp') }}</a>
      <el-form-item>
        <div class="form-button">
          <el-button :disabled="$utils.isNull(toUserInfo)" @click="submitForm('form')" type="primary" size="small">
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
      toUserInfo: null, // 转让的对象
      historyUser: [] // 历史转让用户
    }
  },
  watch: {
    showModal(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      if (newVal) {
        this.historyUserFunc('post')
      } else {
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
      if (this.$utils.isNull(this.toUserInfo)) {
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
      const toUserInfo = this.toUserInfo
      if (this.$utils.isNull(toUserInfo)) return

      const toId = this.$utils.isNull(toUserInfo) ? -1 : toUserInfo.id

      try {
        const res = await this.$backendAPI.transferOwner(
          this.from,
          this.articleId,
          toId
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
      this.toUserInfo = null
    },
    // 搜索用户
    searchUser: debounce(function () {
      const searchName = this.transferUsername.trim()
      if (!searchName) {
        this.searchUserList = []
        return
      }

      this.toUserInfo = null

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
    continueUser(val) {
      this.toUserInfo = val
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
      this.toUserInfo = null
      this.searchUserList = []
      return false
    },
    // 获取常用用户列表
    historyUserFunc(type) {
      this.$API.historyUser({
        type
      }).then(res => {
        if (res.code === 0) {
          this.historyUser = res.data.slice(0, 10)
        } else {
          console.log(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style src="./index.less" scoped lang="less"></style>
