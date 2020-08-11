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
      <div disabled class="aui-flex b-line" style="padding:15px 0">
        <div class="aui-flex-wx">
          <img :src="uniswapLogo" alt="uniswap">
        </div>
        <div class="aui-flex-box aui-flex-box-clear">
          <h4>交易所支付</h4>
          <p>价格：{{ uniswap.price }} (CNY)</p>
        </div>
        <div class="aui-payment-method">
          <el-radio v-model="radio" label="1" disabled="">
            &nbsp;
          </el-radio>
        </div>
      </div>
      <div class="aui-flex b-line" style="padding:15px 0" @click="radio = '2'">
        <div class="aui-flex-wx">
          <img :src="tradeLogo" alt="uniswap">
        </div>
        <div class="aui-flex-box aui-flex-box-clear">
          <h4>直通车支付</h4>
          <p>价格：{{ directTrade.price }} (CNY)</p>
        </div>
        <div class="aui-payment-method">
          <el-radio v-model="radio" label="2">
            &nbsp;
          </el-radio>
        </div>
      </div>
      <el-button type="primary" class="create-btn" @click="createOrder">
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
  },
  data() {
    return {
      isLogin: true,
      showModal: false,
      radio: '1',
      uniswap: {
        balance: 0,
        price: 0
      },
      directTrade: {
        balance: 0,
        price: 0
      }
    }
  },
  computed: {
    tradeLogo() {
      return this.$API.getImg('/avatar/trade.png')
    },
    uniswapLogo() {
      return this.$API.getImg('/avatar/exchange.png')
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    }
  },
  mounted() {
    this.getPoolSize(29)
  },
  methods: {
    async createOrder() {
      let params = {
        ...this.form,
      }
      if (this.radio === '2') params.type = 'direct_trade'
      this.$store.dispatch('order/createOrder', params)
    },
    async getPoolSize(tokenId) {
      const uniswapResult = await this.$API.getCurrentPoolSize(tokenId)
      // const price = await this.$API.getOutputAmount(tokenId, 0, 10000)
      let uniswapBalance = 0
      let uniswapPrice = 0
      if (uniswapResult.code === 0) {
        const { token_amount, cny_amount } = uniswapResult.data
        uniswapBalance = token_amount
        uniswapPrice = token_amount === 0 ? 0 : cny_amount / token_amount
        if (uniswapPrice < 1) uniswapPrice = 1
      }
      let directTradeBalance = 0
      let directTradePrice = 0
      const marketResult = await this.$API.directTrade.getItem(tokenId)
      if (marketResult.code === 0) {
        directTradeBalance = marketResult.data.balance
        directTradePrice = marketResult.data.price
      }
      this.uniswap.balance =  this.$utils.fromDecimal(uniswapBalance)
      this.uniswap.price =  this.$utils.fromDecimal(uniswapPrice)
      this.directTrade.balance =  this.$utils.fromDecimal(directTradeBalance)
      this.directTrade.price =  this.$utils.fromDecimal(directTradePrice)
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
  .aui-flex {
    display: flex;
    align-items: center;
    padding: 12px;
    position: relative;
    cursor: pointer;
    &[disabled] {
      cursor: not-allowed;
      filter: grayscale(100%);
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