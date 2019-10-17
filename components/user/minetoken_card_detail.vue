<template>
  <div class="card">
    <div class="card-info">
      <span class="card-type">{{ type }}</span>
      <h2 class="card-pricing" :style="{ color: `${color}` }">
        {{ amount }}
      </h2>
    </div>
    <div class="card-info">
      <span class="card-date">{{ time }}</span>
    </div>
    <div class="card-info">
      <span class="card-title">{{ card.title || '' }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import { isNDaysAgo } from '@/common/methods';
import { precision } from '@/utils/precisionConversion'

export default {
  name: 'AssetCard',
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
    amount() {
      const tokenamount = precision(this.card.amount, 'CNY', this.card.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    color() {
      return '#FB6877'
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
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.card {
  margin: 10px 0;
  box-sizing: border-box;
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  width: 100%;
  border-bottom: 1px solid #DBDBDB;
  &:nth-last-of-type(1) {
    border: none;
  }
  &-pricing {
    padding: 0;
    margin: 0;
    font-size:20px;
    font-weight:500;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-type {
    font-size:18px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &-title {
    font-size:16px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:22px;
    &-info {
      margin: 0 6px 0 0;
    }
    .copy-hash {
      width: 16px;
    }
  }
  &-date {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:22px;
  }
}

</style>
