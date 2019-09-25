<template>
  <div>
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>输入</span>
          </div>
          <!-- <div>余额：0.084</div> -->
        </div>
        <div class="jbRmQG">
          <input
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
            @input="inputChange"
            @blur="inputBlur"
            :value="form.input"
          />
          <!-- @click="tlShow = true;field = 'inputToken'" -->
          <button class="iAoRgd" >
            <span class="rTZzf">
              {{ form.inputToken.symbol || '请选择'}}
              <!-- <i class="el-icon-arrow-down"></i> -->
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="hYLPFg">
      <div class="exKIZr"></div>
      <div class="haryqg">
        <i class="el-icon-bottom gHgbDu"></i>
      </div>
      <div class="jJSpkX"></div>
    </div>
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>输出</span>
          </div>
          <!-- <div>余额：0.084</div> -->
        </div>
        <div class="jbRmQG">
          <input
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
            readonly="readonly"
            @input="outputChange"
            :value="form.output"
          />
          <button class="iAoRgd" @click="tlShow = true;field = 'outputToken'">
            <span class="rTZzf">
              {{ form.outputToken.symbol || '请选择'}}
              <i class="el-icon-arrow-down"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="hYLPFg">
      <div class="exKIZr"></div>
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">兑换率</span>
        <span v-if="exchangeRate">1 CNY = {{ exchangeRate }} {{form.outputToken.symbol}}</span>
        <span v-else> - </span>
      </div>
    </div>
    <div class="mHVYT" @click="detailShow = !detailShow" >
      <span class="fZbbbs">{{ detailShow ? '收起详情' : '查看详情' }}</span>
      <i :class="detailShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </div>
    <div class="iUPTxf" v-show="detailShow">
      <div class="hRyusy">
        <div>你正在出售
          <span class="iDChvK">
            <span class="jbXIaP">{{form.input}} CNY</span>
          </span> 最少获得≈
          <span class="iDChvK">
            <span class="jbXIaP">{{limitValue}} {{form.outputToken.symbol}}</span>
          </span>
        </div>
        <div class="sc-bsbRJL kxtVAF">预期价格滑落
          <span class="iDChvK">
            <span class="jbXIaP">{{ priceSlippage * 100 }}%</span>
          </span>
        </div>
      </div>
    </div>
    <div class="hGStes">
      <button :disabled="btnDisabled" class="jBltiI" @click="onSubmit">兑换</button>
    </div>
    <OrderModal v-model="orderShow" :order="{...order,...form}"></OrderModal>
    <TokenListModal v-model="tlShow" @selectToken="selectToken"></TokenListModal>
  </div>
</template>

<script>
import OrderModal from './OrderModal'
import TokenListModal from './TokenList'
import utils from '@/utils/utils'
const INPUT = 'inputToken'
const OUTPUT = 'outputToken'

export default {
  components: {
    OrderModal,
    TokenListModal
  },
  data() {
    return {
      detailShow: false,
      tlShow: false,
      field: '', // INPUT OUTPUT
      orderShow: false,
      form: {
        input: '',
        inputToken: { symbol: 'CNY' },
        output: '',
        outputToken: {}
      },
      options: [
        {
          value: 0,
          label: 'CNY'
        }
      ],
      order: {},
      priceSlippage: 0.01
    }
  },
  async asyncData() {},
  mounted() {
  },
  computed: {
    btnDisabled() {
      const { input, output, outputToken } = this.form
      if (utils.isNull(input) || utils.isNull(outputToken) || utils.isNull(output)) {
        return true
      }
      return false
    },
    limitValue() {
      const { output } = this.form
      if (!utils.isNull(output)) {
        return (parseFloat(output) * (1 - this.priceSlippage)).toFixed(4)
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
  methods: {
    inputBlur(e) {
      const value = e.target.value
      const { input, outputToken } = this.form
      if (!utils.isNull(input) && !utils.isNull(outputToken)) {
        this.$API.getTokenAmount(outputToken.id, input).then((res) => {
          if (res.code === 0) {
            this.form.output = res.data
          }
        })
      }
    },
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0
    },
    inputChange(e) {
      const value = e.target.value
      this.form.input = value
    },
    outputChange(e) {
      const value = e.target.value
      const { input, outputToken } = this.form
      if (utils.isNull(input) || utils.isNull(outputToken)) {
        this.form.output = value
      }
    },
    selectToken(token) {
      this.form[this.field] = token
      if (this.field === OUTPUT) {
        if (!utils.isNull(this.form.input)) {
          this.$API.getTokenAmount(token.id, this.form.input).then((res) => {
            if (res.code === 0) {
              this.form.output = res.data
            } else {
              this.$message.error('暂无交易对')
              this.form.output = ''
            }
          })
        }
      }
    },
    decimalTransfer(v, decimal) {
      return parseFloat(v) * Math.pow(10, decimal)
    },
    onSubmit() {
      const { input, output, outputToken } = this.form
      const { decimalTransfer } = this
      this.$API
        .wxpay({
          total: decimalTransfer(input, outputToken.decimals), // 单位yuan
          title: `购买${outputToken.symbol}`,
          type: 'buy_token', // type类型见typeOptions：add，buy_token，sale_token
          token_id: outputToken.id,
          token_amount: decimalTransfer(output, outputToken.decimals),
          limit_value: decimalTransfer(this.limitValue, outputToken.decimals),
          decimals: outputToken.decimals
        })
        .then(res => {
          this.order = res
          this.orderShow = true
        })
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
