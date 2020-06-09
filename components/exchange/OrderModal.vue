<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    :lock-scroll="false"
    :before-close="handleClose"
    width="500px"
    custom-class="br10 nopadding"
  >
    <div
      v-loading="loading"
      class="container"
    >
      <div class="padding20">
        <img
          src="@/assets/img/m_logo.png"
          alt="logo"
        >
        <p>请仔细核对订单信息，如果有误请取消后再次尝试</p>
        <table class="order-table">
          <tbody>
            <tr>
              <td class="order-key">
                交易账号：
              </td><td>{{ currentUserInfo.nickname || currentUserInfo.name }}</td>
            </tr>
            <tr>
              <td class="order-key">
                交易内容：
              </td><td>{{ form.outputToken.symbol }}</td>
            </tr>
            <tr>
              <td class="order-key">
                交易数量：
              </td><td>{{ form.output }}</td>
            </tr>
            <tr>
              <td class="order-key">
                创建时间：
              </td><td>{{ friendlyTime }}</td>
            </tr>
            <tr>
              <td class="order-key">
                订单编号：
              </td><td>{{ order.trade_no }}</td>
            </tr>
            <!-- <tr>
              <td class="order-key">
                交易金额：
              </td>
              <td>
                ￥ {{ input }}
                <el-tooltip  placement="bottom" effect="light">
                  <div slot="content">CNY 交易金额精度大于 0.01 时会自动进位支付，<br/>多支付的金额会保留在您的CNY账户中。</div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <div class="balanceBox">
        <div class="flexBox padding20">
          <div>
            <el-tooltip
              placement="bottom"
              effect="light"
            >
              <div slot="content">
                您的交易可能由于正常的价格波动而失败，<br>
                预期价格波动区间将有助于您的交易成功。<br>
                交易成功后，多支付的金额会退回。
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
            预期价格波动：1%
          </div>
          <div>
            <span class="money-label">
              <el-tooltip
                placement="bottom"
                effect="light"
              >
                <div slot="content">CNY 交易金额精度大于 0.01 时会自动进位支付，<br>多支付的金额会保留在您的CNY账户中。</div>
                <i class="el-icon-question" />
              </el-tooltip>
              合计：
            </span>
            <span class="money">{{ input.toFixed(2) }} CNY</span>
          </div>
        </div>
        <div class="flexBox padding20 bgGray">
          <div>
            <el-checkbox
              v-model="useBalance"
              @change="useBalanceChange"
            >
              使用余额（{{ balance }} CNY）
            </el-checkbox>
          </div>
          <div><span class="money-label">抵扣：</span><span class="money">{{ deduction.toFixed(2) }} CNY</span></div>
        </div>
        <div class="flexBox padding20">
          <div />
          <div><span class="money-label">应付：</span><span class="money">{{ needPay.toFixed(2) }} CNY</span></div>
        </div>
      </div>
      <QRCode
        v-if="needPay > 0"
        :pay-link="order.code_url"
      />
      <div
        v-else
        class="payBtnBox"
      >
        <el-button
          type="primary"
          @click="confirmPay"
        >
          确认支付
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import QRCode from './Qrcode'
import { mapGetters } from 'vuex'
import utils from '@/utils/utils'
const interval = 5000
export default {
  name: 'OrderModal',
  components: {
    QRCode
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({
        input: '',
        inputToken: {},
        output: '',
        outputToken: {},
        base: '',
        limitValue: ''
      })
    },
    // order: {
    //   type: Object,
    //   default: () => ({
    //     code_url: 'weixin://wxpay/bizpayurl?pr=xPK7OBM',
    //     trade_no: ''
    //   })
    // }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    friendlyTime() {
      return this.moment(parseInt(this.order.timeStamp) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    input() {
      if (this.form.input) {
        return utils.up2points(this.form.input)
      } else {
        return 0
      }
    },
    deduction() {
      let input = parseFloat(this.form.input)
      let balance = parseFloat(this.balance)
      let result = 0
      if (this.useBalance) {
        if (balance >= input) {
          result = input
        } else {
          result = balance
        }
      } else {
        result = 0
      }
      return utils.down2points(result)
    },
    needPay() {
      // 支付金额向上取整
      let input = utils.up2points(this.form.input)
      let deduction = this.deduction
      if (this.useBalance) {
        if (deduction >= input) {
          return 0
        } else {
          return input - deduction
        }
      } else {
        return input
      }
    }
  },
  watch: {
    // 'order.trade_no': {
    //   handler(v) {
    //     if (!utils.isNull(v)) {
    //       clearInterval(this.timer)
    //       this.timer = setInterval(() => {
    //         this.getOrderStatus(v)
    //       }, interval)
    //     }
    //   },
    //   deep: true
    // },
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      if (val) {
        this.createOrder()
        this.getCNYBalance()
      }
      this.showModal = val
    }
  },
  data() {
    return {
      showModal: false,
      timer: null,
      order: {},
      balance: 0,
      loading: false,
      useBalance: false
    }
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    confirmPay() {
      const handler = (res) => {
        this.loading = false
        if (res === 0) {
          this.successNotice('交易成功，即将刷新页面')
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          this.errorNotice('交易失败，请重试')
          this.showModal = false
        }
      }
      this.loading = true
      const deadline = Math.floor(Date.now() / 1000) + 300;
      const { input, inputToken, output, outputToken, limitValue, type, youMintTokenAmount } = this.form
      if (type === 'add') {
        this.$API.addLiquidityBalance({
          tokenId: outputToken.id,
          cny_amount: utils.toDecimal(input),
          token_amount: utils.toDecimal(output),
          min_liquidity: utils.toDecimal(youMintTokenAmount),
          max_tokens: utils.toDecimal(limitValue),
          deadline
        }).then(res => handler(res))
      } else if (type === 'buy_token_input') {
        this.$API.cnyToTokenInputBalance({
          tokenId: outputToken.id,
          cny_sold: utils.toDecimal(input),
          min_tokens: utils.toDecimal(limitValue),
          deadline
        }).then(res => handler(res))
      } else if (type === 'buy_token_output') {
        this.$API.cnyToTokenOutputBalance({
          tokenId: outputToken.id,
          tokens_bought: utils.toDecimal(output),
          max_cny: utils.toDecimal(limitValue),
          deadline
        }).then(res => handler(res))
      }
    },
    // 是否使用余额修改
    useBalanceChange(v) {
      this.createOrder();
      clearInterval(this.timer)
    },
    createOrder() {
      this.loading = true
      const { input, inputToken, output, outputToken, limitValue, type } = this.form
      let requestParams = {
        total: utils.toDecimal(input, outputToken.decimals), // 单位yuan
        title: `购买${outputToken.symbol}`,
        type, // type类型见typeOptions：add，buy_token_input，buy_token_output
        token_id: outputToken.id,
        token_amount: utils.toDecimal(output, outputToken.decimals),
        limit_value: utils.toDecimal(limitValue, outputToken.decimals),
        decimals: outputToken.decimals,
        pay_cny_amount: utils.toDecimal(this.needPay)
      }
      console.log(requestParams);
      // 添加out_trade_no参数
      // if (!needCreate) {
      //   requestParams.out_trade_no = this.order.trade_no
      // }
      if (type === 'add') {
        requestParams = {
          ...requestParams,
          title: `添加流动金`,
          min_liquidity: utils.toDecimal(this.form.youMintTokenAmount)
        }
      } else {
        requestParams = {
          ...requestParams,
          title: `购买${outputToken.symbol}`
        }
      }
      this.$API
        .wxpay(requestParams)
        .then(res => {
          this.loading = false
          this.order = res
          if (this.needPay > 0) {
            this.timer = setInterval(() => {
              this.getOrderStatus(this.order.trade_no)
            }, interval)
          }
        })
    },
    getCNYBalance() {
      this.$API.getCNYBalance().then(res => {
        this.balance = utils.fromDecimal(res)
      })
    },
    handleClose() {
      clearInterval(this.timer)
      this.showModal = false
    },
    getOrderStatus(tradeNo) {
      this.$API.getOrderStatus(tradeNo).then(res => {
        if (res.code === 0) {
          if (res.data === 7 || res.data === 8) {
            this.errorNotice('交易失败，等待退款，请重试')
            clearInterval(this.timer)
            this.showModal = false
          }
          if (res.data === 6 || res.data === 9) {
            this.successNotice('交易成功，即将刷新页面')
            clearInterval(this.timer)
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
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
    }
  }
}
</script>
<style lang="less">
.nopadding {
  .el-dialog__body {
    padding: 0
  }
}
</style>
<style scoped lang="less">
.container {
  .bgGray {
    background: #f0f0f0;
  }
  .padding20 {
    padding: 0 20px;
  }
  img {
    width: 200px;
  }
  .order-table {
    tr {
      border: 1px solid #ccc;
      color: #000;
      .order-key {
        color: #666;
      }
    }
  }
  .balanceBox {
    margin-top: 30px;
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 15px 20px;
  }
  .money {
    color: @purpleDark;
    display: inline-block;
    text-align: right;
    width: 80px;
  }
  .payBtnBox {
    padding: 20px 0;
    text-align: center;
  }
  .money-label {
    display: inline-block;
    text-align: right;
    width: 65px;
  }
}
</style>
