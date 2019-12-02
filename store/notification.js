import API from '@/api/API'

export const state = () => ({
  notificationCounters: {}
})

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
  }
}
