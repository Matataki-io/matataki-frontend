<template>
  <el-table :data="list" height="320" style="width: 100%" header-cell-class-name="trade-log-header" cell-class-name="trade-log-row">
    <el-table-column label="方向" width="50">
      <template slot-scope="scope">
        <span :class="direction(scope.row.liquidity)">{{ scope.row.liquidity >= 0 ? '添加' : '删除' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cny_amount" label="CNY">
      <template slot-scope="scope">
        <span :class="direction(scope.row.liquidity)">
          {{ scope.row.cny_amount }}
        </span>
      </template>
    </el-table-column>
    <el-table-column :label="symbol" prop="token_amount">
      <template slot-scope="scope">
        <span :class="direction(scope.row.liquidity)">
          {{ scope.row.token_amount }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="liquidity" label="流动金Token" />
    <el-table-column prop="create_time" label="时间" />
  </el-table>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    symbol: {
      type: String,
      default: '[Token Symbol]'
    }
  },
  data() {
    return {
      purchaseLogs: [],
      myPurchaseLogs: []
    }
  },
  methods: {
    direction(liquidity) {
      if (liquidity >= 0) return 'buy'
      else return 'sell'
    }
  }
}
</script>
<style lang="less" scoped>
.sell {
  color: #FB6877;
}
.buy {
  color: #44D7B6;
}
</style>
