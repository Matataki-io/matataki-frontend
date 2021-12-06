/**
 * For MetaMask(ETH) Only
 */
import BigNumber from 'bignumber.js'
import { setToken, removeToken } from '../utils/auth'
import { getSignatureForLogin } from '@/request/eth'
import API from '@/request/API'

// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  // console.log('metamask')
  return {
    account: null,
    balances: {
      eth: new BigNumber(0)
    },
    isConnected: false
  }
}
// 初始化
export const state = getDefaultState

export const mutations = {
  SET_BALANCE(state, data) {
    state.balances = data
  },
  SET_ACCOUNT(state, account) {
    state.account = account
  },
  SET_METAMASK_CONNECTION(state, status) {
    state.isConnected = status
  },
  // 重置
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

export const actions = {
  async fetchAccount({ commit, dispatch }) {
    await window.ethereum.enable()
    const [account] = await window.web3.eth.getAccounts()
    commit('SET_ACCOUNT', account)
    dispatch('getBalance')
  },
  async getBalance({ commit, state }) {
    const result = await window.web3.eth.getBalance(state.account)
    commit('SET_BALANCE', result)
  },
  async login({ state, commit }) {
    try {
      await window.ethereum.enable()
      commit('SET_METAMASK_CONNECTION', true)
    } catch (error) {
      // @todo: handle User denied account access...
      throw Error('You just reject MetaMask connection, please approve the connection to continute.')
    }
    try {
      const { signature, msgParams } = await getSignatureForLogin()
      const res = await API.auth({
        platform: 'eth',
        publickey: state.account,
        sign: signature,
        msgParams
      })
      if (res.code === 0) {
        setToken(res.data)
        this._vm.$userMsgChannel.postMessage('login')
        return 'Sign In Successfully'
      } else {
        throw Error('Failed to verify your signature')
      }
    } catch (error) {
      console.error(`Error happened when signing ${error.toString()}`)
      throw error
    }
  },
  async getSignature({ dispatch, state }, data = { mode: null, rawSignData: null }) {
    await dispatch('fetchAccount')
    const { account } = state
    switch (data.mode) {
      case 'Login': {
        return {
          publicKey: account,
          signature: getSignatureForLogin(),
          username: account
        }
      }
      default: return null
    }
  },
  // 暂未使用到
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_BALANCE', '')
        removeToken()
      } catch (error) {
        reject(error)
      }
      resolve()
    })
  },
  // 重置
  resetState ({ commit }) {
    commit('resetState')
  }
}
