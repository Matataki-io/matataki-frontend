<template>
  <div class="notify">
    <div class="notify-type">
      <svg-icon v-if="svgType === 'like'" class="icon-search" icon-class="notify_recommend" />
      <svg-icon v-if="svgType === 'comment'" class="icon-search" icon-class="notify_comment" />
      <svg-icon v-if="svgType === 'follow'" class="icon-search" icon-class="notify_follow" />
    </div>
    <div class="notify-right">
      <div class="fl notify-right-header">
        <router-link :to="{name: 'user-id', params:{id: user.id}}">
          <c-avatar :src="avatar" />
        </router-link>
        <p>
          {{ dateCard }}
        </p>
      </div>
      <div class="fl notify-right-title">
        <h4>
          <router-link :to="{name: 'user-id', params:{id: user.id}}">
            {{ nickname }}
          </router-link>
          {{ totalLabel }}
        </h4>
        <p>
          {{ actionLabel }}
        </p>
      </div>
      <p v-if="content" class="notify-right-content" v-html="content" />
      <div>
        <objectCard
          :mode="mode"
          :user="user"
          :post="post"
        />
      </div>
    </div>
  </div>
</template>
<script>

import moment from 'moment'
import { isNDaysAgo } from '@/utils/momentFun'
import objectCard from '@/components/notification/objectCard.vue'

export default {
  components: {
    objectCard
  },
  props: {
    card: {
      type: Object,
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
    comment: {
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
    svgType() {
      return this.card.action
    },
    avatar() {
      if (this.user && this.user.avatar) return this.$ossProcess(this.user.avatar)
      return ''
    },
    actionLabel() {
      return this.actionLabels[this.card.action]
    },
    nickname() {
      return this.user.nickname || this.user.username
    },
    totalLabel() {
      if(this.card.total < 2) return ''
      return `和其他${this.card.total - 1}位用户`
    },
    content() {
      if(this.comment === null || this.card.total > 1) return ''
      return this.comment.comment
    },
    dateCard() {
      const time = moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    mode() {
      if(this.card.action === 'comment' || this.card.action === 'like' ) return 'post'
      else return 'user'
    }
  }
}
</script>

<style lang="less" scoped>
.notify {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  &-type {
    width: 30px;
    svg {
      width: 30px;
      height: 30px;
    }
  }
  &-right {
    flex: 1;
    margin-left: 10px;
    &-header {
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      p {
        text-align: right;
        font-size: 16px;
        color: #B2B2B2;
        line-height: 22px;
        margin: 0;
      }
    }
    &-title {
      margin-bottom: 10px;
      h4 {
        font-size: 16px;
        color: black;
        line-height: 22px;
        margin: 0 10px 0 0;
        a {
          color: black;
          &:hover {
            text-decoration: underline;
          }  
        }
      }
      p {
        font-size: 16px;
        color: #B2B2B2;
        line-height: 22px;
        margin: 0;
      }
    }
    &-content {
      font-size:16px;
      color: black;
      line-height: 30px;
      white-space: pre-wrap;
    }
  }
}
</style>
