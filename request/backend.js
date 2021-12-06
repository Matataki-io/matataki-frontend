import https from 'https'
import axios from 'axios'
import { Base64 } from 'js-base64'
import { toPrecision } from '@/utils/precisionConversion'
import utils from '@/utils/utils'
/* eslint-disable */
// Doc : https://github.com/axios/axios

export const urlAddress = process.env.VUE_APP_URL
// 获取图片直接使用接口地址
export const apiServer = process.env.VUE_APP_API

const ssImgAddress = 'https://smartsignature-img.oss-cn-hongkong.aliyuncs.com'

const axiosforApiServer = axios.create({
  baseURL: apiServer,
  headers: { Accept: '*/*', lang: 'zh' },
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
})

// accessToken with localStorage
export const accessTokenAPI = {
  get() {
    const token = utils.getCookie('ACCESS_TOKEN')
    //const token = window.localStorage.getItem('ACCESS_TOKEN')
    if (token === 'null' || token === 'undefined') {
      this.rm()
      return this.get()
    }
    return token
  },
  set(token) {
    if (!token) this.rm()
    else utils.setCookie('ACCESS_TOKEN', token)
    //window.localStorage.setItem('ACCESS_TOKEN', token)
  },
  rm() {
    utils.delCookie('ACCESS_TOKEN')
    //window.localStorage.removeItem('ACCESS_TOKEN')
  },
  /*
   * 拆token，返回json对象
   * {iss:用户名，exp：token的过期时间，用ticks的形式表示}
   */
  disassemble(token) {
    if (!token) return { iss: null, exp: 0, platform: null, id: null }
    let tokenPayload = token.substring(token.indexOf('.') + 1)
    tokenPayload = tokenPayload.substring(0, tokenPayload.indexOf('.'))
    return JSON.parse(Base64.decode(tokenPayload))
  }
}

const API = {
  accessToken: null,
  /* eslint no-param-reassign: ["error", { "props": false }] */
  async accessBackend(config) {
    let token = null
    try {
      token = await this.accessToken
    } catch (error) {
      // console.debug(error);
    }
    console.debug('x-access-token :', token)
    // https://blog.fundebug.com/2018/07/25/es6-const/
    if (token) config.headers = { 'x-access-token': token }
    if (config.data && config.data.platform && config.data.platform === 'need') {
      config.data.platform = accessTokenAPI.disassemble(token).platform
    }
    return axiosforApiServer(config)
  },
  async reportOrder(order) {
    const data = {
      ...order,
      platform: 'need',
      referrer: order.sponsor.id
    }
    const { idProvider } = data
    data.amount = toPrecision(data.amount, idProvider)
    delete data.idProvider
    delete data.sponsor
    return this.accessBackend({ method: 'POST', url: '/order/order', data })
  },
  async reportShare(share) {
    const data = {
      ...share,
      platform: 'need',
      referrer: share.sponsor.id
    }
    const { idProvider } = data
    data.amount = toPrecision(data.amount, idProvider)
    delete data.idProvider
    delete data.sponsor
    return this.accessBackend({ method: 'POST', url: '/support/support', data })
  },

  /*
   * 根据用户名，公钥，客户端签名请求access_token
   */
  async auth({ idProvider, publicKey: publickey, signature: sign, username }) {
    let params = {
      platform: idProvider.toLowerCase(),
      publickey,
      sign,
      username
    }
    // 推荐人id
    let referral = utils.getCookie('referral')
    if (referral) Object.assign(params, { referral: referral })
    return axiosforApiServer.post(
      '/login/auth',
      params,
      {
        headers: { Authorization: 'Basic bXlfYXBwOm15X3NlY3JldA==' }
      }
    )
  },
  // 获取单篇文章的信息 by hash or id  需要 token 否则无法获取投资状态
  async getArticleInfo(hashOrId) {
    const reg = /^[0-9]*$/
    // post hash获取  ， p id 短链接
    const url = reg.test(hashOrId) ? 'p' : 'post'
    return this.accessBackend({ url: `/${url}/${hashOrId}` })
  },
  async follow({ id }) {
    return this.accessBackend({
      method: 'POST',
      url: '/follow/follow',
      data: { uid: id }
    })
  },
  async unfollow({ id }) {
    return this.accessBackend({
      method: 'POST',
      url: '/follow/unfollow',
      data: { uid: id }
    })
  },
  async getMyUserData() {
    return this.accessBackend({ url: '/user/stats' })
  },
  async getUser({ id }) {
    return this.accessBackend({ url: `/user/${id}` })
  },
  // 设置头像
  async uploadAvatar(data = { avatar: null }) {
    return this.accessBackend({
      method: 'POST',
      url: '/user/setAvatar',
      data
    })
  },
  // 获取账户资产列表 暂时没有EOS数据
  async getBalance() {
    return this.accessBackend({ url: '/user/balance' })
  },
  async withdraw(rawData) {
    const data = { ...rawData, platform: rawData.tokenName.toLowerCase() }
    if (rawData.signature) {
      data.publickey = rawData.signature.publicKey
      data.sign = rawData.signature.signature
    }
    delete data.idProvider
    delete data.tokenName
    delete data.signature
    return this.accessBackend({ method: 'POST', url: '/user/withdraw', data })
  },
  loginGitHub(code) {
    let params = { code }

    // 推荐人id
    let referral = utils.getCookie('referral')
    if (referral) Object.assign(params, { referral: referral })

    return axiosforApiServer.post('/login/github', params)
  },
}

export default API
