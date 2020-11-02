<template>
  <div class="cardunit-bg">
    <div v-if="showUpLine" class="cardunit-bg-uline" />
    <div class="cardunit">
      <div class="cardunit-l">
        <c-avatar
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
          <svg-icon
            class="cardunit-r-header-logo"
            icon-class="twitter"
          />
        </div>
        <p class="cardunit-r-content" v-html="content" />
        <div class="cardunit-r-photoalbum">
          <div class="cardunit-r-photoalbum-pillar" />
          <twitterPhotoAlbum class="cardunit-r-photoalbum-main" />
        </div>
        <twitterQuote />
        <div class="cardunit-r-flows">
          <div class="cardunit-r-flows-comment">
            <svg-icon icon-class="twitter-comment" />
            <span>
              {{ flows.comment }}
            </span>
          </div>
          <div class="cardunit-r-flows-forward">
            <svg-icon icon-class="twitter-forward" />
            <span>
              {{ flows.forward }}
            </span>
          </div>
          <div class="cardunit-r-flows-like">
            <svg-icon icon-class="twitter-like" />
            <span>
              {{ flows.like }}
            </span>
          </div>
        </div>
      </div>
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
    showUpLine: {
      type: Boolean,
      default: false
    },
    showDownLine: {
      type: Boolean,
      default: false
    }
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
    },
    flows () {
      return {
        comment: 13,
        forward: 5,
        like: 57,
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

.cardunit-bg {
  .cardunit-bg-uline {
    display: block;
    height: 5px;
    width: 2px;
    margin-left: 23.5px;
    margin-bottom: 5px;
    background: #ccd6dd;
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

    &-flows {
      display: flex;
      justify-content: space-between;
      margin: 10px 0 10px;
      max-width: 500px;
      .flow-default {
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
  }
}
</style>