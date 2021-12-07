import API from '@/api/ontology'

/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */

// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  // console.log('ontology')
  return {
    account: null,
    balance: {
      ONG: 0,
      ONT: 0
    }
  }
}
// 初始化
export const state = getDefaultState

export const getters = {
  currentBalance: ({ balance }) => `${balance.ONT} ONT`
}

export const mutations = {
  setAccount(state, account = null) {
    state.account = account
  },
  setBalance(state, balance = { ONG: 0, ONT: 0 }) {
    state.balance = balance
  },
  // 重置
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

export const actions = {
  async getAccount({ commit }) {
    console.log('Connecting to ont wallet ...')
    const address = await API.getAccount()
    commit('setAccount', address)
    return address
  },
  async getBalance({ commit, state }) {
    const { account } = state
    if (!account) throw new Error('no account')
    const balance = await API.getBalance({ address: account })
    commit('setBalance', balance)
    return balance
  },
  async getSignature({ state }, { rawSignData }) {
    const { account } = state
    // console.log(state);
    if (!account) throw new Error('no account')
    // console.log(rawSignData);
    const signature = await API.signMessage({ message: rawSignData.join(' ') })
    return { publicKey: signature.publicKey, signature: signature.data, username: account }
  },
  async recordOrder(
    {
      state: { account }
    },
    order
  ) {
    const { recordOrder } = await import(
      /* webpackChunkName: "contract-Ontology" */ '@/api/contractOntology'
    )
    return recordOrder({ owner: account, ...order })
  },
  async recordShare(
    {
      state: { account }
    },
    share
  ) {
    const { recordShare } = await import(
      /* webpackChunkName: "contract-Ontology" */ '@/api/contractOntology'
    )
    return recordShare({ owner: account, ...share })
  },
  signOut({ commit }) {
    commit('setAccount')
    commit('setBalance')
  },
  // 重置
  resetState ({ commit }) {
    commit('resetState')
  },
}
