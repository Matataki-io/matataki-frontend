<template>
  <div class="detail">
    <mineTokensNav v-model="tabPage" />
    <div class="line" />
    <tokenFanCoins v-if="tabPage === 0" />
    <tokenFanCoinsDetail v-if="tabPage === 1" />
    <tokenLiquidity v-if="tabPage === 2" />
    <tokenLiquidityDetail
      v-if="tabPage === 3"
      :token="minetokenToken"
    />
  </div>
</template>
<script>
import mineTokensNav from './minetokens_nav'
import tokenFanCoins from './token_fan_coins'
import tokenFanCoinsDetail from './token_fan_coins_detail'
import tokenLiquidity from './token_liquidity'
import tokenLiquidityDetail from './token_liquidity_detail'

export default {
  components: {
    mineTokensNav,
    tokenFanCoins,
    tokenFanCoinsDetail,
    tokenLiquidity,
    tokenLiquidityDetail
  },
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      tabPage: Number(this.$route.query.tab) || 0
    }
  },
  // computed: {},
  watch: {
    tabPage(val) {
      this.$router.replace({
        query: {
          tab: this.tabPage
        }
      })
      this.$route.query.page = 1 // This is a hack. It wasted me a lot of time!!!
      this.$emit('input', val)
    }
  },
  // created() {},
  // mounted() {},
  // methods: {}
}
</script>
<style lang="less" scoped>
.detail {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 20px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.line {
  height: 1px;
  background: #dbdbdb;
  margin: 20px 0;
}
</style>
