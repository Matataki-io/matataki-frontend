
import { MessageBox, Loading } from 'element-ui'
import utils from '@/utils/utils'
import API from '@/api/API'

export const getters = {
  makeOrderParams: () => ({ input, output, outputToken, needToken = true, needPrice = false, signId, type }) => {
    console.log(input, output, outputToken)
    const requestParams = {
      useBalance: 0,
      items: []
    }
    if (needToken) {
      requestParams.items.push({
        tokenId: outputToken.id,
        type: type || 'buy_token_output',
        cny_amount: utils.toDecimal(input, outputToken.decimals),
        amount: utils.toDecimal(output, outputToken.decimals)
      })
    }
    if (needPrice) {
      requestParams.items.push({
        signId,
        type: type || 'buy_post'
      })
    }
    return requestParams
  }
}

export const actions = {
  // 创建订单
  createOrder({ getters }, data) {
    const loading = Loading.service({
      lock: false,
      text: '订单创建中...',
      background: 'rgba(0, 0, 0, 0.4)'
    })
    const requestParams = getters.makeOrderParams(data)
    API.createOrder(requestParams)
      .then(res => {
        loading.close()
        if (res.code === 0) {
          this.$router.push({ name: 'order-id', params: { id: res.data } })
        } else {
          MessageBox.alert('订单创建失败', '温馨提示')
        }
      })
  }
}
