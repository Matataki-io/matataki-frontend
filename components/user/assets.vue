<template>
  <div class="withdraw">
    <div class="line" />
    <div class="total">
      <div class="total-left">
        <span class="total-title">
          {{ $t('withdraw.pendingCash') }}
        </span>
        <span class="total-money">{{ playerincome }}</span>
      </div>
      <div style="text-align: right;">
        <el-button
          :disabled="isWithdrawDisabled"
          size="small"
          class="btn"
          @click="$emit('toggleWithdraw', 1)"
        >
          {{ $t('withdraw.title') }}
        </el-button>
        <el-button
          v-if="isShowTransfer"
          size="small"
          @click="giftDialogShow = true"
        >
          {{ $t('transferMoney') }}
        </el-button>
        <p
          v-if="isWithdrawDisabled"
          class="mark-text"
        >
          {{ $t('the-withdrawal-function-is-not-yet-open') }}
        </p>
      </div>
    </div>
    <div class="line" />
    <div class="total-list">
      <div class="total-list-block">
        <span class="total-list-title">
          {{ $t('withdraw.createIncome') }}
        </span>
        <span
          :style="
            totalSignIncome > 0
              ? { color: '#41b37d' }
              : totalSignIncome < 0
                ? { color: '#d74e5a' }
                : { color: '#000000' }
          "
          class="total-list-money"
        >{{ totalSignIncome }}</span>
      </div>
    </div>
    <div class="line" />
    <giftDialog
      v-model="giftDialogShow"
      :balance="playerincome"
    />
  </div>
</template>

<script>
import { precision } from '@/utils/precisionConversion'
import giftDialog from '@/components/asset/giftDialog.vue'

export default {
  components: {
    giftDialog
  },
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
  data() {
    return {
      giftDialogShow: false
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
    },
    /**
     * 故意设置为大小写不敏感，请根据实际情况修改 `tokenThatUnableToWithdraw`
     * 目前屏蔽 CNY 和 ETH 的提现 -- Frank, Nov.15th 2019
     */
    isWithdrawDisabled() {
      const toLowerCase = (str) => str.toLowerCase()
      const tokenThatUnableToWithdraw = ['CNY', 'eth'].map(toLowerCase)
      return tokenThatUnableToWithdraw.includes(toLowerCase(this.type))
    },
    isShowTransfer() {
      const toLowerCase = (str) => str.toLowerCase()
      const tokenThatUnableToWithdraw = ['CNY'].map(toLowerCase)
      return tokenThatUnableToWithdraw.includes(toLowerCase(this.type))
    }
  }
}
</script>

<style lang="less" scoped>
.line {
  width: 100%;
  height: 1px;
  background-color: #ececec;
}
.withdraw {
  padding: 0 10px;
}
.total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &-left {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
  }
  &-title {
    font-size: 16px;
    color: #333;
    line-height: 1;
  }
  &-money {
    font-size: 24px;
    color: rgba(0, 0, 0, 1);
    margin-top: 20px;
  }
  .btn:not([disabled]) {
    background: #000;
    border-color: #000;
    color: #fff;
  }
  .mark-text {
    color: #b2b2b2;
    font-size: 12px;
    margin: 12px 5px 0px;
  }
}

.total-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  &-block {
    display: flex;
    flex-direction: column;
    position: relative;
    flex: 1;
    &:nth-child(n + 2)::before {
      content: "";
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
    font-size: 24px;
    color: rgba(251, 104, 119, 1);
    margin-top: 20px;
  }
  &-title {
    font-size: 16px;
    color: #333;
  }
}
</style>
