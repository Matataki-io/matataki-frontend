<template>
  <el-table
    :data="data"
    style="width: 100%"
    :size="$utils.clientWidth() >= 768 ? '' : 'mini'"
  >
    <el-table-column
      v-if="$utils.clientWidth() >= 768"
      :label="$t('types-of')"
    >
      <template slot-scope="scope">
        {{ formatType(scope.row.liquidity) }}
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('time')"
      :width="$utils.clientWidth() >= 768 ? '' : '146' "
    >
      <template slot-scope="scope">
        {{ $utils.formatTime(scope.row.create_time) }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('amount')">
      <template slot-scope="scope">
        {{ formatPrecision(scope.row.cny_amount) }}
        {{ $t('mttk-points') }}
      </template>
    </el-table-column>
    <el-table-column
      v-if="$utils.clientWidth() >= 768"
      :label="$t('fan-ticket')"
    >
      <template slot-scope="scope">
        {{ formatPrecision(scope.row.token_amount) }}
        {{ scope.row.symbol }}
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('liquid-gold-token')"
      align="right"
    >
      <template slot-scope="scope">
        {{ formatPrecision(scope.row.liquidity) }}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { precision } from '@/utils/precisionConversion'
export default {
  components: {
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
    formatType(val) {
      if (val > 0) {
        return this.$t('add-to')
      } else if (val < 0) {
        return this.$t('delete')
      } else {
        return this.$t('other')
      }
    },
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
