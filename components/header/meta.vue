<template>
  <router-link class="wrapper" :to="{ name: 'token-id', params: { id: tokenId } }" target="_blank">
    <svg-icon icon-class="meta-logo" class="logo" />
    <span class="token">{{ tokenAmount }} {{ tokenSymbol }}</span>
  </router-link>
</template>

<script>
export default {

  props: {
    tokenId: {
      type: Number,
      default: 120
    },
    tokenAmount: {
      type: Number,
      default: 0
    },
    tokenSymbol: {
      type: String,
      default: 'META'
    },
  }

}
</script>

<style lang="less" scoped>
.wrapper {
    height: 40px;
    background: #3c68ff;
    border-radius: 16px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    box-sizing: border-box;
    margin-right: 10px;
  .logo {
    font-size: 26px;
  }
  .token {
    color: #fff;
    margin-left: 4px;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>