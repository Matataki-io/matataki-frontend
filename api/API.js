/* eslint-disable */
import qs from 'qs'
import request from '@/utils/request'
import utils from '@/utils/utils'
import { getCookie } from '@/utils/cookie'

import endpoint from './endpoint'
import { paginationUrl } from './pagination_url'
import { replaceStr } from '@/utils/reg'

export default {
  /**
   * 获取token
   * @param {Object} params idProvider publickey(toLowerCase) sign username
   */
  auth(params) {
    // 推荐人id
    let referral = utils.getCookie('referral')
    if (referral) Object.assign(params, { referral: referral })

    return request.post(
      `/login/auth`,
      params
    )
  },
  async wx(url) {
    return request.get(
      `${endpoint.wx}?url=${url}`
    )
  },
  // 推荐信息
  recommend(params) { return request.get('/posts/recommend', { params }) },
  /**
   * 获取文章信息
   */
  getArticleInfo(hashOrId) {
    // post hash获取; p id 短链接;
    const url = /^[0-9]*$/.test(hashOrId) ? 'p' : 'post'
    return request.get(`/${url}/${hashOrId}`)
  },
  // 通过hash获取文章内容
  getIpfsData(hash, edit = false) {
    const params = edit ? { params: {edit: true} } : {}
    return request.get(`/post/ipfs/${hash}`, params)
  },
  getMyPost(id) {
    return request.get(`/mypost/${id}`)
  },
  // 获取可编辑的文章内容（检查我的文章，以及获取了编辑权限的文章）
  getCanEditPost(id) {
    return request.get(`/canEditPost/${id}`)
  },
  // 获取文章的ipfs hash信息
  getArticleIpfs(id) { return request.get(`/p/${id}/ipfs`) },
  // 获取图片地址
  getImg(hash) {
    return `${process.env.ssImgAddress}${hash}`
  },
  async getComments(signid) {
    return request.get('/comment/comments', {
      params: {signid}
    })
  },
  async getFans(uid, page = 1) {
    return request.get('/follow/fans', {
      params: {
        uid, page
      }
    })
  },
  async getFollows(uid, page = 1) {
    return request.get('/follow/follows', {
      params: {
        uid, page
      }
    })
  },
  follow(uid) {
    return request.post('/follow/follow', { uid })
  },
  unfollow(uid) {
    return request.post('/follow/unfollow', { uid })
  },
  async getMyUserData () {
    return request.get('/user/stats')
  },
  /**
   * BasePull 分页组件
   * @param {Object} param params参数
   */
  async getBackendData({ url, params, urlReplace }) {
    if (!urlReplace) {
      const pullApiUrl = paginationUrl
      return await request({
        url: pullApiUrl[url],
        method: 'get',
        noLoading: true,
        params,
      })
    } else {
      const pullApiUrl = paginationUrl
      let urlReg = pullApiUrl[url].replace(/\$\{.*?\}/, urlReplace)
      return await request({
        url: urlReg,
        method: 'get',
        noLoading: true,
        params,
      })
      }
  },
  async getCaptcha(email, { geetest_challenge, geetest_validate, geetest_seccode }) {
    return request.post(`/login/captcha`, {
      geetest_challenge,
      geetest_validate,
      geetest_seccode
    }, { noLoading: true, params: { email } })

    return request.get('/login/captcha', { params: {email}, noLoading: true })
  },
  async verifyEmail(email) {
    return request({
      url: '/login/verify',
      method: 'get',
      params: { email },
      noLoading: true
    })
  },
  async register({email,password,captcha, referral}) {
    return request.post('/login/regist', { email, password, captcha: captcha.toString(), referral })
  },
  async login({username, password}) {
    return request.post('/login/account', { username, password })
  },
  async sendPost({ title, author, desc, content }) {
    const stringifyData = qs.stringify({
      'data[title]': title,
      'data[author]': author,
      'data[desc]': desc,
      'data[content]': content
    })
    return request({
      method: 'post',
      url: `/post/ipfs`,
      data: stringifyData,
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    })
  },
  async myPoints(params) {
    return request.get(`/user/points`, { params })
  },
  // 增加阅读量
  addReadAmount({ articlehash }) {
    return request({
      method: 'POST',
      url: `/post/show/${articlehash}`
    })
  },
  /**
   * 删除文章
   */
  delDraft({ id }) {
    return request({ method: 'DELETE', url: `/draft/${id}` })
  },
  /**
   * 文章导入
   * @param {String} url 导入地址
   */
  importArticle(url) {
    return request({
      method: 'post',
      url: '/posts/importer',
      data:{ url },
      timeout: 40000,
    })
  },
  // 文章持通证阅读
  addMineTokens(data) {
    return request({
      method: 'post',
      url: '/post/addMineTokens',
      data: data,
    })
  },
  // 文章持通证支付
  articlePrices(id, data) {
    return request({
      method: 'PUT',
      url: `/posts/${id}/prices`,
      data: data,
    })
  },
  // 删除文章持通证支付
  articlePricesDelete(id) {
    return request({
      method: 'DELETE',
      url: `/posts/${id}/prices`,
    })
  },
  /**
   * 发布文章接口 通用方法 私有方法
   * @param {String} url 接口地址
   * @param {Object} param1 文章参数
   */
  _sendArticle(
    url,
    { signId = null, author, data, title, fissionFactor,
      cover, isOriginal, tags, commentPayPoint, shortContent, cc_license = null,
      requireToken, requireBuy,
      editRequireToken = null, editRequireBuy = null, ipfs_hide = true, assosiateWith, hCaptchaData,
      indie_post=false, indie_sync_tags=false, }) {
    // 账号类型
    let idProvider = (utils.getCookie('idProvider')).toLocaleLowerCase()
    return request({
      method: 'POST',
      url,
      data: {
        author,
        cover,
        fissionFactor,
        data,
        platform: idProvider,
        signId,
        title,
        is_original: isOriginal,
        tags,
        cc_license,
        commentPayPoint,
        shortContent,
        requireToken, requireBuy,
        editRequireToken, editRequireBuy,
        ipfs_hide,
        assosiateWith,
        hCaptchaData,
        indie_post,
        indie_sync_tags,
      },
      // timeout: 30000
    })
  },
  /**
   * 发布文章
   * @param {Object} params 参数, 签名 非钱包用户需要签名
   */
  publishArticle({ article }) {
    return this._sendArticle('/post/publish', article)
  },
  /**
   * 编辑文章
   * @param {Object} params 参数, 签名 非钱包用户需要签名
   */
  editArticle({ article }) {
    return this._sendArticle('/post/edit', article)
  },
  /**
   * 定时发布文章
   * @param {Number} draftId 草稿 id
   * @param {Date} postTime 发布时间
   * @param {Object} hCaptchaData 验证码数据
   */
  timedPublishArticle(draftId, postTime, hCaptchaData) {
    return request.post(`/post/timed/${draftId}`, { postTime, hCaptchaData })
  },
  /**
   * 删除定时发布任务
   * @param {Number} draftId 草稿 id
   */
  deleteTimedPublishTask(draftId) {
    return request.delete(`/post/timed/${draftId}`)
  },
  // 创建草稿
  createDraft(data) {
    return request({
      method: 'POST',
      url: '/draft/save',
      data
    })
  },
  // 更新草稿
  updateDraft(data) {
    return request({
      method: 'POST',
      url: '/draft/save',
      data
    })
  },
  getDraft({ id }) {
    return request({ url: `/draft/${id}` })
  },
  // 提交积分评论
  postPointComment(data) {
    return request({
      method: 'POST',
      url: '/comment/comment',
      data: data
    })
  },
  /**
   * 上传图片
   * @param {String} type 上传类型
   * @param {Object} data 上传数据
   */
  uploadImage(type, data) {
    const url = {
      avatar: '/user/uploadAvatar',
      artileCover: '/post/uploadImage',
      coins: '/post/uploadImage', // fan票的icon也考虑新开路由
      banner: '/user/uploadBanner'
    }
    const formdata = new FormData()
    formdata.append('image', data)
    return request({
      method: 'POST',
      url: url[type],
      data: formdata
    })
  },
  ossUploadImage(folder, data) {
    const folderOption = {
      avatar: 'avatar', // 头像
      userBanner: 'userBanner', // 用户封面
      articleCover: 'articleCover', // 文章封面
      article: 'article', // 编辑器上传
      temp: 'temp', // 临时文件
      coin: 'coin', // fan票
    }
    const formdata = new FormData()
    // Invalid filename blob
    let filename = data.name ? data.name.split('.') : 'png'
    if (typeof filename !== 'string') {
      filename = filename[filename.length - 1]
    }
    formdata.append('file', data, `${Date.now()}.${filename}`)
    return request({
      method: 'POST',
      url: `/oss/uploadImage?folder=${folderOption[folder]}`,
      data: formdata
    })
  },
  // 搜索推荐
  searchRecommend(params){
    return request('/search/recommend', { params, cache: true })
  },
  // 推荐作者||用户
  usersRecommend(params){
    return request('/users/recommend', { params })
  },
  // 获取任务状态
  userPointStatus() {
    return request('/user/pointStatus')
  },
  // 领取任务积分
  userClaimTaskPoint(data) {
    return request({
      method: 'POST',
      url: '/user/claimTaskPoint',
      data: data
    })
  },
  // 获取首页统计数据
  postsStats() {
    return request('/posts/stats')
  },
  // 阅读获取积分
  postsIdReadnew(id, time) {
    return request.post(`/posts/${id}/readnew`, { time })
  },
  // 购买商品 可能会有区分 暂未合并
  reportOrder(data) {
    let address = { // 缺地址
      'eos': '',
      'ont': '',
    }
    // 平台类型
    let idProvider = utils.getCookie('idProvider').toLocaleLowerCase()
    let contract = address[idProvider] // 合约地址

    Object.assign(data, {
      contract: contract,
      platform: idProvider,
      symbol: idProvider.toUpperCase()
    })
    return request({ method: 'POST', url: '/order/order', data })
  },
  // 赞赏 可能会有区分 暂未合并
  support(data) {
    let address = { // 缺地址
      'eos': '',
      'ont': '',
    }
    // 平台类型
    let idProvider = utils.getCookie('idProvider').toLocaleLowerCase()
    let contract = address[idProvider] // 合约地址

    Object.assign(data, {
      contract: contract,
      platform: idProvider,
      symbol: idProvider.toUpperCase()
    })
    return request({ method: 'POST', url: '/support/support', data })
  },
  // 提交订单hash
  orderSaveHash(data) {
    return request({ method: 'POST', url: '/order/saveTxhash', data })
  },
  // 提交订单hash
  supportSaveHash(data) {
    return request({ method: 'POST', url: '/support/saveTxhash', data })
  },
  registerGT() {
    return request({
      url:`/gt/register-slide?t=${(new Date()).getTime()}`,
      method: 'get',
      dataType: "json",
    })
  },
  getWeixinOpenId(code) {
    return request.post('/wx/login', { code })
  },
  wxpay({ total, title, type, token_id, token_amount, limit_value, decimals, min_liquidity = 0, pay_cny_amount }) {
    return request.post('/wx/pay', { total, title, type, token_id, token_amount, limit_value, decimals, min_liquidity, pay_cny_amount })
  },

  // mine 个人的token list
  tokenTokenList(params) {
    return request.get('/token/tokenlist', { params })
  },
  async doINeedHCaptcha() {
    const { data } = await request.get('/captcha/doINeedHCaptcha')
    return !data.isInWhiteList
  },
  allToken({page = 1, pagesize = 10, search = ''}) {
    return request({
      url: '/token/all',
      method: 'get',
      timeout: 40 * 1000,
      noLoading: true,
      params: {
        page,
        pagesize,
        search
      },
      cache: true
    })
  },
  /**
   * 创建我的token
   * // TODO 有字段后可移除注释
   * @param {Objject} data name symbol decimals // icon 暂无
   */
  minetokenCreate(data) {
    return request({
      method: 'POST',
      url: '/minetoken/create',
      data: data
    })
  },
  /**
   * 发行我的token
   * @param {Object} data amount
   */
  minetokenMint(data) {
    return request({
      method: 'POST',
      url: '/minetoken/mint',
      data: data
    })
  },/**
   * 修改token详情
   * @param {Object} data token详情
   * @param {Number} tokenId token id
   */
  minetokenTokenId(data, tokenId) {
    return request({
      method: 'PUT',
      url: `/minetoken/${tokenId}`,
      data: data
    })
  },
  /**
  * 修改token资源
  * @param {Object} data token资源
  * @param {Number} tokenId token id
  */
minetokenResources(data, tokenId) {
    return request({
      method: 'PUT',
      url: `/minetoken/${tokenId}/resources`,
      data: data
    })
  },
/**
 * 自己 Token resources 信息
 */
minetokenGetResources(tokenId) {
    return request({
      method: 'GET',
      url: `/minetoken/${tokenId}/resources`,
      cache: true
    })
  },
  /**
   * 转移token
   * @param {*} data tokenId to amount
   */
  transferMinetoken(data) {
    return request({
      method: 'POST',
      url: '/minetoken/transfer',
      data: data
    })
  },
  /**
   * Fan票详情
   * @param {Number} id token id
   */
  minetokenId(id) {
    return request({
      method: 'GET',
      url: `/minetoken/${id}`,
      cache: true
    })
  },
  /**
   * 获取token详情
   * 请求头：x-access-token
   * 用户发行了token，data为对象，没有发行token，data为null
   */
  tokenDetail() {
    return request.get('/token/minetoken')
  },
  /**
   * 获取创建跨链 Fan 票的许可
   */
  requestPermitOfCreation(tokenId, chain) {
    return request.put(`/minetoken/${tokenId}/crosschain`, {}, { params: { chain } })
  },
  appendCrosschainTokenByTxHash(txHash, chain) {
    return request.put('/minetoken/crosschain/appendByTxHash', {}, { params: { chain, txHash } })
  },

  // -------------------------------- exchange API --------------------------------
  getCurrentPoolSize(tokenId) {
    return request({
      method: 'get',
      url: '/exchange/currentPoolSize',
      params: {
        tokenId
      }
    })
  },
  getYourPoolSize(tokenId) {
    return request({
      method: 'get',
      url: '/exchange/userPoolSize',
      params: {
        tokenId
      }
    })
  },
  getYourMintToken(tokenId, amount) {
    return request({
      method: 'get',
      url: '/exchange/userMintToken',
      params: {
        tokenId, amount
      }
    })
  },
  getOrderStatus(tradeNo) {
    return request({
      method: 'get',
      url: '/exchange/notify',
      params: {
        trade_no: tradeNo
      }
    })
  },
  getOutputAmount(inputTokenId, outputTokenId, inputAmount) {
    return request({
      method: 'get',
      url: '/exchange/outputAmount',
      params: {
        inputTokenId, outputTokenId, inputAmount
      }
    })
  },
  getInputAmount(inputTokenId, outputTokenId, outputAmount) {
    return request({
      method: 'get',
      url: '/exchange/inputAmount',
      params: {
        inputTokenId, outputTokenId, outputAmount
      }
    })
  },
  // token 换 token / cny接口
  swap({inputTokenId, outputTokenId, amount, limitValue, base}) {
    return request({
      method: 'post',
      url: '/exchange/swap',
      data: {
        inputTokenId, outputTokenId, amount, limitValue, base
      }
    })
  },
  getOutputPoolSize(amount, tokenId) {
    return request({
      method: 'get',
      url: '/exchange/outputPoolSize',
      params: {
        amount, tokenId
      }
    })
  },
  removeLiquidity({ tokenId, amount, min_cny, min_tokens }) {
    return request({
      method: 'post',
      url: '/exchange/removeLiquidity',
      data: {
        tokenId, amount, min_cny, min_tokens
      }
    })
  },
  getPoolCnyToTokenPrice(inputTokenId, outputTokenId, inputAmount) {
    return request({
      method: 'get',
      url: '/exchange/poolCnyToTokenPrice',
      params: {
        outputTokenId, inputAmount
      }
    })
  },
  getUserBalance(tokenId) {
    return request({
      method: 'get',
      url: '/minetoken/balance',
      params: {
        tokenId
      }
    })
  },
  getMatatakiPoint() {
    return request({
      method: 'get',
      url: '/asset/balance'
    })
  },
  /**
   * 通过 User Id 获取 token 信息
   */
  tokenUserId(id) {
    return request({
      method: 'get',
      url: `/token/user/${id}`,
      cache: true
    })
  },
  getCNYBalance() {
    return request({
      method: 'get',
      url: '/asset/balance',
      params: {
        symbol: 'CNY'
      }
    })
  },
  addLiquidityBalance({tokenId, cny_amount, token_amount, min_liquidity, max_tokens, deadline}) {
    return request({
      method: 'post',
      url: '/exchange/addLiquidityBalance',
      data: {
        tokenId, cny_amount, token_amount, min_liquidity, max_tokens, deadline
      }
    })
  },
  // 以输入为准
  cnyToTokenInputBalance({tokenId, cny_sold, min_tokens, deadline}) {
    return request({
      method: 'post',
      url: '/exchange/cnyToTokenInputBalance',
      data: {
        tokenId, cny_sold, min_tokens, deadline
      }
    })
  },
  // 以输出为准
  cnyToTokenOutputBalance({tokenId, tokens_bought, max_cny, deadline}) {
    return request({
      method: 'post',
      url: '/exchange/cnyToTokenOutputBalance',
      data: {
        tokenId, tokens_bought, max_cny, deadline
      }
    })
  },
  getPurchaseLogs(tokenId) {
    return request({
      method: 'get',
      url: '/token/purchaseLogs',
      params: {
        tokenId
      }
    })
  },
  getMyPurchaseLogs(tokenId) {
    return request({
      method: 'get',
      url: '/token/myPurchaseLogs',
      params: {
        tokenId
      }
    })
  },
  getLiquidityLogs(tokenId) {
    return request({
      method: 'get',
      url: '/token/liquidityLogs',
      params: {
        tokenId
      }
    })
  },
  getMyLiquidityLogs(tokenId) {
    return request({
      method: 'get',
      url: '/token/myLiquidityLogs',
      params: {
        tokenId
      }
    })
  },
  loginWeixin(code) {
    return request({
      method: 'POST',
      url: '/login/weixin',
      data: {
        code
      }
    })
  },
  /**
   * 解析引用网址的title
   * @param {Object} data {url: xxx}
   */
  extractRefTitle(data) {
    return request({
      method: 'POST',
      url: '/posts/extractRefTitle',
      data
    })
  },
  // 添加/修改草稿引用 id: signId
  draftsReferences(id, data) {
    return request({
      method: 'PUT',
      url: `/drafts/${id}/references`,
      data
    })
  },
  // 删除草稿引用 signId number
  removeDraftsReferences(id, number) {
    return request({
      method: 'DELETE',
      url: `/drafts/${id}/references/${number}`
    })
  },
  // 根据草稿Id、number获取文章引用
  getDraftsReferences(id, number){
    return request({
      method: 'GET',
      url: `/drafts/${id}/references/${number}`
    })
  },
  // draftId
  // 草稿发布时发布引用的文章
  draftsReferencesPublish(id, data) {
    return request({
      method: 'POST',
      url: `/drafts/${id}/references/publish`,
      data
    })
  },
  // 删除草稿引用 signId number
  removePostsReferences(id, number) {
    return request({
      method: 'DELETE',
      url: `/posts/${id}/references/${number}`
    })
  },
  // 添加/修改草稿引用 id: signId
  postsReferences(id, data) {
    return request({
      method: 'PUT',
      url: `/posts/${id}/references`,
      data
    })
  },
  // 根据草稿Id、number获取文章引用
  getPostsReferences(id, number) {
    return request({
      method: 'GET',
      url: `/posts/${id}/references/${number}`
    })
  },
  // 根据symbol获取token信息
  getTokenBySymbol(symbol) {
    return request({
      method: 'GET',
      url: '/token/symbol',
      params: {
        symbol
      }
    })
  },

  // 根据id获取个人资料中的社交账号和相关网站
  getUserLinks({id}) {
    return request.get(`/user/${id}/links`, { cache: true });
  },
  // 设置用户links
  setUserLinks({websites, socialAccounts}) {
    return request({
      method: 'PUT',
      url: '/user/links',
      data: {
        websites,
        socialAccounts,
      }
    })
  },
  //-------------文章支付使用开始-----------------
  wxNativePay(tradeNo, title) {
    return this.orderWxpay({
      tradeNo,
      trade_type: 'NATIVE',
      title
    })
  },
  wxJsapiPay(tradeNo, openid, title) {
    return this.orderWxpay({
      tradeNo,
      trade_type: 'JSAPI',
      title,
      openid
    })
  },
  orderWxpay(order) {
    return request.post('/order/wxpay', order)
  },
  //-------------文章支付使用结束-----------------
  getOrderData(tradeNo) {
    return request({
      method: 'get',
      url: `/orders/${tradeNo}`
    })
  },
  updateOrder(tradeNo, order) {
    return request({
      method: 'put',
      url: `/orders/${tradeNo}`,
      data: order
    })
  },
  createOrder(order) {
    return request({
      method: 'PUT',
      url: '/orders',
      data: order
    })
  },
  handleAmount0(tradeNo) {
    return request({
      method: 'post',
      url: '/orders/handleAmount0',
      data: {
        tradeNo
      }
    })
  },
  // 获取收藏文章
  getBookmarks(orderType = 1) {
    return request.get(`/user/bookmarks`, {
      params: {
        order: orderType
      }
    })
  },
  transferAsset({ symbol = 'cny', to, amount }) {
    return request({
      method: 'POST',
      url: '/asset/transfer',
      data: {
        symbol, to, amount
      }
    })
  },
  fetchNotifications(provider, page = 1, type = 'check_time') {
    return request.get('/notification/fetch', { params: { page, type, provider } })
  },
  getNotificationCounters() {
    return request.get('/notification')
  },
  readNotifications(provider) {
    return request.post('/notification/read', { provider })
  },
  async getResetCaptcha(email, { geetest_challenge, geetest_validate, geetest_seccode }) {
    return request({
      method: 'POST',
      url: `/login/resetPassword/captcha?email=${email}`,
      data: {
        geetest_challenge,
        geetest_validate,
        geetest_seccode
      }
    })
  },
  async resetPassword({ email, password, captcha }) {
    return request({
      method: 'POST',
      url: `/login/resetPassword`,
      data: {
        email,
        password,
        captcha: captcha.toString()
      }
    })
  },
  // -------------------------------- 用户登录 --------------------------------
  // github登录
  loginGitHub(code) {
    let params = { code }
    // 推荐人id
    let referral = getCookie('referral')
    if (referral) Object.assign(params, { referral: referral })
    return request.post('/login/github', params)
  },
  // 得到用户信息
  getUser(id) { return request.get(`/user/${id}`, { cache: true }) },
  // 增加阅读量
  read(hash) { return request.post(`/post/show/${hash}`) },
  // 获取当前用户的文章信息
  currentProfile(data) { return request.post('/post/currentProfile', data) },
  // 收藏
  bookmark(id) { return request.post(`/post/${id}/bookmark`) },
  unbookmark(id) { return request.delete(`/post/${id}/bookmark`) },
  // 点赞
  like(id, data) { return request.post(`/posts/${id}/like`, data) },
  dislike(id, data) { return request.post(`/posts/${id}/dislike`, data) },
  // 客户端打开文章后提交，表示开始阅读
  reading(id) { return request.post(`/posts/${id}/reading`) },
  // -------------------------------- 账号绑定 --------------------------------
  // account binding
  accountBind(params) { return request.post('/account/binding', params) },
  // account unbinding
  accountUnbind(params) { return request.post('/account/unbinding', params) },
  // 切换主账号
  accountChange(params) { return request.post('/account/changeMainAccount', params) },
  // 账号列表
  accountList() { return request.get('/account/list') },
  // -------------------------------- 分享 --------------------------------
  // 创建分享
  createShare(data) { return request.post('/share', data) },
  // 分享详情
  // 暂时不用, 后端说用 p 接口
  // shareDetail(id) { return request.get(`/share/${id}`) },
  shareDetail(id) { return request.get(`/p/${id}`) },
  // telegram 登录
  telegramLogin(data) {
    return request({
      method: 'POST',
      url: '/login/telegram',
      data: data
    })
  },
  // twitter 登录
  twitterLoginPrepare(type) {
    return request({
      method: 'GET',
      url: '/login/twitter/prepare',
      params: { type }
    })
  },
  twitterLogin(data) {
    return request({
      method: 'POST',
      url: '/login/twitter',
      data: data
    })
  },
  // google 登录
  googleLoginPrepare(callbackUrl, state) {
    return request({
      method: 'GET',
      url: '/login/google/prepare',
      params: { callbackUrl, state }
    })
  },
  googleLogin(data) {
    return request({
      method: 'POST',
      url: '/login/google',
      data: data
    })
  },
  // facebook 登录
  facebookLoginPrepare(callbackUrl, state) {
    return request({
      method: 'GET',
      url: '/login/facebook/prepare',
      params: { callbackUrl, state }
    })
  },
  facebookLogin(data) {
    return request({
      method: 'POST',
      url: '/login/facebook',
      data: data
    })
  },
  // --------------------------- 搜索 ------------------------------------
  search(type, params) {
    return request.get(`/search/${type}`, { params })
  },
  searchDb(type, params) {
    return request.get(`/search/db/${type}`, { params })
  },
  // 搜索 db tag
  searchDbTag(params) { return request.get(`/search/db/tag`, { params }) },
  // 常用候选列表
  historyUser(params) {
    return request.get(`/history/user`, { params })
  },
  // 文章转让
  transferOwner(from, articleId, uid) {
    // console.log(from, articleId, uid)
    if (from === 'article') {
      // 文章
      return request({
        method: 'POST',
        url: '/post/transferOwner',
        data: { signid: articleId, uid }
      })
    } else if (from === 'draft') {
      // 草稿
      return request({
        method: 'POST',
        url: '/draft/transferOwner',
        data: { draftid: articleId, uid }
      })
    } else {
      // 其他
      return request({
        method: 'POST',
        url: '/post/transferOwner',
        data: { signid: articleId, uid }
      })
    }
  },
  // 获取可用标签列表
  getTags(type) {
    return request.get('/tag/tags', {
      params:{
        type
      },
      cache: true
    })
  },
  // 获取某篇文章的标签
  tagsById(params) { return request.get(`/tags/get_by_post`,  { params, cache: true }) },
  // 获取热门标签
  tagsHotest(params) { return request.get(`/tags/hotest`,  { params, cache: true }) },
  // 热门标签 筛选对象为最近14天内应用次数最多的标签
  hotestTags(params) { return request.get('/tags/hotestTags',  { params, cache: true }) },
  // 删除文章
  delArticle({ id }) {
    return request({
      method: 'DELETE',
      url: `/post/${id}`
    })
  },
  // 设置资料
  setProfile({ nickname, introduction, email, accept, hCaptchaData }) {
    return request({
      method: 'POST',
      url: '/user/setProfile',
      data: {
        nickname,
        introduction,
        email,
        accept,
        hCaptchaData
      }
    })
  },
  downpost() {
    return request.get('/dev/down/posts')
  },
  // preview
  // 设置预览id
  previewSetId(data) { return request.post('/preview', data) },
  // 获取预览内容
  previewDraft(id) { return request.get(`/preview/${id}`)},
  // 获取预览时间
  previewDraftTime(id) { return request.get(`/previewTime/${id}`)},

  getNumArticles(id) {
    return request.get(`posts/timeRanking`, {
      params:{
        author: id,
        page: 1,
        pagesize: 1
      }
    })
  },

  notifyMarkRead(notifyIds) {
    return request({
      method: 'put',
      url: `/notify/event`,
      data: { ids: notifyIds }
    })
  },

  notifyMarkReadAll() {
    return request({
      method: 'put',
      url: `/notify/event/all`
    })
  },

  getNotifyUnreadQuantity() {
    return request.get(`/notify/event/quantity`)
  },
  reply(signId, replyId, comment) {
    return request({
      method: 'POST',
      url: '/comment/reply',
      data: {
        signId,
        comment,
        replyId
      }
    })
  },
  likeComment(id) {
    return request({
      method: 'PUT',
      url: `/comment/like/${id}`,
    })
  },
  searchToken(word, page = 1, pagesize = 20) {
    return request({
      method: 'GET',
      url: '/search/token',
      params: {
        word,
        page,
        pagesize,
      }
    })
  },
  getCommentIndexById(id) {
    return request.get(`/comment/index/${id}`)
  },
  // 文章打赏
  rewardArticle(pid, data) {
    return request({
      method: 'POST',
      url: `/posts/${pid}/reward`,
      data
    })
  },
  // Token提现
  withdrawToken(tid, data) {
      return request({
        method: 'POST',
        url: `/minetoken/${tid}/withdraw`,
        data,
        timeout: 40 * 1000
      })
  },
    // Token提现去BSC
  withdrawTokenToBsc(tid, data) {
      return request({
        method: 'POST',
        url: `/minetoken/crosschain/${tid}/withdrawToOtherChain/`,
        data: { ...data, chain: 'bsc' },
        timeout: 60 * 1000
      })
  },
  // Token提现去Matic
  withdrawTokenToMatic(tid, data) {
      return request({
        method: 'POST',
        url: `/minetoken/crosschain/${tid}/withdrawToOtherChain/`,
        data: { ...data, chain: 'matic' },
        timeout: 60 * 1000
      })
  },
    // Token 充值从 BSC
  depositFromExternalChain(data, chain) {
    return request({
      method: 'POST',
      url: `/minetoken/crosschain/1/depositFromOtherChain`,
      data: { ...data, chain },
      timeout: 60 * 1000
    })
  },
  // Token 充值从 BSC
  depositFromBsc(tid, data) {
    return request({
      method: 'POST',
      url: `/minetoken/crosschain/${tid}/depositFromOtherChain`,
      data: { ...data, chain: 'bsc' },
      timeout: 60 * 1000
    })
  },
    // Token 充值从 Matic
  depositFromMatic(tid, data) {
    return request({
      method: 'POST',
      url: `/minetoken/crosschain/${tid}/depositFromOtherChain`,
      data: { ...data, chain: 'matic' },
      timeout: 60 * 1000
    })
  },
  renewBscWithdrawPermit(permitId) {
    return request({
      method: 'GET',
      url: `/minetoken/crosschain-permit/renew/${permitId}/`,
    })
  },
  listMyCrossChainDeposit() {
    return request({
      method: 'GET',
      url: '/minetoken/crosschain/myDeposits',
    })
  },
  listMyCrossChainToken(data) {
    return request({
      method: 'GET',
      url: '/minetoken/crosschain/',
      params: { ...data }
    })
  },
  listAllCrossChainToken(chain = 'bsc') {
    return request({
      method: 'GET',
      url: '/minetoken/crosschain/ls',
      params: { chain }
    })
  },
  isCrossChainToken(tokenAddress) {
    return request({
      method: 'GET',
      url: `/minetoken/crosschain/isToken/${tokenAddress}`,
    })
  },
  // 获取我的 BSC 许可
  listMyCrosschainPermit(chain = 'bsc') {
      return request({
        method: 'GET',
        url: `/minetoken/crosschain/permit`,
        params: { chain }
      })
  },
  // Token转入同步到DB
  depositToken(txHash) {
    return request({
      method: 'POST',
      url: `/minetoken/deposit`,
      data: { txHash },
    })
  },
  getMyHostingAddress() {
    return request({
      method: 'GET',
      url: `/token/myAddress`,
    })
  },
  getRewardList(pid, page = 1, pagesize = 1000) {
    return request({
      method: 'GET',
      url: `/posts/${pid}/reward`,
      params: {
        page,
        pagesize,
      }
    })
  },
  /** 删除一条评论 */
  deleteComment(id) {
    return request.delete(`/comment/delete/${id}`)
  },
  // 获取评论列表
  commentGetComments(params) {
    return request.get(`/comment/getComments`, { params } )
  },
  payTokenToArticle(data) {
    return request({
      method: 'POST',
      url: '/orders/payArticle',
      data
    })
  },
  getAddSupplyChart(id) {
    return request.get(`/minetoken/${id}/supplyChart`, { cache: true })
  },
  /** 文章分享事件上报 */
  shareCount(postId) {
    return request.post(`/post/${postId}/shareCount`)
  },
  // -------------------- token历史记录 --------------------
  // token历史价格
  getPriceHistory(tokenId) { return request.get(`/token/history/price`, { params: { tokenId }, cache: true }) },
  // token流动金历史
  getLiquidityHistory(tokenId) { return request.get(`/token/${tokenId}/history/liquidity`, { cache: true }) },
  // token历史增发
  getIssuedHistory(tokenId) { return request.get(`/token/${tokenId}/history/issued`, { cache: true }) },
  // token交易额历史
  getAmountHistory(tokenId) { return request.get(`/token/${tokenId}/history/amount`, { cache: true }) },
  // token交易量历史
  getVolumeHistory(tokenId) { return request.get(`/token/${tokenId}/history/volume`, { cache: true }) },
  // token收益历史
  getIncomeHistory(tokenId) { return request.get(`/token/${tokenId}/history/income`, { cache: true }) },

  // -------------------- 微信服务号 扫码登录 --------------------------------------
  apiWeChatQRCode(data) { return request.post('/api/wechat/qrcode', data) },
  apiLoginByWx(params) { return request.get('/api/login_by_wx', { params }) },
  // 扫码绑定
  apiBindByWx(params) { return request.get('/api/bind_by_wx', { params }) },

  // -------------------- token 协作者 --------------------
  // 获取协作者列表
  getCollaborators() { return request.get('/token/collaborator') },
  // 添加协作者
  setCollaborator(userId) { return request.post(`/token/collaborator/${userId}`) },
  // 删除协作者
  deleteCollaborator(userId) { return request.delete(`/token/collaborator/${userId}`) },
  // 获取自己创建和协作的Fan票列表
  getBindableTokenList() { return request.get(`/token/bindable`) },
  // -------------------- End -----------------------

  // -------------------- 直通车 --------------------
  directTrade: {
    // 查item
    getItem(id, type = 'tokenId') { return request.get(`/trade/direct/${id}`, { params: { type }}) },
    // 增
    create(price) { return request.post(`/trade/direct`, { price }) },
    // 改
    set(data) { return request.put(`/trade/direct`, data) },
    // 查list
    getList(params) { return request.get(`/trade/direct`, { params }) },
    getItemByUser() { return request.get('/api/user/market')}
  },
  // -------------------- End -----------------------
  getMintDetail() {
    return request.get('/api/mint/detail')
  },

  // ---------------- Fan票申请 ----------------------------------------
  // fan票提交申请
  apiGetMinetokenApplication() { return request.get('/api/minetoken_application', { cache: true }) },
  apiMinetokenApplication(data) { return request.post('/api/minetoken_application', data) },
  // fan票提交申请调研表单
  apiMinetokenApplicationSurveyGet(data) { return request.get('/api/minetoken_application_survey', data) },
  apiMinetokenApplicationSurvey(data) { return request.post('/api/minetoken_application_survey', data) },
  // fan票提交校验 不能重复 symbol
  apiMinetokenApplicationVerify(data) { return request.post('/api/minetoken_application_verify', data) },
  insufficientLiquidity(data) { return request.post('/post/InsufficientLiquidity', data) },

  // ---------------- Dashboard ----------------------------------------
  // 阅览数据
  // 数据统计
  dbBrowseCount(params) { return request.get('/db/browse/count', { params, cache: true }) },
  // 数据增量趋势
  dbBrowseHistoryType(type, params) { return request.get(`/db/browse/history/${type}`, { params, cache: true }) },
  // 获取用户所有文章的总收益
  dbIncomeSum(params) { return request.get('/db/income/sum', { params, cache: true }) },

  // ---------------- 获取推特授权 ----------------------------------------
  twitterRequestToken(callbackUrl) { return request.get(`/authorize/twitter/prepare`, { params: { callbackUrl } }) },
  twitterAccessToken(oauthToken, oauthVerifier) { return request.post(`/authorize/twitter`, { oauthToken, oauthVerifier }) },
  deleteTwitterAccessToken() { return request.delete(`/authorize/twitter`) },

  // ---------------- 获取推特时间线 ----------------------------------------
  getTwitterTimeline(page = 1, pagesize = 20) { return request.get(`/timeline/twitter`, { params: { page, pagesize } }) },
  setTwitterUserTimeLineSwitch(timelineSwitch) { return request.post('/timeline/twitter/user', { timelineSwitch }) },


  // -------------------------------- 收藏夹 --------------------------------
  // 创建收藏夹
  favCreate(data) { return request.post(`/favorites/create`, data ) },
  // 编辑收藏夹
  favEdit(data) { return request.put(`/favorites/edit`, data ) },
  // 删除收藏夹
  favDelete(data) { return request.delete(`/favorites/delete`, { data } ) },
  // 保存收藏夹
  favSave(data) { return request.post(`/favorites/save`, data ) },
  favCancelSave(data) { return request.post(`/favorites/cancel_save`, data ) },
  // 获取自己的收藏夹列表
  favList(params) { return request.get(`/favorites/list`, { params }) },
  // 获取自己的收藏夹列表文章
  favPost(params) { return request.get(`/favorites/post`, { params }) },
  // 获取文章和自己的收藏夹关系
  favRelated(params) { return request.get(`/favorites/related`, { params }) },

  // ------------------------------ 独立子站 ----------------------------------
  /**
   * 创建用于独立子站保存文章的仓库
   * @param {Object} hCaptchaData 验证码数据
   * */
  createIndieBlogRepo (hCaptchaData) {
    return request.post('/indie/prepareRepo', { hCaptchaData })
  },
  /**
   * 初始化仓库，进行设置项目的修改
   * 应当在 /user/prepareRepo 调用成功之后调用
   */
  initialIndieBlogRepo () {
    return request.post(`/indie/prepareConfig`)
  },
  /**
   * 获取仓库状态，将可能返回以下 4 种状态码
   * 0: 一切正常
   * 10020: 目标仓库没有留空
   * 10019: 没有绑定 GitHub 账号，或 GitHub Token 不存在
   */
  getIndieBlogRepoStatus () {
    return request.get(`/indie/repoStatus`)
  },
  /**
   * 获取独立子站状态
   * 10021: 独立子站没有创建
   */
  getIndieBlogSiteStatus () {
    return request.get(`/indie/siteStatus`)
  },
  /**
   * 修改子站仓库名，将可能返回以下 4 种状态码
   * 0: 修改成功
   * 10019: 没有绑定 GitHub 账号，或 GitHub Token 不存在
   */
  modifyIndieBlogRepoName (params) {
    return request.post(`/indie/repo`, params)
  },
  /**
   * 获取子站设置项，成功后将返回以下 JSON
   * {
   *   "code": 0,
   *   "message": "成功",
   *   "data": {
   *     "title": "titleName"
   *   }
   * }
   */
  getIndieBlogSiteConfig () {
    return request.get(`/indie/siteConfig`)
  },
  /**
   * 修改子站设置项
   * @param {Object} hCaptchaData 验证码数据
   * @param {Object} params 修改设置内容
   * eg:
   * {
   *   "title": "LemonNeko's indie blog",
   *   "timezone": "Etc/GMT+8"
   * }
   */
  changeIndieBlogSiteConfig (hCaptchaData, params) {
    return request.post(`/indie/siteConfig`, { hCaptchaData, ...params })
  },
  /**
   * 获取子站部署状态
   * NOT FOUND: 未开启 pages
   * building: 正在构建
   * built: 构建完成可以访问
   */
  getIndieBlogPagesStatus () {
    return request.get(`/indie/pagesStatus`)
  },
  /** 获取目前所有可用主题 */
  getIndieBlogThemes () {
    return request.get(`/indie/themeList`)
  },
  // ----------------------- MTK NFT ------------------
  // 通过 token address 获取 nft
  nftSearchByAskToken ({ tokenAddress }) {
    return request.get(`/api/nft/search/byAskToken/${tokenAddress}`, { cache: true })
  }
}
