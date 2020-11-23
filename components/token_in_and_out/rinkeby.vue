<template>
  <div class="rinkeby-in-n-out">
    RinkebySelected
    <div v-if="isDepositSelected" class="deposit">
      isDepositSelected
    </div>
    <div v-else class="withdraw">
      isWithdrawSelected
    </div>
  </div>
</template>

<script>
export default {
  name: 'RinkebyInAndOut',
  props: {
    direction: {
      type: String,
      required: true
    }
  },
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