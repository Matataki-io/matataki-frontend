<template>
  <el-table :data="list" height="320" style="width: 100%" header-cell-class-name="trade-log-header" cell-class-name="trade-log-row">
    <el-table-column label="方向" width="60">
      <template slot-scope="scope">
        <span :class="scope.row.direction">{{ scope.row.direction === 'buy' ? '买' : '卖' }}</span>
        <txHash v-if="scope.row.tx_hash" :hash="scope.row.tx_hash" size="14px" />
      </template>
    </el-table-column>
    <el-table-column prop="price" label="价格/CNY">
      <template slot-scope="scope">
        <span :class="scope.row.direction">
          {{ scope.row.price }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="cny_amount" label="金额/CNY">
      <template slot-scope="scope">
        <span :class="scope.row.direction">
          {{ scope.row.cny_amount }}
        </span>
      </template>
    </el-table-column>
    <el-table-column :label="'数量'+symbol" prop="token_amount" />
    <el-table-column prop="create_time" label="时间" />
  </el-table>
</template>

<script>
import txHash from '@/components/tx_hash_popover/index'

export default {
  components: {
    txHash
  },
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    symbol: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      purchaseLogs: [],
      myPurchaseLogs: []
    }
  }
}
</script>
<style lang="less" scoped>
.sell {
  color: @red;
}
.buy {
  color: @green;
}
</style>
