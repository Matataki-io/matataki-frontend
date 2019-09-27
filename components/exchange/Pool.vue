<template>
  <div>
    <div class="hYLPFg">
      <div class="caRvnP" @click="psShow = true">
          <span class="gclSjj">{{ poolSelected.text }}</span>
          <i class="el-icon-arrow-down"></i>
      </div>
      <div class="jJSpkX"></div>
    </div>
    <!-- 存入 -->
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>{{ isDelete ? '资金池通证' : '存入' }}</span>
          </div>
          <!-- <div>余额：0.084</div> -->
        </div>
        <!--------------------- 删除流动金代码开始 ---------------------->
        <div class="jbRmQG" v-if="isDelete">
          <div></div>
          <input
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
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
        <!--------------------- 删除流动金代码结束 ---------------------->
        <div class="jbRmQG" v-else>
          <input
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
            @input="inputChange"
            :value="form.input"
          />
          <button class="iAoRgd">
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
        <i class="el-icon-bottom gHgbDu" v-if="isDelete"></i>
        <i class="el-icon-plus gHgbDu" v-else></i>
      </div>
      <div class="jJSpkX"></div>
    </div>
    <!-- 存入 -->
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>{{ isDelete ? '输出（估计）' : '存入' }}</span>
          </div>
          <!-- <div>余额：0.084</div> -->
        </div>
        <!--------------------- 删除流动金代码开始 ---------------------->
        <div class="cHbrWc" v-if="isDelete">
          <template v-if="outputPoolSize.cny_amount !== 0">
            <div class="kroqsf">{{ outputPoolSize.cny_amount.toFixed(4) }} CNY</div>
            <div class="jlBXmz"> + </div>
            <div class="kroqsf">{{ outputPoolSize.token_amount.toFixed(4) }} {{ form.outputToken.symbol }}</div>
          </template>
        </div>
        <!--------------------- 删除流动金代码结束 ---------------------->
        <div class="jbRmQG" v-else>
          <div></div>
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
        <span class="sc-hORach icyNSS">你的资金池份额 （{{yourPoolSize.your_supply}}）</span>
        <span v-if="form.outputToken.symbol">{{yourPoolSize.cny_amount}} CNY + {{yourPoolSize.token_amount}} {{form.outputToken.symbol}}</span>
        <span v-else> - </span>
      </div>
    </div>
    <div class="mHVYT" @click="detailShow = !detailShow" v-if="!isDelete">
      <span class="fZbbbs">{{ detailShow ? '收起详情' : '查看详情' }}</span>
      <i :class="detailShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </div>
    <div class="iUPTxf" v-show="detailShow" v-if="!isDelete">
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
      <button :disabled="btnDisabled" class="jBltiI" @click="onSubmit">{{ poolSelected.text }}</button>
    </div>
    <OrderModal v-model="orderShow" :order="{...order,...form}"></OrderModal>
    <TokenListModal v-model="tlShow" @selectToken="selectToken"></TokenListModal>
    <PoolSelectModal v-model="psShow" @selectPool="selectPool"></PoolSelectModal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
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
      yourPoolSize: {
        cny_amount: 0,
        token_amount: 0,
        your_supply: 0
      },
      youMintTokenAmount: 0,
      poolSelected: {
        id: 0,
        text: '添加流动金'
      },
      outputPoolSize: {
        cny_amount: 0,
        token_amount: 0
      }
    }
  },
  async asyncData() {},
  mounted() {
  },
  computed: {
    // 是否是删除流动金
    isDelete() {
      // 添加流动金
      if (this.poolSelected.id === 0) {
        return false
      } else {
      // 删除流动金
        return true
      }
    },
    btnDisabled() {
      const { input, inputToken, output, outputToken } = this.form
      const { outputPoolSize } = this
      // 删除流动金的情况
      /* eslint-disable */
      if (this.isDelete) {
        if (this.yourPoolSize.cny_amount === 0 || this.yourPoolSize.cny_amount < this.outputPoolSize.cny_amount) {
          return true
        }
        if (utils.isNull(output) || utils.isNull(outputToken) || outputPoolSize.cny_amount === 0 || outputPoolSize.token_amount === 0) {
          return true
        }
      } else {
        if (utils.isNull(input) || utils.isNull(outputToken) || utils.isNull(output)) {
          return true
        }
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
    calLimitValue(v) {
      return parseFloat(v) * (1 - this.priceSlippage)
    },
    selectPool(val) {
      // 修改form，重置
      this.form = {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      }
      this.outputPoolSize = {
        cny_amount: 0,
        token_amount: 0
      }
      this.poolSelected = val
    },
    inputChange: debounce(function (e) {
      const value = e.target.value
      this.form.input = value
      const { input, inputToken, outputToken } = this.form
      if (!utils.isNull(input) && !utils.isNull(outputToken)) {
        // 获取输出token的数量
        this.getOutputAmount(inputToken.id, outputToken.id, input)
        // 获取你能挖到的数量
        this.getYourMintToken(outputToken.id, input)
      }
    }, 500),
    outputChange(e) {
      const value = e.target.value
      this.form.output = value
      /*---------------------- 删除流动金逻辑开始 ---------------------*/
      if (this.isDelete) {
        const { output, outputToken } = this.form
        if (!utils.isNull(output) && !utils.isNull(outputToken)) {
          this.getOutputPoolSize(output, outputToken.id)
        }
        return
      }
      /*---------------------- 删除流动金逻辑结束 ---------------------*/
    },
    selectToken(token) {
      this.form[this.field] = token
      // 获取个人占比
      this.getYourPoolSize(token.id)
      // 获取总池子大小
      this.getCurrentPoolSize(token.id)
      if (this.field === OUTPUT) {
        if (this.isDelete) {
           /*---------------------- 删除流动金逻辑开始 ---------------------*/
          const { output } = this.form
          if (!utils.isNull(output)) {
            this.getOutputPoolSize(output, token.id)
          }
          /*---------------------- 删除流动金逻辑结束 ---------------------*/
        } else {
          const { inputToken, input } = this.form
          if (!utils.isNull(input)) {
            // 获取输出token的数量
            this.getOutputAmount(inputToken.id, token.id, input)
            // 获取你能挖到的数量
            this.getYourMintToken(token.id, input)
          }
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
      if (this.isDelete) {
        this.removeLiquidity()
      } else {
        this.addLiquidity()
      }
    },
    addLiquidity() {
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
          this.currentPoolSize = {
            cny_amount: utils.fromDecimal(res.data.cny_amount, 4),
            token_amount: utils.fromDecimal(res.data.token_amount, 4),
            total_supply: utils.fromDecimal(res.data.total_supply, 4)
          }
        }
      })
    },
    getYourPoolSize(tokenId) {
      this.$API.getYourPoolSize(tokenId).then(res => {
        if (res.code === 0) {
          this.yourPoolSize = {
            cny_amount: utils.fromDecimal(res.data.cny_amount, 4),
            token_amount: utils.fromDecimal(res.data.token_amount, 4),
            your_supply: utils.fromDecimal(res.data.your_supply || 0, 4)
          }
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
    },
    getOutputPoolSize(amountBefore, tokenId) {
      const amount = utils.toDecimal(amountBefore, 4)
      this.$API.getOutputPoolSize(amount, tokenId).then(res => {
        if (res.code === 0) {
          this.outputPoolSize = {
            cny_amount: utils.fromDecimal(res.data.cny_amount, 4),
            token_amount: utils.fromDecimal(res.data.token_amount, 4)
          }
        } else {
          this.outputPoolSize = {
            cny_amount: 0,
            token_amount: 0
          }
        }
      })
    },
    removeLiquidity() {
      const { output, outputToken } = this.form
      const minCny = utils.toDecimal(this.calLimitValue(this.outputPoolSize.cny_amount), 4)
      const minTokens = utils.toDecimal(this.calLimitValue(this.outputPoolSize.token_amount), 4)
      this.$API.removeLiquidity({
        tokenId: outputToken.id,
        amount: utils.toDecimal(output, outputToken.decimals),
        min_cny: minCny,
        min_tokens: minTokens
      }).then(res => {
        if (res.code === 0) {
          this.successNotice('流动金删除成功')
        } else {
          this.errorNotice('流动金删除失败')
        }
      })
    },
    successNotice(text) {
      this.$message.success({
        message: text,
        duration: 0,
        showClose: true
      })
    },
    errorNotice(text) {
      this.$message.error({
        message: text,
        duration: 0,
        showClose: true
      })
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
