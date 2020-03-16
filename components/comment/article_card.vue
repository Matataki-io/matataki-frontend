<template>
  <div class="comment">
    <div class="comment-info">
      <n-link
        :to="{name: 'user-id', params: {id : comment.uid}}"
        class="comment-avatar"
        target="_blank"
      >
        <avatar
          :src="avatar"
          size="30px"
        />
      </n-link>
      <div>
        <router-link
          :to="`/user/${comment.uid}`"
          class="comment-author"
          :class="!comment.username && 'logout'"
          target="_blank"
        >
          {{ nickname }}
          <span>
            {{ friendlyDate }}
          </span>
        </router-link>
        <p class="comment-content wrap-open">
          <!-- 开了wrap 这个span不能换行！ -->
          <span class="wrap-open">{{ displayMessage }}</span>
        </p>
      </div>
    </div>
    <p class="comment-message" />
  </div>
</template>

<script>
import moment from 'moment'
import avatar from '@/components/avatar/index'

export default {
  name: 'CommentCard',
  components: {
    avatar
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    displayMessage() {
      console.log('comment', this.comment.comment)
      return this.comment.comment !== '' ? this.comment.comment : this.$t('p.commentNotContent')
    },
    friendlyDate() {
      const time = moment(this.comment.create_time)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    avatar() {
      if (this.comment.avatar) return this.$ossProcess(this.comment.avatar)
      return ''
    },
    nickname() {
      return this.comment.nickname || this.comment.username || this.$t('error.accountHasBeenLoggedOut')
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
  &.logout {
    color: #b2b2b2;
  }
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
.wrap-open {
  white-space: pre-wrap;
}

</style>
