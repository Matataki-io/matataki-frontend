<template>
  <div class="outer">
    <div ref="container" :class="{ 'white-bg': !canvas }">
      <div v-if="!canvas" ref="capture" class="container">
        <section class="header">
          <img src="@/assets/img/smartsignature.svg" alt="SmartSignature">
          <h1>投资好文，分享有收益</h1>
        </section>
        <section class="content-container">
          <h1>{{ shareInfo.title }}</h1>
          <div class="desc">
            <div class="user">
              <img class="avatar" :src="shareInfo.avatar" alt="" :onerror="defaultAvatar">
              <span class="name">{{ shareInfo.name }}</span>
            </div>
            <span class="time">{{ shareInfo.time }}</span>
          </div>
          <div class="content markdown-body" v-html="htmlStr" />
        </section>
        <div class="hide-article-box">
          <span>—— 扫描二维码 免费读全文 ——</span>
        </div>
        <section class="footer">
          <img src="@/assets/img/logo-word.svg" alt="SmartSignature">
          <div ref="qr" class="qrcode" />
        </section>
      </div>
      <img v-else :src="downloadLink" alt="" style="width: 100%;">
    </div>
    <button class="save-btn" @click="toCanvas">
      生成图片
    </button>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: 'QRCodeDialog',
  props: {
    shareInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      canvas: null
    }
  },
  computed: {
    downloadLink() {
      if (this.canvas) return this.canvas.toDataURL()
      return ''
    },
    isAPP() {
      return /Edge|Firefox|Opera|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    },
    htmlStr() {
      return this.filterStr(this.shareInfo.content).substr(0, 300);
    }
  },
  watch: {},
  mounted() {
    this.genQRCode()
    console.log(this.isAPP)
  },
  methods: {
    filterStr(str) {
      let re = /<[^>]+>/gi;
      str = str.replace(re, '');
      return str;
    },
    close() {
      this.$emit('change', false)
    },
    saveLocal(canvas) {
      let link = document.createElement('a')
      link.href = canvas.toDataURL()
      link.setAttribute('download', `${this.shareInfo.title}.png`)
      link.style.display = 'none'
      link.click()
    },
    toCanvas() {
      const loading = this.$loading({
        text: `图片生成中...`
      })
      html2canvas(this.$refs.capture, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0
      }).then(canvas => {
        this.canvas = canvas
        this.saveLocal(canvas)
        loading.close()
      }).catch((error) => {
        console.log(error);
        loading.close()
        this.$message('图片生成失败')
      })
    },
    genQRCode() {
      new QRCode(this.$refs.qr, {
        text: this.shareInfo.shareLink,
        width: 55,
        height: 55,
      });
    }
  }
}
</script>

<style lang="less" scoped>
.markdown-body {
  font-size: 14px;
  color: #000000;
}
.white-bg {
  background: #ffffff;
  width: 100%;
  margin: auto;
}
.outer {
  background: transparent;
  overflow: auto;
}
.hide-article-box {
  width: 100%;
  background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 70%);
  padding-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 9999;
  padding-top: 100px;
  bottom: 2px;
  margin-top: -100px;
  color: #b2b2b2;
  font-size: 14px;
}
.save-btn {
  font-size: 20px;
  color: #ffffff;
  border-radius: 6px;
  border: none;
  background: #1c9cfe;
  width: 335px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 20px auto 0 auto;
  user-select: none;
  &.disabled {
    background: #b2b2b2;
  }
  &:disabled {
    background: #b2b2b2;
  }
}
.container {
  width: 100%;
  margin: auto;
}
.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: 130px;
  background: url('../../assets/img/share-bg.svg');
  h1 {
    font-size: 20px;
    color: #ffffff;
    line-height: 28px;
    margin: 0;
  }
}
.content-container {
  width: inherit;
  padding: 20px;
  box-sizing: border-box;
  h1 {
    color: #000000;
    font-size: 20px;
    line-height: 24px;
    margin: 0;
  }
}
.content {
  // max-height: 180px;
  overflow: hidden;
}
.desc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}
.user {
  display: flex;
  align-items: center;
  max-width: 70%;
}
.time {
  color: #b2b2b2;
  font-size: 12px;
}
.name {
  color: #000;
  font-size: 12px;
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.footer {
  background: #f1f1f1;
  height: 75px;
  width: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  img {
    width: 50%;
  }
  .qrcode {
    background: #ffffff;
    width: 55px;
    height: 55px;
  }
}
</style>
