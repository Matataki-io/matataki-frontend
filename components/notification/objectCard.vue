<template>
  <n-link :to="url" target="_blank">
    <div
      :class="bgColor !== '#F1F1F1' && 'shadow'"
      class="card"
      :style="`background-color: ${bgColor};`"
    >
      <!-- 文章 -->
      <div v-if="mode === 'post'" class="fl post">
        <div class="post-cover">
          <el-image
            :src="cover"
            class="post-cover-img"
            lazy
            alt="cover"
          />
        </div>
        <div>
          <h4>
            {{ post.title }}
          </h4>
          <div class="fl post-data">
            <!-- 阅读量 -->
            <div>
              <i class="el-icon-view" />
              {{ read }}
            </div>
            <!-- 点赞量 -->
            <div>
              <svg-icon icon-class="like" />
              {{ likes }}
            </div>
          </div>
        </div>
      </div>
      <!-- 用户 -->
      <div v-if="mode === 'user'" class="fl user">
        <c-user-popover :user-id="Number(user.id) || 0">
          <c-avatar :src="avatar" class="avatar" />
        </c-user-popover>
        <div class="user-info" :class="dateCard && 'user-details'">
          <div class="fl user-info-top">
            <h4 :class="logout && 'logout'">
              {{ nickname }}
            </h4>
            <p class="user-info-top-other">
              {{ dateCard }} {{ action ? actionLabels[action] : '' }}
            </p>
          </div>
          <p class="introduction">
            {{ user.introduction || $t('notProfile') }}
          </p>
        </div>
        <div v-if="user.id && !isMe(user.id)" class="user-button">
          <a href="javascript:;">
            <el-button
              :class="!user.is_follow && 'black'"
              size="small"
              class="user-follow"
              @click.stop="followOrUnFollow"
            >
              <i
                v-if="!user.is_follow"
                class="el-icon-plus"
              />
              {{ followBtnText }}
            </el-button>
          </a>
        </div>
      </div>
      <!-- 回复/评论 -->
      <div v-if="mode === 'reply'" class="fl reply">
        <p v-if="content !== false">
          {{ content }}
        </p>
        <p v-else>
          <i class="el-icon-delete" />
          {{ $t('this-comment-has-been-deleted') }}
        </p>
      </div>
      <!-- token -->
      <div v-if="mode === 'token'" class="fl token">
        <div class="token-logo">
          <el-image
            class="token-logo-img"
            :src="tokenLogo"
            lazy
            alt="cover"
          />
        </div>
        <div v-if="token.symbol !== 'CNY'" class="token-right">
          <h4>
            {{ token.name }} 「{{ token.symbol }}」
            <span>
              {{ action && actionLabels[action] }}
            </span>
          </h4>
          <p>
            {{ token.brief }}
          </p>
        </div>
        <div v-else class="token-right">
          <h4>
            CNY
          </h4>
        </div>
      </div>
      <!-- @分享 -->
      <div v-if="mode === 'share'" class="fl share">
        <n-link class="link" :to="{ name: 'share-id', params: { id: share.id } }" target="_blank">
          {{ $t('mention-at-to-you-in-ta-sharing') }}
        </n-link>
      </div>
    </div>
  </n-link>
</template>
<script>

import { isNDaysAgo } from '@/utils/momentFun'
import { mapGetters } from 'vuex'

