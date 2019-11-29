<template>
<div class="main">
  <g-header />
  <div class="order outer-container" v-loading="loading">
    <el-alert
      title="请仔细核对订单信息，如果有误请取消后再次尝试"
      effect="dark"
      type="warning">
    </el-alert>
    <!-- <p></p> -->
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
    <div class="order-item">
      <el-table header-cell-class-name="grayHeader" :data="orderItems" style="width: 100%">
        <el-table-column prop="name" label="品名"> </el-table-column>
        <el-table-column prop="operating" label="操作"> </el-table-column>
        <el-table-column prop="amount" label="数量"> </el-table-column>
        <el-table-column prop="total" label="小计"> </el-table-column>
      </el-table>
    </div>
    <div class="flexBox">
      <span>预期价格波动：1% </span>
      <div>
        合计：<span class="money">¥ {{ cnyAmount.toFixed(2) }}</span>
      </div>
    </div>
    <div class="flexBox">
      <div>
        <el-checkbox
          v-model="useBalance"
          @change="useBalanceChange"
          >使用余额（¥ {{ balance }}）</el-checkbox>
      </div>
      <div>
        抵扣：<span class="money">¥ {{ deduction.toFixed(2) }}</span>
      </div>
    </div>
    <div class="flexBox">
      <div></div>
      <div>应付：<span class="money">¥ {{needPay.toFixed(2)}}</span>
      </div>
    </div>
    <div class="tip">
      <p>
        <i class="el-icon-warning" />
        您的交易可能由于正常的价格波动而失败，预期价格波动区间将有助于您的交易成功。交易成功后，多支付的金额会退回。
      </p>
      <p>
        <i class="el-icon-warning" />
        CNY 交易金额精度大于 0.01 时会自动进位支付，多支付的金额会保留在您的CNY账户中。
      </p>
    </div>
    <div class="btns">
      <el-button type="primary" @click="onSubmit" class="pay-btn">
        确认支付
      </el-button>
    </div>
    <el-dialog
      title=""
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="qrcodeShow"
      :before-close="handleClose"
      width="300px"
    >
      <QRCode :pay-link="payLink" />
    </el-dialog>
  </div>
</div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import moment from 'moment'
import QRCode from '@/components/exchange/Qrcode'
import utils from '@/utils/utils'

