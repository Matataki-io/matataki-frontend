<template>
  <div class="card">
    <div class="fl jsb">
      <span class="type">{{ type }}</span>
      <span class="amount">{{ amount }}</span>
    </div>
    <div class="fl jsb">
      <span class="time">{{ time }}</span>
      <span class="symbol">{{ card.symbol }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    time() {
      return moment(this.card.create_time).format('MMMDo HH:mm')
    },
    assetAmount() {
      return this.card.amount
    },
    color() {
      return '#FB6877'
    },
    amount() {
      const tokenamount = precision(this.card.amount, 'CNY', this.card.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    type() {
      const { type } = this.card
      const typeList = {
        mint: '增发',
        transfer: '赠送',
        exchange_purchase: '交易所内购买',
        exchange_addliquidity: '交易所添加流动性',
        exchange_removeliquidity: '交易所删除流动性'
      }
      return typeList[type] || '其他'
    }
  },
  created() {
    // console.log('card', this.card)
  },
  methods: {}
}
</script>

<style scoped lang="less">
.card {
  padding: 14px 20px;
  border-bottom: 1px solid #DBDBDB;
  &:nth-last-child(1) {
    border-bottom: none;
  }
  &>div {
    margin: 6px 0;
  }
  .time {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:22px;
  }
  .amount {
    font-size:20px;
    font-weight:500;
    color:rgba(251,104,119,1);
    line-height:28px;
  }
  .type {
    font-size:20px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  .symbol {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:22px;
  }
}
</style>
