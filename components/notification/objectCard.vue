<template>
  <router-link :to="url">
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
        <c-avatar
          :src="avatar"
          class="avatar"
        />
        <div class="user-info" :class="dateCard && 'user-details'">
          <div class="fl user-info-top">
            <h4>
              {{ nickname }}
            </h4>
            <p class="">
              {{ dateCard }} {{ action ? actionLabels[action] : '' }}
            </p>
          </div>
          <p class="introduction">
            {{ user.introduction || '暂无简介' }}
          </p>
        </div>
        <div v-if="!isMe(user.id)" class="user-button">
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
    </div>
  </router-link>
</template>
<script>

import moment from 'moment'
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
      default: null
    },
    post: {
      type: Object,
      default:  null
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
        follow: '关注了你'
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    cover() {
      if (!this.post) return ''
      return this.post.cover ? this.$ossProcess(this.post.cover, { h: 60 }) : ''
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
      return {name: 'user-id', params:{id: this.user.id}}
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
      if(!this.user) return ''
      return this.user.nickname || this.user.username
    },
    dateCard() {
      if(!this.createTime) return ''
      const time = moment(this.createTime)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
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
          this.$message.success(`${message}${this.$t('success.success')}`)

          this.user.is_follow = type === 1
        } else {
          this.$message.error(`${message}${this.$t('error.fail')}`)
        }
      } catch (error) {
        this.$message.error(`${message}${this.$t('error.fail')}`)
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
        }
        p {
          font-size: 14px;
          color: #B2B2B2;
          line-height: 20px;
          margin: 0;
        }
      }
      p {
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
        }
        p {
          font-size: 12px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
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
</style>
