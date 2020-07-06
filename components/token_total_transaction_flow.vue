<template>
  <div class="total-flow">
    <div>
      <span class="head-title" :class="headTitle === 0 && 'active'">全部</span>
      <span class="head-title" :class="headTitle === 1 && 'active'">转账</span>
      <span class="head-title" :class="headTitle === 2 && 'active'">交易</span>
      <span class="head-title" :class="headTitle === 3 && 'active'">添加</span>
      <span class="head-title" :class="headTitle === 4 && 'active'">删除</span>
    </div>

    <tableCard class="table-card" :data="totalFlow" />
  </div>
</template>

<script>
import tableCard from './token_total_transaction_flow_card'
export default {
  components: {
    tableCard
  },
  data() {
    return {
      headTitle: 0,
      totalFlow: [{
        name: '我的币',
        action: '交易',
        time: '2020-20-20 20:20:20',
        amount: 123,
        symbol: 'XTB'
      },
      {
        name: '我的币',
        action: '交易',
        time: '2020-20-20 20:20:20',
        amount: 123,
        symbol: 'XTB'
      },{
        name: '我的币',
        action: '交易',
        time: '2020-20-20 20:20:20',
        amount: 123,
        symbol: 'XTB'
      },
      {
        name: '我的币',
        action: '交易',
        time: '2020-20-20 20:20:20',
        amount: 123,
        symbol: 'XTB'
      },{
        name: '我的币',
        action: '交易',
        time: '2020-20-20 20:20:20',
        amount: 123,
        symbol: 'XTB'
      }]
    }
  }
}
</script>

<style lang="less" scoped>
.head-title {
  font-size:16px;
  font-weight:500;
  color:rgba(178,178,178,1);
  line-height:22px;
  padding: 0;
  margin: 0 20px 0 0;
  cursor: pointer;
  &:nth-last-of-type(1) {
    margin-right: 0;
  }
  &.active {
    color: #000;
  }
}

.table-card {
  margin-top: 20px;
}
</style>