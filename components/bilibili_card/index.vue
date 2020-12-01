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
        <a class="cardunit-r-header-logo" :href="originUrl" target="_blank">
          <svg-icon icon-class="bilibili_tv" />
        </a>
      </div>
      <bilibiliContent class="cardunit-r-content" :card="card" :mode="stype" />
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
        class="cardtop10"
        :card="card"
      />
      <!-- 专栏 -->
      <bilibiliColumn
        v-if="type === 64"
        class="cardtop10"
        :card="card"
      />
      <!-- 音乐 -->
      <bilibiliMusic
        v-if="type === 256"
        class="cardtop10"
        :card="card"
      />
      <bilibiliOrigin
        v-if="card.origin"
        class="cardtop10"
        :type="card.item.orig_type"
        :card="jsonp(card.origin)"
        :user="card.origin_user"
      />
      <!-- 特殊卡片 -->
      <bilibiliSpecial v-if="sketch" :sketch="sketch" />
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
import bilibiliColumn from './bilibili_column'
import bilibiliMusic from './bilibili_music'
import bilibiliSpecial from './bilibili_special'
import bilibiliContent from './bilibili_content'
import bilibiliOrigin from './bilibili_origin'

export default {
  components: {
    bilibiliPhotoAlbum,
    bilibiliVideo,
    bilibiliColumn,
    bilibiliMusic,
    bilibiliSpecial,
    bilibiliContent,
    bilibiliOrigin
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
      if (this.type === 256) return 4
      return 0
    },
    type () {
      return this.data.desc.type
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
      const res = {
        comment: desc.comment,
        retweet: desc.repost,
        favorite: desc.like
      }
      if (this.stype === 2) res.comment = this.card.stat.reply
      else if (this.type === 64) {
        res.comment = this.card.stats.reply
        res.retweet = this.card.stats.dynamic
      }
      else if (this.type === 256) {
        res.comment = this.card.replyCnt
      }

      return res
    },
    media () {
      if (!this.card || this.stype !== 1 || !this.card.item.pictures) return []
      return this.card.item.pictures
    },
    sketch () {
      if (!this.card || this.stype !== 3 || !this.card.sketch) return null
      return this.card.sketch
    },
    originUrl () {
      if (this.stype === 1) return `https://t.bilibili.com/${this.data.desc.dynamic_id_str}?tab=2`
      else if (this.stype === 2) return 'https://www.bilibili.com/video/av' + this.card.aid
      else if (this.type === 64) return 'https://www.bilibili.com/read/cv' + this.card.id
      else if (this.type === 256) return 'https://www.bilibili.com/audio/au' + this.card.id
      else return ''
    },
  },
  mounted () {
    console.log(this.type, this.data, this.card)
    let meta = document.createElement('meta')
    meta.name = 'referrer'
    meta.content = 'no-referrer'
    document.getElementsByTagName('head')[0].appendChild(meta)
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

    .cardtop10 {
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