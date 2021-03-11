<template>
  <div class="matic-in-n-out">
    <div v-if="isDepositSelected" class="deposit">
      <Deposit :selection.sync="selection" />
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
      <MyPermit v-if="selection === 'my'" :selection.sync="selection" />
      <Withdraw v-if="selection === 'apply'" :selection.sync="selection" />
      <MintWithPermit v-if="selection === 'upload'" :selection.sync="selection" />
    </div>
  </div>
</template>

<script>
import MyPermit from './matic/myPermit.vue'
import Withdraw from './matic/withdraw.vue'
import Deposit from './matic/deposit.vue'
import MintWithPermit from './matic/mintWithPermit.vue'
import wbAlertWarning from '@/components/withdraw/matic/alert_warning'

export default {
  name: 'MaticInAndOut',
  components: {
    MyPermit,
    MintWithPermit,
    Withdraw,
    Deposit,
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
