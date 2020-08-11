<template>
  <div :style="mode === 'hide' && 'cursor:default'" class="notify" @click="openDetails">
    <div class="notify-type">
      <!-- 通知类型图标 -->
      <svg-icon v-if="iconTypes[svgType]" class="icon-search" :icon-class="iconTypes[svgType]" />
      <svg-icon v-else class="icon-search" icon-class="annouce" />
    </div>
    <div class="notify-right">
      <div class="fl notify-right-header">
        <!-- 头像 -->
        <div @click.stop>
          <router-link v-if="card.action !== 'annouce' || card.object_type === 'collaborator'" :to="{name: 'user-id', params:{id: card.user_id}}">
            <c-user-popover :user-id="Number(card.user_id)">
              <c-avatar :src="avatar" class="avatar" />
            </c-user-popover>
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
      <div v-if="card.action !== 'annouce' || card.object_type === 'collaborator'" class="notify-right-title">
        <!-- 事件发送者 -->
        <h4>
          <span @click.stop>
            <router-link :class="!(user.nickname || user.username) && 'logout'" :to="{name: 'user-id', params:{id: card.user_id}}">
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
      <p v-if="noComment && !content" class="notify-right-content no-data">
        <i class="el-icon-delete" />
        此条评论已被删除
      </p>
      <!-- 对象卡片 -->
      <div v-if="mode !== 'hide'" @click.stop>
        <objectCard
          :mode="mode"
          :user="user"
          :post="post"
          :comment="commentObject"
          :token="transferLog || token"
        />
      </div>
    </div>
  </div>
</template>
<script>

import { isNDaysAgo } from '@/utils/momentFun'
import { precision } from '@/utils/precisionConversion'
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
      default: () => { return {} }
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
    },
    commentObject: {
      type: Object,
      default: null
    },
    transferLog: {
      type: Object,
      default: null
    },
    token: {
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
        reply: '回复了你的评论',
        transfer: '向你转账',
        reward: '打赏了你',
        collaborator: '已将你设置为协作者'
      },
      iconTypes: {
        like: 'notify_recommend',
        comment: 'notify_comment',
        follow: 'notify_follow',
        annouce: 'notify_annouce',
        featured: 'notify_featured',
        reply: 'notify_reply',
        transfer: 'notify_transfer',
        reward: 'notify_reward',
        collaborator: 'notify_collaborator',
        author: 'notify_author'
      }
    }
  },
  computed: {
    /** 消息标签 */
    svgType() {
      const { action, object_type } = this.card
      if (object_type === 'featuredArticles') return 'featured'
      else if (action === 'transfer' && object_type === 'article') return 'reward'
      else if (action === 'annouce' && object_type === 'collaborator') return 'collaborator'
      return action
    },
    avatar() {
      if (this.user && this.user.avatar) return this.$ossProcess(this.user.avatar)
      return ''
    },
    /** 行为标签 */
    actionLabel() {
      const { action, object_type } = this.card
      if (action === 'transfer' && object_type === 'article') return this.actionLabels.reward
      if (action === 'annouce' && object_type === 'collaborator') return this.actionLabels.collaborator

      return this.actionLabels[action]
    },
    nickname() {
      return this.user.nickname || this.user.username || this.$t('error.accountHasBeenLoggedOut')
    },
    /** 折叠数量 */
    totalLabel() {
      if(this.card.total < 2) return ''
      if(this.card.action === 'comment') return ''
      return `和其他${this.card.total - 1}位用户`
    },
    announcementTitle() {
      if(this.card.action !== 'annouce') return ''
      if (['announcement', 'announcementToken'].includes(this.card.object_type)) return this.annouce.title
      if (this.card.object_type === 'featuredArticles') return '你的文章已被瞬Matataki评为精选作品'
      return ''
    },
    /** 内容 */
    content() {
      const { action, object_type } = this.card
      if (action === 'comment' || action === 'reply') {
        // 评论
        if (this.comment === null || this.card.total > 1) return ''
        return this.comment.comment
      }
      else if (action === 'annouce') {
        // 公告
        if (['announcement', 'announcementToken'].includes(object_type) && this.annouce)
          return this.annouce.content
        else return ''
      }
      else if (action === 'transfer' && this.transferLog && this.card.total === 1) {
        // 转账
        const amount = this.tokenAmount(this.transferLog.amount, this.transferLog.decimals)
        if(object_type === 'cnyWallet') // CNY
          return `金额：${amount} ${this.transferLog.symbol}`
        else if(object_type === 'tokenWallet' || object_type === 'article') { // Token
          let content = `金额：${amount} ${this.transferLog.symbol}`
          if(this.transferLog.memo) content += `\n留言：${this.transferLog.memo}`
          return content
        }
      }
      return ''
    },
    /** 格式化时间 */
    dateCard() {
      // 优先采用notify_time
      const time = this.moment(this.card.notify_time || this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    /** 判断：是评论或回复类型、条目数等予1，并且评论对象缺失 */
    noComment() {
      return (this.card.action === 'comment' || this.card.action === 'reply') && this.card.total === 1 && !this.comment
    },
    /** 子卡片显示模式 */
    mode() {
      const { action, object_type, total } = this.card
      if (['comment', 'like'].includes(action) && this.post)
        return 'post' // 文章
      else if (action === 'reply')
        return 'reply' // 回复
      else if (action === 'follow' && this.user)
        return 'user' // 用户
      else if (action === 'transfer' && this.transferLog) {
        if (object_type === 'article') return 'post' // 打赏文章
        else return 'token' // Fan票或者CNY
      }
      else if (action === 'annouce') {
        if (object_type === 'collaborator' && this.token && total < 2) return 'token'
        if (object_type === 'announcementToken' && this.token) return 'token'
        else if (this.post) return 'post'
      }
      return 'hide' // 隐藏
    }
  },
  methods: {
    openDetails() {
      if(this.card.total < 2 || (this.card.action === 'annouce' && this.card.object_type !== 'collaborator')) return this.openObject()

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

      let url
      switch (this.mode) {
        case 'post':
          if (this.card.action === 'comment' && this.comment)
            url = {name: 'p-id', params: {id: this.post.id}, query: {comment: this.comment.id}}
          else url = {name: 'p-id', params: {id: this.post.id}}
          break
        case 'user':
          url = {name: 'user-id', params: {id: this.card.user_id}}
          break
        case 'reply':
          if (this.comment)
            url = {name: 'p-id', params: {id: this.comment.sign_id}, query: {comment: this.comment.id}}
          else url = {}
          break
        case 'token':
          if (this.transferLog) { 
            if (this.transferLog.symbol === 'CNY') url = {name: 'account'}
            else url = {name: 'token-id', params: {id: this.transferLog.token_id}}
          }
          else if (this.token) url = {name: 'token-id', params: {id: this.token.id}}
          break
        default:
          url = {}
          break
      }
      this.$router.push(url)
    },
    tokenAmount(amount, decimals) {
      const tokenamount = precision(amount, 'CNY', decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
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
      &.no-data {
        white-space: normal;
        color: #b2b2b2;
      }
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
