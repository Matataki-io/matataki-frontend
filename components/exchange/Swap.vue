<template>
  <div>
    <slot name="help" />
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>输入</span>
          </div>
          <div v-if="form.inputToken.symbol && form.inputToken.id !== 0">
            余额：{{ balance.input }}
          </div>
        </div>
        <div class="jbRmQG">
          <input
            :value="form.input"
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
            @input="inputChange"
            @keypress="isNumber"
          >
          <button
            class="iAoRgd"
            @click="tlShow = true;field = 'inputToken'"
          >
            <span class="rTZzf">
              {{ form.inputToken.symbol || '选择Fan票' }}
              <i class="el-icon-arrow-down" />
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="hYLPFg">
      <div class="exKIZr" />
      <div class="haryqg">
        <i
          class="el-icon-bottom gHgbDu"
          @click="swap"
        />
      </div>
      <div class="jJSpkX" />
    </div>
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>输出</span>
          </div>
          <div v-if="form.outputToken.symbol && form.outputToken.id !== 0">
            余额：{{ balance.output }}
          </div>
        </div>
        <div class="jbRmQG">
          <input
            :value="form.output"
            class="gcotIA"
            type="number"
            min="0"
            step="0.0001"
            placeholder="0.0"
            @input="outputChange"
            @keypress="isNumber"
          >
          <button
            class="iAoRgd"
            @click="tlShow = true;field = 'outputToken'"
          >
            <span class="rTZzf">
              {{ form.outputToken.symbol || '选择Fan票' }}
              <i class="el-icon-arrow-down" />
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="hYLPFg">
      <div class="exKIZr" />
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">兑换比率</span>
        <span v-if="exchangeRate">1 {{ form.inputToken.symbol }} = {{ exchangeRate }} {{ form.outputToken.symbol }}</span>
        <span v-else> - </span>
      </div>
    </div>
    <div
      class="mHVYT"
      @click="detailShow = !detailShow"
    >
      <span class="fZbbbs">{{ detailShow ? '收起详情' : '查看详情' }}</span>
      <i :class="detailShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
    </div>
    <div
      v-show="detailShow"
      class="iUPTxf"
    >
      <div class="hRyusy">
        <div v-if="base === 'input'">
          你正在出售
          <span class="iDChvK">
            <span class="jbXIaP">{{ form.input }} {{ form.inputToken.symbol }}</span>
          </span> 最少获得
          <span class="iDChvK">
            <span class="jbXIaP">{{ limitValue }} {{ form.outputToken.symbol }}</span>
          </span>
        </div>
        <div v-else>
          你正在购买
          <span class="iDChvK">
            <span class="jbXIaP">{{ form.output }} {{ form.outputToken.symbol }}</span>
          </span> 最多需要
          <span class="iDChvK">
            <span class="jbXIaP">{{ limitValue }} {{ form.inputToken.symbol }}</span>
          </span>
        </div>
        <div class="sc-bsbRJL kxtVAF">
          预期价格滑落
          <span class="iDChvK">
            <span class="jbXIaP">{{ priceSlippage * 100 }}%</span>
          </span>
          <el-tooltip
            placement="bottom"
            effect="light"
          >
            <div slot="content">
              您的交易可能由于正常的价格波动而失败，<br>价格滑落区间将有助于您的交易成功
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="hGStes">
      <button
        :disabled="btnDisabled"
        class="jBltiI"
        @click="onSubmit"
      >
        交易
      </button>
    </div>
    <OrderModal
      v-model="orderShow"
      :form="{...form,type,limitValue}"
    />
    <TokenListModal
      v-model="tlShow"
      @selectToken="selectToken"
    />
    <TradeLog :tokens-id="tokensId" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import OrderModal from './OrderModal'
import TokenListModal from './TokenList'
import TradeLog from './TradeLog'
import { CNY, INPUT, OUTPUT } from './consts.js'
import utils from '@/utils/utils'

