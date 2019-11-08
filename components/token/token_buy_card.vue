<template>
  <div class="buy-card">
    <div class="buy-flex">
      <h2 class="token-title">快捷购买</h2>
      <span class="center">220 KJM <svg-icon icon-class="exchange"/></span>
    </div>
    <el-input
      placeholder="输入购买数量"
      v-model="amount">
      <span slot="suffix" class="el-input__icon suffix-text">= 0 CNY</span>
    </el-input>
    <div class="btns">
      <el-button class="btn1">立即支付</el-button>
      <el-button  class="btn2" type="primary">交易粉丝币</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      amount: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.suffix-text {
  color: @purpleDark;
}
.buy-card {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.token-title {
  font-size:24px;
  font-weight:bold;
  color:@black;
  line-height:33px;
  padding: 0;
  margin: 0;
}
.buy-flex {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 20px;
}
.center {
  line-height: 33px;
  height: 33px;
}
.btns {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-top: 20px;
  .btn1, .btn2 {
    flex: 1;
  }
}
</style>
<style lang="less">
.buy-card {
  .btn1 {
    border-color: @purpleDark;
    color: @purpleDark;
  }
}
</style>
