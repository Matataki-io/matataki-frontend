<template>
  <div class="activity">
    <h2 class="token-title">
      {{ $t('token.relatedActivities') }}
    </h2>
    <p>
      <i class="el-icon-s-cooperation" />
      活动卡片正在施工中
    </p>
  </div>
</template>
<script>
export default {
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
  },
}
</script>
<style lang="less" scoped>
.activity {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);

  height: 169px;
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
