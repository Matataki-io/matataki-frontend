// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  // console.log('transferDialog')
  return {
    transferDialog: false,
    transferUserData: Object.create(null)
  }
}
// 初始化
export const state = getDefaultState

export const mutations = {
  setTransferDialog(state, show) {
    state.transferDialog = show
  },
  setTransferUserData(state, data) {
    state.transferUserData = data
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
