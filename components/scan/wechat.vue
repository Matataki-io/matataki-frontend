<template>
  <div class="wechat-share">
    <qrcode class="wechat-code" :value="link" :options="{ width: width }" />
    <p v-if="isShowText" class="code">
      {{ text }}
      <svg-icon class="icon" icon-class="weixin" />
    </p>
  </div>
</template>
<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
export default {
  components: {
    qrcode: VueQrcode
  },
  props: {
    link: {
      type: String,
      required: true
    },
    isShowText: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: function () {
        return this.$t('p.shareWechat')
      }
    },
    width: {
      type: Number,
      default: 120
    }
  }
}
</script>
<style scoped lang="less">
.wechat-share {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.wechat-code {
  display: block;
  margin: 0 auto;
}
.code {
  text-align: center;
  padding: 0;
  margin: 10px 0 0 0;
  color: #333;
  position: relative;
  display: inline-block;
  .icon {
    position: absolute;
    color: #24DB5A;
    font-size: 22px;
    margin-left: 4px;
  }
}
</style>
