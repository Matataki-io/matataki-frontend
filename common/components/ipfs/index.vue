<template>
  <el-popover
    class="m-ipfs"
    placement="bottom"
    trigger="hover"
  >
    <div>
      <p class="ipfs-tip">
        {{ $t('ipfsHash.slogan') }}
      </p>
      <p class="ipfs-link">
        IPFS Hash: {{ hash }}
        <svg-icon
          icon-class="copy"
          @click="copy(hash)"
        />
      </p>
    </div>
    <svg-icon
      slot="reference"
      icon-class="ipfs"
      class="ipfs"
    />
  </el-popover>
</template>

<script>
export default {
  props: {
    hash: {
      type: String,
      default: ''
    }
  },
  methods: {
    copy(val) {
      this.$copyText(val).then(
        () => this.$message({
          showClose: true,
          message: this.$t('success.copy'),
          type: 'success'
        }),
        () => this.$message({ showClose: true, message: this.$t('error.copy'), type: 'error' })
      )
    }
  }
}


</script>


<style lang="less" scoped>
.m-ipfs {
  .ipfs {
    font-size: 20px;
    cursor: pointer;
  }
}
.ipfs-tip {
  font-size:12px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:14px;
  margin-bottom: 10px;
}

.ipfs-link {
  font-size:12px;
  font-weight: bold;
  color: @purpleDark;
  line-height:14px;
}
</style>
