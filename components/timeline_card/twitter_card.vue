<template>
  <div class="card">
    <div class="card-l">
      <c-avatar
        class="card-l-avatar"
        :src="avatarImg"
      />
    </div>
    <div class="card-r">
      <div class="card-r-header">
        <p class="card-r-header-user">
          <span class="card-r-header-user-nickname">
            {{ nickname }}
          </span>
          <span class="card-r-header-user-name">
            @{{ username }}
          </span>
        </p>
        <p class="card-r-header-time">
          •
          {{ createTime }}
        </p>
        <svg-icon
          class="card-r-header-logo"
          icon-class="twitter"
        />
      </div>
      <p class="card-r-content" v-html="content" />
      <div class="card-r-photoalbum">
        <div class="card-r-photoalbum-pillar" />
        <twitterPhotoAlbum class="card-r-photoalbum-main" />
      </div>
      <twitterQuote />
    </div>
  </div>
</template>

<script>
import twitterPhotoAlbum from './twitter_photo_album'
import twitterQuote from './twitter_quote'

export default {
  components: {
    twitterPhotoAlbum,
    twitterQuote
  },
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    },
  },
  computed: {
    avatarImg () {
      return 'https://picsum.photos/1280/720?random'
    },
    nickname () {
      return '张三'
    },
    username () {
      return 'zhang_san'
    },
    createTime () {
      return '39分钟前'
    },
    content () {
      return '张三和李四、王五、王大麻子通常联系在一起被使用。'
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

.card {
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);

  &-l {
    height: 100%;
    width: 49px;
    margin-right: 10px;

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
        color: #00ACED;
      }
    }

    &-content {
      color: black;
      font-size: 15px;
      font-weight: 400;
      line-height: 20px;
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

    &-quote {
      margin-top: 10px;
      background: #B2B2B2;
      border-radius: 16px;
      height: 145px;
      width: 100%;
    }
  }
}
</style>