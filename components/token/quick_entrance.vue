<template>
  <div class="entrance">
    <h2 class="token-title">
      {{ $t('token.quickEntrance') }}
    </h2>
    <div class="entrance-list">
      <a
        class="entrance-list-card"
        href="https://www.yuque.com/matataki"
        target="_blank"
      >
        帮助手册
      </a>
      <a
        class="entrance-list-card"
        href="https://docs.matataki.io"
        target="_blank"
      >
        开发文档
      </a>
    </div>
  </div>
</template>
<script>
export default {
  // props: {
  //   minetokenToken: {
  //     type: Object,
  //     required: true
  //   },
  // },
}
</script>
<style lang="less" scoped>
.entrance {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);

  &-list {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-gap: 10px 10px;
    justify-content: space-between;
    &-card {
      height: 47px;
      font-size: 16px;
      font-weight: 600;
      color: #542DE0;
      line-height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius:4px;
      background: #EBE6FF;
    }
  }
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
