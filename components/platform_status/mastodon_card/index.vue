<template>
  <div class="cardunit-bg">
    <!-- 转嘟 -->
    <div v-if="isForward" class="cardunit-bg-retweeted">
      <div class="cardunit-bg-retweeted-l">
        <svg-icon icon-class="twitter-forward" />
      </div>
      <foreignUserPopover v-if="fromUser" :card="fromUser">
        <div class="cardunit-bg-retweeted-r">
          {{ data.account.display_name || data.account.username }} 转嘟了
        </div>
      </foreignUserPopover>
      <div v-else class="cardunit-bg-retweeted-r">
        {{ data.account.display_name || data.account.username }} 转嘟了
      </div>
    </div>
    <div class="cardunit">
      <!-- 头像 -->
      <div class="cardunit-l">
        <foreignUserPopover v-if="fromUser" :card="fromUser">
          <c-avatar
            class="cardunit-l-avatar"
            :src="avatarImg"
          />
        </foreignUserPopover>
        <c-avatar
          v-else
          class="cardunit-l-avatar"
          :src="avatarImg"
        />
      </div>
      <div class="cardunit-r">
        <!-- 用户名称与发布时间 -->
        <div class="cardunit-r-header">
          <p class="cardunit-r-header-user">
            <span class="cardunit-r-header-user-nickname">
              {{ nickname }}
            </span>
            <span class="cardunit-r-header-user-name">
              @{{ username }}
            </span>
          </p>
          <p class="cardunit-r-header-time">
            •
            {{ createTime }}
          </p>
          <a class="cardunit-r-header-logo" :href="originUrl" target="_blank">
            <svg-icon icon-class="mastodon" />
          </a>
        </div>
        <!-- 隐藏内容的警告文本 -->
        <div v-if="hiddenContent" class="cardunit-r-spoilertext">
          {{ spoilerText }}
          <span class="show-content" @click="showHiddenContent = !showHiddenContent">
            {{ showHiddenContent ? '隐藏内容' : '显示内容' }}
          </span>
        </div>
        <!-- 正文 -->
        <mastodonContent
          v-if="!hiddenContent || showHiddenContent"
          class="cardunit-r-content"
          :card="card"
        />
        <!-- 投票 -->
        <mastodonPoll
          v-if="poll && (!hiddenContent || showHiddenContent)"
          :poll="poll"
          class="cardtop10"
        />
        <!-- 特殊卡片 -->
        <mastodonSpecial v-if="special && (!hiddenContent || showHiddenContent)" class="cardtop10" :special="special" />
        <!-- 图片 -->
        <div
          v-if="media && media.length > 0"
          class="cardunit-r-photoalbum"
        >
          <div class="cardunit-r-photoalbum-pillar" />
          <mastodonPhotoAlbum
            class="cardunit-r-photoalbum-main"
            :sensitive="sensitive"
            :media="media"
          />
        </div>
        <!-- 视频 -->
        <div
          v-if="video"
          class="cardunit-r-photoalbum"
        >
          <div :style="`padding-bottom: ${video.heightRatio}%;`" class="cardunit-r-photoalbum-pillar" />
          <mastodonVideo
            class="cardunit-r-photoalbum-main"
            :sensitive="sensitive"
            :video="video"
          />
        </div>
        <!-- 统计数据 -->
        <div class="cardunit-r-flows">
          <div class="cardunit-r-flows-comment">
            <svg-icon icon-class="mastodon-reply" />
            <span v-if="flows.comment">
              {{ flows.comment }}
            </span>
          </div>
          <div class="cardunit-r-flows-forward">
            <svg-icon icon-class="mastodon-retweet" />
            <span v-if="flows.retweet">
              {{ flows.retweet }}
            </span>
          </div>
          <div class="cardunit-r-flows-like">
            <svg-icon :class="`${stats && 'like-touch'} ${flows.localLiked && 'active'}`" icon-class="mastodon-star" @click="likeClick" />
            <span v-if="flows.favorite + flows.localLike">
              {{ flows.favorite + flows.localLike }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import url from 'url'

import foreignUserPopover from '@/components/user/foreign_user_popover'
import mastodonContent from './mastodon_content'
import mastodonPoll from './mastodon_poll'
import mastodonPhotoAlbum from './mastodon_photo_album'
import mastodonVideo from './mastodon_video'
import mastodonSpecial from './mastodon_special'

export default {
  components: {
    foreignUserPopover,
    mastodonContent,
    mastodonPoll,
    mastodonPhotoAlbum,
    mastodonVideo,
    mastodonSpecial
  },
  props: {
    // 卡片数据
    data: {
      type: Object,
      required: true
    },
    fromUser: {
      type: Object,
      default: null
    },
    stats: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showHiddenContent: false,
      likeIt: false
    }
  },
  computed: {
    isForward () {
      return this.data && this.data.reblog
    },
    card () {
      if (!this.data) return null
      return this.isForward && this.data.reblog || this.data
    },
    avatarImg () {
      if (!this.card) return ''
      return this.card.account.avatar
    },
    nickname () {
      if (!this.card) return ''
      return this.card.account.display_name
    },
    username () {
      if (!this.card) return ''
      return this.card.account.username + '@' + url.parse(this.card.account.url).hostname
    },
    createTime () {
      if (!this.card) return ''
      const time = this.moment(this.card.created_at)
      if (!this.$utils.isNDaysAgo(2, time)) return time.fromNow()
      else if (!this.$utils.isNDaysAgo(365, time)) return time.format('MMMDo')
      return time.format('YYYY MMMDo')
    },
    media () {
      if (!this.card || !this.card.media_attachments) return []
      return this.card.media_attachments.filter(item => ['image', 'gifv'].includes({ ...item }.type))
    },
    video () {
      if (!this.card || !this.card.media_attachments) return null
      const video = this.card.media_attachments.find(item => item.type === 'video')
      if (!video) return null

      let heightRatio
      try {
        heightRatio = Number((video.meta.original.height / video.meta.original.width * 100).toFixed(2))
        if (heightRatio > 100) heightRatio = 100
        else if (heightRatio < 35) heightRatio = 35
      }
      catch (e) {
        console.error('Unable to get video aspect ratio, video:',this.card.id ,video, e)
        heightRatio = 100
      }

      return {
        ...video,
        heightRatio
      }
    },
    spoilerText () {
      return this.card && this.card.spoiler_text || ''
    },
    sensitive () {
      return this.card && this.card.sensitive
    },
    // 标记为敏感并且含有警告文字的属于隐藏内容，不含警告文字的只属于敏感媒体。
    hiddenContent () {
      return this.card && this.card.sensitive && this.card.spoiler_text
    },
    special () {
      return this.card && this.card.card || null
    },
    flows () {
      const {
        replies_count,
        reblogs_count,
        favourites_count
      } = { ...this.card }
      return {
        comment: replies_count,
        retweet: reblogs_count,
        favorite: favourites_count,
        localLike: this.stats ? (this.stats.like + this.likeIt) : 0,
        localLiked: this.stats ? (this.likeIt || this.stats.liked) : 0
      }
    },
    originUrl () {
      return this.card && this.card.url || ''
    },
    poll () {
      return this.card && this.card.poll || null
    }
  },
  mounted () {
    console.log(this.type, this.data, this.card)
    this.clearReferer()
  },
  methods: {
    jsonp(str) {
      try {
        return JSON.parse(str)
      }
      catch (e) {
        console.error(str, e)
        return null
      }
    },
    /** 清除 referer，否则无法加载 Mastodon 的图片资源 */
    clearReferer() {
      let meta = document.createElement('meta')
      meta.name = 'referrer'
      meta.content = 'no-referrer'
      document.getElementsByTagName('head')[0].appendChild(meta)
    },
    async likeClick () {
      if (!this.stats) return
      if (this.likeIt || this.stats.liked) return
      this.likeIt = true
      const platformUrl = this.data.account.url.replace(/(http(s?):\/\/)/gm, '').replace('/@' + this.data.account.acct, '')
      this.$emit('click-like', { type: 'like',  platform: 'mastodon' , dynamicId: `${platformUrl}_${this.data.id}` })
    }
  }
}
</script>

<style lang="less" scoped>
p {
  margin: 0;
  padding: 0;
}

span {
  margin: 0;
  padding: 0;
}

.cardunit-bg {
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

      &-user {
        height: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;

        &-nickname {
          font-size: 15px;
          color: black;
          line-height: 20px;
          font-weight: 700;
        }

        &-name {
          margin-left: 5px;
          color: #657786;
          font-size: 15px;
          font-weight: 400;
          line-height: 20px;
        }
      }

      &-time {
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
        color: #3487D2;
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

    &-photoalbum {
      position: relative;
      margin-top: 10px;
      width: 100%;

      &-pillar {
        padding-bottom: 56.25%;
      }

      &-main {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }

    .cardtop10 {
      margin-top: 10px;
    }

    &-flows {
      display: flex;
      margin: 10px 0 0;
      .flow-default {
        flex: 1;
        svg {
          height: 18px;
          width: 18px;
          color: #657786;
        }
        span {
          margin:  0 0 0 5px;
        }
      }
      &-comment {
        .flow-default();
      }
      &-forward {
        .flow-default();
      }
      &-like {
        .flow-default();
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
    }

    &-sensitive {
      border: 1px solid #ccd6dd;
      margin-top: 10px;
    }
  }
}
</style>