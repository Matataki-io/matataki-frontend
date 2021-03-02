<template>
  <div class="cardunit-bg">
    <div v-if="showUpLine" class="cardunit-bg-uline" />
    <div v-if="isRetweeted" class="cardunit-bg-retweeted">
      <div class="cardunit-bg-retweeted-l">
        <svg-icon icon-class="twitter-forward" />
      </div>
      <foreignUserPopover v-if="fromUser" :card="fromUser">
        <div class="cardunit-bg-retweeted-r">
          {{ card.user.name || card.user.screen_name }} {{ $t('zhuan-tui-le') }}
        </div>
      </foreignUserPopover>
      <div v-else class="cardunit-bg-retweeted-r">
        {{ card.user.name || card.user.screen_name }} {{ $t('zhuan-tui-le') }}
      </div>
    </div>
    <div class="cardunit">
      <div class="cardunit-l">
        <foreignUserPopover v-if="fromUser && fromUser.twitter_name === username" :card="fromUser">
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
        <div v-if="showDownLine" class="cardunit-l-dline" />
      </div>
      <div class="cardunit-r">
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
          <a class="cardunit-r-header-logo" :href="`https://twitter.com/${sCard.user.screen_name}/status/${sCard.id_str}`" target="_blank">
            <svg-icon v-if="showLogo" icon-class="twitter" />
            <i v-else class="el-icon-link" />
          </a>
        </div>
        <twitterContent class="cardunit-r-content" :card="sCard" />
        <!-- 敏感媒体 -->
        <sensitiveMedia v-if="hideSensitiveMedia" class="cardunit-r-sensitive" @view="showSensitiveMedia = true" />
        <!-- 图片 -->
        <div
          v-if="media && media.length > 0 && !hideSensitiveMedia"
          class="cardunit-r-photoalbum"
        >
          <div class="cardunit-r-photoalbum-pillar" />
          <twitterPhotoAlbum
            class="cardunit-r-photoalbum-main"
            :media="media"
          />
        </div>
        <!-- 视频 -->
        <div
          v-if="video && !hideSensitiveMedia"
          class="cardunit-r-photoalbum"
        >
          <div :style="`padding-bottom: ${video.heightRatio}%;`" class="cardunit-r-photoalbum-pillar" />
          <twitterVideo
            class="cardunit-r-photoalbum-main"
            :video="video"
          />
        </div>
        <twitterQuote v-if="card.quoted_status" :card="card.quoted_status" />
        <div class="cardunit-r-flows">
          <div class="cardunit-r-flows-comment">
            <svg-icon icon-class="twitter-comment" />
            <span v-if="flows.comment">
              {{ flows.comment }}
            </span>
          </div>
          <div class="cardunit-r-flows-forward">
            <svg-icon icon-class="twitter-forward" />
            <span v-if="flows.retweet">
              {{ flows.retweet }}
            </span>
          </div>
          <div class="cardunit-r-flows-like">
            <svg-icon :class="`${stats && 'like-touch'} ${flows.localLiked && 'active'}`" :icon-class="flows.localLiked ? 'twitter-liked' : 'twitter-like'" @click="likeClick" />
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

import twitterPhotoAlbum from './twitter_photo_album'
import twitterVideo from './twitter_video'
import twitterQuote from './twitter_quote'
import twitterContent from './twitter_content'
import sensitiveMedia from './sensitive_media'
import foreignUserPopover from '@/components/user/foreign_user_popover'

export default {
  components: {
    twitterPhotoAlbum,
    twitterVideo,
    twitterQuote,
    twitterContent,
    sensitiveMedia,
    foreignUserPopover
  },
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    },
    showUpLine: {
      type: Boolean,
      default: false
    },
    showDownLine: {
      type: Boolean,
      default: false
    },
    showLogo: {
      type: Boolean,
      default: false
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
  data() {
    return {
      showSensitiveMedia: false,
      likeIt: false
    }
  },
  computed: {
    isRetweeted () {
      return !!this.card.retweeted_status
    },
    sCard () {
      return this.isRetweeted ? this.card.retweeted_status : this.card
    },
    avatarImg () {
      return this.sCard.user.profile_image_url_https || ''
    },
    nickname () {
      return this.sCard.user.name || this.sCard.user.screen_name
    },
    username () {
      return this.sCard.user.screen_name
    },
    createTime () {
      const time = this.moment(this.sCard.created_at)
      if (!this.$utils.isNDaysAgo(2, time)) return time.fromNow()
      else if (!this.$utils.isNDaysAgo(365, time)) return time.format('MMMDo')
      return time.format('YYYY MMMDo')

    },
    flows () {
      return {
        comment: 0,
        retweet: this.sCard.retweet_count,
        favorite: this.sCard.favorite_count,
        localLike: this.stats ? (this.stats.like + this.likeIt) : 0,
        localLiked: this.stats ? (this.likeIt || this.stats.liked) : 0
      }
    },
    hideSensitiveMedia () {
      return this.card.possibly_sensitive && !this.showSensitiveMedia
    },
    media () {
      if (this.sCard.extended_entities && this.sCard.extended_entities.media) {
        const imgUrls = this.sCard.extended_entities.media
          .filter(item => item.type === 'photo')
          .map(item => item.media_url_https)
        return imgUrls
      }
      else return null
    },
    video () {
      if (this.sCard.extended_entities && this.sCard.extended_entities.media) {
        const media = this.sCard.extended_entities.media
        // 找到这个视频媒体
        for (let i = 0; i < media.length; i++) {
          if (media[i].type === 'video' || media[i].type === 'animated_gif') {
            // 将这个视频媒体中码率最高的 mp4 原作为返回值
            const res = media[i].video_info.variants.filter(variant => variant.content_type === 'video/mp4').sort((a,b) => b.bitrate - a.bitrate)[0]
            res
            if (res) {
              // mini播放器的宽高比
              res.heightRatio = Number((media[i].video_info.aspect_ratio[1] / media[i].video_info.aspect_ratio[0] * 100).toFixed(2))
              if (res.heightRatio > 100) res.heightRatio = 100
              else if (res.heightRatio < 35) res.heightRatio = 35
              // 是不是 gif
              if (media[i].type === 'animated_gif') res.type = 'gif'
            }
            return res
          }
        }
      }
      return null
    },
  },
  methods: {
    async likeClick () {
      if (!this.stats) return
      if (this.likeIt || this.stats.liked) return
      this.likeIt = true
      this.$emit('click-like', { type: 'like',  platform: 'twitter', dynamicId: this.card.id_str })
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
  &-uline {
    display: block;
    height: 5px;
    width: 2px;
    margin-left: 23.5px;
    margin-bottom: 5px;
    background: #ccd6dd;
  }

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
  box-sizing: border-box;
  display: flex;

  &-l {
    width: 49px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;

    &-avatar {
      width: 49px;
      height: 49px;
    }

    // &-uline {

    // }

    &-dline {
      width: 2px;
      margin: 5px auto 0;
      background: #ccd6dd;
      flex: 1;
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
        color: #00ACED;
        margin: 0 0 0 5px;
        transition: all ease-in 0.1s;
        &:hover {
          transform: scale(1.2);
        }
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

    &-flows {
      display: flex;
      margin: 10px 0 10px;
      .flow-default {
        color: #657786;
        flex: 1;
        svg {
          height: 18px;
          width: 18px;
          color: #657786;
        }
        span {
          margin:  0 0 0 3px;
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
            color: #e0245e;
            transform: scale(1.2);
          }
          &:active {
            transform: scale(1);
          }
          &.active {
            color: #e0245e;
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
