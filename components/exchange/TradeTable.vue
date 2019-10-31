<template>
  <el-table height="200" :data="list" style="width: 100%" header-cell-class-name="trade-log-header" cell-class-name="trade-log-row">
    <el-table-column label="方向" width="50">
      <template slot-scope="scope">
        <span :class="scope.row.direction">{{ scope.row.direction === 'buy' ? '买' : '卖' }}</span>
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
    <el-table-column prop="token_amount" :label="'数量'+symbol"></el-table-column>
    <el-table-column prop="create_time" label="时间"></el-table-column>
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
  color: #FB6877;
}
.buy {
  color: #44D7B6;
}
</style>
<style lang="less">
@t-h: 30px;
.trade {
  .el-tabs {
    width: 100%;
  }
  .el-tabs__item {
    font-size: 14px !important;
    height: @t-h!important;
  }
  .el-tabs__content {
    background: #ffffff !important;
    padding: 0 10px;
  }
  .el-tabs--border-card > .el-tabs__header {
    background: #ffffff !important;
  }
  .el-tabs__header {
    .el-tabs__nav-scroll {
      margin-bottom: 0;
    }
    .el-tabs__nav {
      width: 220px;
      height: @t-h;
    }
  }
  .el-table::before {
    height: 0;
  }
}
.trade-log-header {
  color: #542DE0;
  font-weight: 400;
  border-bottom: 0!important;
}
.trade-log-row {
  border-bottom: 0!important;
  padding: 2px 0!important;
}
</style>
