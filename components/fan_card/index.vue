<template>
  <n-link
    :to="{name: 'ring-id', params: { id: card.token_id }}"
    target="_blank"
    class="token-card"
  >
    <div class="img-frame">
      <img
        v-if="logo"
        v-lazy="logo"
        :alt="card.symbol"
        class="img-frame"
      >
    </div>
    <div class="title">
      {{ card.symbol + $t('home.ofFanCircle') }}
    </div>
  </n-link>
</template>

<script>

export default {
  components: {
  },
  transition: 'page',
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    logo() {
      return this.card.logo ? this.$ossProcess(this.card.logo, { h: 240 }) : ''
    }
  }
}
</script>
<style lang="less" scoped>
  .token-card {
    width: calc(25% - 18px);
    min-width: 140px;
    height:239px;
    border-radius: 10px;
    background:white;
    margin-right: 18px;
    margin-bottom: 20px;
    float: left;
    transition: all 0.3s;
    &:hover {
      transform: translate(0, -4px);
      box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
    }
    &.add {
      border: 1px dashed #dbdbdb;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 40px;
      color: #dbdbdb;
      overflow: hidden;
      text-decoration: none;
      width: 175px;
      height: 237px;
      span {
        font-size: 12px;
        margin: 4px 0 0;
        padding: 0;
        color: #dbdbdb;
      }
    }
    overflow: hidden;
    .img-frame {
      width:177px;
      height:177px;
      border-bottom: 1px solid #9d9d9d38;
      img {
        // width:177px;
        height:177px;
      }
    }
    .title {
      color: black;
      margin-top: 20px;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
    }
  }
</style>
