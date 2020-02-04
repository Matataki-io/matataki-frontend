<template>
  <div class="outer">
    <div ref="container" :class="{ 'white-bg': !canvas }">
      <div ref="capture" v-if="!canvas" class="container">
        <div class="header">
          <div class="info">
            <avatar :src="shareInfo.avatar" size="40px" />
            <span class="username">{{ shareInfo.name }}</span>
          </div>
          <p v-clampy="2">
            {{ shareInfo.title }}
          </p>
          <div v-if="shareInfo.cover" class="full" />
          <div
            v-if="shareInfo.cover"
            :style="coverImage"
            class="cover"
          />
        </div>
        <div class="content-container">
          <p v-clampy="8" v-html="htmlStr" class="markdown-body" />
        </div>
        <div class="hide-article-box">
          —— {{ $t('p.sweepCodeView') }} ——
        </div>
        <section class="footer-share">
          <div class="flex">
            <img class="logo" src="@/assets/img/share_logo.png" alt="logo">
            <qrcode :value="shareInfo.shareLink" :options="{ width: '80' }" class="qrcode" />
          </div>
          <img class="des" src="@/assets/img/des_logo.png" alt="logo">
        </section>
      </div>
      <img v-else :src="downloadLink" alt="" style="width: 100%;">
    </div>
    <a @click="toCanvas" href="javascript:;" class="save-btn">
      {{ $t('p.downloadImg') }}
    </a>
  </div>
</template>

<script>
/* eslint-disable */

import avatar from "@/components/avatar";
import { xssFilter } from '@/utils/xss'
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  name: 'QRCodeDialog',
  props: {
    shareInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    avatar,
    qrcode: VueQrcode
  },
  data() {
    return {
      canvas: null,
      coverImage: {
        backgroundImage: `url(${this.shareInfo.cover})`
      }
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
      // TODO:这边感觉有点问题, 只优先完成了 保留换行和去掉img引起的空行
      let filterStrRes = this.filterStr(this.shareInfo.content)
      let removeSpaceRes = this.removeSpace(filterStrRes)
      return xssFilter(removeSpaceRes.substr(0, 400));
    }
  },
  beforeDestroy(){
    // 离开删除插入的a dom
    let downloadImg = document.querySelector('#downloadImg')
    if (downloadImg) downloadImg.remove()
  },
  methods: {
    filterStr(str) {
      let re = /<[^>]+>/gi;
      str = str.replace(re, '');
      return str;
    },
    removeSpace(str) {
      return str.replace(/\n\s*\n/gi, '\n')
    },
    close() {
      this.$emit('change', false)
    },
    saveLocal(canvas) {
      let link = document.createElement("a");
      link.id = 'downloadImg'
      link.href = canvas.toDataURL();
      link.setAttribute('download', `${this.shareInfo.title}.png`)
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
    },
    toCanvas() {
      const loading = this.$loading({
        text: `${this.$t('p.createImg')}...`
      })
      if (this.canvas) {
        document.querySelector('#downloadImg').click()
        loading.close()
        return
      }
      html2canvas(this.$refs.capture, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: this.$refs.capture.clientWidth,
        height: this.$refs.capture.clientHeight,
      }).then(canvas => {
        this.canvas = canvas
        this.saveLocal(canvas)
        loading.close()
      }).catch((error) => {
        console.log(error);
        loading.close()
        this.$message(this.$t('p.createFail'))
      })
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
  background: #fff;
  overflow: auto;
  position: relative;
}
.hide-article-box {
  width: 100%;
  background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 70%);
  padding-bottom: 30px;
  text-align: center;
  position: relative;
  z-index: 99;
  padding-top: 100px;
  margin-top: -100px;
  color: #B2B2B2;
  font-size: 14px;
}
.save-btn {
  position: absolute;
  font-size: 14px;
  text-decoration: underline;
  color: @purpleDark;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  right: 6px;
  bottom: 6px;
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
  height: 200px;
  background-color: @purpleDark;
  position: relative;
  overflow: hidden;
  .info {
    display: flex;
    align-items: center;
    z-index: 10;
    position: relative;
    padding: 24px 0 0 20px;
  }
  .username {
    font-size:16px;
    font-weight:500;
    color: #fff;
    padding: 0;
    margin: 0 0 0 10px;
    letter-spacing: 1px;
  }
  p {
    display: block;
    width: 80%;
    font-size:20px;
    color: #fff;
    padding: 0;
    margin: 60px auto 0;
    line-height: 1.5;
    letter-spacing: 1px;
    z-index: 10;
    position: relative;
  }
  .cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    background-size: cover;
    background-position: center;
  }
  .full {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, .4);
  }
}
.content-container {
  box-sizing: border-box;
  // overflow: hidden;
  padding: 40px 40px 50px;
  margin: 0;
  min-height: 290px;
  p {
    font-size: 14px;
    line-height: 25px;
    max-height: 200px;
    overflow: hidden;
    padding: 0;
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
  }
}

.footer-share {
  box-sizing: border-box;
  padding: 0 0 40px;
  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      height: 80px;
      margin-right: 15px;
    }
    .qrcode {
      background: #ffffff;
      width: 80px;
      height: 80px;
      margin-left: 15px;
    }
  }
  .des {
    display: block;
    width: 140px;
    margin: 20px auto 0;
  }
}
</style>
