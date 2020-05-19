<template>
  <router-link :to="url">
    <div class="card">
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
        <div class="user-info">
          {{ nickname }}
          <p class="user-introduction">
            {{ user.introduction }}
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

import { mapGetters, mapActions } from 'vuex'

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
    }
  },
  data() {
    return {
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
      if (!this.post || !this.post.read) return 0
      if (this.post.read > 9999) { return Math.round(this.post.read / 10000) + '万' }
      return this.post.read
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
      console.log(this.user)
      if(!this.user) return ''
      return this.user.nickname || this.user.username
    },
  },
  methods: {
    ...mapActions('user', ['followOrUnfollowUser']),
    followOrUnFollow() {
      if (this.user.is_follow) {
        this.$confirm(this.$t('p.confirmUnFollowMessage'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => this.followOrUnfollowUser({
          id: this.id,
          type: 0
        }))
      } else {
        this.followOrUnfollowUser({
          id: this.id,
          type: 1
        })
      }
    }

  }
}
</script>
<style lang="less" scoped>
.card {
  height: 60px;
  border-radius: 8px;
  background-color: #F1F1F1;
  padding: 10px;
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
    .avatar {
      width: 60px !important;
      height: 60px !important;
      background: #eee;
      z-index: 1;
      position: relative;
    }
    &-info {
      max-width: 400px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 20px;
      margin-left: 14px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: blank;
      .name {
        font-size: 16px;
        color: #000;
        line-height: 22px;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
    }
    &-introduction {
      font-size: 14px;
      color: @gray;
      line-height: 17px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

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
      flex: 1;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
