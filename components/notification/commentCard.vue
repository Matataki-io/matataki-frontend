<template>
  <router-link :to="{name: 'p-id', params:{id: card.object_id}}">
    <div
      class="card"
    >
      <!-- 用户 -->
      <div class="fl user">
        <router-link :to="{name: 'user-id', params:{id: card.user.id}}">
          <c-avatar
            :src="avatar"
            class="avatar"
          />
        </router-link>
        <div class="user-info">
          <div class="fl user-info-top">
            <h4>
              <router-link :to="{name: 'user-id', params:{id: card.user.id}}">
                {{ nickname }}
              </router-link>
            </h4>
            <div class="fl" style="flex: 1;">
              <p class="action">
                评论了你的文章
              </p>
              <p>
                {{ dateCard }}
              </p>
            </div>
          </div>
          <p class="user-info-content" v-html="card.comment.comment" />
        </div>
      </div>
    </div>
  </router-link>
</template>
<script>

import moment from 'moment'
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
        like: '推荐了你的文章',
        comment: '评论了你的文章',
        follow: '关注了你'
      }
    }
  },
  computed: {
    avatar() {
      if (this.card.user && this.card.user.avatar) return this.$ossProcess(this.card.user.avatar)
      return ''
    },
    nickname() {
      if(!this.card.user) return ''
      return this.card.user.nickname || this.card.user.username
    },
    dateCard() {
      if(!this.card.create_time) return ''
      const time = moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.card {
  border-radius: 8px;
  padding: 10px;
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
          &.action {
            flex: 1;
          }
        }
      }
      &-content {
        font-size: 16px;
        color: black;
        line-height: 30px;
        white-space: pre-wrap;
        margin: 0;
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