export default {
  components: {
    OrderModal,
    TokenListModal,
    TradeLog
  },
  data() {
    return {
      detailShow: false,
      tlShow: false,
      field: '', // INPUT OUTPUT
      orderShow: false,
      form: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      order: {},
      priceSlippage: 0.01,
      base: 'input', // input / output
      balance: {
        input: 0,
        output: 0
      }
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    tokensId() {
      const result = []
      const { inputToken, outputToken } = this.form
      if (!utils.isNull(inputToken) && inputToken.id !== 0) {
        result.push(inputToken.id)
      }
      if (!utils.isNull(outputToken) && outputToken.id !== 0) {
        result.push(outputToken.id)
      }
      return result
    },
    type() {
      return this.base === 'input' ? 'buy_token_input' : 'buy_token_output'
    },
    btnDisabled() {
      const { input, output, outputToken } = this.form
      if (utils.isNull(input) || utils.isNull(outputToken) || utils.isNull(output) || !this.checkBalance(false)) {
        return true
      }
      return false
    },
    limitValue() {
      const { input, output } = this.form
      const { base } = this
      // 以input为准计算
      if (base === 'input') {
        if (!utils.isNull(output)) {
          return (parseFloat(output) * (1 - this.priceSlippage)).toFixed(4)
        }
      }
      // 以output为准计算
      if (base === 'output') {
        if (!utils.isNull(input)) {
          return (parseFloat(input) / (1 - this.priceSlippage)).toFixed(4)
        }
      }
      return '-'
    },
    exchangeRate() {
      const { input, output } = this.form
      if (!utils.isNull(input) && !utils.isNull(output)) {
        return ((1 / input) * output).toFixed(4)
      }
      return ''
    }
  },
  async asyncData() {},
  mounted() {
    this.getTokenBySymbol()
  },
  methods: {
    async getTokenBySymbol() {
      const { input = '', output = '' } = this.$route.query
      // 输入
      if (!this.$utils.isNull(input)) {
        this.field = INPUT
        if (input.toLowerCase() === 'cny') {
          this.form.inputToken = CNY
        } else {
          const inputRes = await this.$API.getTokenBySymbol(input)
          this.selectToken(inputRes.data || {})
        }
      }
      // 输出
      if (!this.$utils.isNull(output)) {
        this.field = OUTPUT
        if (output.toLowerCase() === 'cny') {
          this.form.outputToken = CNY
        } else {
          const ouputRes = await this.$API.getTokenBySymbol(output)
          this.selectToken(ouputRes.data || {})
        }
      }
    },
    addRouterQuery(symbol) {
      this.$router.replace({
        hash: this.$route.hash,
        query: {
          ...this.$route.query,
          [this.field === INPUT ? 'input' : 'output']: symbol
        }
      })
    },
    isNumber(event) {
      if (!/\d/.test(event.key) && event.key !== '.') {
        return event.preventDefault()
      }
    },
    checkLogin() {
      if (!this.isLogined) {
        this.$message({ message: this.$t('error.pleaseLogin'), type: 'info', customClass: 'zindex-3000' })
        this.$store.commit('setLoginModal', true)
        return false
      }
      return true
    },
    inputChange: debounce(function (e) {
      const value = e.target.value
      this.form.input = value
      this.base = 'input'
      this.form.output = ''
      const { input, inputToken, outputToken } = this.form
      this.checkBalance()
      if (!utils.isNull(input) && !utils.isNull(inputToken) && !utils.isNull(outputToken)) {
        this.getOutputAmount(inputToken.id, outputToken.id, input)
      }
    }, 500),
    outputChange: debounce(function (e) {
      const value = e.target.value
      this.form.output = value
      this.base = 'output'
      this.form.input = ''
      const { inputToken, output, outputToken } = this.form
      if (!utils.isNull(inputToken) && !utils.isNull(output) && !utils.isNull(outputToken)) {
        this.getInputAmount(inputToken.id, outputToken.id, output)
      }
    }, 500),
    selectToken(token) {
      this.form[this.field] = token
      // 输入输出token不能相同
      if (this.form[INPUT] === this.form[OUTPUT]) {
        this.form[this.field === INPUT ? OUTPUT : INPUT] = ''
        this.form[this.field === INPUT ? 'output' : 'input'] = ''
        this.balance[this.field === INPUT ? 'output' : 'input'] = 0
      }
      // 获取用户余额
      this.getUserBalance(token.id, this.field === INPUT ? 'input' : 'output')
      const { input, inputToken, output, outputToken } = this.form
      if (!utils.isNull(input) && !utils.isNull(inputToken) && !utils.isNull(outputToken)) {
        this.getOutputAmount(inputToken.id, outputToken.id, input)
        return
      }
      if (!utils.isNull(output) && !utils.isNull(inputToken) && !utils.isNull(outputToken)) {
        this.getInputAmount(inputToken.id, outputToken.id, output)
      }
      this.addRouterQuery(token.symbol)
    },
    onSubmit() {
      if (!this.checkLogin()) return
      const { input, inputToken, output, outputToken } = this.form
      if (parseFloat(input) < 0.01 && inputToken.id === 0) {
        this.$message.error({
          message: '交易金额小于不得小于 0.01 CNY',
          duration: 3000,
          showClose: true
        })
        return
      }
      // 输入是人民币
      if (inputToken.isCNY) {
        this.$store.dispatch('order/createOrder', {
          ...this.form,
          type: this.type
        })
        // this.orderShow = true
        // this.$API
        //   .wxpay({
        //     total: utils.toDecimal(input, outputToken.decimals), // 单位yuan
        //     title: `购买${outputToken.symbol}`,
        //     type: this.base === 'input' ? 'buy_token_input' : 'buy_token_output', // type类型见typeOptions：add，buy_token_input，buy_token_output
        //     token_id: outputToken.id,
        //     token_amount: utils.toDecimal(output, outputToken.decimals),
        //     limit_value: utils.toDecimal(this.limitValue, outputToken.decimals),
        //     decimals: outputToken.decimals
        //   })
        //   .then(res => {
        //     this.order = res
        //     this.orderShow = true
        //   })
      } else {
        const loading = this.$loading({
          lock: false,
          text: '提交中',
          background: 'rgba(0, 0, 0, 0.4)'
        })
        // 输入不是人民币
        const amount = this.base === 'input' ? input : output
        this.$API.swap({
          inputTokenId: inputToken.id,
          outputTokenId: outputToken.id,
          amount: utils.toDecimal(amount, 4),
          limitValue: utils.toDecimal(this.limitValue, 4),
          base: this.base
        }).then(res => {
          loading.close()
          if (res.code === 0) {
            this.successNotice('兑换成功，即将刷新页面')
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } else {
            this.errorNotice('兑换失败，请刷新重试')
          }
        })
      }
    },
    getOutputAmount(inputTokenId, outputTokenId, inputAmount) {
      const deciaml = 4
      const _inputAmount = utils.toDecimal(inputAmount, deciaml)
      this.$API.getOutputAmount(inputTokenId, outputTokenId, _inputAmount).then((res) => {
        if (res.code === 0) {
          this.form.output = parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4)
        } else {
          this.$message.error(res.message)
          this.form.output = ''
        }
      })
    },
    getInputAmount(inputTokenId, outputTokenId, outputAmount) {
      const deciaml = 4
      const _outputAmount = utils.toDecimal(outputAmount, deciaml)
      this.$API.getInputAmount(inputTokenId, outputTokenId, _outputAmount).then((res) => {
        if (res.code === 0) {
          // rmb向上取整
          if (inputTokenId === 0 && parseFloat(res.data) >= 100) {
            this.form.input = parseFloat(utils.formatCNY(res.data, deciaml)).toFixed(2)
          } else {
            this.form.input = parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4)
          }
          this.checkBalance()
        } else {
          this.$message.error(res.message)
          this.form.input = ''
        }
      })
    },
    successNotice(text) {
      this.$message.success({
        message: text,
        duration: 4000,
        showClose: true
      })
    },
    errorNotice(text) {
      this.$message.error({
        message: text,
        duration: 4000,
        showClose: true
      })
    },
    // 获取用户余额
    getUserBalance(tokenId, type) {
      // RMB 不计算余额
      if (tokenId === 0) {
        this.balance[type] = 0
        return
      }
      this.$API.getUserBalance(tokenId).then((res) => {
        if (res.code === 0) {
          this.balance[type] = parseFloat(utils.fromDecimal(res.data, 4))
          // 检查用户余额
          this.checkBalance()
        }
      })
    },
    // 检测余额
    checkBalance(showError = true) {
      const { input, inputToken } = this.form
      const inputBalance = this.balance.input
      // 输入通证存在，且不是rmb
      if (!utils.isNull(inputToken) && inputToken.id !== 0) {
        // 输入大于余额
        if (parseFloat(input) > parseFloat(inputBalance)) {
          if (showError) {
            this.$message.error({
              message: '余额不足',
              duration: 3000,
              showClose: true
            })
          }
          return false
        }
      }
      return true
    },
    swap() {
      const { input = 'cny', output = 'cny' } = this.$route.query
      console.info(this.$route.query)
      this.$router.replace({
        hash: this.$route.hash,
        query: {
          ...this.$route.query,
          input: output,
          output: input
        }
      })

      // Hack
      this.$route.query.input = output
      this.$route.query.output = input

      this.getTokenBySymbol()
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
