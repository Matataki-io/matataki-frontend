<template>
  <div class="outer">
    <div class="share-btn-container">
      <div
        class="share-btn"
        @click="windowSmallOpen(socialLink.weibo)"
      >
        <div class="share-bg">
          <svg-icon
            class="share-icon weibo"
            icon-class="weibo"
          />
        </div>
        <p>{{ $t('p.shareWeibo') }}</p>
      </div>
      <div
        class="share-btn"
        @click="windowSmallOpen(socialLink.facebook)"
      >
        <div class="share-bg">
          <svg-icon
            class="share-icon facebook"
            icon-class="facebook"
          />
        </div>
        <p>Facebook</p>
      </div>
      <div
        class="share-btn"
        @click="windowSmallOpen(socialLink.twitter)"
      >
        <div class="share-bg">
          <svg-icon
            class="share-icon twitter"
            icon-class="twitter"
          />
        </div>
        <p>Twitter</p>
      </div>
    </div>
    <div class="share-btn-container itop30">
      <div
        class="share-btn"
        @click="windowSmallOpen(socialLink.qq)"
      >
        <div class="share-bg">
          <svg-icon
            class="share-icon qq"
            icon-class="qq"
          />
        </div>
        <p>QQ</p>
      </div>
      <div
        class="share-btn"
        @click="windowSmallOpen(socialLink.qzone)"
      >
        <div class="share-bg">
          <svg-icon
            class="share-icon qzone"
            icon-class="qzone"
          />
        </div>
        <p>{{ $t('qqSpace') }}</p>
      </div>
      <div
        class="share-btn"
        @click="windowSmallOpen(socialLink.telegram)"
      >
        <div class="share-bg">
          <!-- Telegram and Share shares the same icon as paperplane -->
          <svg-icon
            class="share-icon telegram"
            icon-class="tg"
          />
        </div>
        <p>Telegram</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import wechat from '@/components/scan/wechat.vue'

export default {
  name: 'SocialShare',
  components: {
    // wechat
  },
  props: {
    article: {
      type: Object,
      default: () => {
        return {}
      }
    },
    qqTitle: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    cover() {
      if (this.article.cover) return this.$ossProcess(this.article.cover)
      return 'https://smartsignature-img.oss-cn-hongkong.aliyuncs.com/avatar/2019/08/30/c1d6ae7ed4e6102cb45d0a8f656d5569.png'
    },
    socialLink() {
      const title = this.article.title
      let link = encodeURIComponent(window.location.href)
      if (this.isLogined) link += encodeURIComponent(`/?referral=${this.currentUserInfo.id}`)
      const pic = this.cover
      // 用于 Telegram 的即时预览，模板出问题了联系我 --Frank
      const telegramIVLink = encodeURIComponent(`https://t.me/iv?url=${link}&rhash=${process.env.TELEGRAM_IV_RHASH}`)

      const shortContent = this.article.short_content.slice(0, 120)
      return {
        weibo: `http://service.weibo.com/share/share.php?&title=${encodeURIComponent(`${title} - 来自 瞬Matataki ${link}`)}&url=${link}&pic=${pic}&searchPic=false&style=simple`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
        twitter: `https://twitter.com/intent/tweet?text=${link}`,
        telegram: `https://t.me/share/url?url=${telegramIVLink}`,
        qq: `http://connect.qq.com/widget/shareqq/index.html?url=${this.shareLink}&sharesource=qzone&title=${title}&pics=${pic}&summary=${shortContent}`,
        qzone: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${this.shareLink}&sharesource=qzone&title=${title}&pics=${pic}&summary=${shortContent}`
      }
    },
    shareLink() {
      let url = `${process.env.VUE_APP_URL}/p/${this.$route.params.id}`
      if (this.isLogined) url += `?referral=${this.currentUserInfo.id}`
      return url
    }
  },
  mounted() {
  },
  methods: {
    windowSmallOpen(url) {
      window.open(url, '_blank', 'width=760,height=640')
      this.$emit('share-count')
    }
  }
}
</script>

<style lang="less" scoped>
.share-btn-container {
  &.itop30 {
    margin-top: 30px;
  }
  display: flex;
  align-items: center;
  justify-content: space-around;
  .share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    .share-icon {
      font-size: 4em;
    }
  }
}
.wx-share {
  text-align: center;
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
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
    color: #ff5722;
  }
  .facebook {
    color: #3c5999;
  }
  .twitter {
    color: #00aced;
  }
  .telegram {
    color: #36aae8;
  }
  .qq {
    color: #4cafe9;
  }
  .qzone {
    color: #fab619;
  }
}
.code {
  margin-top: 30px;
  .icon {
    color: #24db5a;
    font-size: 22px;
    margin-left: 4px;
  }
}
</style>
