<template>
  <div class="share">
    <h2 class="token-title">
      {{ $t('token.shareWidget') }}
    </h2>
    <el-input
      v-model="tokenWidget"
      :rows="6"
      class="token-widget"
      type="textarea"
      :placeholder="$t('rule.content')"
    />
  </div>
</template>
<script>

export default {
  data() {
    return {
      tokenWidget: `<iframe width="100%" height="200px" src='${process.env.VUE_APP_URL}/widget/token/?id=${this.$route.params.id}' frameborder=0></iframe>`
    }
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
