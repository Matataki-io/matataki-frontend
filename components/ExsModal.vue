<template>
  <el-dialog
    :visible.sync="showModal"
    :modal="true"
    :close-on-click-modal="false"
    width="380px"
    title="选择支付方式"
    custom-class="my-dialog br10 auth-dialog"
  >
    <section class="exs-main">
      <div
        :disabled="noUniswap"
        class="aui-flex b-line"
        style="padding:15px 0" 
        @click="radio = '1'"
      >
        <div class="aui-flex-wx">
          <img :src="uniswapLogo" alt="uniswap">
        </div>
        <div class="aui-flex-box aui-flex-box-clear">
          <h4>交易所支付</h4>
          <p v-if="noUniswap" class="warn-tip">暂无流动性</p>
          <p v-else>价格：{{ uniswap.price }} (CNY) </p>
        </div>
        <div class="aui-payment-method">
          <el-radio v-model="radio" label="1" :disabled="noUniswap">
            &nbsp;
          </el-radio>
        </div>
      </div>
      <div
        :disabled="noMarket" 
        class="aui-flex b-line"
        style="padding:15px 0"
        @click="radio = '2'"
      >
        <div class="aui-flex-wx">
          <img :src="tradeLogo" alt="uniswap">
        </div>
        <div class="aui-flex-box aui-flex-box-clear">
          <h4>直通车支付</h4>
          <p v-if="noMarket" class="warn-tip">暂无流动性</p>
          <p v-else>价格：{{ directTrade.price }} (CNY) </p>
        </div>
        <div class="aui-payment-method">
          <el-radio v-model="radio" label="2" :disabled="noMarket">
            &nbsp;
          </el-radio>
        </div>
      </div>
      <el-button
        type="primary"
        class="create-btn"
        :disabled="noUniswap&&noMarket"
        @click="createOrder"
      >
        创建订单
      </el-button>
    </section>
  </el-dialog>
</template>

<script>
// 交易所类型
export default {
  name: 'ExsModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({
        input: '',
        inputToken: {},
        output: '',
        outputToken: {},
        signId: ''
      })
    },
    amount: {
      type: [String, Number],
      default: 0
    },
    token: {
      type: Object,
      default: () => ({
        id: '',
      })
    },
  },
  data() {
    return {
      isLogin: true,
      showModal: false,
      radio: '3',
      uniswap: {
        balance: 0,
        price: 0
      },
      directTrade: {
        balance: 0,
        price: 0
      },
      noUniswap: true,
      noMarket: true,
      loading: true
    }
  },
  computed: {
    tradeLogo() {
      return this.$API.getImg('/avatar/trade.png')
    },
    uniswapLogo() {
      return this.$API.getImg('/avatar/exchange.png')
    },
    tokenId() {
      return this.token.id
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    },
    tokenId(val) {
      if (val) this.getExsInfo(this.tokenId)
    }
  },
  mounted() {
    // if (this.tokenId) this.getExsInfo(this.tokenId)
  },
  methods: {
    async createOrder() {
      let params = {
        output: this.amount,
        outputToken: this.token
      }
      if (this.radio === '2') params.type = 'direct_trade'
      this.$store.dispatch('order/createOrder', params)
    },
    async getExsInfo(tokenId) {
      this.loading = true
      const uniswapResult = await this.$API.getCurrentPoolSize(tokenId)
      // const price = await this.$API.getOutputAmount(tokenId, 0, 10000)
      let uniswapBalance = 0
      let uniswapPrice = 0
      if (uniswapResult.code === 0) {
        const { token_amount, cny_amount } = uniswapResult.data
        uniswapBalance = token_amount
        uniswapPrice = token_amount === 0 ? 0 : cny_amount / token_amount
        if (uniswapPrice < 1) uniswapPrice = 1
        this.noUniswap = false
      } else {
        this.noUniswap = true
      }
      if (uniswapBalance <= 0) this.noUniswap = true
      let directTradeBalance = 0
      let directTradePrice = 0
      const marketResult = await this.$API.directTrade.getItem(tokenId)
      if (marketResult.code === 0) {
        directTradeBalance = marketResult.data.balance
        directTradePrice = marketResult.data.price
        this.noMarket = false
      } else {
        this.noMarket = true
      }
      if (directTradeBalance <= 0) this.noMarket = true
      this.uniswap.balance =  this.$utils.fromDecimal(uniswapBalance)
      this.uniswap.price =  this.$utils.fromDecimal(uniswapPrice)
      this.directTrade.balance =  this.$utils.fromDecimal(directTradeBalance)
      this.directTrade.price =  this.$utils.fromDecimal(directTradePrice)
      this.loading = false
      if(this.noUniswap) {
        if (this.noMarket) {
          this.radio = '3'
        } else {
          this.radio = '2'
        }
      } else {
        this.radio = '1'
      }
    }
  }
}
</script>

<style lang="less" scoped>
// <420
@media screen and (max-width: 420px) {
  /deep/ .auth-dialog {
    width: 90% !important;
  }
}
.exs-main {
  padding: 20px 30px;
  width: 300px;
  position: relative;
  margin: auto;
  .warn-tip {
    color: #FB6877!important;
  }
  .aui-flex {
    display: flex;
    align-items: center;
    padding: 12px;
    position: relative;
    cursor: pointer;
    &[disabled] {
      cursor: not-allowed;
      img {
        filter: grayscale(100%);
      }
    }
  }
  .aui-flex-wx {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    img {
      width: 100%;
      height: auto;
      border: none;
      display: block;
    }
  }
  .aui-flex-box {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    color: #333;
    h4, p {
      margin: 0;
      padding: 0;
    }
    p {
      color: #999;
      font-size: 0.75rem;
    }
  }
  .b-line:after {
    content: '';
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #e2e2e2;
    transform: scaleY(0.5);
    transform-origin: 0 100%;
  }
  .create-btn {
    width: 100%;
    margin-top: 40px;
  }
}
</style>