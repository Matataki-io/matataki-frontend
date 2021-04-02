<template>
  <div class="fl comment-input">
    <c-avatar
      :src="avatarSrc"
      class="avatar"
      :recommend-author="user.is_recommend === 1"
      :level="1"
      :token-user="!!tokenInfo.id"
      :level-token="1"
    />
    <div class="comment-container">
      <commentsInput ref="commentsInputRef" />
      <!-- <el-input
        v-model="comment"
        :autosize="{ minRows: 3}"
        :placeholder="placeholder"
        :autofocus="true"
        type="textarea"
        maxlength="500"
        show-word-limit
        class="customize-input"
        @keyup.native="postCommentKeyup"
      /> -->
      <span class="comments-input__count" :style="{ color: currentText > totalText ? 'red' : '' }">{{ currentText }}/{{ totalText }}</span>
    </div>
    <button type="submit" class="comment-submit" @click="postComment">
      {{ $t('post-a-comment') }}
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { filterOutHtmlShare } from '@/utils/xss'
import commentsInput from '../p_page/comments_input'

export default {
  components: {
    commentsInput
  },
  props: {
    replyUsername: {
      type: String,
      required: true
    },
    replyId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      comment: '',
      avatarSrc: '',
      user: Object.create(null), // 用户信息
      tokenInfo: Object.create(null), // token info
      timeLength: null,
      totalText: 500,
      currentText: 0,
    }
  },
  computed: {
    ...mapGetters(['isLogined', 'currentUserInfo']),
    placeholder() {
      return `回复 @${this.replyUsername} :`
    }
  },
  watch: {
    isLogined(val) { // 监听登陆 重新获取头像
      // 切换文章时重置评论框内容
      this.comment = ''
      if (val && this.currentUserInfo.id) {
        this.getUser(this.currentUserInfo.id)
        this.getTokenUser(this.currentUserInfo.id)
      }
    }
  },
  mounted() {
    if (process.client) {
      if (this.currentUserInfo.id) {
        this.getUser(this.currentUserInfo.id)
        this.getTokenUser(this.currentUserInfo.id)
      }
      this.timeLength = setInterval(this.handleCurrentText, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.timeLength)
  },
  methods: {
    handleCurrentText() {
      try {
        let { commentsInputRef } = this.$refs
        let { contentEditable } = commentsInputRef.$refs
        let content = contentEditable.innerText
        this.currentText = (content.trim()).length
      } catch (e) {
        console.log('e', e)
      }
    },
    async getUser(id) { // 获取用户头像
      await this.$API.getUser(id).then(res => {
        if (res.code === 0) {

          this.user = res.data

          this.avatarSrc = res.data.avatar ? this.$ossProcess(res.data.avatar) : ''
        }
      })
    },
    async getTokenUser(id) {
      // 获取是否有 token
      const tokenRes = await this.$utils.factoryRequest(this.$API.tokenUserId(id))
      // not token, data is null
      this.tokenInfo = tokenRes ? (tokenRes.data || {}) : {}
    },
    postComment() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return
      }

      try {
        let { commentsInputRef } = this.$refs
        let { contentEditable } = commentsInputRef.$refs
        let content = filterOutHtmlShare(contentEditable.innerHTML.toString())

        if (!(content).trim()) {
          this.$message.error(this.$t('p.commentContent'))
          return
        }

        if ((contentEditable.innerText.trim()).length > this.totalText) {
          this.$message.error('评论内容不能超出上限')
          return
        }

        console.log('articleId:', this.$route.params.id)
        const signId = this.$route.params.id
        const replyId = this.replyId
        const comment = content
        const res = this.$API.reply(signId, replyId, comment)
        if (res.code === 0) {
          contentEditable.innerHTML = ''
          this.$store.commit('setCommentRequest')
          this.$emit('doneReply')
        } else {
          this.$message({ showClose: true, message: res.message, type: 'error' })
        }
      } catch (e) {
        console.log('评论失败', e)
        this.$message.error(this.$t('p.commentFail'))
      }
    },
    postCommentKeyup(e) {
      // TODO 组合键调用方法 Ctrl or ⌘ + Enter
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
        this.postComment()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  /deep/ .recommend-icon {
    right: -10px !important; 
    bottom: -5px !important; 
    width: 26px !important; 
  }
}
.comment-submit {
  /* width: 70px;
  height: 64px;
  position: absolute;
  right: -80px;
  top: 0; */
  padding: 4px 15px;
  font-size: 14px;
  color: #fff;
  border-radius: 4px;
  text-align: center;
  min-width: 60px;
  vertical-align: top;
  cursor: pointer;
  background-color: #000;
  border: 1px solid #000;
  transition: 0.1s;
  user-select: none;
  outline: none;
  margin-left: 10px;
  height: 75px;
  &:hover {
    background: #333;
    border-color: #333;
  }
  &::active {
    transform: scale(0.9);
    box-shadow: 0 2px 25px rgba(163, 163, 163, 0.747);
  }
}
.comment-input {
  margin-top: 10px;
  margin-bottom: 10px;
  .avatar {
    margin-right: 20px;
  }
  .btn-container {
    margin-top: 10px;
    width: 100px;
  }
  .btn-des {
    font-size: 14px;
    font-weight: 400;
    color: #9a9a9a;
    line-height: 20px;
    margin-right: 10px;
  }
  .btn {
    background: #000;
    border-color: #000;
    color: #fff;
    &:hover {
      background: #333;
      border-color: #333;
    }
  }
}
.comment-container {
  // background-color: #fff;
  flex: 1;
  overflow: hidden;
  // min-height: 150px;
  .clearfix();
}
// 小于860
@media screen and (max-width: 860px) {
  .avatar {
    display: none;
  }
}

.comments-input__count {
  color: #fff;
  background: #b2b2b2;
  position: static;
  font-size: 12px;
  padding: 0 5px;
  line-height: 20px;
  height: 20px;
  border-radius: 2px;
  float: right;
  margin: 10px 0 0;
}
</style>

<style lang="less">
//  评论聚焦颜色
.comment-container .el-textarea__inner:focus {
  border-color: @purpleDark;
}
</style>
