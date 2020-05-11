// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  // console.log('importArticle')
  return {
    importModalShow: false
  }
}
// 初始化
export const state = getDefaultState

export const mutations = {
  setImportModal(state, show) {
    state.importModalShow = show
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
