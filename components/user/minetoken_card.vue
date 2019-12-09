<template>
  <el-table
    :data="card"
    :default-sort="{ prop: 'amount', order: 'descending' }"
    @sort-change="onSortChanged"
    style="width: 100%"
    class="coins"
  >
    <el-table-column
      :sort-orders="['ascending', 'descending']"
      prop="name"
      label="持仓者"
      sortable="custom"
    >
      <template slot-scope="scope">
        <n-link :to="{name: 'user-id', params: {id: scope.row.uid}}" class="invite-block avatar">
          <avatar :src="cover(scope.row.avatar)" size="30px" />
          <span class="username">{{ scope.row.nickname || scope.row.username }}</span>
        </n-link>
      </template>
    </el-table-column>
    <el-table-column
      :sort-orders="['descending', 'ascending']"
      prop="amount"
      label="持仓量"
      width="200"
      sortable="custom"
    >
      <template slot-scope="scope">
        <div class="invite-block">
          <span class="time">{{ tokenAmount(scope.row.amount) }} ({{ percentage(scope.row.amount, scope.row.total_supply) }})</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { precision, toPrecision } from '@/utils/precisionConversion'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar
  },
  props: {
    card: {
      type: Array,
      required: true
    },
    decimals: {
      type: Number,
      required: true
    }
  },
  methods: {
    tokenAmount(amount) {
      const tokenamount = precision(amount, 'CNY', this.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    percentage(amount, total) {
      if (total <= 0) {
        return '0%'
      }

      return (amount / total).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 })
    },
    cover(cover) {
      return cover ? this.$API.getImg(cover) : ''
    },
    onSortChanged(args) {
      this.$emit('sort-changed', args)
    }
  }
}
</script>

<style lang="less" scoped>

.invite-block.avatar{
  display: flex;
  align-items: center;
}
.username {
  margin-left: 10px;
  font-size: 16px;
  color:#333;
  flex: 1;
}
.time {
  font-size: 16px;
  color:#333;
}
.point {
  font-size: 16px;
  font-weight: bold;
  color:rgba(251,104,119,1);
}

</style>

<style lang="less">
.coins {
  .el-table th>.cell {
    font-size: 16px !important;
    font-weight: 400 !important;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: none;
  }
  .el-table::before {
    height: 0;
  }
}
</style>
