<template>
  <div class="buy-card">
    <div class="buy-flex">
      <h2 class="token-title">
        {{ $t('token.quickPurchase') }}
      </h2>
      <span class="center"><span class="ellipsis">{{ currentPoolSize.token_amount|| 0 }}</span> {{ token.symbol }} <svg-icon icon-class="exchange" /></span>
    </div>
    <el-input
      v-model="form.output"
      :placeholder="$t('token.enterPurchaseQuantity')"
      @input="inputChange"
      @keypress.native="isNumber"
    >
      <span
        slot="suffix"
        class="el-input__icon suffix-text"
      >= {{ form.input || 0 }} CNY</span>
    </el-input>
    <div class="btns">
      <el-button
        class="btn1"
        @click="pay"
      >
        {{ $t('token.payImmediately') }}
      </el-button>
      <router-link :to="{name: 'exchange', hash: '#swap', query: { output: token.symbol }}">
        <el-button
          class="btn2"
          type="primary"
        >
          {{ $t('token.tradingFanTickets') }}
        </el-button>
      </router-link>
    </div>
    <OrderModal
      v-model="orderShow"
      :form="{...form,type,limitValue}"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import { CNY } from '@/components/exchange/consts.js'
import OrderModal from '@/components/exchange/OrderModal'
export default {
  components: {
    OrderModal
  },
  props: {
    token: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      type: 'buy_token_output',
      priceSlippage: 0.01,
      orderShow: false,
      currentPoolSize: {}
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
    }
  },
  mounted() {
    this.form.outputToken = this.token
    if (this.token.id) this.getCurrentPoolSize(this.token.id)
  },
  methods: {
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
          // this.orderShow = true
          this.$store.dispatch('order/createOrder', {
            ...this.form,
            type: this.type
          })
        }
      } else {
        this.$store.commit('setLoginModal', true)
      }
    },
    inputChange: debounce(function () {

      // 没有合约地址
      if (!this.token.contract_address) return

      this.getInputAmount(0, this.token.id, this.form.output)
    }, 500),
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
    getCurrentPoolSize(tokenId) {
      this.$API.getCurrentPoolSize(tokenId).then(res => {
        if (res.code === 0) {
          this.currentPoolSize = {
            cny_amount: this.$utils.fromDecimal(res.data.cny_amount, 4),
            token_amount: this.$utils.fromDecimal(res.data.token_amount, 4),
            total_supply: this.$utils.fromDecimal(res.data.total_supply, 4)
          }
        }
      })
    },
    isNumber(event) {
      if (!/\d/.test(event.key) && event.key !== '.') {
        return event.preventDefault()
      }
    }
  }
}
</script>

<style scoped lang="less">
.suffix-text {
  color: @purpleDark;
}
.buy-card {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.token-title {
  font-size:24px;
  font-weight:bold;
  color:@black;
  line-height:33px;
  padding: 0;
  margin: 0;
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
  .btn1, .btn2 {
    // flex: 1;
  }
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
