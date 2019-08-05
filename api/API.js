/* eslint-disable */
import request from '@/utils/request'
import endpoint from './endpoint'
import { paginationUrl } from './pagination_url'

export default {
  async wx(url) {
    return request.get(
      `${endpoint.wx}?url=${url}`
    )
  },
  getArticleInfo(hashOrId) {
    // post hash获取; p id 短链接;
    const url = /^[0-9]*$/.test(hashOrId) ? 'p' : 'post'
    return request.get(`/${url}/${hashOrId}`)
  },
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
  async follow(uid) {
    return request.post('/follow/follow', { uid })
  },
  async unfollow(uid) {
    return request.post('/follow/unfollow', { uid })
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
    const pullApiUrl = paginationUrl
    return request.get(pullApiUrl[url], { params, showLoading: false })
  },
}
