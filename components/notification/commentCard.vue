<template>
  <router-link :to="url">
    <div
      class="card"
    >
      <!-- 用户 -->
      <div class="fl user">
        <router-link :to="{name: 'user-id', params:{id: card.user_id}}">
          <c-user-popover :user-id="Number(card.user_id)">
            <c-avatar :src="avatar" class="avatar" />
          </c-user-popover>
        </router-link>
        <div class="user-info">
          <div class="fl user-info-top">
            <h4>
              <router-link :class="logout && 'logout'" :to="{name: 'user-id', params:{id: card.user_id}}">
                {{ nickname }}
              </router-link>
            </h4>
            <div class="fl" style="flex: 1;">
              <p class="action">
                {{ actionLabels[card.action] }}
              </p>
              <p>
                {{ dateCard }}
              </p>
            </div>
          </div>
          <p v-if="comment !== false" class="user-info-content" v-html="comment" />
          <p v-else class="user-info-content no-data">
            <i class="el-icon-delete" />
            此条评论已被删除
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script>

import { isNDaysAgo } from '@/utils/momentFun'

export default {
  components: {

  },
  props: {
    card: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      actionLabels: {
        reply: '回复了你的评论',
        comment: '评论了你的文章'
      }
    }
  },
  computed: {
    avatar() {
      if (this.card.user && this.card.user.avatar) return this.$ossProcess(this.card.user.avatar)
      return ''
    },
    nickname() {
      if(!this.card.user) return this.$t('error.accountHasBeenLoggedOut')
      return this.card.user.nickname || this.card.user.username || this.$t('error.accountHasBeenLoggedOut')
    },
    logout() {
      return !this.card.user || (!this.card.user.nickname && !this.card.user.username)
    },
    dateCard() {
      if(!this.card.create_time) return ''
      const time = this.moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    url() {
      if(this.card && this.card.comment)
        return {name: 'p-id', params: {id: this.card.comment.sign_id}, query: {comment: this.card.comment.id}}
      else return {}
    },
    comment() {
      if(this.card && this.card.comment)
        return this.card.comment.comment
      else return false
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.card {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background-color: white;
  .user {
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
        margin-bottom: 10px;
        h4 {
          font-size: 16px;
          color: black;
          line-height: 22px;
          margin: 0;
          margin-right: 10px;
          a {
            color: black;
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
        }
        p {
          font-size: 14px;
          color: #B2B2B2;
          line-height: 20px;
          margin: 0;
          white-space: nowrap;
          &.action {
            flex: 1;
            margin-right: 5px;
          }
        }
      }
      &-content {
        font-size: 16px;
        color: black;
        line-height: 30px;
        white-space: pre-wrap;
        margin: 0;
        &.no-data {
          white-space: normal;
          color: #b2b2b2;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .card {
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
          display: block;
          h4 {
            font-size: 14px;
          }
        }
        p {
          font-size: 12px;
        }
        &-content {
          font-size: 14px;
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
