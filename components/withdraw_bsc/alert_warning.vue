<template>
  <el-alert :type="type">
    <h2 class="title">
      ⚠️ {{ $t('you-found-an-experimental-feature-that-is-not-yet-open-to-the-public') }} ⚠️
    </h2>
    <p class="description">
      {{ $t('this-is-the-BSC-transfer-permission-you-currently-apply-for-once-uploaded-you-can-generate-Fan-ticket-assets-on-the-BSC') }}
      <b>{{ $t('you-need-MetaMask-to-connect-to-the-Binance-Smartchain-mainnet-and-have-enough-BNB-to-upload-the-withdrawal-permission') }}</b>
    </p>
    <a
      class="link"
      href="https://www.readblocks.com/archives/32275"
      target="_blank"
      rel="noopener noreferrer"
    >👉{{ $t('guide-to-add-Binance-Smartchain-in-MetaMask') }} ↗️ 👈</a>
    <p class="description">
      {{ $t('if-you-dont-have-enough-BNB-you-can-share-the-license-with-friends-who-have-BNB-and-let-TA-help-you-generate-Fan-ticket-assets-on-the-Binance-Smart-Chain') }}
    </p>
  </el-alert>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'warning',
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  padding: 0;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.5;
}
.description {
  font-size: 14px;
  padding: 0;
  margin: 4px 0 0 0;
  line-height: 1.5;
}
.link {
  color: rgb(25, 137, 250);
  display: inline-block;
  font-size: 14px;
  text-decoration: underline;
  padding: 0;
  margin: 4px 0 0 0;
  line-height: 1.5;
}
</style>