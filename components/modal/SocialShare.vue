<template>
  <div class="outer">
    <div class="share-btn-container">
      <!-- <div class="share-btn">
        <svg-icon class="share-icon" icon-class="qq" />
        <p>QQ</p>
      </div> -->
      <a :href="socialLink.weibo" target="_blank">
        <div class="share-btn">
          <div class="share-bg">
            <svg-icon class="share-icon weibo" icon-class="weibo" />
          </div>
          <p>微博</p>
        </div>
      </a>
      <a :href="socialLink.facebook" target="_blank">
        <div class="share-btn">
          <div class="share-bg">
            <svg-icon class="share-icon facebook" icon-class="facebook" />
          </div>
          <p>Facebook</p>
        </div>
      </a>
      <a :href="socialLink.twitter" target="_blank">
        <div class="share-btn">
          <div class="share-bg">
            <svg-icon class="share-icon twitter" icon-class="twitter" />
          </div>
          <p>Twitter</p>
        </div>
      </a>
    </div>
    <div class="wx-share">
      <div class="qrcode-container">
        <div ref="wxqr" class="qrcode" />
      </div>
      <p class="code">
        <span>扫一扫，分享到微信</span>
        <svg-icon class="icon" icon-class="weixin" />
      </p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
export default {
  name: 'SocialShare',
  props: {
    article: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    cover() {
      if (this.article.cover) return this.$API.getImg(this.article.cover)
      return 'http://ssimg.frontenduse.top/image/2019/07/15/fe217e00671f5062951cc1ebad79fa1d.png'
    },
    socialLink() {
      const title = this.article.title
      const link = encodeURIComponent(window.location.href)
      const pic = this.cover
      return {
        weibo: `http://service.weibo.com/share/share.php?appkey=&title=${title}&url=${link}&pic=${pic}&searchPic=false&style=simple`,
        facebook: `https://www.facebook.com/sharer.php?title=${title}&href=${link}`,
        twitter: `https://twitter.com/intent/tweet?text=${link}`
      }
    },
    shareLink() {
      let url = `${process.env.WX_SHARE_HOST}/article/${this.$route.params.id}`
      if (this.isLogined) url += `?invite=${this.currentUserInfo.id}`
      return url
    }
  },
  mounted() {
    this.genQRCode()
  },
  methods: {
    genQRCode() {
      new QRCode(this.$refs.wxqr, {
        text: this.shareLink,
        width: 120,
        height: 120,
      });
    },
  }
}
</script>

<style lang="less" scoped>
.share-btn-container {
  .flexCenter();
  justify-content: space-around;
  .share-btn {
    .flexCenter();
    flex-direction: column;
    cursor: pointer;
    .share-icon {
      font-size: 4em;
    }
  }
}
.wx-share {
  text-align: center;
  margin-top: 40px;
  .flexCenter();
  flex-direction: column;
  .qrcode {
    background: #ffffff;
    width: 120px;
    height: 120px;
  }
}
.qrcode-container {
  background: #ffffff;
  padding: 5px;
}
p {
  margin: 10px 0 0 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
}
.share-bg {
  width: 70px;
  height: 70px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  .share-icon {
    width: 50%;
  }
  .weibo {
    color: #FF5722;
  }
  .facebook {
    color: #3C5999;
  }
  .twitter {
    color: #00ACED;
  }
}
.code {
  margin-top: 30px;
  .icon {
    color: #24DB5A;
    font-size: 22px;
    margin-left: 4px;
  }
}
</style>
