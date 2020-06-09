<template>
  <div :style="mode === 'hide' && 'cursor:default'" class="notify" @click="openDetails">
    <div class="notify-type">
      <!-- 通知类型图标 -->
      <svg-icon v-if="svgType === 'like'" class="icon-search" icon-class="notify_recommend" />
      <svg-icon v-else-if="svgType === 'comment'" class="icon-search" icon-class="notify_comment" />
      <svg-icon v-else-if="svgType === 'follow'" class="icon-search" icon-class="notify_follow" />
      <svg-icon v-else-if="svgType === 'annouce'" class="icon-search" icon-class="notify_annouce" />
    </div>
    <div class="notify-right">
      <div class="fl notify-right-header">
        <!-- 头像 -->
        <div @click.stop>
          <router-link v-if="card.action !== 'annouce'" :to="{name: 'user-id', params:{id: user.id || 0}}">
            <c-avatar :src="avatar" class="avatar" />
            <div v-if="card.total > 1" class="round-silhouette" />
          </router-link>
        </div>
        <!-- 时间 -->
        <p class="header-date">
          {{ dateCard }}
        </p>
        <p class="header-read" :class="card.state || 'unread'">
          {{ card.state ? '已读' : '未读' }}
        </p>
      </div>
      <div v-if="card.action !== 'annouce'" class="notify-right-title">
        <!-- 事件发送者 -->
        <h4>
          <span @click.stop>
            <router-link :to="{name: 'user-id', params:{id: user.id || 0}}">
              {{ nickname }}
            </router-link>
          </span>
          <span class="notify-quantity">
            {{ totalLabel }}
          </span>
        </h4>
        <div class="fl" style="flex: 1;">
          <!-- 行为 -->
          <p>
            {{ actionLabel }}
          </p>
          <p v-if="card.total > 1" class="view-all">
            查看全部
            <i class="el-icon-arrow-right" />
          </p>
        </div>
      </div>
      <div v-else class="notify-right-title">
        <h4>
          {{ announcementTitle }}
        </h4>
      </div>
      <p v-if="content" class="notify-right-content" v-html="content" />
      <!-- 对象卡片 -->
      <div v-if="mode !== 'hide'" @click.stop>
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
    annouce: {
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
        follow: '关注了你',
        annouce: '',
        reply: '回复了你的评论'
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
    /** 行为标签 */
    actionLabel() {
      return this.actionLabels[this.card.action]
    },
    nickname() {
      return this.user.nickname || this.user.username
    },
    /** 折叠数量 */
    totalLabel() {
      if(this.card.total < 2) return ''
      if(this.card.action === 'comment') return ''
      return `和其他${this.card.total - 1}位用户`
    },
    announcementTitle() {
      if(this.card.action !== 'annouce') return ''
      return this.annouce.title
    },
    /** 内容 */
    content() {
      const { action } = this.card
      if (action === 'comment') {
        // 评论
        if (this.comment === null || this.card.total > 1) return ''
        return this.comment.comment
      }
      else if (action === 'annouce') {
        // 公告
        if (this.annouce === null) return ''
        return this.annouce.content
      }
      return ''
    },
    /** 格式化时间 */
    dateCard() {
      const time = moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    /** 子卡片显示模式 */
    mode() {
      if (['comment', 'like', 'annouce'].includes(this.card.action)) {
        // 使用文章卡片，如果文章对象是空的则不显示
        if(!this.post) return 'hide'
        else return 'post'
      }
      else if (this.card.action === 'reply') {
        return 'reply'
      } else {
        // 使用用户卡片，如果用户对象是空的则不显示
        if (!this.user) return 'hide'
        else return 'user'
      }
    }
  },
  methods: {
    openDetails() {
      if(this.card.total < 2) return this.openObject()

      this.$emit('openDetails', {
        startId: this.card.id,
        endId: this.card.end_id,
        action: this.card.action,
        objectId: this.card.object_id,
        objectType: this.card.object_type
      })
    },
    openObject() {
      if(this.mode === 'hide') return

      const url = this.mode === 'post' ? {name: 'p-id', params:{id: this.post.id}} : {name: 'user-id', params:{id: this.user.id}}
      this.$router.push(url)
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
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  // 悬浮显示“查看全部”的文字
  // &:hover {
  //   .view-all{
  //     visibility: visible;
  //   }
  // }
  &-type {
    width: 30px;
    margin-right: 10px;
    svg {
      width: 30px;
      height: 30px;
    }
  }
  &-right {
    flex: 1;
    &-header {
      align-items: center;
      margin-bottom: 10px;
      p {
        font-size: 16px;
        color: #B2B2B2;
        line-height: 22px;
        margin: 0;
      }
      a {
        position: relative;
        display: block;
        height: 34px;
      }
      svg {
        width: 30px;
        height: 30px;
      }
      .avatar {
        z-index: 1;
        position: relative;
        border:2px solid white;
      }
      .header-date {
        flex: 1;
        text-align: right;
        font-size: 16px;
        color: #B2B2B2;
        line-height: 22px;
        margin: 0;
      }
      .header-read {
        color: #B2B2B2;
        margin-left: 10px;
        &.unread {
          color: #FB6877;
        }
      }
    }
    &-title {
      margin-bottom: 10px;
      display: flex;
      h4 {
        font-size: 16px;
        color: black;
        line-height: 22px;
        margin: 0 10px 0 0;
        display: flex;
        .notify-quantity {
          white-space: nowrap;
        }
        a {
          color: black;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
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
        white-space: nowrap;
      }
      .view-all {
        flex: 1;
        font-size: 16px;
        color: #542DE0;
        line-height: 22px;
        margin: 0 0 0 20px;
        text-align: right;
        // 隐藏“查看全部”的文字
        // visibility: hidden;
      }
    }
    &-content {
      font-size:16px;
      color: black;
      line-height: 30px;
      white-space: pre-wrap;
    }
  }
  .round-silhouette {
    border:2px solid white;
    background-color: #EBE6FF;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    position: absolute;
    left: 15px;
    top: 0px;
  }
}

@media screen and (max-width: 768px){
  .notify-right-title {
    display: block;
    h4 {
      font-size: 14px;
    }
    p {
      font-size: 14px;
    }
    .view-all {
      font-size: 14px;
    }
  }
  .notify-right-header {
    .header-read {
      font-size: 14px;
    }
    .header-date {
      font-size: 14px;
    }
  }
  .notify-right-content {
    font-size: 14px;
  }
}
</style>
