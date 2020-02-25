// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  console.log('i18n')
  return {
    locales: ['zh', 'en'],
    locale: 'zh'
  }
}
// 初始化
export const state = getDefaultState

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
  // 重置
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

export const actions = {
  // 重置
  resetState ({ commit }) {
    commit('resetState')
  },
}
