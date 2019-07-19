import axios from 'axios'
import https from 'https'
import { Base64 } from 'js-base64'
import { toPrecision } from '../common/precisionConversion'

// Doc : https://github.com/axios/axios

export const urlAddress = process.env.VUE_APP_URL
// 获取图片直接使用接口地址
export const apiServer = process.env.VUE_APP_API

const ssImgAddress = 'https://ssimg.frontenduse.top'

// 代理使用地址
// export const apiServerAdders = process.env.NODE_ENV === 'development' ? '/' : process.env.VUE_APP_API;
// https://github.com/axios/axios/issues/535
const axiosforApiServer = axios.create({
  baseURL: apiServer,
  headers: { Accept: '*/*', lang: 'zh' },
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
})

// accessToken with localStorage
export const accessTokenAPI = {
  get() {
    const token = window.localStorage.getItem('ACCESS_TOKEN')
    if (token === 'null' || token === 'undefined') {
      this.rm()
      return this.get()
    }
    return token
  },
  set(token) {
    if (!token) this.rm()
    else window.localStorage.setItem('ACCESS_TOKEN', token)
  },
  rm() {
    window.localStorage.removeItem('ACCESS_TOKEN')
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
  async sendArticle(
    url,
    { signId = null, author, hash, title, fissionFactor, cover, isOriginal, tags },
    signature = null
  ) {
    return this.accessBackend({
      method: 'POST',
      url,
      data: {
        author,
        cover,
        fissionFactor,
        hash,
        platform: 'need',
        publickey: signature ? signature.publicKey : null,
        sign: signature ? signature.signature : null,
        signId,
        title,
        is_original: isOriginal,
        tags
      }
    })
  },
  async publishArticle({ article, signature }) {
    return this.sendArticle('/publish', article, signature)
  },
  async editArticle({ article, signature }) {
    console.log(article, signature)

    return this.sendArticle('/edit', article, signature)
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
    return this.accessBackend({ method: 'POST', url: '/order', data })
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
    return this.accessBackend({ method: 'POST', url: '/support', data })
  },

  /*
   * 根据用户名，公钥，客户端签名请求access_token
   */
  async auth({ idProvider, publicKey: publickey, signature: sign, username }) {
    return axiosforApiServer.post(
      '/auth',
      {
        platform: idProvider.toLowerCase(),
        publickey,
        sign,
        username
      },
      {
        headers: { Authorization: 'Basic bXlfYXBwOm15X3NlY3JldA==' }
      }
    )
  },
  async getArticleDatafromIPFS(hash) {
    return axios.get(`${apiServer}/ipfs/catJSON/${hash}`)
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
      url: '/follow',
      data: { uid: id }
    })
  },
  async unfollow({ id }) {
    return this.accessBackend({
      method: 'POST',
      url: '/unfollow',
      data: { uid: id }
    })
  },
  async getMyUserData() {
    return this.accessBackend({ url: '/user/stats' })
  },
  async getUser({ id }) {
    return this.accessBackend({ url: `/user/${id}` })
  },
  async sendComment({ comment, signId }) {
    return this.accessBackend({
      method: 'POST',
      url: '/post/comment',
      // eslint-disable-next-line camelcase
      data: { comment, sign_id: signId }
    })
  },
  // be Used in Article Page
  async addReadAmount({ articlehash }) {
    return this.accessBackend({
      method: 'POST',
      url: `/post/show/${articlehash}`
    })
  },
  // 删除文章
  async delArticle({ id }) {
    return this.accessBackend({
      method: 'DELETE',
      url: `/post/${id}`
    })
  },
  // 设置头像
  async uploadAvatar(data = { avatar: null }) {
    return this.accessBackend({
      method: 'POST',
      url: '/user/setAvatar',
      data
    })
  },
  // 获取头像
  getAvatarImage(hash) {
    return `${ssImgAddress}${hash}`
  },
  // 上传图片
  async uploadImage(type, data) {
    const url = {
      avatar: '/user/uploadAvatar',
      artileCover: '/post/uploadImage'
    }
    const formdata = new FormData()
    formdata.append('image', data)
    return this.accessBackend({
      method: 'POST',
      url: url[type],
      data: formdata
    })
  },
  // BasePull 分页组件
  async getBackendData({ url, params }, needAccessToken = false) {
    // 分页组件接口地址
    const pullApiUrl = {
      // home
      homeTimeRanking: 'posts/timeRanking',
      homeSupportsRanking: 'posts/supportsRanking',
      homeAmountRankingEOS: 'posts/amountRanking',
      homeAmountRankingONT: 'posts/amountRanking',
      // article comments
      commentsList: 'comments',
      // followlist
      followsList: 'follows',
      fansList: 'fans',
      // asset
      assetList: 'tokens',
      // user articles
      // 原创文章-使用 homeTimeRanking 接口 地址一样
      userArticlesSupportedList: 'posts/supported',
      // draftbox
      draftboxList: 'drafts',
      // tag by id
      getPostByTagById: 'posts/getPostByTag',
      // buy
      buyHistory: 'order/products'
    }

    return !needAccessToken
      ? axiosforApiServer.get(pullApiUrl[url], { params })
      : this.accessBackend({ url: `/${pullApiUrl[url]}`, params })
  },
  async createDraft({ title, content, cover, fissionFactor, isOriginal, tags }) {
    return this.accessBackend({
      method: 'POST',
      url: '/draft/save',
      data: {
        title,
        content,
        cover,
        fissionFactor,
        isOriginal,
        tags
      }
    })
  },
  async updateDraft({ id, title, content, cover, fissionFactor, isOriginal, tags }) {
    return this.accessBackend({
      method: 'POST',
      url: '/draft/save',
      data: {
        id,
        title,
        content,
        cover,
        fissionFactor,
        isOriginal,
        tags
      }
    })
  },
  async delDraft({ id }) {
    return this.accessBackend({ method: 'DELETE', url: `/draft/${id}` })
  },
  async getDraft({ id }) {
    return this.accessBackend({ url: `/draft/${id}` })
  },
  async setProfile({ nickname, introduction, email, accept }) {
    return this.accessBackend({
      method: 'POST',
      url: '/user/setProfile',
      data: {
        nickname,
        introduction,
        email,
        accept
      }
    })
  },
  async getMyPost(id) {
    return this.accessBackend({ url: `/mypost/${id}` })
  },
  // 获取账户资产列表 暂时没有EOS数据
  async getBalance() {
    return this.accessBackend({ url: '/balance' })
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
  async loginGitHub(code) {
    return axiosforApiServer.post('/login/github', { code })
  },
  // 获取可用标签列表
  async getTags() {
    return axiosforApiServer.get('/tag/tags')
  },
  // 文章转让
  async transferOwner(from, articleId, uid) {
    console.log(from, articleId, uid)
    if (from === 'article')
      return this.accessBackend({
        method: 'POST',
        url: '/post/transferOwner',
        data: { signid: articleId, uid }
      })
    if (from === 'draft')
      return this.accessBackend({
        method: 'POST',
        url: '/draft/transferOwner',
        data: { draftid: articleId, uid }
      })
  },
  // 通过用户名搜索
  async searchUsername(username) {
    return axiosforApiServer.get('/search', {
      params: {
        q: username
      }
    })
  },
  // 获取推荐文章或者商品
  postsRecommend(channel) {
    return axiosforApiServer.get('/posts/recommend', {
      params: {
        channel
      }
    })
  }
}

export default API
