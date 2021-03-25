<template>
  <div class="share">
    <h2 class="token-title">{{ $t('token.shareWidget') }}</h2>
    <el-input
      v-model="tokenWidget"
      :rows="4"
      class="token-widget"
      type="textarea"
    />
    <el-button size="mini" style="margin-top: 10px;" @click="copy(tokenWidget)">
      {{ $t('copy') }}
    </el-button>
  </div>
</template>
<script>

export default {
  data() {
    return {
      tokenWidget: `<iframe width="100%" height="200px" src='${process.env.VUE_APP_URL}/widget/token/?id=${this.$route.params.id}' frameborder=0></iframe>`
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
        () => {
          this.$message({ showClose: true, message: this.$t('error.copy'), type: 'error' })
        }
      )
    },
  }
}
</script>
<style lang="less" scoped>
.share {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 20px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.token-widget {
  margin-top: 20px;
}

.token-title {
  font-size: 24px;
  font-weight: bold;
  color: @black;
  line-height: 33px;
  padding: 0;
  margin: 0;
}

@media screen and (max-width: 600px) {
  .token-title {
    font-size: 20px;
  }
}
</style>
