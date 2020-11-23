<template>
  <div class="bsc-in-n-out">
    <div v-if="isDepositSelected" class="deposit">
      To be continuted...
      敬请期待
    </div>
    <div v-if="isWithdrawSelected" class="withdraw">
      <el-radio v-model="selection" label="apply">
        申请提现许可
      </el-radio>
      <el-radio v-model="selection" label="my">
        查看我的提现许可
      </el-radio>
      <el-radio v-model="selection" label="upload">
        替别人提现许可
      </el-radio>
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
import MintWithPermit from './bsc/mintWithPermit.vue'
import wbAlertWarning from '@/components/withdraw_bsc/alert_warning'

export default {
  name: 'BscInAndOut',
  components: {
    MyBscPermit,
    MintWithPermit,
    BscWithdraw,
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