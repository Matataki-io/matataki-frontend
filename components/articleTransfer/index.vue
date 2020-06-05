<template>
  <m-dialog
    v-model="showModal"
    :title="dialogTitle"
    class="transfer-dialog"
  >
    <el-form
      v-show="widgetModalStatus === 0"
      ref="form"
      label-width="70px"
      @submit.native.prevent
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
          <el-tag
            v-for="item in historyUser"
            :key="item.id"
            type="info"
            class="history-user__tag"
            @click="continueUser(item)"
          >
            {{
              (item.nickname || item.username).length > 20
                ? `${(item.nickname || item.username).slice(0, 20)}...`
                : item.nickname || item.username
            }}
          </el-tag>
        </template>
        <!-- 搜索结果 -->
        <div
          v-if="searchUserList.length !== 0 && $utils.isNull(toUserInfo)"
          class="transfer—search__list"
        >
          <div
            v-for="item in searchUserList"
            :key="item.id"
            @click="continueUser(item)"
          >
            <avatar
              :src="searchUserAvatar(item.avatar)"
              class="transfer—search__list__avatar"
            />
            <span
              class="search-result__tag "
              v-html="searchUserTitle(item.nickname || item.username)"
            />
          </div>
        </div>
      </el-form-item>

      <!-- 结果 -->
      <transition name="result">
        <el-form-item
          v-if="!$utils.isNull(toUserInfo)"
          label=""
          prop=""
        >
          <router-link
            :to="{name: 'user-id', params: {id: toUserInfo.id}}"
            class="search-user"
            target="_blank"
          >
            <avatar
              :src="searchUserAvatar(toUserInfo.avatar)"
              class="search-user-avatar"
            />
            <span
              class="search-result__tag "
              v-html="searchUserTitle(toUserInfo.nickname || toUserInfo.username)"
            />

            <div
              class="gift-ful"
              @click="closeUser"
            >
              <i class="el-icon-close" />
            </div>
          </router-link>
        </el-form-item>
      </transition>
      <a
        class="transfer-help"
        href="javascript:;"
        @click="widgetModalStatus = 1"
      >{{ $t('p.articleTransferHelp') }}</a>
      <el-form-item>
        <div class="form-button">
          <el-button
            :disabled="$utils.isNull(toUserInfo)"
            type="primary"
            size="small"
            @click="submitForm('form')"
          >
            {{ dialogButton }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <div
      v-show="widgetModalStatus === 1"
      class="widget-help"
    >
      <p class="widget-help-title">
        {{ dialogHelpTitle }}
      </p>
      <p class="widget-help-content">
        {{ dialogHelpContent }}
      </p>
      <br>
      <p class="widget-help-title">
        {{ $t('p.articleTransferHelpStepTitle') }}
      </p>
      <p class="widget-help-content">
        <template v-for="(item, index) in dialogHelpContentStep">
          {{ item }} <br :key="index">
        </template>
      </p>
      <div class="form-button">
        <el-button
          type="primary"
          size="small"
          @click="widgetModalStatus = 0"
        >
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
  computed: {
    // dialog 标题
    dialogTitle() {
      // 文章 草稿
      if (this.from === 'article' || this.from === 'draft') {
        return this.$t('p.articleTransferTitle')
      } else if (this.from === 'share') {
        // 分享
        return '转让分享的ownership'
      } else {
        // other
        return ''
      }
    },
    // dialog 按钮
    dialogButton() {
      // 文章 草稿
      if (this.from === 'article' || this.from === 'draft') {
        return this.$t('p.articleTransferBtn')
      } else if (this.from === 'share') {
        // 分享
        return '转让分享'
      } else {
        // other
        return ''
      }
    },
    // dialog 帮助标题
    dialogHelpTitle() {
      // 文章 草稿
      if (this.from === 'article' || this.from === 'draft') {
        return this.$t('p.articleTransferHelpTitle')
      } else if (this.from === 'share') {
        // 分享
        return '什么是分享权限转移'
      } else {
        // other
        return ''
      }
    },
    // dialog 帮助内容
    dialogHelpContent() {
      // 文章 草稿
      if (this.from === 'article' || this.from === 'draft') {
        return this.$t('p.articleTransferHelpDes')
      } else if (this.from === 'share') {
        // 分享
        return '使用此功能可以将分享的署名权和收益权转移给另一名用户。接受权限转移的选项默认为关闭状态，需要在设置中手动开启。可转移对象为已发表的分享。请勿滥用此功能！'
      } else {
        // other
        return ''
      }
    },
    // dialog 帮助内容
    dialogHelpContentStep() {
      // 文章 草稿
      if (this.from === 'article' || this.from === 'draft') {
        return [
          '1.在搜索框中完整输入对方昵称',
          '2.请仔细核对被转移账户的信息',
          '3.核对后点击“转让文章”来移交权限'
        ]
      } else if (this.from === 'share') {
        // 分享
        return [
          '1.在搜索框中完整输入对方昵称',
          '2.请仔细核对被转移账户的信息',
          '3.核对后点击“转让分享”来移交权限'
        ]
      } else {
        // other
        return ''
      }
    },
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
    submitForm() {
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
        const res = await this.$API.transferOwner(
          this.from,
          this.articleId,
          toId
        )
        if (res.code === 0) {
          this.$message.success(this.$t('p.articleTransferSuccess'))

          if (this.from === 'article' || this.from === 'draft') {
            this.$emit('toggleDone') // 编辑页面离开
            this.$router.push({ name: 'article' })
          } else if (this.from === 'share') {
            this.$router.push({ name: 'sharehall' })
          } else {
            this.$router.push({ name: 'article' })
          }

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
