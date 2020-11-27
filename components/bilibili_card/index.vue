<template>
  <div class="cardunit">
    <div class="cardunit-l">
      <c-avatar
        class="cardunit-l-avatar"
        :src="avatarImg"
      />
    </div>
    <div class="cardunit-r">
      <div class="cardunit-r-header">
        <p class="cardunit-r-header-user">
          <span class="cardunit-r-header-user-nickname">
            {{ nickname }}
          </span>
        </p>
        <p class="cardunit-r-header-time">
          •
          {{ createTime }}
        </p>
        <!-- <a class="cardunit-r-header-logo" :href="`https://t.bilibili.com/461467903514442263?tab=2`" target="_blank">
          <i class="el-icon-link" />
        </a> -->
      </div>
      <bilibiliContent class="cardunit-r-content" :card="card" :mode="stype" />
      <!-- 敏感媒体 -->
      <!-- <sensitiveMedia v-if="hideSensitiveMedia" class="cardunit-r-sensitive" @view="showSensitiveMedia = true" /> -->
      <!-- 图片 -->
      <div
        v-if="media && media.length > 0"
        class="cardunit-r-photoalbum"
      >
        <div class="cardunit-r-photoalbum-pillar" />
        <bilibiliPhotoAlbum
          class="cardunit-r-photoalbum-main"
          :media="media"
        />
      </div>
      <!-- 视频 -->
      <bilibiliVideo
        v-if="stype === 2"
        class="cardunit-r-video"
        :card="card"
      />
      <!-- 特殊卡片 -->
      <bilibiliSpecial v-if="sketch" :sketch="sketch" />
      <!-- <twitterQuote v-if="card.quoted_status" :card="card.quoted_status" /> -->
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
          <svg-icon icon-class="twitter-like" />
          <span v-if="flows.favorite">
            {{ flows.favorite }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bilibiliPhotoAlbum from './bilibili_photo_album'
import bilibiliVideo from './bilibili_video'
// import twitterQuote from './twitter_quote'
// import sensitiveMedia from './sensitive_media'
import bilibiliSpecial from './bilibili_special'
import bilibiliContent from './bilibili_content'

export default {
  components: {
    bilibiliPhotoAlbum,
    bilibiliVideo,
    // twitterQuote,
    // sensitiveMedia,
    bilibiliSpecial,
    bilibiliContent
  },
  props: {
    // 卡片数据
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    card () {
      if (!(this.data && this.data.card)) return null
      return JSON.parse(this.data.card)
    },
    stype () {
      if (!this.card) return 0
      if (this.card.item) return 1
      if (this.card.aid) return 2
      if (this.card.rid) return 3
      return 0
    },
    avatarImg () {
      if (!this.card) return ''
      return this.data.desc.user_profile.info.face
    },
    nickname () {
      if (!this.card) return ''
      return this.data.desc.user_profile.info.uname
    },
    createTime () {
      if (!this.card) return ''
      const time = this.moment(Math.round(this.data.desc.timestamp * 1000))
      if (!this.$utils.isNDaysAgo(2, time)) return time.fromNow()
      else if (!this.$utils.isNDaysAgo(365, time)) return time.format('MMMDo')
      return time.format('YYYY MMMDo')
    },
    flows () {
      if (!this.card) return {}
      const desc = { ...this.data.desc }
      let comment
      if (this.stype === 2) comment = this.card.stat.reply
      else comment = desc.comment

      return {
        comment,
        retweet: desc.repost,
        favorite: desc.like
      }
    },
    media () {
      if (!this.card || this.stype !== 1 || !this.card.item.pictures) return []
      return this.card.item.pictures
    },
    sketch () {
      if (!this.card || this.stype !== 3 || !this.card.sketch) return null
      return this.card.sketch
    }
  },
  mounted () {
    console.log(this.stype, this.data, this.card)
    let meta = document.createElement('meta')
    meta.name = 'referrer'
    meta.content = 'no-referrer'
    document.getElementsByTagName('head')[0].appendChild(meta)
  },
  methods: {
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

.cardunit {
  background: rgba(255, 255, 255, 1);
  padding: 20px;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
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

    &-video {
      margin-top: 10px;
    }

    &-flows {
      display: flex;
      margin: 10px 0 10px;
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
      }
    }

    &-sensitive {
      border: 1px solid #ccd6dd;
      margin-top: 10px;
    }
  }
}
</style>