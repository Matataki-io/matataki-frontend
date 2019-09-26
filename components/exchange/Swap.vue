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
          <button class="iAoRgd" @click="tlShow = true;field = 'inputToken'">
            <span class="rTZzf">
              {{ form.inputToken.symbol || '请选择'}}
              <i class="el-icon-arrow-down"></i>
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
            step="0.0001"
            placeholder="0.0"
            @input="outputChange"
            @blur="outputBlur"
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
        <span v-if="exchangeRate">1 {{form.inputToken.symbol}} = {{ exchangeRate }} {{form.outputToken.symbol}}</span>
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
            <span class="jbXIaP">{{form.input}} {{form.inputToken.symbol}}</span>
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
import { CNY, INPUT, OUTPUT } from './consts.js'
import utils from '@/utils/utils'

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
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
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
      const { input, inputToken, outputToken } = this.form
      if (!utils.isNull(input) && !utils.isNull(inputToken) && !utils.isNull(outputToken)) {
        this.getOutputAmount(inputToken.id, outputToken.id, input)
      }
    },
    outputBlur(e) {
      const value = e.target.value
      const { inputToken, output, outputToken } = this.form
      if (!utils.isNull(inputToken) && !utils.isNull(output) && !utils.isNull(outputToken)) {
        this.getInputAmount(inputToken.id, outputToken.id, output)
      }
    },
    inputChange(e) {
      const value = e.target.value
      this.form.input = value
      if (!utils.isNull(this.form.outputToken)) {
        this.form.output = ''
      }
    },
    outputChange(e) {
      const value = e.target.value
      this.form.output = value
      if (!utils.isNull(this.form.outputToken)) {
        this.form.input = ''
      }
    },
    selectToken(token) {
      this.form[this.field] = token
      const { input, inputToken, output, outputToken } = this.form
      console.log(input, inputToken.symbol, output, outputToken.symbol)
      if (!utils.isNull(input) && !utils.isNull(inputToken) && !utils.isNull(outputToken)) {
        this.getOutputAmount(inputToken.id, outputToken.id, input)
        return
      }
      if (!utils.isNull(output) && !utils.isNull(inputToken) && !utils.isNull(outputToken)) {
        this.getInputAmount(inputToken.id, outputToken.id, output)
      }
    },
    onSubmit() {
      const { input, inputToken, output, outputToken } = this.form
      // 输入是人名币
      if (inputToken.isCNY) {
        this.$API
          .wxpay({
            total: utils.toDecimal(input, outputToken.decimals), // 单位yuan
            title: `购买${outputToken.symbol}`,
            type: 'buy_token', // type类型见typeOptions：add，buy_token，sale_token
            token_id: outputToken.id,
            token_amount: utils.toDecimal(output, outputToken.decimals),
            limit_value: utils.toDecimal(this.limitValue, outputToken.decimals),
            decimals: outputToken.decimals
          })
          .then(res => {
            this.order = res
            this.orderShow = true
          })
      } else {
        // 输入不是人名币
        this.$API.swap({
          inputTokenId: inputToken.id,
          outputTokenId: outputToken.id,
          inputAmount: utils.toDecimal(output, 4),
          minValue: utils.toDecimal(this.limitValue, 4)
        }).then(res => {
          if (res.code === 0) {
            this.$alert('跳转到我的持仓查看？', '兑换成功', {
              confirmButtonText: '确定'
            })
          } else {
            this.$alert('请重新兑换', '兑换失败', {
              confirmButtonText: '确定'
            })
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
          this.$message.error('暂无交易对')
          this.form.output = ''
        }
      })
    },
    getInputAmount(inputTokenId, outputTokenId, outputAmount) {
      const deciaml = 4
      const _outputAmount = utils.toDecimal(outputAmount, deciaml)
      this.$API.getInputAmount(inputTokenId, outputTokenId, _outputAmount).then((res) => {
        if (res.code === 0) {
          this.form.input = parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4)
        } else {
          this.$message.error('暂无交易对')
          this.form.input = ''
        }
      })
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
