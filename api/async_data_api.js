import { paginationUrl } from './pagination_url'

export const recommend = (axios, channel) => {
  const path = '/posts/recommend?channel='
  return axios.get(path + channel)
}

// 分页数据
export const paginationData = (axios, url, params) => axios.get(paginationUrl[url], { params })

// 获取可用标签列表
export const getTags = (axios, type) => axios.get('/tag/tags', { params: { type } })
