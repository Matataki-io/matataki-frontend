<template>
  <div class="comment">
    <div class="comment-info">
      <n-link
        class="comment-avatar"
        :to="{name: 'user-id', params: {id : comment.uid}}"
      >
        <avatar :src="avatar" size="30px" /></avatar>
      </n-link>
      <div>
        <router-link class="comment-author" :to="`/user/${comment.uid}`">
          {{ comment.nickname || comment.username }}
          <span>
            {{ friendlyDate }}
          </span>
        </router-link>
        <p class="comment-content">
          {{ displayMessage }}
        </p>
      </div>
    </div>
    <p class="comment-message" />
  </div>
</template>

<script>
import moment from 'moment'
import { precision } from '@/utils/precisionConversion'
import avatar from '@/components/avatar/index'

export default {
  name: 'CommentCard',
  components: {
    avatar
  },
  props: ['comment', 'type'],
  data() {
    return {
    }
  },
  computed: {
    displayMessage() {
      return this.comment.comment !== '' ? this.comment.comment : '用户没有留下评论'
    },
    friendlyDate() {
      const time = moment(this.comment.create_time)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    action() {
      if (this.type === 2) {
        if (this.comment.action === 1) {
          return '投资了'
        } else if (this.comment.action === 2) {
          return '购买了'
        } else {
          // 默认返回
          return '投资了'
        }
      } else {
        return '投资了'
      }
    },
    amount() {
      if (this.comment.action === 1) {
        return (
          precision(this.comment.amount, this.comment.platform) +
          this.comment.platform.toUpperCase()
        )
      } else if (this.comment.action === 2) {
        return `${this.comment.num}份商品`
      } else {
        return ''
      }
    },
    avatar() {
      if (this.comment.avatar) return this.$API.getImg(this.comment.avatar)
      return ''
    }
  }
}
</script>

<style scoped lang="less">
.comment {
  margin: 20px 0;
}

.comment-info {
  display: flex;
  align-items: flex-start;
}
.comment-avatar {
  margin-right: 10px;
}
.comment-author {
  color: #000000;
  font-size: 14px;
  line-height: 20px;
  word-break: break-word;
  padding: 0;
  margin: 4px 0;
  display: inline-block;
  span {
    color: #9c9c9c;
    margin-left: 10px;
  }
}
.comment-content {
  color: #000000;
  font-size: 14px;
  line-height: 20px;
  padding: 0;
  margin: 6px 0;
  word-break: break-all;
}

</style>
