<template>
  <el-dialog
    :visible.sync="showModal"
    :modal="true"
    :close-on-click-modal="false"
    width="380px"
    title="选择支付方式"
    custom-class="my-dialog br10 auth-dialog"
  >
    <div class="token-title">
      还需购买 <span>{{ amount }} {{ token.symbol }}</span> <span v-if="isPriceArticle">并支付</span>
    </div>
    <section 
      v-loading="loading"
      class="exs-main"
    > 
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
          <p v-if="noUniswap" class="warn-tip">
            流动性不足，剩余 {{ uniswap.balance }} {{ token.symbol }}
          </p>
          <!-- <p v-else-if="noUniswap" class="warn-tip">暂无流动性</p> -->
          <!-- 价格：¥{{ uniswap.price }}， -->
          <p v-else>需支付：¥{{ uniswapNeedPay }}</p>
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
          <p v-if="noMarket" class="warn-tip">
            流动性不足，剩余 {{ directTrade.balance }} {{ token.symbol }}
          </p>
          <!-- <p v-else-if="noMarket" class="warn-tip">暂无流动性</p> -->
          <!-- 价格：¥{{ directTrade.price }}， -->
          <p v-else>需支付：¥{{ directTradeNeedPay }}</p>
        </div>
        <div class="aui-payment-method">
          <el-radio v-model="radio" label="2" :disabled="noMarket">
            &nbsp;
          </el-radio>
        </div>
      </div>
      <el-button
        v-if="noUniswap&&noMarket"
        type="warning"
        class="create-btn"
        :loading="btnLoading"
        :disabled="noticeDisabled"
        @click="notice"
      >
        {{ noticeDisabled ? '流动性不足，已经提醒作者' : '流动性不足，点击提醒作者' }}
      </el-button>
      <el-button
        v-else
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
    article: {
      type: Object,
      required: true
    },
    needPrice: {
      type: Boolean,
      default: false
    },
    needToken: {
      type: Boolean,
      default: false
    }
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
      loading: true,
      noticeDisabled: false,
      btnLoading: false,
      uniswapNeedPay: 0
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
    },
    // uniswap流动性不足
    uniswapInsufficientLiquidity() {
      if (this.uniswap.balance < parseFloat(this.amount)) {
        return true
      }
      return false
    },
    // 直通车流动性不足
    directTradeInsufficientLiquidity() {
      if (this.directTrade.balance < parseFloat(this.amount)) {
        return true
      }
      return false
    },
    directTradeNeedPay() {
      return parseFloat(this.amount) * parseFloat(this.directTrade.price)
    },
    // 是否是付费文章
    isPriceArticle() {
      return (this.article.prices && this.article.prices.length !== 0)
    },
    // 是否是持通证文章
    isTokenArticle() {
      return (this.article.tokens && this.article.tokens.length !== 0)
    },
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
    async notice() {
      const tokenId = this.token.id
      const postId = this.article.id
      if (tokenId && postId) {
        this.btnLoading = true
        await this.$API.insufficientLiquidity({ postId, tokenId })
        this.noticeDisabled = true
        this.btnLoading = false
        this.$message({
          showClose: true,
          message: '通知成功~',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: '数据出错，刷新后重试',
          type: 'error'
        })
      }
    },
    async createOrder() {
      let params = {
        output: this.amount,
        outputToken: this.token,
        needPrice: this.needPrice,
        needToken: this.needToken,
      }
      if (this.radio === '2') params.type = 'direct_trade'
      this.$store.dispatch('order/createOrder', params)
    },
    async getExsInfo(tokenId) {
      this.loading = true
      const uniswapResult = await this.$API.getCurrentPoolSize(tokenId)
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
      this.uniswap.balance = this.$utils.fromDecimal(uniswapBalance)
      if (this.uniswap.balance <= parseFloat(this.amount)) this.noUniswap = true
      this.uniswap.price = this.$utils.fromDecimal(uniswapPrice)
      this.directTrade.balance = this.$utils.fromDecimal(directTradeBalance)
      this.directTrade.price = this.$utils.fromDecimal(directTradePrice)
      if (this.directTrade.balance <= parseFloat(this.amount)) this.noMarket = true
      if(!this.noUniswap) {
        const uniswapAmountResult = await this.$API.getInputAmount(0, this.token.id, this.amount)
        if (uniswapAmountResult.code === 0) {
          this.uniswapNeedPay = this.$utils.fromDecimal(uniswapAmountResult.data)
        }
      }
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
.token-title {
  margin: 0;
  padding: 20px 20px 0;
  span {
    font-weight: bolder;
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