<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    width="500px"
    :lock-scroll="false"
    custom-class="br10 nopadding"
    :before-close="handleClose"
  >
    <div class="container" v-loading="loading">
      <div class="padding20">
        <img src="@/assets/img/m_logo.png" alt="logo">
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
                交易类型：
              </td><td>{{ tradeType }}</td>
            </tr>
            <tr>
              <td class="order-key">
                创建时间：
              </td><td>{{ friendlyTime }}</td>
            </tr>
            <tr>
              <td class="order-key">
                订单编号：
              </td><td>{{ tradeNo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="order-item">
        <el-table
          header-cell-class-name="grayHeader"
          :data="orderItems"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="品名">
          </el-table-column>
          <el-table-column
            prop="operating"
            label="操作">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="total"
            label="小计">
          </el-table-column>
        </el-table>
      </div>
      <div class="balanceBox">
        <div class="flexBox padding20">
          <div>
            <el-tooltip  placement="bottom" effect="light">
              <div slot="content">您的交易可能由于正常的价格波动而失败，<br/>
                  预置币格波动区间将有助于您的交易成功。<br/>
                  交易成功后，多支付的金额会退回。</div>
              <i class="el-icon-question" />
            </el-tooltip>
            预期价格波动：1%
          </div>
          <div>
            <span class="money-label">
              <el-tooltip  placement="bottom" effect="light">
                <div slot="content">CNY 交易金额精度大于 0.01 时会自动进位支付，<br/>多支付的金额会保留在您的CNY账户中。</div>
                <i class="el-icon-question" />
              </el-tooltip>
              合计：
            </span>
            <span class="money">{{cnyAmount.toFixed(2)}} CNY</span></div>
        </div>
        <div class="flexBox padding20 bgGray">
          <div><el-checkbox v-model="useBalance" @change="useBalanceChange">使用余额（{{balance}} CNY）</el-checkbox></div>
          <div><span class="money-label">抵扣：</span><span class="money">{{deduction.toFixed(2)}} CNY</span></div>
        </div>
        <div class="flexBox padding20">
          <div></div>
          <div><span class="money-label">应付：</span><span class="money">{{needPay.toFixed(2)}} CNY</span></div>
        </div>
      </div>
      <!-- <div class="payBtnBox">
        <el-button type="primary" @click="onSubmit">确认支付</el-button>
      </div>
      <el-dialog
        title=""
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="qrcodeShow"
        :before-close="handleClose"
        width="300px">
        <QRCode :pay-link="payLink" />
      </el-dialog> -->
      <QRCode v-if="needPay > 0" :pay-link="payLink" v-loading="qrcodeLoading"/>
      <div v-else class="payBtnBox">
        <el-button type="primary" @click="onSubmit">确认使用余额支付</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import QRCode from '@/components/exchange/Qrcode'
import { mapGetters } from 'vuex'
import utils from '@/utils/utils'
import moment from 'moment'
const interval = 5000
export default {
  name: 'OrderModal',
  components: {QRCode},
  props: {
    tradeNo: {
      type: String,
      default: ''
    },
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
    tradeType() {
      return '购买文章'
    },
    friendlyTime() {
      return moment(this.order.create_time).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    cnyAmount() {
      if (this.order.total) {
        return utils.up2points(utils.fromDecimal(this.order.total))
      } else {
        return 0
      }
    },
    deduction() {
      let input = parseFloat(this.cnyAmount)
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
      let input = parseFloat(this.cnyAmount)
      let deduction = this.deduction;
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
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      if (val) {
        this.getOrderData()
        this.weixinPay()
        this.getUserBalance()
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
      useBalance: false,
      qrcodeShow: false,
      payLink: '',
      qrcodeLoading: true,
      orderItems: []
    }
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    onSubmit() {
      this.loading = true
      if (this.needPay > 0) {
        this.weixinPay()
      } else {
        this.balancePay()
      }
    },
    handleClose() {
      clearInterval(this.timer)
      this.qrcodeShow = false
    },
    getOrderData() {
      this.loading = true
      this.$API.getArticleOrder(this.tradeNo).then(res => {
        this.loading = false
        if (res.code === 0) {
          const status = Number(res.data.status)
          if(status === 7 || status === 8) {
            this.errorNotice('订单支付已失败')
          }
          if(status === 6 || status === 9) {
            this.errorNotice('订单已支付')
          }
          this.order = res.data
          this.useBalance = Boolean(res.data.use_balance)
          this.orderItems = this.handleOrderItem(res.data.items)
        } else {
          this.errorNotice('订单不存在')
        }
      })
    },
    handleOrderItem(items) {
      let result = []
      const t1 = items.orderPriceItem
      const t2 = items.orderTokenItem
      if (t1) {
        result.push({
          name: t1.symbol,
          operating: '支付',
          amount: utils.fromDecimal(t1.amount),
          total: utils.up2points(utils.fromDecimal(t1.price)) + ' CNY'
        })
      }
      if (t2) {
        result.push({
          name: t2.symbol,
          operating: '购买',
          amount: utils.fromDecimal(t2.token_amount),
          total: utils.up2points(utils.fromDecimal(t2.cny_amount)) + ' CNY',
        })
      }
      return result
    },
    weixinPay() {
      this.qrcodeLoading = true
      this.$API.articleNativePay(this.tradeNo).then(res => {
        this.loading = false
        this.payLink = res.code_url
        this.qrcodeShow = true
        this.qrcodeLoading = false
        this.timer = setInterval(() => {
          this.getOrderStatus(this.order.trade_no)
        }, interval)
      })
    },
    // 使用余额支付
    balancePay() {
      this.$API.handleAmount0(this.tradeNo).then(res => {
        if (res.code === 0) {
          this.loading = false
          this.showModal = false
          this.successNotice('交易成功，即将刷新页面')
          clearInterval(this.timer)
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      })
    },
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
      clearInterval(this.timer)
      this.$API.updateArticleOrder(this.tradeNo, { useBalance: Number(v) }).then(res => {
        if (res.code === 0) {
          if (this.needPay > 0) this.weixinPay()
        }
      })
    },
    getUserBalance() {
      this.$API.getCNYBalance().then(res => {
        this.balance = utils.fromDecimal(res)
      })
    },
    handleClose() {
      clearInterval(this.timer)
      this.showModal = false
    },
    getOrderStatus(tradeNo) {
      this.$API.getArticleOrder(tradeNo).then(res => {
        if (res.code === 0) {
          const status = Number(res.data.status)
          if (status === 7 || status === 8) {
            this.errorNotice('交易失败，等待退款，请重试')
            clearInterval(this.timer)
            this.showModal = false
          }
          if (status === 6 || status === 9) {
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
  }
}
</script>
<style lang="less">
.container {
  .grayHeader {
    color: #B2B2B2;
    font-weight: 400;
    padding: 6px 0;
  }
}
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
  .order-item {
    margin: 20px 20px 0;
  }
}
</style>
