<template>
  <el-popover
    class="ipfs-block"
    placement="bottom"
    width="400"
    trigger="click"
  >
    <div>
      <p class="ipfs-tip">
        本文内容已上传星际文件存储系统「IPFS」，永久保存。
      </p>
      <p class="ipfs-link">
        IPFS Hash:cjsoiajcoiosjocjosjcoijocjsoiajcoiosjocjosjcoijo
        <svg-icon @click="copy('cjsoiajcoiosjocjosjcoijocjsoiajcoiosjocjosjcoijo')" icon-class="copy" />
      </p>
    </div>
    <svg-icon slot="reference" icon-class="ipfs" class="ipfs" />
  </el-popover>
</template>

<script>
export default {
  methods: {
    copy(val) {
      this.$copyText(val).then(
        () => this.$toast.success({ duration: 1000, message: this.$t('success.copy') }),
        () => this.$toast.fail({ duration: 1000, message: this.$t('fail.copy') })
      )
    }
  }
}
</script>

<style lang="less" scoped>
.ipfs-block {
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
