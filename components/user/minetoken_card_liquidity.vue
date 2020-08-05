<template>
  <el-table
    :data="card"
    :default-sort="{ prop: 'amount', order: 'descending' }"
    style="width: 100%"
    class="coins"
    @sort-change="onSortChanged"
  >
    <el-table-column
      :sort-orders="['ascending', 'descending']"
      prop="name"
      :label="$t('token.positionHolder')"
      sortable="custom"
    >
      <template slot-scope="scope">
        <n-link :to="{name: 'user-id', params: {id: scope.row.uid}}" class="invite-block avatar" target="_blank">
          <c-user-popover :user-id="Number(scope.row.uid)">
            <c-avatar
              :src="cover(scope.row.avatar)"
              :recommend-author="scope.row.user_is_recommend === 1"
              :token-user="scope.row.user_is_token === 1"
            />
          </c-user-popover>
          <span class="username">{{ scope.row.nickname || scope.row.username }}</span>
        </n-link>
      </template>
    </el-table-column>
    <el-table-column
      :sort-orders="['descending', 'ascending']"
      prop="amount"
      :label="$t('token.openInterest')"
      width="200"
      sortable="custom"
    >
      <template slot-scope="scope">
        <div class="invite-block">
          <span class="time">{{ tokenAmount(scope.row.liquidity_balance) }} ({{ percentage(scope.row.liquidity_balance, scope.row.total_supply) }})</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { precision } from '@/utils/precisionConversion'

export default {
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
      return cover ? this.$ossProcess(cover, { h: 60 }) : ''
    },
    onSortChanged(args) {
      this.$emit('sort-changed', args)
    }
  }
}
</script>

<style lang="less" scoped>
.invite-block.avatar {
  display: flex;
  align-items: center;
  padding: 2px 0;
}
.username {
  margin-left: 10px;
  font-size: 16px;
  color: #333;
  flex: 1;
}
.time {
  font-size: 16px;
  color: #333;
}
.point {
  font-size: 16px;
  font-weight: bold;
  color: rgba(251, 104, 119, 1);
}

// <600
@media screen and (max-width: 600px) {
  .invite-block.avatar {
    /deep/ .g-avatar {
      display: none;
    }
    .username {
      margin-left: 0;
    }
  }
}
</style>

<style lang="less">
.coins {
  .el-table th > .cell {
    font-size: 16px !important;
    font-weight: 400 !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: none;
  }
  .el-table::before {
    height: 0;
  }
}
</style>
