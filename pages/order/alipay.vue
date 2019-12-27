<template>
  <div>
    <h1>alipay!!!</h1>
    <a :href="href">{{ href }}</a>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  layout: 'empty',
  data() {
    return {
      href: ''
    }
  },
  mounted() {
    this.getAliPay()
    // this.notify()
  },
  methods: {
    getAliPay() {
      request.post('/alipay/pagePay', {
        amount: 0.01,
        title: '测试'
      }).then(res => {
        this.href = res.data
      })
    }
    /* notify() {
      const a = {
        gmt_create: '2019-12-26 20:22:02',
        charset: 'utf-8',
        gmt_payment: '2019-12-26 20:22:05',
        notify_time: '2019-12-26 20:22:06',
        subject: '测试',
        sign: 'QbZDIkPPf8KE72lBKW+mHz/tLlyZdTdUUS7+lw1bW+IM+XdgubxoJUxEb6WVO2wPIh5qleHXfs83s+Ri2Dw1s16jVD8TVoqWn6AoetrlbHHNczTqZYSMatarq51q+C9iwI2cd+QHUaHYeafIMB10WdqlWQFbW6ch86u5T+VTc7Fn6ABdNYrDqhcply6Q/jlHKtJrgI3C1DIh1MxpFyxaib85YrYF/kyDZ06Y38cjeLB/eGd6y6TCE8DPErwJkJYnT+W58Cw6YPQ79XLov+RcVqjRGipSL+61AODsqWbh4q6MG3gw1wTJDJdhtzWEnMKvJoiQrbI+CoplEnvnltks1Q==',
        buyer_id: '2088112441730665',
        invoice_amount: '0.01',
        version: '1.0',
        notify_id: '2019122600222202205030661405957821',
        fund_bill_list: '[{"amount":"0.01","fundChannel":"PCREDIT"}]',
        notify_type: 'trade_status_sync',
        out_trade_no: 'ApR2qYY7qt60fhn97mVSwvgjaTM55Ca',
        total_amount: '0.01',
        trade_status: 'TRADE_SUCCESS',
        trade_no: '2019122622001430661403660216',
        auth_app_id: '2021001100628625',
        receipt_amount: '0.01',
        point_amount: '0.00',
        buyer_pay_amount: '0.01',
        app_id: '2021001100628625',
        sign_type: 'RSA2',
        seller_id: '2088731130400364'
      }
      request.post('/alipay/notify', a).then(res => {
        console.log(res)
      })
    } */
  }
}
</script>

<style lang="less">
@purple: #542de0;
</style>