const interval = 5000
export default {
  name: 'Order',
  components: { QRCode },
  data() {
    return {
      timer: null,
      tradeNo: 0,
      order: {},
      balance: 0,
      loading: false,
      useBalance: false,
      form: {
        input: '',
        inputToken: {},
        output: '',
        outputToken: {},
        base: '',
        limitValue: ''
      },
      qrcodeShow: false,
      payLink: '',
      orderItems: [],
      articleId: ''
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    tradeType() {
      const typeOptions = {
        add: '添加流动性',
        buy_token_input: '购买Fan票',
        buy_token_output: '购买Fan票',
        sale_token: '出售Fan票',
      };
      if (this.articleId) {
        return `购买文章${this.articleId}`
      } else {
        const type = this.order.items ? this.order.items.orderTokenItem.type : null
        return typeOptions[type] || '暂无'
      }
    },
    cnyAmount() {
      if (this.order.total) {
        return utils.up2points(utils.fromDecimal(this.order.total))
      } else return 0
    },
    friendlyTime() {
      return moment(this.order.create_time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 是否是微信账户
    isWeixinAccount() {
      return this.currentUserInfo.idProvider === 'weixin'
    },
    // 是否处于微信浏览器
    isInWeixin() {
      const isWeixin = () => /micromessenger/.test(navigator.userAgent.toLowerCase())
      return isWeixin()
    },
    // 扣除
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
  mounted() {
    this.getOrderData()
    this.getUserBalance()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleClose() {
      clearInterval(this.timer)
      this.qrcodeShow = false
    },
    onSubmit() {
      if (this.needPay > 0) {
        this.weixinPay()
      } else {
        this.balancePay()
      }
    },
    alert(message) {
      this.$alert(`${message}，点击确定返回`, '温馨提示', {
        showClose: false,
        callback: action => {
          this.$router.go(-1)
        }
      })
    },
    getOrderData() {
      this.loading = true
      const id = this.$route.params.id
      this.tradeNo = id
      this.$API.getOrderData(id).then(res => {
        this.loading = false
        if (res.code === 0) {
          const status = Number(res.data.status)
          if (status === 7 || status === 8) {
            this.alert('订单支付已失败')
          }
          if (status === 6 || status === 9) {
            this.alert('订单已支付')
          }
          this.order = res.data
          this.articleId = res.data.items.orderPriceItem ? res.data.items.orderPriceItem.signid : ''
          this.useBalance = Boolean(res.data.use_balance)
          this.orderItems = this.handleOrderItem(res.data.items)
        } else {
          this.alert('订单不存在')
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
          total: utils.up2points(utils.fromDecimal(t2.cny_amount)) + ' CNY'
        })
      }
      return result
    },
    // 是否使用余额修改
    useBalanceChange(v) {
      this.loading = true
      clearInterval(this.timer)
      this.$API.updateOrder(this.tradeNo, { useBalance: Number(v) }).then(res => {
        this.loading = false
        if (res.code === 0) {
          // this.getOrderData()
        }
      })
    },
    // 使用余额支付
    balancePay() {
      this.loading = true
      this.$API.handleAmount0(this.tradeNo).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.alert('交易成功')
        } else {
          this.alert('交易失败')
        }
      })
    },
    // 使用微信支付
    weixinPay() {
      this.loading = true
      const { tradeNo } = this
      // 当前是否处于微信浏览器中
      if (this.isInWeixin) {
        let openid = ''
        if (this.isWeixinAccount) {
          // 微信账号直接使用JSAPI微信支付
          openid = this.currentUserInfo.name
        } else {
          // 不是微信账号需要先获取openid
          openid = window.localStorage.getItem('WX_OPENID')
        }
        this.$API.wxJsapiPay(tradeNo, openid, this.tradeType).then(res => {
          this.loading = false
          this.weakWeixinPay(res)
        })
      } else {
        // 弹出NATIVE支付二维码
        this.$API.wxNativePay(tradeNo, this.tradeType).then(res => {
          this.loading = false
          this.payLink = res.code_url
          this.qrcodeShow = true
          this.timer = setInterval(() => {
            this.getOrderStatus(this.order.trade_no)
          }, interval)
        })
      }
      const openid = this.currentUserInfo.name
    },
    // 唤起JS微信支付
    weakWeixinPay(order) {
      const { appId, timeStamp, nonceStr, signType, paySign } = order
      const self = this
      function onBridgeReady() {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            appId,
            timeStamp,
            nonceStr,
            package: order.package,
            signType,
            paySign
          },
          function(res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              self.alert('交易成功')
            }
          }
        )
      }
      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
      } else {
        onBridgeReady()
      }
    },
    // 获取用户账户余额
    getUserBalance() {
      this.$API.getCNYBalance().then(res => {
        this.balance = utils.fromDecimal(res)
      })
    },
    // 获取订单状态
    getOrderStatus(tradeNo) {
      this.$API.getOrderData(tradeNo).then(res => {
        if (res.code === 0) {
          const status = Number(res.data.status)
          if (status === 7 || status === 8) {
            clearInterval(this.timer)
            this.qrcodeShow = false
            this.alert('交易失败，等待退款')
          }
          if (status === 6 || status === 9) {
            clearInterval(this.timer)
            this.qrcodeShow = false
            this.alert('交易成功')
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
@purple: #542de0;
.order {
  .grayHeader {
    color: #B2B2B2;
    font-weight: 400;
    padding: 6px 0;
    font-size: 15px;
  }
}
</style>
<style scoped lang="less">
.main {
  .minHeight();
}
.outer-container {
  background: white;
  padding: 20px;
  width: 600px;
  margin: 20px auto 40px;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.16);
  position: relative;
  border-radius: 4px;
}
.order {
  .img-container {
    width: 100%;
    background: #ffffff;
    .logo {
      padding: 16px;
      width: 300px;
    }
  }
  .bgGray {
    background: #f0f0f0;
  }
  .order-table {
    tr {
      border: 1px solid #ccc;
      color: #000;
      .order-key {
        color: #666;
        white-space: nowrap;
      }
    }
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 10px 16px;
    font-size: 14px;
  }
  .money {
    color: #542de0;
    font-size: 20px;
  }
  .payBtnBox {
    padding: 20px 0;
    text-align: center;
  }
  .wxpay-btn {
    text-align: center;
    padding: 20px 0;
  }
  .wxpay-icon {
    font-size: 18px;
  }
  .tip {
    padding: 16px 0;
    font-size: 14px;
    p {
      color: #bbbbbb;
      margin-bottom: 16px;
    }
  }
  .order-item {
    margin-top: 10px;
  }
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
    margin: 15px 0;
    tr {
      border: 1px solid #ccc;
      color: #000;
      font-size: 14px;
      line-height: 24px;
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
    margin: 15px 0;
    padding: 0;
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
  .btns {
    text-align: center;
    .pay-btn {
      width: 200px
    }
  }
}
</style>
