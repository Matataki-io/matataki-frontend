/* eslint-disable */
import qs from 'qs'
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
    return request({
      url: pullApiUrl[url],
      method: 'get',
      noLoading: true,
      params
    })
  },
  async getCaptcha(email) {
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
  async register({email,password,captcha}) {
    return request.post('/login/regist', { email, password, captcha: captcha.toString() })
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
  async reading(id) {
    return request.post(`/posts/${id}/reading`, {}, { noLoading: true })
  },
  async like(id, time) {
    return request.post(`/posts/${id}/like`, { time })
  },
  async dislike(id, time) {
    return request.post(`/posts/${id}/dislike`, { time })
  },
  async myPoints(params) {
    return request.get(`/user/points`, { params })
  }
}
