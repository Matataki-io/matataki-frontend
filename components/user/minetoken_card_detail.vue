<template>
  <div class="card">
    <div class="fl jsb">
      <div class="from-to">
        <router-link :to="{ name: 'user-id', params: { id: card.from_uid } }" class="username">
          {{ card.from_nickname || card.from_username }}
        </router-link>
        <svg-icon icon-class="transfer" class="info-icon" />
        <router-link :to="{ name: 'user-id', params: { id: card.to_uid } }" class="username">
          {{ card.to_nickname || card.to_username }}
        </router-link>
        <txHash v-if="card.tx_hash" :hash="card.tx_hash" />
      </div>
      <span class="amount">{{ amount }}</span>
    </div>
    <div class="fl jsb">
      <span class="time">{{ time }}</span>
      <!-- <span class="type">{{ type }}</span> -->
      <span class="symbol">{{ card.symbol }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import { isNDaysAgo } from '@/common/methods';
import { precision } from '@/utils/precisionConversion'
import txHash from '@/components/tx_hash_popover/index'

export default {
  name: 'AssetCard',
  components: {
    txHash
  },
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
      return '#d74e5a'
    },
    type() {
      const { type } = this.card
      const typeList = {
        mint: '增发',
        transfer: '赠送',
        exchange_purchase: '交易 ',
        exchange_addliquidity: '添加流动性',
        exchange_removeliquidity: '删除流动性'
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
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  width: 100%;
  border-bottom: 1px solid #DBDBDB;
  & > div {
    margin: 4px 0;
  }
}
.card-info {
  flex: 1;
  flex-direction: column;
  margin-left: 10px;
}
.info-icon {
  color: #000;
  margin: 0 6px;
}
.username {
  font-size:20px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:28px;
}
.type {
  font-size: 12px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 17px;
  margin: 2px 0;
}
.amount {
  font-size:20px;
  font-weight:500;
  color:rgba(0,0,0,1);
  line-height:28px;
}
.time {
  font-size:16px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:22px;
}
.symbol {
  font-size:16px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:22px;
}
</style>
