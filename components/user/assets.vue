<template>
  <div class="withdraw">
    <div class="line" />
    <div class="total">
      <div class="total-left">
        <span class="total-title">待提现</span>
        <span class="total-money">{{ playerincome }}</span>
      </div>
      <el-button class="btn" :disabled="type === 'CNY'" @click="$emit('toggleWithdraw', 1)">
        提现
      </el-button>
    </div>
    <div class="line" />
    <div class="total-list">
      <div class="total-list-block">
        <span
          class="total-list-money"
          :style="
            totalSignIncome > 0
              ? { color: '#FB6877' }
              : totalSignIncome < 0
                ? { color: '#44D7B6' }
                : { color: '#000000' }
          "
        >{{ totalSignIncome }}</span>
        <span class="total-list-title">创作收益</span>
      </div>
      <div class="total-list-block">
        <span
          class="total-list-money"
          :style="
            totalShareIncome > 0
              ? { color: '#FB6877' }
              : totalShareIncome < 0
                ? { color: '#44D7B6' }
                : { color: '#000000' }
          "
        >{{ totalShareIncome }}</span>
        <span class="total-list-title">投资收益</span>
      </div>
      <div class="total-list-block">
        <span
          class="total-list-money"
          :style="
            totalShareExpenses > 0
              ? { color: '#FB6877' }
              : totalShareExpenses < 0
                ? { color: '#44D7B6' }
                : { color: '#000000' }
          "
        >{{ totalShareExpenses }}</span>
        <span class="total-list-title">投资支出</span>
      </div>
    </div>
    <div class="line" />
  </div>
</template>

<script>
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    assets: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    // 余额
    playerincome() {
      return precision(this.assets.balance, this.type) || 0
    },
    totalSignIncome() {
      const price = precision(this.assets.totalSignIncome, this.type) || 0
      const str = price > 0 ? '+' : ''
      return str + price
    },
    totalShareIncome() {
      const price = precision(this.assets.totalShareIncome, this.type) || 0
      const str = price > 0 ? '+' : ''
      return str + price
    },
    totalShareExpenses() {
      const price = precision(this.assets.totalShareExpenses, this.type) || 0
      const str = price > 0 ? '+' : ''
      return str + price
    }

  }
}
</script>

<style lang="less" scoped>
.flexCenter{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.line {
  width: 100%;
  height: 1px;
  background-color: #ececec;
}
.withdraw {
  padding: 0 10px;
}
.total {
  .flexCenter();
  &-left {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
  }
  &-title {
    font-size: 18px;
    color: #333;
    line-height: 1;
  }
  &-money {
    font-size:40px;
    color:rgba(0,0,0,1);
    margin-top: 10px;
  }
  .btn:not([disabled]) {
    background: #000;
    border-color: #000;
    color: #fff;
  }
}

.total-list {
  .flexCenter();
  padding: 20px 0;
  &-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    &:nth-child(n+2)::before{
      content: '';
      position: absolute;
      left: 0;
      top: 20px;
      display: block;
      width: 1px;
      height: 30px;
      background-color: #ececec;
    }
  }
  &-money {
    font-size: 30px;
    color: rgba(251,104,119,1);
    margin: 4px 0;
  }
  &-title {
    font-size: 14px;
    color:#333;
  }
}
</style>
