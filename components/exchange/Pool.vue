<template>
  <div>
    <div class="hYLPFg">
      <div class="caRvnP" @click="psShow = true">
          <span class="gclSjj">添加流动金</span>
          <i class="el-icon-arrow-down"></i>
      </div>
      <div class="jJSpkX"></div>
    </div>
    <!-- 存入 -->
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>存入</span>
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
        <i class="el-icon-plus gHgbDu"></i>
      </div>
      <div class="jJSpkX"></div>
    </div>
    <!-- 存入 -->
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>存入</span>
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
            :readonly="outputReadOnly"
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
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">当前资金池大小</span>
        <span v-if="form.outputToken.symbol">{{currentPoolSize.cny_amount}} CNY + {{currentPoolSize.token_amount}} {{form.outputToken.symbol}}</span>
        <span v-else> - </span>
      </div>
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">你的资金池份额</span>
        <span v-if="form.outputToken.symbol">{{youtPoolSize.cny_amount}} CNY + {{youtPoolSize.token_amount}} {{form.outputToken.symbol}}</span>
        <span v-else> - </span>
      </div>
    </div>
    <div class="mHVYT" @click="detailShow = !detailShow" >
      <span class="fZbbbs">{{ detailShow ? '收起详情' : '查看详情' }}</span>
      <i :class="detailShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </div>
    <div class="iUPTxf" v-show="detailShow">
      <div class="hRyusy">
        <div>你正在添加
          <span class="iDChvK">
            <span class="jbXIaP">{{form.input}} CNY</span>
          </span> 和最多
          <span class="iDChvK">
            <span class="jbXIaP">{{limitValue}} {{form.outputToken.symbol}}</span>
          </span>到流动池中。
        </div>
        <div class="sc-bsbRJL kxtVAF">你将会挖到
          <span class="iDChvK">
            <span class="jbXIaP"> {{ youMintTokenAmount }} </span>
          </span>
          liquidity tokens
        </div>
        <div class="sc-bsbRJL kxtVAF">当前 liquidity tokens总量是
          <span class="iDChvK">
            <span class="jbXIaP"> {{ currentPoolSize.total_supply || 0 }} </span>
          </span>
        </div>
      </div>
    </div>
    <!-- 提交 -->
    <div class="hGStes">
      <button :disabled="btnDisabled" class="jBltiI" @click="onSubmit">添加流动金</button>
    </div>
    <OrderModal v-model="orderShow" :order="{...order,...form}"></OrderModal>
    <TokenListModal v-model="tlShow" @selectToken="selectToken"></TokenListModal>
    <PoolSelectModal v-model="psShow"></PoolSelectModal>
  </div>
</template>

<script>
import OrderModal from './OrderModal'
import TokenListModal from './TokenList'
import PoolSelectModal from './PoolSelect'
import { CNY, INPUT, OUTPUT } from './consts.js'
import utils from '@/utils/utils'

export default {
  components: {
    OrderModal,
    TokenListModal,
    PoolSelectModal
  },
  data() {
    return {
      psShow: false,
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
      priceSlippage: 0.02,
      outputReadOnly: true,
      // display 计算data
      currentPoolSize: {
        cny_amount: 0,
        token_amount: 0,
        total_supply: 0
      },
      youtPoolSize: {
        cny_amount: 0,
        token_amount: 0
      },
      youMintTokenAmount: 0
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
      if (!utils.isNull(input) && !utils.isNull(outputToken)) {
        // 获取输出token的数量
        this.getOutputAmount(inputToken.id, outputToken.id, input)
        // 获取你能挖到的数量
        this.getYourMintToken(outputToken.id, input)
      }
    },
    inputChange(e) {
      const value = e.target.value
      this.form.input = value
    },
    outputChange(e) {
      const value = e.target.value
      this.form.output = value
    },
    selectToken(token) {
      this.form[this.field] = token
      if (this.field === OUTPUT) {
        const { inputToken, input } = this.form
        // 获取个人占比
        this.getYourPoolSize(token.id)
        // 获取总池子大小
        this.getCurrentPoolSize(token.id)
        if (!utils.isNull(input)) {
          // 获取输出token的数量
          this.getOutputAmount(inputToken.id, token.id, input)
          // 获取你能挖到的数量
          this.getYourMintToken(token.id, input)
        }
      }
    },
    getOutputAmount(inputTokenId, outputTokenId, inputAmount) {
      const deciaml = 4
      const _inputAmount = utils.toDecimal(inputAmount, deciaml)
      this.$API.getOutputAmount(inputTokenId, outputTokenId, _inputAmount).then((res) => {
        if (res.code === 0) {
          this.outputReadOnly = true
          this.form.output = parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4)
        } else {
          this.form.output = ''
          this.outputReadOnly = false
        }
      })
    },
    onSubmit() {
      const { input, output, outputToken } = this.form
      this.$API
        .wxpay({
          total: utils.toDecimal(input, outputToken.decimals), // 单位yuan
          title: `添加流动金`,
          type: 'add', // type类型见typeOptions：add，buy_token，sale_token
          token_id: outputToken.id,
          token_amount: utils.toDecimal(output, outputToken.decimals),
          limit_value: utils.toDecimal(this.limitValue, outputToken.decimals),
          decimals: outputToken.decimals,
          min_liquidity: utils.toDecimal(this.youMintTokenAmount, outputToken.decimals)
        })
        .then(res => {
          this.order = res
          this.orderShow = true
        })
    },
    getCurrentPoolSize(tokenId) {
      this.$API.getCurrentPoolSize(tokenId).then(res => {
        if (res.code === 0) {
          this.currentPoolSize = res.data
        }
      })
    },
    getYourPoolSize(tokenId) {
      this.$API.getYourPoolSize(tokenId).then(res => {
        if (res.code === 0) {
          this.youtPoolSize = res.data
        }
      })
    },
    getYourMintToken(tokenId, amountBefore) {
      const { outputToken } = this.form
      // 转换之后
      console.log(amountBefore, outputToken.decimals)
      const amount = utils.toDecimal(amountBefore, outputToken.decimals)
      this.$API.getYourMintToken(tokenId, amount).then(res => {
        if (res.code === 0) {
          this.youMintTokenAmount = utils.fromDecimal(res.data, outputToken.decimals)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
