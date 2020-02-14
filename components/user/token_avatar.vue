<template>
  <router-link :to="{name: 'token-id', params: {id : token.id}}" class="token">
    <div v-if="logo" class="minetoken">
      <img :src="logo" alt="token-logo">
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    token: {
      type: Object,
      required: true
    }
  },
  computed: {
    logo() {
      // console.log(this.token)
      return this.token.logo ? this.$ossProcess(this.token.logo) : ''
    }
  }
}
</script>

<style lang="less" scoped>
.token {
  width: 120px;
  height: 120px;
  background: url(../../assets/img/token.png);
  background-repeat: no-repeat;
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .minetoken {
    width: 62px;
    height: 62px;
    overflow: hidden;
    border-radius: 50%;
    margin: -8px 0 0 -8px;
    transform: skew(0deg, -10deg);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
