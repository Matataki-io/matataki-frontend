<template>
  <div class="fl comment-input">
    <avatar :src="avatarSrc" size="40px" class="avatar" />
    <div class="comment-container">
      <el-input
        v-model="comment"
        :autosize="{ minRows: 4}"
        :placeholder="$t('p.commentPointPlaceholder')"
        @keyup.native="postCommentKeyup"
        type="textarea"
        maxlength="500"
        show-word-limit
      />
      <div class="btn-container fl ac jfe">
        <span class="btn-des">{{ article.comment_pay_point }}{{ $t('p.commentPointDes') }}</span>
        <el-button @click="postComment" size="small" class="btn">
          {{ $t('p.commentPointBtn') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import avatar from '@/components/avatar/index'

export default {
  components: {
    avatar
  },
  props: {
    article: {
      type: Object,
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
    ...mapGetters(['isLogined', 'currentUserInfo'])
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
      if (!this.islogin()) return
      if (!(this.comment).trim()) return this.$message.error(this.$t('p.commentContent'))
      const data = {
        signId: this.article.id,
        comment: (this.comment).trim()
      }
      this.$API.postPointComment(data)
        .then(res => {
          if (res.code === 0) {
            this.$message.success(this.$t('p.commentSuccess'))
            this.comment = ''
            this.$emit('doneComment')
          } else this.$message.error(res.message)
        })
        .catch(e => {
          console.log('评论失败', e)
          this.$message.error(this.$t('p.commentFail'))
        })
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
.comment-input {
  margin-top: 40px;
  margin-bottom: 20px;
  .avatar {
    margin-right: 20px;
  }
  .btn-container {
    margin-top: 10px;
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
</style>

<style lang="less">
//  评论聚焦颜色
.comment-container .el-textarea__inner:focus {
  border-color: @purpleDark;
}
</style>
