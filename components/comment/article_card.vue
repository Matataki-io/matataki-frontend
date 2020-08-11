<template>
  <div class="comment">
    <div :id="'comment' + comment.id" class="comment-info">
      <n-link
        :to="{name: 'user-id', params: {id : comment.uid}}"
        class="comment-avatar"
        target="_blank"
      >
        <c-user-popover :user-id="Number(comment.uid)">
          <c-avatar
            :src="avatar" 
            :recommend-author="comment.user_is_recommend === 1"
            :token-user="comment.user_is_token === 1"
          />
        </c-user-popover>
      </n-link>
      <div class="comment-main">
        <div class="comment-header">
          <div class="fl nickname-bar">
            <router-link
              :to="`/user/${comment.uid}`"
              class="comment-author"
              :class="!comment.username && 'logout'"
              target="_blank"
            >
              {{ nickname }}
            </router-link>
            <span v-if="comment.reply_uid" class="text-con">
              回复
            </span>
            <router-link
              v-if="comment.reply_uid"
              :to="`/user/${comment.reply_uid}`"
              class="text-con-a"
              target="_blank"
            >
              @{{ comment.reply_nickname }}
            </router-link>
          </div>
          <div class="fl function-bar">
            <span class="time">
              {{ friendlyDate }}
            </span>

            <span class="reply" @click="switchShowInput">回复</span>
            <span class="flex1-scaffold" />
            <!-- 更多操作 -->
            <el-dropdown
              v-if="isMe(comment.uid)"
              trigger="click"
              @command="dropdownCommand"
            >
              <span class="more-options">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="delete">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
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
      @doneReply="doneReply"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import replyInput from './ReplyInput'

export default {
  name: 'CommentCard',
  components: {
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
    ...mapGetters(['isLogined', 'isMe']),
    displayMessage() {
      // console.log('comment', this.comment.comment)
      return this.comment.comment !== '' ? this.comment.comment : this.$t('p.commentNotContent')
    },
    friendlyDate() {
      const time = this.moment(this.comment.create_time)
      return time.format('MMMDo HH:mm')
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
    },
    switchShowInput() {
      if(!this.isLogined) return this.$store.commit('setLoginModal', true)

      this.showInput = !this.showInput
    },
    dropdownCommand(command) {
      if(command === 'delete') this.deleteComment()
    },
    async deleteComment() {
      try {
        const result = await this.$API.deleteComment(this.comment.id)
        if(result.code === 0) {
          this.$message.success(this.$t('success.success'))
          this.$store.commit('setCommentRequest')
          this.$emit('success')
        }
        else this.$message.error(result.message)
      }
      catch (e) {
        this.$message.success(this.$t('error.fail'))
        console.error(e)
      }
    },
    doneReply() {
      this.showInput = false
      this.$emit('success')
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
  &.play-prompt {
    animation: prompt 3s;
  }
}
.comment-avatar {
  margin-right: 10px;
}
.comment-main {
  flex: 1;
}
.comment-author {
  color: #000000;
  font-size: 14px;
  line-height: 20px;
  word-break: break-word;
  padding: 0;
  margin: 4px 5px 4px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break:break-all;
  &.logout {
    color: #b2b2b2;
  }
  span {
    color: #9c9c9c;
    margin-left: 10px;
  }
}
.comment-header {
  align-items: baseline;
  display: flex;
  .function-bar {
    flex: 1;
  }
  .nickname-bar {
    align-items: baseline;
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
.clickable {
  padding: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  color: #99a2aa;
  line-height: 26px;
  font-size: 12px;
  white-space: nowrap;
  &:hover {
    color: #542DE0;
    background: #e5e9ef;
  }
}
.reply {
  .clickable();
}
.more-options {
  .clickable();
}
.flex1-scaffold {
  flex: 1;
}
.time {
  color: #99a2aa;
  line-height: 26px;
  font-size: 12px;
  margin-right: 20px;
  white-space: nowrap;
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
      color: #542DE0;
    }
  }
}
.text-con {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  margin-right: 5px;
  &-a {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    outline: none;
    color: #542DE0;
    text-decoration: none;
    margin-right: 5px;
    cursor: pointer;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break:break-all;
  }
}

@keyframes prompt
{
10% {
  border-radius: 10px;
  box-shadow: none;
}
20%  {
  background: white;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
}
90%  {
  background: white;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
}
0% {
  border-radius: 10px;
  box-shadow: none;
}
}

@media screen and (max-width: 600px) {
  .comment-header {
    display: block;
  }
}
</style>
