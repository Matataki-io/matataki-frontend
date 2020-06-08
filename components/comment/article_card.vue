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
        </router-link>
        <span v-if="comment.reply_uid" class="text-con">回复 
          <router-link :to="`/user/${comment.reply_uid}`" target="_blank"> @{{ comment.reply_nickname }} </router-link>
        </span>
        <span class="time">
          {{ friendlyDate }}
        </span>
        <!-- <span class="like-container">
          <svg-icon
            class="icon"
            icon-class="like"
            @click="likeComment"
          />
          <span>{{ comment.like_num }}</span>
        </span> -->

        <span class="reply" @click="showInput = !showInput">回复</span>
        <p class="comment-content wrap-open">
          <!-- 开了wrap 这个span不能换行！ -->
          <span class="wrap-open">{{ displayMessage }}</span>
        </p>
      </div>
    </div>
    <p class="comment-message" />
    <replyInput
      v-if="showInput"
      :reply-id="comment.id"
      :reply-username="nickname"
      @doneReply="showInput = false"
    />
  </div>
</template>

<script>
import moment from 'moment'
import avatar from '@/components/avatar/index'
import replyInput from './ReplyInput'

export default {
  name: 'CommentCard',
  components: {
    avatar,
    replyInput
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showInput: false
    }
  },
  computed: {
    displayMessage() {
      // console.log('comment', this.comment.comment)
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
  },
  methods: {
    likeComment() {
      this.$API.likeComment(this.comment.id)
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
.reply {
  padding: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  color: #99a2aa;
  line-height: 26px;
  font-size: 12px;
  &:hover {
    color: #00a1d6;
    background: #e5e9ef;
  }
}
.time {
  color: #99a2aa;
  line-height: 26px;
  font-size: 12px;
  margin-right: 20px;
}
.like-container {
  color: #99a2aa;
  font-size: 12px;
  margin-right: 20px;
  .icon {
    color: #99a2aa;
    cursor: pointer;
    font-size: 16px;
    &:hover {
      color: #00a1d6;
    }
  }
}
.text-con {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  a {
    outline: none;
    color: #00a1d6;
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
