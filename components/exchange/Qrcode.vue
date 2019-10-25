<template>
  <div class="outer">
    <div ref="qr" class="qrcode" />
    <p>请使用微信扫描二维码进行支付</p>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'QRCode',
  props: {
    payLink: {
      type: String,
      default: ''
    }
  },
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
    payLink(url) {
      this.$refs.qr.innerHTML = ''
      this.genQRCode(url)
    }
  },
  mounted() {
    this.genQRCode(this.payLink)
  },
  methods: {
    genQRCode(url) {
      new QRCode(this.$refs.qr, {
        color: {
          dark: '#542DE0',  // Blue dots
          light: '#0000' // Transparent background
        },
        text: url,
        width: 150,
        height: 150,
      });
    }
  }
}
</script>

<style lang="less" scoped>
.outer {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.qrcode {
  background: #ffffff;
  width: 150px;
  height: 150px;
}
</style>
