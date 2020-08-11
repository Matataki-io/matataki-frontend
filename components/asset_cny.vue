<template>
  <div>
    <div class="assets">
      <span>余额 ¥</span>
    </div>
    <div class="total">
      <span>{{ playerincome }}</span>
      <el-button v-if="isShowTransfer" size="small" @click="giftDialogShow = true">
        转账
      </el-button>
    </div>
    <div class="line" />
    <giftDialog v-model="giftDialogShow" :balance="playerincome" />
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
.total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  span {
    font-size:24px;
    font-weight:500;
    color:rgba(0,0,0,1);
    line-height:33px;
  }
}

.assets {
  margin-bottom: 20px;
  span {
    font-weight: bold;
    font-size: 20px;
    padding: 0;
    margin: 0;
  }
}
</style>
