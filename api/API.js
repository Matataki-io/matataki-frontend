/* eslint-disable */
import request from '@/utils/request'
import endpoint from './endpoint'

export default {
  async wx(url) {
    return request.get(
      `${endpoint.wx}?url=${url}`
    )
  },
  async getArticleInfo(hashOrId) {
    // post hash获取; p id 短链接;
    const url = /^[0-9]*$/.test(hashOrId) ? 'p' : 'post'
    return request.get(`/${url}/${hashOrId}`)
  },
  getImg(hash) {
    return `${process.env.ssImgAddress}${hash}`
  },
  async getComments(signid) {
    return request.get('/comments', {
      params: {signid}
    })
  },
  async getFans(uid, page = 1) {
    return request.get('/fans', {
      params: {
        uid, page
      }
    })
  },
  async getFollows(uid, page = 1) {
    return request.get('/follows', {
      params: {
        uid, page
      }
    })
  },
  async follow(uid) {
    return request.post('/follow', { uid })
  },
  async unfollow(uid) {
    return request.post('/unfollow', { uid })
  },
  async getMyUserData () {
    return request.get('/user/stats')
  },
  async getUser({ id }) {
    return request.get(`/user/${id}`)
  },
  // BasePull 分页组件
  async getBackendData({ url, params }) {
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
    return request.get(pullApiUrl[url], { params, showLoading: false })
  },
}
