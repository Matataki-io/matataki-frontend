<template>
  <el-popover
    placement="top"
    trigger="hover"
    class="components-ipfs_all"
    width="370"
  >
    <div class="components-ipfs_all">
      <p class="tx_hash__title">
        链上查看
      </p>
      <div v-if="hash" class="tx_hash__address">
        <a :href="link + hash" target="_blank">
          Hash: {{ hash }}
        </a>
        <svg-icon @click="copy(hash)" icon-class="copy" class="icon" />
      </div>
    </div>
    <svg-icon slot="reference" :style="{ 'font-size': size }" icon-class="eth_mini2" class="eth_mini_icon" />
  </el-popover>
</template>

<script>
export default {
  props: {
    hash: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '18px'
    }
  },
  data() {
    return {
      link: 'https://rinkeby.etherscan.io/tx/'
    }
  },
  computed: {
  },
  methods: {
    copy(val) {
      this.$copyText(val).then(
        () => this.$message.success(this.$t('success.copy')),
        () => this.$message.error(this.$t('error.copy'))
      )
    }
  }
}
</script>

<style lang="less" scoped>

.components-ipfs_all {
  .eth_mini_icon {
    color: @purpleDark;
    cursor: pointer;
  }
  .tx_hash__title {
    padding: 0;
    margin: 0 0 10px;
    font-size:14px;
    font-weight:bold;
    color:rgba(0,0,0,1);
    line-height:20px;
  }
  .tx_hash__address {
    margin: 0;
    display: flex;
    align-items: center;
    a {
      padding: 0;
      margin: 0;
      font-size:12px;
      color:@purpleDark;
      line-height:17px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .icon {
      margin: 0;
      color: @purpleDark;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
