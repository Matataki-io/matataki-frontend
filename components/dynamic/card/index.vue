<template>
  <router-link
    class="cardunit-bg"
    :to="{ name: 'share-id', params: { id: card && card.id } }"
    target="_blank"
  >
    <!-- 转发标签 -->
    <div v-if="isForward" class="cardunit-bg-retweeted">
      <div class="cardunit-bg-retweeted-l">
        <svg-icon icon-class="twitter-forward" />
      </div>
      <div class="cardunit-bg-retweeted-r">
        {{ forwardNickname }} 转发了
      </div>
    </div>
    <!-- 卡片主体 -->
    <div class="cardunit">
      <!-- 卡片左侧 -->
      <div class="cardunit-l">
        <!-- 头像 -->
        <router-link
          :to="{name: 'user-id', params: {id: card && card.uid}}"
          target="_blank"
        >
          <c-user-popover :user-id="Number(card && card.uid)">
            <c-avatar
              class="cardunit-l-avatar"
              :src="avatarImg"
            />
          </c-user-popover>
        </router-link>
      </div>
      <!-- 卡片右侧 -->
      <div class="cardunit-r">
        <!-- 用户名称与发布时间 -->
        <div class="cardunit-r-header">
          <p class="cardunit-r-header-user">
            <router-link
              :to="{ name: 'user-id', params: { id: card.uid } }"
              target="_blank"
            >
              {{ nickname }}
            </router-link>
          </p>
          <p class="cardunit-r-header-time">
            •
            {{ createTime }}
          </p>
          <router-link
            :to="{ name: 'share-id', params: { id: card && card.id } }"
            class="cardunit-r-header-logo"
            target="_blank"
          >
            <svg-icon icon-class="matataki-square-logo" />
          </router-link>
        </div>
        <!-- 隐藏内容的警告文本 -->
        <!-- <div v-if="hiddenContent" class="cardunit-r-spoilertext">
          {{ spoilerText }}
          <span class="show-content" @click="showHiddenContent = !showHiddenContent">
            {{ showHiddenContent ? '隐藏内容' : '显示内容' }}
          </span>
        </div> -->
        <!-- 正文 -->
        <mainText
          class="cardunit-r-content"
          :card="card"
        />
        <!-- 图片 -->
        <a class="jump-shield cardtop10" href="javascript:;">
          <photoAlbum
            v-if="media && media.length > 0"
            :media="media"
          />
        </a>
        <references
          v-if="refs && refs.length !== 0"
          class="cardtop10"
          :refs="refs"
        />
        <!-- 统计数据 -->
        <a class="jump-shield" href="javascript:;">
          <div class="cardunit-r-flows">
            <!-- 转发 -->
            <div class="cardunit-r-flows-forward">
              <svg-icon icon-class="dynamic-repo" @click="refPush" />
              <span v-if="flows.retweet">
                {{ flows.retweet }}
              </span>
            </div>
            <!-- 评论 -->
            <div class="cardunit-r-flows-comment">
              <svg-icon icon-class="dynamic-comment" />
              <span v-if="flows.comment">
                {{ flows.comment }}
              </span>
            </div>
            <!-- 喜欢 -->
            <div class="cardunit-r-flows-like">
              <i v-if="likeLoading" class="el-icon-loading" />
              <svg-icon
                v-else
                :class="likeIconClass"
                icon-class="dynamic-good"
                @click="likeClick"
              />
              <span v-if="flows.favorite">
                {{ flows.favorite }}
              </span>
            </div>
            <!-- 分享 -->
            <div class="cardunit-r-flows-share">
              <svg-icon icon-class="dynamic-share" />
            </div>
          </div>
        </a>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'
import mainText from './main_text'
import photoAlbum from './photo_album'
import references from './references'

