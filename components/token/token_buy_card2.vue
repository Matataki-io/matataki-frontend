<template>
  <div class="container-padding">
    <div class="buy-card">
      <!-- <h2 class="token-title">
        {{ $t('token.quickPurchase') }}
      </h2> -->
      <div class="buy-flex">
        <div>
          <span 
            :class="[ 'token-title', { 'active': isUniswap } ]"
            @click="tabChange('uniswap')"
          >Uniswap交易所</span>
          <span 
            :class="[ 'token-title', { 'active': isDirectTrade } ]"
            @click="tabChange('direct')"
          >直通车</span>
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
        >= {{ suffixAmount || 0 }} {{ suffixSymbol }}</span>
      </el-input>
      <div class="btns">
        <div class="market-info-container">
          <div v-if="isDirectTrade" class="market-info">
            <span>价格：{{ market.price }} CNY</span>
            <span>剩余：{{ market.balance }} {{ token.symbol }}</span>
            <span>已售出：{{ market.totalAmount - market.balance }} {{ token.symbol }}</span>
          </div>
          <div v-if="isUniswap" class="market-info">
            <!-- <span>价格：0 CNY</span> -->
            <span>剩余：{{ currentPoolSize.token_amount|| 0 }} {{ token.symbol }}</span>
          </div>
        </div>
        <el-button
          type="primary"
          class="pay-btn"
          @click="pay"
        >
          {{ $t('token.payImmediately') }}
        </el-button>
      </div>
    </div>
    <el-divider direction="vertical" class="middle-divider" />
    <div class="tips-card">
      <ul>
        <ol>1. 首次发行的时候会自动默认发行 1000 个Fan票</ol>
        <ol>2. 首次发行成功后即可立即操作手动增发</ol>
        <ol>3. 每次增发后需要等待10天可再次增发</ol>
      </ul>
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
        balance: 0
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
          this.$message({ showClose: true, message: res.message, type: 'error' })
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
    }
  }
}
</script>

<style scoped lang="less">
.container-padding {
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 20px;
  background: @white;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tips-card {
    width: 45%;
    display: inline-block;
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
  padding: 20px 0 20px 20px;
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

@media screen and (max-width: 600px) {
  .token-title  {
    font-size: 20px;
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
