<template>
  <div>
    <slot name="help" />
    <div class="hYLPFg">
      <div
        class="caRvnP"
        @click="psShow = true"
      >
        <span class="gclSjj">{{ poolSelected.text }}</span>
        <i class="el-icon-arrow-down" />
      </div>
      <div class="jJSpkX" />
    </div>
    <!-- 存入 -->
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>{{ isDelete ? $t('delete') : $t('deposit') }}</span>
          </div>
          <div v-if="isDelete && form.outputToken.symbol && form.outputToken.id !== 0">
            {{ $t('liquid-gold-token') }}：{{ yourPoolSize.your_supply }}
          </div>
        </div>
        <!--------------------- 删除流动金代码开始 ---------------------->
        <div
          v-if="isDelete"
          class="jbRmQG"
        >
          <div />
          <input
            :value="form.output"
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
            @input="outputChange"
            @keypress="isNumber"
          >
          <button
            class="iAoRgd"
            @click="tlShow = true;field = 'outputToken'"
          >
            <span class="rTZzf">
              {{ form.outputToken.symbol || $t('choose-coin') }}
              <i class="el-icon-arrow-down" />
            </span>
          </button>
        </div>
        <!--------------------- 删除流动金代码结束 ---------------------->
        <div
          v-else
          class="jbRmQG"
        >
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
          <button class="iAoRgd">
            <span class="rTZzf">
              {{ form.inputToken.symbol || $t('choose-coin') }}
              <!-- <i class="el-icon-arrow-down"></i> -->
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="hYLPFg">
      <div class="exKIZr" />
      <div class="haryqg">
        <i
          v-if="isDelete"
          class="el-icon-bottom gHgbDu"
        />
        <i
          v-else
          class="el-icon-plus gHgbDu"
        />
      </div>
      <div class="jJSpkX" />
    </div>
    <!-- 存入 -->
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>{{ isDelete ? $t('output-estimated') : $t('deposit') }}</span>
          </div>
          <div v-if="form.outputToken.symbol && form.outputToken.id !== 0 && !isDelete">
            {{ $t('balance') }}：{{ balance.add }}
          </div>
        </div>
        <!--------------------- 删除流动金代码开始 ---------------------->
        <div
          v-if="isDelete"
          class="cHbrWc"
        >
          <template v-if="outputPoolSize.cny_amount !== 0">
            <div class="kroqsf">
              {{ outputPoolSize.cny_amount.toFixed(4) }} CNY
            </div>
            <div class="jlBXmz">
              +
            </div>
            <div class="kroqsf">
              {{ outputPoolSize.token_amount.toFixed(4) }} {{ form.outputToken.symbol }}
            </div>
          </template>
        </div>
        <!--------------------- 删除流动金代码结束 ---------------------->
        <div
          v-else
          class="jbRmQG"
        >
          <div />
          <input
            :readonly="outputReadOnly"
            :value="form.output"
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
            @input="outputChange"
            @keypress="isNumber"
          >
          <button
            class="iAoRgd"
            @click="tlShow = true;field = 'outputToken'"
          >
            <span class="rTZzf">
              {{ form.outputToken.symbol || $t('choose-coin') }}
              <i class="el-icon-arrow-down" />
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="hYLPFg">
      <div class="exKIZr" />
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">{{ $t('exchange-ratio') }}</span>
        <span v-if="exchangeRate">1 CNY = {{ exchangeRate }} {{ form.outputToken.symbol }}</span>
        <span v-else> - </span>
      </div>
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">{{ $t('current-total-liquid-gold-pool') }}</span>
        <span v-if="form.outputToken.symbol">{{ currentPoolSize.cny_amount }} CNY + {{ currentPoolSize.token_amount }} {{ form.outputToken.symbol }}</span>
        <span v-else> - </span>
      </div>
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">{{ $t('your-share-of-the-liquid-gold-pool') }} （{{ yourPercent }}）</span>
        <span v-if="form.outputToken.symbol">{{ yourPoolSize.cny_amount }} CNY + {{ yourPoolSize.token_amount }} {{ form.outputToken.symbol }}</span>
        <span v-else> - </span>
      </div>
    </div>
    <div
      v-if="!isDelete"
      class="mHVYT"
      @click="detailShow = !detailShow"
    >
      <span class="fZbbbs">{{ detailShow ? $t('collapse-details') : $t('see-details') }}</span>
      <i :class="detailShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
    </div>
    <div
      v-show="detailShow"
      v-if="!isDelete"
      class="iUPTxf"
    >
      <div class="hRyusy">
        <div>
          {{ $t('you-are-adding') }}
          <span class="iDChvK">
            <span class="jbXIaP">{{ form.input }} CNY</span>
          </span> {{ $t('and-up-to') }}
          <span class="iDChvK">
            <span class="jbXIaP">{{ limitValue }} {{ form.outputToken.symbol }}</span>
          </span>{{ $t('into-the-flowing-gold-pool') }}
        </div>
        <div class="sc-bsbRJL kxtVAF">
          {{ $t('you-will-dig') }}
          <span class="iDChvK">
            <span class="jbXIaP"> {{ youMintTokenAmount }} </span>
          </span>
          {{ $t('liquid-gold-Token-as-a-certificate') }}
        </div>
        <div class="sc-bsbRJL kxtVAF">
          {{ $t('the-current-total-amount-of-liquid-gold-Token-is') }}
          <span class="iDChvK">
            <span class="jbXIaP"> {{ currentPoolSize.total_supply || 0 }} </span>
          </span>
        </div>
      </div>
    </div>
    <!-- 提交 -->
    <div class="hGStes">
      <button
        :disabled="btnDisabled"
        class="jBltiI"
        @click="onSubmit"
      >
        {{ poolSelected.text }}
      </button>
    </div>
    <OrderModal
      v-model="orderShow"
      :form="{...form, type: 'add', limitValue, youMintTokenAmount}"
    />
    <TokenListModal
      v-model="tlShow"
      :addon="false"
      @selectToken="selectToken"
    />
    <PoolSelectModal
      v-model="psShow"
      @selectPool="selectPool"
    />
    <TradeLog
      :tokens-id="tokensId"
      type="liquidity"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import OrderModal from './OrderModal'
