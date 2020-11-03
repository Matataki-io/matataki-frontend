<template>
  <div class="quote">
    <div class="quote-header">
      <c-avatar
        class="quote-header-avatar"
        :src="avatarImg"
      />
      <p class="quote-header-user">
        <span class="quote-header-user-nickname">
          {{ nickname }}
        </span>
        <span class="quote-header-user-name">
          @{{ username }}
        </span>
      </p>
      <p class="quote-header-time">
        •
        {{ createTime }}
      </p>
    </div>
    <div class="quote-cols">
      <div
        v-if="media && media.length > 0"
        class="quote-cols-photoalbum"
      >
        <div class="quote-cols-photoalbum-pillar" />
        <twitterPhotoAlbum
          class="quote-cols-photoalbum-main"
          :media="media"
        />
      </div>
      <twitterContent class="quote-cols-content" :card="card" />
    </div>
  </div>
</template>

<script>
import twitterPhotoAlbum from './twitter_photo_album'
import twitterContent from './twitter_content'

export default {
  components: {
    twitterPhotoAlbum,
    twitterContent
  },
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    avatarImg () {
      return this.card.user.profile_image_url_https || ''
    },
    nickname () {
      return this.card.user.name || this.card.user.screen_name
    },
    username () {
      return this.card.user.screen_name
    },
    createTime () {
      const time = this.moment(this.card.created_at)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo') : time.fromNow()
    },
    media () {
      if (this.card.extended_entities && this.card.extended_entities.media) {
        const imgUrls = this.card.extended_entities.media
          .filter(item => item.type === 'photo')
          .map(item => item.media_url_https)
        return imgUrls
      }
      else return null
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

.quote {
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid #ccd6dd;
  border-radius: 16px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  
  &-header {
    display: flex;
    margin-bottom: 5px;

    &-avatar {
      width: 22px;
      height: 22px;
      margin-right: 5px;
    }

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
    }
  }

  &-cols {
    display: flex;

    &-photoalbum {
      position: relative;
      flex: 1;

      &-pillar {
        padding-bottom: 100%;
      }

      &-main {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
    
    &-content {
      margin-left: 10px;
      width: 77.4%;
      color: black;
      font-size: 15px;
      font-weight: 400;
      line-height: 20px;
    }
  }
}
</style>