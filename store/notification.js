import API from '@/request/API'

// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  // console.log('notification')
  return {
    notificationCounters: {}
  }
}
// 初始化
export const state = getDefaultState

export const getters = {
  hasNewNotification({ notificationCounters }) {
    if (!notificationCounters || typeof notificationCounters !== 'object') return false
    for (const p in notificationCounters) {
      if (notificationCounters[p] > 0) return true
    }
    return false
  }
}

export const mutations = {
  setCounters(state, counters) {
    state.notificationCounters = counters
  },
  clearCounters(state, provider) {
    if (state.notificationCounters[provider]) {
      state.notificationCounters[provider] = 0
    }
  },
  // 重置
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

export const actions = {
  async getNotificationCounters({ commit }) {
    const { data } = await API.getNotificationCounters()
    if (data) {
      commit('setCounters', data)
    }
  },
  async clearNotificationCounter({ commit }, { provider }) {
    await API.readNotifications(provider)
    commit('clearCounters', provider)
  },
  // 重置
  resetState ({ commit }) {
    commit('resetState')
  },
}
