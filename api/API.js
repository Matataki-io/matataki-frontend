/* eslint-disable */
import request from './request'
import endpoint from './endpoint'

export default {
  async wx(url) {
    return request.get(
      `${endpoint.wx}?url=${url}`
    )
  }
}
