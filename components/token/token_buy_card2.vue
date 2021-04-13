<template>
  <div class="container-padding">
    <div class="container-outer">
      <h2 class="card-title">
        {{ $t('token.quickPurchase') }}
      </h2>
      <div class="container-inner">
        <div class="buy-card">
          <!-- <h2 class="token-title">
            {{ $t('token.quickPurchase') }}
          </h2> -->
          <div class="buy-flex">
            <div>
              <span 
                :class="[ 'token-title', { 'active': isUniswap } ]"
                @click="tabChange('uniswap')"
              >{{ $t('uniswap-exchange') }}</span>
              <span 
                :class="[ 'token-title', { 'active': isDirectTrade } ]"
                @click="tabChange('direct')"
              >{{ $t('through-train') }}</span>
            </div>
            <router-link class="center" :to="{name: 'exchange', hash: '#swap', query: { output: token.symbol }}">
              Uniswap <i class="el-icon-arrow-right" />
            </router-link>
          </div>
          <el-input
            v-model="inputModel"
            :placeholder="base === baseType[0] ? $t('token.enterBudget') : $t('token.enterPurchaseQuantity')"
            @input="inputChange"
            @keypress.native="isNumber"
          >
            <span slot="prefix" class="prefix-switch" @click="baseSwitch">
              <svg-icon icon-class="switch" />
            </span>
            <span
              slot="suffix"
              class="el-input__icon suffix-text"
            >= {{ suffixAmount || 0 }} {{ exchangeSymbol(suffixSymbol) }}</span>
          </el-input>
          <div class="btns">
            <div class="market-info-container">
              <div v-if="isDirectTrade" class="market-info">
                <span>{{ $t('price') }}：{{ market.price }} MTTK积分</span>
                <span>{{ $t('remaining') }}：{{ market.balance }} {{ token.symbol }}</span><span v-if="NoMarket" class="warn-tip">（{{ $t('insufficient-liquidity') }}）</span>
                <span>{{ $t('sold') }}：{{ market.sellAmount }} {{ token.symbol }}</span>
              </div>
              <div v-if="isUniswap" class="market-info">
                <!-- <span>价格：0 MTTK积分</span> -->
                <span>{{ $t('remaining') }}：{{ currentPoolSize.token_amount|| 0 }} {{ token.symbol }}</span><span v-if="noUniswap" class="warn-tip">（{{ $t('insufficient-liquidity') }}）</span>
              </div>
            </div>
            <el-button
              type="primary"
              class="pay-btn"
              :disabled="isUniswap ? noUniswap : NoMarket"
              @click="pay"
            >
              {{ $t('token.payImmediately') }}
            </el-button>
          </div>
        </div>
        <el-divider direction="vertical" class="middle-divider" />
        <div class="tips-card">
          <h3>{{ $t('tips') }}</h3>
          <ul v-if="isUniswap">
            <ol>1. {{ $t('here-is-the-quick-purchase-function-realized-through-the-Uniswap-transaction-mechanism') }}</ol>
            <ol>2. {{ $t('click-the-Uniswap-button-in-the-upper-right-corner-of-the-interface-to-enter-the-corresponding-exchange') }}</ol>
            <ol>3. {{ $t('when-there-is-insufficient-liquidity-in-the-exchange') }}，<a href="https://www.yuque.com/matataki/matataki/xzzv3r" target="_blank">{{ $t('how-to-provide-liquidity') }}</a></ol>
            <ol><a href="https://www.yuque.com/matataki/matataki/pmu2dr" target="_blank">{{ $t('more-help-information') }}</a></ol>
          </ul>
          <ul v-else>
            <ol>1. {{ $t('the-price-in-the-through-train-is-set-by-the-founder-and-cannot-be-modified') }}</ol>
            <ol>2. {{ $t('the-amount-paid-by-the-through-train-will-be-directly-transferred-to-the-founder') }}</ol>
            <ol>3. {{ $t('When-there-is-insufficient-liquidity-in-the-through-train-you-cannot-use-the-through-train-to-quickly-purchase-coin') }}</ol>
            <ol><a href="https://www.yuque.com/matataki/matataki/pmu2dr" target="_blank">{{ $t('more-help-information') }}</a></ol>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import { CNY } from '@/components/exchange/consts.js'
