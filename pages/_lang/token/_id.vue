<template>
  <layout v-model="tabPage">
    <tokenFanCoins v-if="tabPage === 0" />
    <tokenFanCoinsDetail v-if="tabPage === 1" />
    <tokenLiquidity v-if="tabPage === 2" />
    <tokenLiquidityDetail v-if="tabPage === 3" />
  </layout>
</template>

<script>
// import userPagination from '@/components/user/user_pagination.vue'
// import minetokenCard from '@/components/user/minetoken_card'
import layout from '@/components/token/token_layout.vue'
import tokenFanCoins from '@/components/token/token_fan_coins'
import tokenFanCoinsDetail from '@/components/token/token_fan_coins_detail'
import tokenLiquidity from '@/components/token/token_liquidity'
import tokenLiquidityDetail from '@/components/token/token_liquidity_detail'
export default {
  components: {
    layout,
    tokenFanCoins,
    tokenFanCoinsDetail,
    tokenLiquidity,
    tokenLiquidityDetail
  },
  data() {
    return {
      tabPage: 0
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
