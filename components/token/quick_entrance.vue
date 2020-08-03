<template>
  <div class="entrance">
    <h2 class="token-title">
      {{ $t('token.quickEntrance') }}
    </h2>
    <div class="entrance-list">
      <a
        v-for="(item, index) of list"
        :key="index"
        class="entrance-list-card"
        :href="item.url"
        target="_blank"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          label: '帮助手册',
          url: 'https://www.yuque.com/matataki/matataki'
        },
        {
          label: '开发文档',
          url: 'https://docs.matataki.io'
        },
        {
          label: '任何反馈',
          url: 'http://andoromeda.mikecrm.com/a93Le8z'
        }
      ]
    }
  }
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
