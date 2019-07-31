<template>
  <div class="withdraw">
    <div class="line" />
    <div class="total">
      <div class="total-left">
        <span class="total-title">待提现</span>
        <span class="total-money">{{ playerincome }}</span>
      </div>
      <div>
        <button @click="$emit('toggleWithdraw', 1)">
          提现
        </button>
      </div>
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
        <span class="total-list-title">创作收益</span>
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
        <span class="total-list-title">创作收益</span>
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
      default: 'EOS'
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
  background-color: #DBDBDB;
}
.withdraw {}
.total {
  .flexCenter();
  &-left {
    display: flex;
    flex-direction: column;
    padding: 40px 0;
  }
  &-title {
    font-size:20px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-money {
    font-size:36px;
    color:rgba(0,0,0,1);
    line-height:56px;
  }
  button {
    width:90px;
    height:40px;
    background:rgba(0,0,0,1);
    border-radius: @borderRadius6;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
  }
}

.total-list {
  .flexCenter();
  padding: 40px 0;
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
      top: 16px;
      display: block;
      width: 1px;
      height: 30px;
      background-color: #979797;
    }
  }
  &-money {
    font-size: 40px;
    color: rgba(251,104,119,1);
    line-height: 56px;
  }
  &-title {
    font-size:18px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
}
</style>
