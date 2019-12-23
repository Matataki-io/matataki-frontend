import { paginationUrl } from './pagination_url'

export const recommend = (axios, channel) => {
  const path = '/posts/recommend?channel='
  return axios.get(path + channel)
}

export const tokenTokenList = (axios, params, accessToekn) => {
  const path = '/token/tokenlist'
  return axios.get(path, { params, headers: { 'x-access-token': accessToekn } })
}

// 分页数据
export const paginationData = (axios, url, params) => axios.get(paginationUrl[url], { params })

// 获取可用标签列表
export const getTags = (axios, type) => axios.get('/tag/tags', { params: { type } })

// 获取ipfs数据
export const ipfsData = (axios, hash) => axios.get(`/post/ipfs/${hash}`)
export const ipfsArticleData = (axios, hash) => axios.get(`/post/${hash}`)
