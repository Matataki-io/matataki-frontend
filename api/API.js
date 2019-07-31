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
  async getUser(id) {
    return request.get(`/user/${id}`)
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
}
