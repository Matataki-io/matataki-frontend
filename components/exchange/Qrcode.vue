<template>
  <div class="outer">
    <qrcode
      :value="payLink"
      :options="{ width: '150' }"
      class="qrcode"
    />
    <p>请使用微信扫描二维码进行支付</p>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  name: 'QRCode',
  components: {
    qrcode: VueQrcode
  },
  props: {
    payLink: {
      type: String,
      default: ''
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