export default {
  components: {
    mainText,
    photoAlbum,
    references,
  },
  props: {
    // 卡片数据
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showHiddenContent: false,
      likeIt: false,
      likeLoading: false
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    likeIconClass () {
      return {
        'like-touch': !this.likeLoading,
        'active': !!this.flows.iLiked
      }
    },
    isForward () {
      return false
    },
    forwardNickname () {
      return 'xxx用户'
    },
    card () {
      return this.data
    },
    avatarImg () {
      if (this.card.avatar) return this.$ossProcess(this.card.avatar, { h: 60 })
      return ''
    },
    nickname () {
      if (!this.card) return ''
      return this.card.nickname || this.card.author
    },
    createTime () {
      if (!this.card) return ''
      const time = this.moment(this.card.create_time)
      if (!this.$utils.isNDaysAgo(2, time)) return time.fromNow()
      else if (!this.$utils.isNDaysAgo(365, time)) return time.format('MMMDo')
      return time.format('YYYY MMMDo')
    },
    media () {
      if (!this.card) return []
      return this.card.media
    },
    refs () {
      if (!this.card || !this.card.refs) return []
      return this.card.refs
    },
    flows () {
      const {
        likes,
        i_liked,
        beRefs
      } = { ...this.card }
      return {
        // 评论
        comment: 0,
        // 转发
        retweet: beRefs ? beRefs.length : 0,
        // 喜欢
        favorite: likes + this.likeIt,
        iLiked: i_liked || this.likeIt
      }
    },
    originUrl () {
      return this.card && this.card.url || ''
    }
  },
  methods: {
    // async likeClick () {
    //   if (this.likeIt) return
    //   this.likeIt = true
    //   this.$emit('click-like', { type: 'like',  platform: 'matataki' , dynamicId: this.card.id })
    // },
    // 推荐
    async likeClick() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      if (!this.card || this.flows.iLiked) return
      this.likeLoading = true
      // 文章在客户端打开后提交，表示开始阅读，不提交这个会出现点赞失败的情况
      try {
        await this.$API.reading(this.card.id)
      }
      catch (e) {
        console.error(e)
        this.$message({ type: 'error', message: this.$t('error.fail') })
        return
      }

      await this.$API.like(this.card.id, { time: 0 })
        .then(res => {
          if (res.code === 0) {
            this.likeIt = true
            this.$message({ type: 'success', message: this.$t('likeSuccess') })
          } else this.$message({ type: 'error', message: res.message })
        }).catch(err => {
          this.$message({ type: 'error', message: this.$t('error.fail') })
          console.log(err)
        }).finally(() => {
          this.likeLoading = false
        })
    },
    // 引用发布
    refPush() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      this.$emit('ref-push', `${process.env.VUE_APP_URL}/share/${this.card.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
a {
  color: #000;
}
p {
  margin: 0;
  padding: 0;
}

span {
  margin: 0;
  padding: 0;
}

.cardunit-bg {
  display: block;
  background: rgba(255, 255, 255, 1);
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &-retweeted {
    display: block;
    display: flex;
    margin-bottom: 5px;
    &-l {
      width: 49px;
      margin-right: 10px;
      display: flex;
      justify-content: flex-end;
      svg {
        height: 18px;
        width: 18px;
        color: #657786;
      }
    }
    &-r {
      flex: 1;
      font-size: 13px;
      font-weight: 700;
      line-height: 17px;
      color: #657786;
    }
  }
  .jump-shield {
    cursor: default;
  }
}

.cardunit {
  background: rgba(255, 255, 255, 1);
  display: flex;
  overflow: hidden;

  &-l {
    width: 49px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;

    &-avatar {
      width: 49px;
      height: 49px;
    }
  }

  &-r {
    flex: 1;
    height: 100%;

    &-header {
      display: flex;
      margin-bottom: 5px;
      align-items: flex-start;

      &-user {
        height: 20px;
        line-height: 20px;
        font-size: 15px;
        color: black;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;

        a {
          color: black;
          &:hover {
            color: #542DE0;
            text-decoration: underline;
          }
        }
      }

      &-time {
        height: 20px;
        margin-left: 5px;
        color: #657786;
        font-size: 15px;
        font-weight: 400;
        line-height: 20px;
        white-space: nowrap;
        flex: 1;
      }

      &-logo {
        font-size: 20px;
        color: #542DE0;
        margin: 0 0 0 5px;
        transition: all ease-in 0.1s;
        &:hover {
          transform: scale(1.2);
        }
      }
    }

    &-spoilertext {
      color: black;
      font-size: 15px;
      font-weight: 400;
      line-height: 20px;

      .show-content {
        background: #d9e1e8;
        display: inline-block;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 700;
        line-height: 20px;
        padding: 0 6px;
        color: black;
        cursor: pointer;
        -moz-user-select:none;
        -webkit-user-select:none;
        user-select:none;
      }
    }

    &-content {
      color: black;
      font-size: 15px;
      font-weight: 400;
      line-height: 20px;
      white-space: pre-line;
    }

    .cardtop10 {
      margin-top: 10px;
      overflow: hidden;
    }

    &-flows {
      display: flex;
      margin: 10px 0 0;
      .flow-default {
        font-size: 18px;
        flex: 1;
        svg {
          height: 18px;
          width: 18px;
          color: #657786;
        }
        span {
          margin:  0 0 0 5px;
          font-size: 15px;
        }
      }
      &-forward {
        .flow-default();

        svg {
          width: 21px;
          -moz-user-select:none;
          -webkit-user-select:none;
          user-select:none;
          transition: all ease-in 0.05s;
          cursor: pointer;

          &:hover {
            transform: scale(1.2);
          }

          &:active {
            transform: scale(1);
          }
        }
      }

      &-comment {
        .flow-default();

        svg {
          width: 19px;
        }
      }

      &-like {
        .flow-default();

        svg {
          width: 20px;
        }

        .like-touch {
          -moz-user-select:none;
          -webkit-user-select:none;
          user-select:none;
          transition: all ease-in 0.05s;
          cursor: pointer;

          &:hover {
            transform: scale(1.2);
          }

          &:active {
            transform: scale(1);
          }

          &.active {
            color: #ca8f04;
            transform: scale(1);
            cursor: default;
          }
        }
      }

      &-share {
        .flow-default();
        flex: 0;
        margin-right: 5px;

        svg {
          width: 17px;
        }
      }
    }

    &-sensitive {
      border: 1px solid #ccd6dd;
      margin-top: 10px;
    }
  }
}
</style>