import TokenListModal from './TokenList'
import PoolSelectModal from './PoolSelect'
import TradeLog from './TradeLog'
import { CNY, INPUT, OUTPUT } from './consts.js'
import utils from '@/utils/utils'

export default {
  components: {
    OrderModal,
    TokenListModal,
    PoolSelectModal,
    TradeLog
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
      },
      balance: {
        add: 0, // 添加流动性余额
        delete: 0 // 删除流动性余额
      }
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    tokensId() {
      const result = []
      const { outputToken } = this.form
      if (!utils.isNull(outputToken) && outputToken.id !== 0) {
        result.push(outputToken.id)
      }
      return result
    },
    yourPercent() {
      const yourSupply = parseFloat(this.yourPoolSize.your_supply)
      const totalSupply = parseFloat(this.currentPoolSize.total_supply)
      if (yourSupply === 0 || totalSupply === 0) {
        return '0%'
      } else {
        return `${(yourSupply / totalSupply * 100).toFixed(2)}%`
      }
    },
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
      const { input, output, outputToken } = this.form
      const { outputPoolSize } = this
      // 检查余额情况
      if (!this.checkBalance(false)) {
        return true
      }
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
        return (parseFloat(output) / (1 - this.priceSlippage)).toFixed(4)
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
  async mounted() {
    await this.getTokenBySymbol()
  },
  methods: {
    async getTokenBySymbol() {
      console.log(this.$route);
      const { output = '' } = this.$route.query
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
        this.$message({ showClose: true, message: this.$t('error.pleaseLogin'), type: 'info', customClass: 'zindex-3000' })
        this.$store.commit('setLoginModal', true)
        return false
      }
      return true
    },
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
        const { inputToken, output, outputToken } = this.form
        if (!utils.isNull(output) && !utils.isNull(outputToken)) {
          this.getOutputPoolSize(output, outputToken.id)
          this.getInputAmount(inputToken.id, outputToken.id, output)
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
        this.getUserBalance(token.id, this.isDelete ? 'delete' : 'add')
        if (this.isDelete) {
           /*---------------------- 删除流动金逻辑开始 ---------------------*/
          const { inputToken, output } = this.form
          if (!utils.isNull(output)) {
            this.getOutputPoolSize(output, token.id)
            this.getInputAmount(inputToken.id, token.id, output)
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
      this.addRouterQuery(token.symbol)
    },
    getInputAmount(inputTokenId, outputTokenId, outputAmount) {
      const deciaml = 4
      const _outputAmount = utils.toDecimal(outputAmount, deciaml)
      this.$API.getInputAmount(inputTokenId, outputTokenId, _outputAmount).then((res) => {
        if (res.code === 0) {
          this.form.input = parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4)
        }
      })
    },
    getOutputAmount(inputTokenId, outputTokenId, inputAmount) {
      const deciaml = 4
      const _inputAmount = utils.toDecimal(inputAmount, deciaml)
      this.$API.getPoolCnyToTokenPrice(inputTokenId, outputTokenId, _inputAmount).then((res) => {
        if (res.code === 0) {
          this.outputReadOnly = true
          this.form.output = parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4)
          this.checkBalance()
        } else {
          this.form.output = ''
          this.outputReadOnly = false
        }
      })
    },
    onSubmit() {
      if (!this.checkLogin()) return
      if (this.isDelete) {
        this.removeLiquidity()
      } else {
        // 添加流动性创建订单
        this.$store.dispatch('order/createOrder', {
          ...this.form,
          type: 'add'
        })
      }
    },
    addLiquidity() {
      const { input, output, outputToken } = this.form
      this.orderShow = true
      // this.$API
      //   .wxpay({
      //     total: utils.toDecimal(input, outputToken.decimals), // 单位yuan
      //     title: `添加流动金`,
      //     type: 'add', // type类型见typeOptions：add，buy_token，sale_token
      //     token_id: outputToken.id,
      //     token_amount: utils.toDecimal(output, outputToken.decimals),
      //     limit_value: utils.toDecimal(this.limitValue, outputToken.decimals),
      //     decimals: outputToken.decimals,
      //     min_liquidity: utils.toDecimal(this.youMintTokenAmount, outputToken.decimals)
      //   })
      //   .then(res => {
      //     this.order = res
      //     this.orderShow = true
      //   })
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
        this.checkBalance()
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
          this.successNotice('流动金删除成功，即将刷新页面')
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          this.errorNotice('流动金删除失败，请刷新重试')
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
        }
      })
    },
    // 检测余额
    checkBalance(showError = true) {
      // 添加流动性
      if (!this.isDelete) {
        const { output, outputToken } = this.form
        // 添加流动性的余额
        const addBalance = this.balance.add
        // 输入通证存在，且不是rmb
        if (!utils.isNull(outputToken) && outputToken.id !== 0) {
          // 输入大于余额
          if (parseFloat(output) > parseFloat(addBalance)) {
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
      } else { // 删除流动性
        const { output, outputToken } = this.form
        if (!utils.isNull(outputToken) && outputToken.id !== 0) {
          if (parseFloat(this.yourPoolSize.cny_amount) < parseFloat(this.outputPoolSize.cny_amount)) {
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
      }
      return true
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