export default {
  components: {
  },
  props: {
    token: {
      type: Object,
      default: () => ({})
    },
    currentPoolSize: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      buyExchange: 'uniswap',
      inputModel: '',
      form: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      type: 'buy_token_output',
      priceSlippage: 0.01,
      baseType: ['input', 'output'],
      base: 'output',
      market: {
        price: 0,
        totalAmount: 0,
        balance: 0,
        sellAmount: 0
      },
      NoMarket: false
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    limitValue() {
      const { input } = this.form
      if (!this.$utils.isNull(input)) {
        return (parseFloat(input) / (1 - this.priceSlippage)).toFixed(4)
      }
      return 0
    },
    suffixAmount() {
      return this.baseType.findIndex(base => base === this.base) ? this.form.input : this.form.output
    },
    suffixSymbol() {
      return this.baseType.findIndex(base => base === this.base) ? this.form.inputToken.symbol : this.form.outputToken.symbol
    },
    isUniswap() {
      return this.buyExchange === 'uniswap'
    },
    isDirectTrade() {
      return this.buyExchange === 'direct'
    },
    noUniswap() {
      return this.currentPoolSize.token_amount === 0
    }
  },
  watch: {
    inputModel(val) {
      if(this.base === this.baseType[0])
        this.form.input = val
      else
        this.form.output = val
    }
  },
  mounted() {
    this.form.outputToken = this.token
    this.getMarket()
  },
  methods: {
    tabChange(v) {
      this.buyExchange = v
      this.form.input = ''
      this.form.output = ''
      this.inputModel = ''
    },
    async getMarket() {
      const result = await this.$API.directTrade.getItem(this.token.id)
      if (result.code === 0) {
        const market = result.data
        if (market.status === 0) {
          this.NoMarket = false
          this.market = {
            price: this.$utils.fromDecimal(market.price),
            totalAmount: this.$utils.fromDecimal(market.amount),
            balance: this.$utils.fromDecimal(market.balance),
            sellAmount: this.$utils.fromDecimal(market.amount - market.balance),
          }
        } else { // 尚未启动market
          this.NoMarket = true
        }
      } else { // market暂无
        this.NoMarket = true
      }
    },
    baseSwitch() {
      // switch
      this.base = this.baseType[Number(this.base === this.baseType[0])]
      
      this.inputModel = this.base === this.baseType[0] ? this.form.input : this.form.output
    },
    pay() {
      if (this.isLogined) {
        
        // 没有合约地址
        if (!this.token.contract_address) {
          this.$message.error(this.$t('token.underDeployment'))
          return
        }

        if (this.$utils.isNull(this.form.output)) {
          this.$message.error(this.$t('token.enterTheNumber'))
        } else {
          let type = this.type
          if (this.isDirectTrade) type = 'direct_trade'
          this.$store.dispatch('order/createOrder', {
            ...this.form,
            type
          })
        }
      } else {
        this.$store.commit('setLoginModal', true)
      }
    },
    inputChange: debounce(function () {
      // uniswap 交易
      if (this.isUniswap) {
        // 没有合约地址
        if (!this.token.contract_address) return
        if(this.base === this.baseType[0])
          this.getOutputAmount(0, this.token.id, this.form.input)
        else
          this.getInputAmount(0, this.token.id, this.form.output)
      } else if (this.isDirectTrade) { // 直通车交易
        if(this.base === this.baseType[0]) { // 输入是cny，输出是token
          this.getMarketOutputAmount(this.form.input, this.market.price)
        } else { // 输入是token，输出是cny
          this.getMarketInputAmount(this.form.output, this.market.price)
        }
      }
    }, 500),
    getMarketOutputAmount(input, price) {
      let r = Math.floor(parseFloat(input) / parseFloat(price) * 100) / 100
      // if (r === 0) r = 0.01
      this.form.output = r

    },
    getMarketInputAmount(output, price) {
      this.form.input = parseFloat(output) * parseFloat(price)
    },
    getInputAmount(inputTokenId = 0, outputTokenId, outputAmount) {
      const deciaml = 4
      const _outputAmount = this.$utils.toDecimal(outputAmount, deciaml)
      this.$API.getInputAmount(inputTokenId, outputTokenId, _outputAmount).then((res) => {
        if (res.code === 0) {
          // rmb向上取整
          if (parseFloat(res.data) >= 100) {
            this.form.input = parseFloat(this.$utils.formatCNY(res.data, deciaml)).toFixed(2)
          } else if (!this.$utils.isNull(this.form.output)) {
            this.form.input = 0.01
          } else {
            this.form.input = ''
          }
        } else {
          // '没有交易对-->Fan票流动性不足，无法交易'
          let message = res.code === 10807 ? 'Fan票流动性不足，无法交易' : res.message
          this.$message({ showClose: true, message: message, type: 'error' })
          this.form.input = ''
        }
      })
    },
    getOutputAmount(inputTokenId = 0, outputTokenId, inputAmount) {
      const deciaml = 4
      const _inputAmount = this.$utils.toDecimal(inputAmount, deciaml)
      this.$API.getOutputAmount(inputTokenId, outputTokenId, _inputAmount).then((res) => {
        if (res.code === 0) {
          if (res.data)
            this.form.output = parseFloat(this.$utils.fromDecimal(res.data, deciaml)).toFixed(4) || ''
          else
            this.form.output = ''
        } else {
          this.$message({ showClose: true, message: res.message, type: 'error' })
          this.form.output = ''
        }
      })
    },
    isNumber(event) {
      const max = 100000000
      if (!/\d/.test(event.key) && event.key !== '.') {
        return event.preventDefault()
      }
      else if(Number(this.inputModel + event.key) > max) {
        this.inputModel = max
        this.inputChange()
        return event.preventDefault()
      }
    },
    // 转换Symbol
    exchangeSymbol(symbol) {
      if (!symbol) return symbol
      return symbol.toLocaleUpperCase() === 'CNY' ? 'MTTK积分' : symbol
    }
  }
}
</script>

