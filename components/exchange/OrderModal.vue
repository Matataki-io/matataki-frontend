<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    width="500px"
    :lock-scroll="false"
    custom-class="br10"
    :before-close="handleClose"
  >
    <div class="container">
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
              交易内容：
            </td><td>{{ order.outputToken.symbol }}</td>
          </tr>
          <tr>
            <td class="order-key">
              交易数量：
            </td><td>{{ order.output }}</td>
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
          <tr>
            <td class="order-key">
              交易金额：
            </td><td>￥ {{ input }}</td>
          </tr>
        </tbody>
      </table>
      <QRCode :pay-link="order.code_url" />
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
  components: {QRCode},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: () => ({
        code_url: 'weixin://wxpay/bizpayurl?pr=xPK7OBM',
        trade_no: ''
      })
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    friendlyTime() {
      return this.moment(parseInt(this.order.timeStamp) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    input() {
      if (this.order.input) {
        return parseFloat(this.order.input).toFixed(2)
      } else {
        return 0
      }
    }
  },
  watch: {
    'order.trade_no': {
      handler(v) {
        if (!utils.isNull(v)) {
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.getOrderStatus(v)
          }, interval)
        }
      },
      deep: true
    },
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
      timer: null
    }
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleClose() {
      clearInterval(this.timer)
      this.showModal = false
    },
    getOrderStatus(tradeNo) {
      this.$API.getOrderStatus(tradeNo).then(res => {
        if (res.code === 0) {
          if (res.data === 7 || res.data === 8) {
            this.errorNotice('交易失败，等待退款')
            clearInterval(this.timer)
          }
          if (res.data === 6 || res.data === 9) {
            this.successNotice('交易成功')
            clearInterval(this.timer)
          }
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
}
</style>
