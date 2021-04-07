<template>
  <el-table
    :data="data"
    style="width: 100%"
    :size="$utils.clientWidth() >= 768 ? '' : 'mini'"
  >
    <el-table-column
      prop="name"
      :label="$t('name')"
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
      :label="$t('types-of')"
      :width="$utils.clientWidth() >= 768 ? '160' : '' "
    >
      <template slot-scope="scope">
        {{ formatType(scope.row.from_uid, scope.row.type) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="create_time"
      :label="$t('time')"
      :align="$utils.clientWidth() >= 768 ? 'left' : 'center'"
      :width="$utils.clientWidth() >= 768 ? '180' : '146' "
    >
      <template slot-scope="scope">
        {{ $utils.formatTime(scope.row.create_time) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      :label="$t('quantity')"
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
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['currentUserInfo']),
  },
  methods: {
    // 格式化 amount
    formatPrecision (amount) {
      return precision(amount, 'CNY', 4)
    },
    // 格式化类型
    formatType(from_uid, type) {
      if (type === 'direct_trade' && this.currentUserInfo.id === from_uid) {
        return '直通车转入'
      }
      let list = {
        'mint': this.$t('additional-issuance'),
        'transfer': this.$t('transferMoney'),
        'exchange_purchase': this.$t('exchange-purchase'),
        'exchange_addliquidity': this.$t('add-liquidity'),
        'exchange_removeliquidity': this.$t('delete-liquidity'),
        'reward_article': this.$t('reward-articles'),
        'pay_article': this.$t('payment-article'),
        'direct_trade': this.$t('through-train-transaction'),
        'crosschain_bsc_transfer_out': this.$t('crosschain_bsc_transfer_out'),
        'crosschain_bsc_deposit': this.$t('crosschain_bsc_deposit'),
        'crosschain_matic_transfer_out': this.$t('crosschain_matic_transfer_out'),
        'crosschain_matic_deposit': this.$t('crosschain_matic_deposit'),
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