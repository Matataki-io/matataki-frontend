<template>
  <div class="cardorigin">
    <div class="cardorigin-header">
      <c-avatar
        class="cardorigin-header-avatar"
        :src="avatarImg"
      />
      <p class="cardorigin-header-user">
        <span class="cardorigin-header-user-nickname">
          {{ nickname }}
        </span>
      </p>
      <!-- <a class="cardorigin-header-logo" :href="`https://t.bilibili.com/461467903514442263?tab=2`" target="_blank">
        <i class="el-icon-link" />
      </a> -->
    </div>
    <bilibiliContent class="cardorigin-content" :card="card" :mode="stype" />
    <!-- 图片 -->
    <div
      v-if="media && media.length > 0"
      class="cardorigin-photoalbum"
    >
      <div class="cardorigin-photoalbum-pillar" />
      <bilibiliPhotoAlbum
        class="cardorigin-photoalbum-main"
        :media="media"
      />
    </div>
    <!-- 视频 -->
    <bilibiliVideo
      v-if="type === 8"
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
    <!-- 番剧 -->
    <bilibiliAnime
      v-if="type === 512"
      class="cardtop10"
      :card="card"
    />
    <!-- 特殊卡片 -->
    <bilibiliSpecial v-if="sketch" :sketch="sketch" />
  </div>
</template>

<script>
import bilibiliPhotoAlbum from './bilibili_photo_album'
import bilibiliVideo from './bilibili_video'
import bilibiliColumn from './bilibili_column'
import bilibiliMusic from './bilibili_music'
import bilibiliAnime from './bilibili_anime'
import bilibiliSpecial from './bilibili_special'
import bilibiliContent from './bilibili_content'

export default {
  components: {
    bilibiliPhotoAlbum,
    bilibiliVideo,
    bilibiliColumn,
    bilibiliMusic,
    bilibiliAnime,
    bilibiliSpecial,
    bilibiliContent
  },
  props: {
    // 卡片数据
    type: {
      type: Number,
      required: true
    },
    card: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    stype () {
      if (!this.card) return 0
      if (this.card.item) return 1
      if (this.card.aid) return 2
      if (this.card.rid) return 3
      if (this.type === 256) return 4
      return 0
    },
    avatarImg () {
      if (!this.user) return ''
      if (this.type === 512 && this.card && this.card.apiSeasonInfo && this.card.apiSeasonInfo.cover) {
        return this.card.apiSeasonInfo.cover
      }
      return this.user.info.face
    },
    nickname () {
      if (!this.user) return ''
      if (this.type === 512 && this.card && this.card.apiSeasonInfo && this.card.apiSeasonInfo.title) {
        return this.card.apiSeasonInfo.title
      }
      return this.user.info.uname
    },
    media () {
      if (!this.card || this.type !== 2 || !this.card.item.pictures) return []
      return this.card.item.pictures
    },
    sketch () {
      if (!this.card || this.stype !== 3 || !this.card.sketch) return null
      return this.card.sketch
    }
  },
  mounted () {
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

.cardorigin {
  max-width: 520px;
  background: #f4f5f7;
  padding: 8px 12px;
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &-header {
    display: flex;
    margin-bottom: 5px;

    &-avatar {
      width: 26px;
      height: 26px;
      min-width: 26px;
    }

    &-user {
      margin-left: 6px;
      height: 26px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;

      &-nickname {
        font-size: 14px;
        color: #00a1d6;
        line-height: 26px;
        font-weight: 400;
      }
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
    margin-top: 5px;
  }
}
</style>