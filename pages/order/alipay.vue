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
  }
}
</script>

<style lang="less">
@purple: #542de0;
</style>
