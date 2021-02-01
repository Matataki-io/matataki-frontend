<template>
  <div class="bsc-in-n-out">
    <div v-if="isDepositSelected" class="deposit">
      <BscDeposit :selection.sync="selection" />
    </div>
    <div v-if="isWithdrawSelected" class="withdraw">
      <div class="withdraw-switch">
        <el-radio v-model="selection" label="apply">
          {{ $t('apply-for-withdrawal-permission') }}
        </el-radio>
        <el-radio v-model="selection" label="my">
          {{ $t('check-my-withdrawal-permission') }}
        </el-radio>
        <el-radio v-model="selection" label="upload">
          {{ $t('withdraw-permission-for-others') }}
        </el-radio>
      </div>
      <wbAlertWarning />
      <MyBscPermit v-if="selection === 'my'" :selection.sync="selection" />
      <BscWithdraw v-if="selection === 'apply'" :selection.sync="selection" />
      <MintWithPermit v-if="selection === 'upload'" :selection.sync="selection" />
    </div>
  </div>
</template>

<script>
import MyBscPermit from './bsc/myPermit.vue'
import BscWithdraw from './bsc/withdraw.vue'
import BscDeposit from './bsc/deposit.vue'
import MintWithPermit from './bsc/mintWithPermit.vue'
import wbAlertWarning from '@/components/withdraw_bsc/alert_warning'

export default {
  name: 'BscInAndOut',
  components: {
    MyBscPermit,
    MintWithPermit,
    BscWithdraw,
    BscDeposit,
    wbAlertWarning,
  },
  props: {
    direction: {
      type: String,
      required: true
    }
  },
  data: () => ({
    selection: 'apply'
  }),
  computed: {
    isWithdrawSelected() {
      return this.direction === 'withdraw'
    },
    isDepositSelected() {
      return this.direction === 'deposit'
    },
  },
}
</script>
<style lang="less" scoped>
.withdraw-switch {
  margin: 10px 0;
}
</style>