<style scoped lang="less">
.container-padding {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 20px;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  .container-outer {
    background: @white;
    border-radius: @br10;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
    width: 100%;
    padding: 20px;;
    box-sizing: border-box;
  }
  .container-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tips-card {
    width: 45%;
    display: inline-block;
    padding-bottom: 20px;
    ul > ol {
      line-height: 30px;
    }
  }
  .middle-divider {
    height: 120px;
  }
  .market-info-container {
    display: flex;
    align-items: center;
    .market-info {
      span {
        font-size: 14px;
        color: #B2B2B2;
        margin-right: 10px;
      }
    }
  }
  .pay-btn {
    height: 40px;;
  }
}
.buy-card {
  display: inline-block;
  width: 45%;
  // padding: 20px 0 20px 20px;
  margin: 0;
  .suffix-text {
    color: @purpleDark;
  }
  .prefix-switch {
    margin: 50% 0;
    width: 20px;
    height: 20px;
    color: white;
    background: #B2B2B2;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background: #896DF0;
    }
  }
}
.token-title {
  font-size:20px;
  color: #B2B2B2;
  line-height:33px;
  padding: 0;
  margin-right: 10px;
  cursor: pointer;
  &.active {
    color: #000000;
  }
}

.buy-flex {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 20px;
}
.center {
  line-height: 33px;
  height: 33px;
  font-size: 14px;
}
.btns {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-top: 20px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.warn-tip {
  color: #FB6877!important;
}
.card-title {
  font-size:24px;
  font-weight:bold;
  color:@black;
  line-height:33px;
  padding: 0;
  margin: 0;
}

@media screen and (max-width: 600px) {
  .token-title  {
    font-size: 20px;
  }
}
@media screen and (max-width: 800px) {
  .middle-divider {
    display: none!important;
  }
  .buy-card, .tips-card {
    padding: 20px;
    width: 100%!important;
  }
  .market-info {
    span {
      display: block;
    }
  }
  .container-inner {
    flex-direction: column;
  }
}
</style>
<style lang="less">
.buy-card {
  .btn1 {
    border-color: @purpleDark;
    color: @purpleDark;
  }
}
</style>
