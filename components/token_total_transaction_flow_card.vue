<template>
  <el-table
    :data="data"
    style="width: 100%"
    :size="$utils.clientWidth() >= 768 ? '' : 'mini'"
  >
    <el-table-column
      prop="name"
      label="名称"
    >
      <template slot-scope="scope">
        <span class="card-name" :class="$utils.clientWidth() >= 768 ? '' : 'mini'">
          <!-- 如果没有名字 不显示 -->
          <router-link
            v-if="(scope.row.from_nickname || scope.row.from_username)"
            :to="{ name: 'user-id', params: { id: scope.row.from_uid } }"
            class="username"
            :class="!(scope.row.from_nickname || scope.row.from_username) && 'logout'"
            target="_blank"
          >
            {{ scope.row.from_nickname || scope.row.from_username }}
          </router-link>
          <!-- 如果没有 from 或者 to 不显示图标 -->
          <svg-icon 
            v-if="(scope.row.from_nickname || scope.row.from_username) && (scope.row.to_nickname || scope.row.to_username)"
            icon-class="transfer"
            class="icon"
          />
          <!-- 如果没有名字 不显示 -->
          <router-link
            v-if="(scope.row.to_nickname || scope.row.to_username)"
            :to="{ name: 'user-id', params: { id: scope.row.to_uid } }"
            class="username"
            :class="!(scope.row.to_nickname || scope.row.to_username) && 'logout'"
            target="_blank"
          >
            {{ scope.row.to_nickname || scope.row.to_username }}
          </router-link>
          <txHash v-if="scope.row.tx_hash" :hash="scope.row.tx_hash" class="hash" />
        </span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="$utils.clientWidth() >= 768"
      prop="type"
      label="类型"
      :width="$utils.clientWidth() >= 768 ? '160' : '' "
    >
      <template slot-scope="scope">
        {{ formatType(scope.row.type) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="时间"
      :align="$utils.clientWidth() >= 768 ? 'left' : 'center'"
      :width="$utils.clientWidth() >= 768 ? '180' : '146' "
    >
      <template slot-scope="scope">
        {{ $utils.formatTime(scope.row.create_time) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      label="数量"
      align="right"
    >
      <template slot-scope="scope">
        {{ formatPrecision(scope.row.amount) }}
        {{ scope.row.symbol }}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import txHash from '@/components/tx_hash_popover/index'
import { precision } from '@/utils/precisionConversion'
export default {
  components: {
    txHash
  },
  props: {
    data: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
  
    }
  },
  methods: {
    // 格式化 amount
    formatPrecision (amount) {
      return precision(amount, 'CNY', 4)
    },
    // 格式化类型
    formatType(type) {
      let list = {
        'mint': '增发',
        'transfer': '转账',
        'exchange_purchase': '交易所购买',
        'exchange_addliquidity': '添加流动金',
        'exchange_removeliquidity': '删除流动金',
        'reward_article': '打赏文章',
        'pay_article': '支付文章',
      }

      return list[type] || '其他'
    }
  }
}
</script>
<style lang="less" scoped>

.card-name {
  color: #606266;
  display: flex;
  align-items: center;
  .icon {
    margin: 0 4px;
  }
  a {
    color: inherit;
    line-height: 1.2;
  }
  &.logout {
    color: #b2b2b2;
  }
  .hash {
    margin-left: 4px;
  }

  &.mini {
    flex-direction: column;
    .icon {
      transform: rotate(90deg);
    }
  }
}
.card-type,
.card-time {
  font-size:16px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:22px;
  display: inline-block;
  width: 160px;
}
.card-amount {
  color: #606266;
}
.card-symbol {
  color: #606266;
}
</style>