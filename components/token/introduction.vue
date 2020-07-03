<template>
  <div class="introduction">
    <h2 class="token-title">
      {{ $t('token.introduction') }}
    </h2>
    <p class="token-introduction">
      <!-- 开了wrap 这个span不能换行！ -->
      <span class="wrap-open">{{ minetokenToken.introduction || $t('not') }}</span>
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
.introduction {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.token-title {
  font-size: 24px;
  font-weight: bold;
  color: @black;
  line-height: 33px;
  padding: 0;
  margin: 0;
}
.token-introduction {
  font-size: 16px;
  font-weight: 400;
  color: @black;
  line-height: 22px;
  padding: 0;
  margin: 20px 0 0;
}
.wrap-open {
  white-space: pre-wrap;
}
@media screen and (max-width: 600px) {
  .token-title {
    font-size: 20px;
  }
  .token-introduction {
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
