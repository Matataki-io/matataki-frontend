<template>
  <div class="fl comment-input">
    <avatar
      :src="avatarSrc"
      size="40px"
      class="avatar"
    />
    <div class="comment-container">
      <el-input
        v-model="comment"
        :autosize="{ minRows: 3}"
        :placeholder="placeholder"
        :autofocus="true"
        type="textarea"
        maxlength="500"
        show-word-limit
        @keyup.native="postCommentKeyup"
      />
    </div>
    <button type="submit" class="comment-submit" @click="postComment">
      发表评论
    </button>
    <!-- <div class="btn-container fl ac jfe">
      <el-button
        size="small"
        class="btn"
        @click="postComment"
      >
        {{ $t('p.commentPointBtn') }}
      </el-button>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import avatar from '@/components/avatar/index'

export default {
  components: {
    avatar
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
      avatarSrc: ''
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
      if (val && this.currentUserInfo.id) this.getUser(this.currentUserInfo.id)
    }
  },
  mounted() {
    if (this.currentUserInfo.id) this.getUser(this.currentUserInfo.id)
  },
  methods: {
    async getUser(id) { // 获取用户头像
      await this.$API.getUser(id).then(res => {
        if (res.code === 0) this.avatarSrc = res.data.avatar ? this.$ossProcess(res.data.avatar) : ''
      })
    },
    islogin() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      return true
    },
    postComment() {
      console.log('articleId:', this.$route.params.id)
      const signId = this.$route.params.id
      const replyId = this.replyId
      const comment = this.comment
      this.$API.reply(signId, replyId, comment).then(res => {
        if (res.code === 0) {
          this.comment = ''
          this.$store.commit('setCommentRequest')
          this.$emit('doneReply')
        } else this.$message({ showClose: true, message: res.message, type: 'error' })
      }).catch(e => {
        console.log('评论失败', e)
        this.$message.error(this.$t('p.commentFail'))
      }) 
      /* if (!this.islogin()) return
      if (!(this.comment).trim()) return this.$message.error(this.$t('p.commentContent'))
      const data = {
        signId: this.articleId,
        comment: (this.comment).trim()
      }
      this.$API.postPointComment(data)
        .then(res => {
          if (res.code === 0) {
            this.$message.success(this.$t('p.commentSuccess'))
            this.comment = ''
          } else this.$message({ showClose: true, message: res.message, type: 'error' })
        })
        .catch(e => {
          console.log('评论失败', e)
          this.$message.error(this.$t('p.commentFail'))
        }) */
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
  transition: .1s;
  user-select: none;
  outline: none;
  margin-left: 10px;
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
    font-size:14px;
    font-weight:400;
    color:#9a9a9a;
    line-height:20px;
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
  // min-height: 150px;
}
// 小于860
@media screen and (max-width: 860px){
  .avatar {
    display: none;
  }
}
</style>

<style lang="less">
//  评论聚焦颜色
.comment-container .el-textarea__inner:focus {
  border-color: @purpleDark;
}
</style>