export default {
  components: {

  },
  props: {
    mode: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      default: () => { return {} }
    },
    post: {
      type: Object,
      default:  null
    },
    comment: {
      type: Object,
      default:  null
    },
    token: {
      type: Object,
      default: null
    },
    share: {
      type: Object,
      default: null
    },
    bgColor: {
      type: String,
      default:  '#F1F1F1'
    },
    createTime: {
      type: String,
      default:  ''
    },
    action: {
      type: String,
      default:  ''
    },
  },
  data() {
    return {
      actionLabels: {
        like: '推荐了你的文章',
        comment: '评论了你的文章',
        follow: '关注了你',
        collaborator: '将你添加为协作者'
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    cover() {
      if (!this.post) return ''
      return this.post.cover ? this.$ossProcess(this.post.cover, { h: 60 }) : this.$ossProcess('/material/default_cover.png', { h: 60 })
    },
    likes() {
      if (!this.post || !this.post.likes) return 0
      if (this.post.likes > 9999) { return Math.round(this.post.likes / 10000) + '万' }
      return this.post.likes
    },
    read() {
      if (!this.post || !this.post.real_read_count) return 0
      if (this.post.real_read_count > 9999) { return Math.round(this.post.real_read_count / 10000) + '万' }
      return this.post.real_read_count
    },
    url() {
      if(this.mode === 'post') return {name: 'p-id', params:{id: this.post.id}}
      else if(this.mode === 'reply' && this.comment) return {name: 'p-id', params: {id: this.comment.sign_id}, query: {comment: this.comment.id}}
      else if(this.mode === 'token' && this.token.symbol === 'CNY') return {name: 'account'}
      else if(this.mode === 'token') return {name: 'token-id', params: {id: this.token.token_id || this.token.id}}
      else if(this.mode === 'user') return {name: 'user-id', params:{id: this.user.id || 0}}
      else if(this.mode === 'share') return {name: 'share-id', params:{id: this.share.id || 0}}
      return {}
    },
    followBtnText() {
      if(!this.user) return ''
      return this.user.is_follow ? this.$t('following') : this.$t('follow')
    },
    avatar() {
      if (this.user && this.user.avatar) return this.$ossProcess(this.user.avatar)
      return ''
    },
    nickname() {
      if(!this.user) return this.$t('error.accountHasBeenLoggedOut')
      return this.user.nickname || this.user.username || this.$t('error.accountHasBeenLoggedOut')
    },
    logout() {
      return !this.user || !this.user.id
    },
    dateCard() {
      if(!this.createTime) return ''
      const time = this.moment(this.createTime)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    content() {
      if(!this.comment) return false
      return this.comment.comment
    },
    tokenLogo() {
      if (!this.token) return ''
      if (this.token.symbol === 'CNY') return require('@/assets/img/notify_cny.png')
      return this.token.logo ? this.$ossProcess(this.token.logo, { h: 60 }) : ''
    },
  },
  methods: {
    followOrUnFollow() {
      if (this.user.is_follow) {
        this.$confirm(this.$t('p.confirmUnFollowMessage'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.followOrUnfollowUser(this.user.id, 0)
        })
      } else {
        this.followOrUnfollowUser(this.user.id, 1)
      }
    },
    async followOrUnfollowUser(id, type) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      const message = type === 1 ? this.$t('follow') : this.$t('unFollow')

      try {
        let res = null
        if (type === 1) res = await this.$API.follow(id)
        else res = await this.$API.unfollow(id)
        if (res.code === 0) {
          this.$message({ showClose: true, message: `${message}${this.$t('success.success')}`, type: 'success'})

          this.user.is_follow = type === 1
        } else {
          this.$message({ showClose: true, message: `${message}${this.$t('error.fail')}`, type: 'error' })
        }
      } catch (error) {
        this.$message({ showClose: true, message: `${message}${this.$t('error.fail')}`, type: 'error' })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.card {
  height: 60px;
  border-radius: 8px;
  padding: 10px;
  &.shadow {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    padding: 20px;
  }
  .post {
    &-cover {
      width: 120px;
      min-width: 120px;
      height: 60px;
      margin-right: 10px;
      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius:8px;
      }
    }
    &-data {
      font-size: 14px;
      color: #B2B2B2;
      line-height: 20px;
      div {
        min-width: 60px;
      }
    }
    h4 {
      font-size: 16px;
      color: black;
      line-height: 21px;
      height: 42px;
      margin: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .user {
    align-items: center;
    .avatar {
      width: 60px !important;
      height: 60px !important;
      min-width: 60px;
      background: #eee;
      margin-right: 14px;
    }
    &-info {
      flex: 1;
      &-top {
        h4 {
          font-size: 16px;
          color: black;
          line-height: 22px;
          margin: 0;
          margin-right: 10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break:break-all;
          &.logout {
            color: #b2b2b2;
          }
          &:hover {
            text-decoration: underline;
          }
        }
        &-other {
          font-size: 14px;
          color: #B2B2B2;
          line-height: 20px;
          margin: 0;
          white-space: nowrap;
        }
      }
      .introduction {
        font-size: 14px;
        color: #B2B2B2;
        line-height: 20px;
        margin: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }

    &-follow {
      &.black {
        background: #333;
        color: #fff;
        border: 1px solid #333;
      }
    }
    &-button {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-left: 20px;
    }
  }
  .reply {
    padding: 10px;
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      color: #B2B2B2;
      line-height: 20px;
      margin: 0;
      .no-data {
        color: #b2b2b2;
      }
    }
  }
  .token {
    &-logo {
      width: 60px !important;
      height: 60px !important;
      min-width: 60px;
      margin-right: 14px;
      &-img {
        width: 100%;
        height: 100%;
        background: #eee;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    &-right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      h4 {
        font-size: 16px;
        color: black;
        line-height: 21px;
        margin: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break:break-all;
        span {
          font-size: 14px;
          color: #B2B2B2;
          line-height: 20px;
          font-weight: 500;
          margin: 0;
          white-space: nowrap;
        }
      }
      p {
        font-size: 14px;
        font-weight: 400;
        color: #B2B2B2;
        line-height: 20px;
        margin: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break:break-all;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .card {
    height: 42px;
    .post {
      &-cover {
        width: 80px;
        min-width: 80px;
        height: 40px;
        margin-right: 10px;
      }
      h4 {
        font-size: 14px;
        line-height: 16px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break:break-all;
        height: 16px;
        margin-bottom: 5px;
      }
    }
    .user {
      .avatar {
        width: 40px !important;
        height: 40px !important;
        min-width: 40px;
        background: #eee;
        margin-right: 14px;
      }
      &-info {
        &-top {
          h4 {
            font-size: 14px;
          }
          &-other {
            font-size: 12px;
          }
        }
        .introduction {
          font-size: 12px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break:break-all;
        }
      }
    }
    .reply {
      padding: 0;
    }
    .token {
      &-logo {
        width: 40px !important;
        height: 40px !important;
        min-width: 40px;
      }
      &-right {
        h4 {
          font-size: 14px;
        }
        p {
          font-size: 12px;
        }
      }
    }
  }
  .user-details {
    .user-info-top {
      display: block;
    }
    .introduction {
      display: none !important;
    }
  }
}

.share {
  .link {
    color: rgb(47, 174, 227);
    font-size: 14px;
  }
}
</style>
