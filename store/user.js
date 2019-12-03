/* eslint-disable */
import { Message } from 'element-ui';
import backendAPI from '@/api/backend'
import API from '@/api/API'

export const state = () => ({
  userInfo: {}
})

export const getters = {
}

export const mutations = {
  setUserInfo(state, data) {
    const {
      avatar,
      banner,
      email,
      fans,
      follows,
      is_follow,
      nickname,
      introduction,
      username,
      accounts,
      articles,
      supports,
      drafts
    } = data
    state.userInfo = {
      email: email,
      fans: fans,
      follows: follows,
      introduction: introduction,
      followed: is_follow,
      name: nickname || username,
      avatar: API.getImg(avatar),
      banner: banner ? API.getImg(banner) : '',
      stats: { accounts, articles, supports, drafts }
    }
  },
}

export const actions = {
  async refreshUser({ commit, rootGetters }, { id }) {
    const { isMe } = rootGetters
    const { data } = await (isMe(id) ? API.getMyUserData() : API.getUser({ id }))
    console.log('数据：', isMe(id), data)
    commit('setUserInfo', data)
  },
  async followOrUnfollowUser({ commit, rootGetters, dispatch }, { id, type }) {
    if (!rootGetters.isLogined) {
      commit('setLoginModal', true, { root:true })
      return
    }
    const message = type === 1 ? '关注' : '取消关注'
    try {
      if (type === 1) await API.follow(id)
      else await API.unfollow(id)
      Message.success(`${message}成功`)
      // this.followed = type === 1
    } catch (error) {
      Message.error(`${message}失败`)
    }
    dispatch('refreshUser', {id})
  }
}
