<template>
  <div class="detail">
    <datasheetsNav v-model="tabPage" />
    <div class="line" />
    <fanCoins v-if="tabPage === 0" />
    <fanCoinsDetail v-if="tabPage === 1" />
    <liquidity v-if="tabPage === 2" />
    <liquidityDetail
      v-if="tabPage === 3"
      :token="minetokenToken"
    />
  </div>
</template>
<script>
import datasheetsNav from './tokens_datasheets_nav'
import fanCoins from './token_fan_coins'
import fanCoinsDetail from './token_fan_coins_detail'
import liquidity from './token_liquidity'
import liquidityDetail from './token_liquidity_detail'

export default {
  components: {
    datasheetsNav,
    fanCoins,
    fanCoinsDetail,
    liquidity,
    liquidityDetail
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
