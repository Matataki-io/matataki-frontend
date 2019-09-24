<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    width="400px"
    :lock-scroll="false"
    custom-class="br10"
  >
    <div class="container">
      <img src="@/assets/img/m_logo.png" alt="logo">
      <p>请仔细核对订单信息，如果有误请取消后再次尝试</p>
      <table class="order-table">
        <tbody>
          <tr><td class="order-key">交易账号：</td><td>Nickanme123</td></tr>
          <tr><td class="order-key">交易内容：</td><td>{{ order.outputToken }}</td></tr>
          <tr><td class="order-key">交易数量：</td><td>{{ order.output }}</td></tr>
          <tr><td class="order-key">创建时间：</td><td>{{ friendlyTime }}</td></tr>
          <tr><td class="order-key">订单编号：</td><td>{{ order.trade_no }}</td></tr>
          <tr><td class="order-key">交易金额：</td><td>￥ {{ input }}</td></tr>
        </tbody>
      </table>
      <button @click="genQRCode" v-if="notClick">生成支付二维码</button>
      <div ref="qr" class="qrcode" />
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
export default {
  name: 'OrderModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: () => ({
        code_url: 'weixin://wxpay/bizpayurl?pr=xPK7OBM'
      })
    }
  },
  computed: {
    friendlyTime() {
      return this.moment(parseInt(this.order.timeStamp) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    input() {
      if (this.order.input) {
        return this.order.input.toFixed(2)
      } else {
        return 0
      }
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    }
  },
  data() {
    return {
      showModal: false,
      notClick: true
    }
  },
  mounted() {
    /* if (process.client) {
      this.genQRCode()
    } */
  },
  methods: {
    genQRCode() {
      this.notClick = false
      new QRCode(this.$refs.qr, {
        text: this.order.code_url,
        width: 80,
        height: 80
      })
    }
  }
}
</script>

<style scoped lang="less">
.container {
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
  .qrcode {
    background: #ffffff;
    width: 80px;
    height: 80px;
  }
}
</style>
