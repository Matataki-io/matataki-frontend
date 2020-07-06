<template>
  <el-table
    :data="data"
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      label="名称"
    >
      <template slot-scope="scope">
        <span class="card-name">
          {{ scope.row.name }}
          <txHash />
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="action"
      label="类型"
      width="160"
    />
    <el-table-column
      prop="time"
      label="时间"
      width="180"
    />
    <el-table-column
      prop="amount"
      label="数量"
      align="right"
    >
      <template slot-scope="scope">
        <span class="card-amount">
          {{ scope.row.amount }}
          <span class="card-symbol">{{ scope.row.symbol }}</span>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import txHash from '@/components/tx_hash_popover/index'

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
  }
}
</script>
<style lang="less" scoped>

.card-name {
  font-size:16px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:22px;
  width: 270px;
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
  font-size:16px;
  font-weight:500;
  color:rgba(178,178,178,1);
  line-height:22px;
  flex: 1;
  
}
.card-symbol {
  font-size:14px;
  font-weight:500;
  color:rgba(178,178,178,1);
  line-height:20px;
}
</style>