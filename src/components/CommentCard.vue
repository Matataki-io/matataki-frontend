<template>
  <div class="comment">
    <div class="comment-info">
      <div
        class="comment-avatar"
        @click="$router.push({ name: 'User', params: { id: comment.id } })"
      >
        <img :src="avatar" alt="avatar" :onerror="defaultAvatar" />
      </div>
      <div class="comment-head">
        <router-link class="comment-author" :to="{ name: 'User', params: { id: comment.id } }">
          {{ comment.nickname || comment.username }}
        </router-link>
        {{ action }}
        <span class="comment-quantity">{{ amount }}</span>
        <p class="comment-timestamp">{{ friendlyDate }}</p>
      </div>
    </div>
    <p class="comment-message">{{ displayMessage }}</p>
  </div>
</template>

<script>
import moment from 'moment'
import { isNDaysAgo } from '@/common/methods'
import { precision } from '@/common/precisionConversion'

export default {
  name: 'CommentCard',
  props: ['comment', 'type'],
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`
    }
  },
  computed: {
    displayMessage() {
      return this.comment.comment !== '' ? this.comment.comment : '用户没有留下评论'
    },
    friendlyDate() {
      // const isAppleSlave = navigator.platform.includes('iPhone');
      const time = moment(this.comment.create_time)
      // const time = moment(newTime.getTime() - newTime.getTimezoneOffset()
      //              * 60000);// 返回的数据带了时区
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
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
      if (this.comment.avatar) return this.$backendAPI.getAvatarImage(this.comment.avatar)
      return ''
    }
  }
}
</script>

<style scoped lang="less">
.comment {
  margin: 20px 0;
  text-align: left;
}

.comment-info {
  display: flex;
  align-items: center;
}
.comment-head {
  font-size: 14px;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 20px;
  letter-spacing: 1px;
}
.comment-avatar {
  margin-right: 10px;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  background: #eee;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.comment-author {
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 1);
  line-height: 20px;
  letter-spacing: 1px;
  word-break: break-word;
}
.comment-quantity {
  font-weight: 700;
  color: #1c9cfe;
  line-height: 20px;
  letter-spacing: 1px;
}
.comment-timestamp {
  font-size: 10px;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 17px;
  letter-spacing: 1px;
}
.comment-message {
  color: rgba(0, 0, 0, 1);
  /* height: 60px; */
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 1px;
  margin: 5px 0 20px 40px;
  word-break: break-all;
}
.comment-line {
  height: 1px;
  margin-left: 44px;
  background-color: rgba(241, 241, 241, 1);
  box-sizing: border-box;
}
@media screen and (min-width: 750px) {
  .comment {
    margin: 18px 24px;
  }
}
</style>
