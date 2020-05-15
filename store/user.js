/* eslint-disable */
import { Message } from 'element-ui';
import backendAPI from '@/api/backend'
import API from '@/api/API'

// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  // console.log('user')
  return {
    userInfo: {}
  }
}
// 初始化
export const state = getDefaultState

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
      avatar: avatar ? API.getImg(avatar) : '',
      banner: banner ? API.getImg(banner) : '',
      stats: { accounts, articles, supports, drafts }
    }
  },
  // 重置
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

export const actions = {
  async refreshUser({ commit, rootGetters }, { id }) {
    const { isMe } = rootGetters
    const { data } = await (isMe(id) ? API.getMyUserData() : API.getUser(id))
    // console.log('数据：', isMe(id), data)
    commit('setUserInfo', data)
  },
  async followOrUnfollowUser({ commit, rootGetters, dispatch }, { id, type }) {
    if (!rootGetters.isLogined) {
      commit('setLoginModal', true, { root:true })
      return
    }
    // const message = type === 1 ? this.$t('follow') : this.$t('unFollow')
    const message = type === 1 ? '关注' : '取消关注'
    try {
      if (type === 1) await API.follow(id)
      else await API.unfollow(id)
      // Message.success(`${message}${this.$t('success.success')}`)
      Message.success(`${message}成功`)
      // this.followed = type === 1
    } catch (error) {
      // Message.error(`${message}${this.$t('error.fail')}`)
      Message.error(`${message}失败`)
    }
    dispatch('refreshUser', {id})
  },
  // 重置
  resetState ({ commit }) {
    commit('resetState')
  },
}
