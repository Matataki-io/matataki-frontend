/**
 * For MetaMask(ETH) Only
 */
import BigNumber from 'bignumber.js'
import { getToken, setToken, removeToken } from '../utils/auth'
import { signToLogin, getSignatureForLogin, getSignatureForPublish } from '@/api/eth'
import API from '@/api/API'

export const state = () => ({
  account: null,
  balances: {
    eth: new BigNumber(0)
  },
  isConnected: false
})

export const mutations = {
  SET_BALANCE(state, data) {
    state.balances = data
  },
  SET_ACCOUNT(state, account) {
    state.account = account
  },
  SET_METAMASK_CONNECTION(state, status) {
    state.isConnected = status
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
      throw Error('你拒绝了网站对MetaMask插件的访问，无法通过MetaMask登录')
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
        return '签名登录成功，正在跳转'
      } else {
        throw Error('签名登录失败')
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
      case 'Article': {
        const [author, hash] = data.rawSignData
        const signature = await getSignatureForPublish(hash)
        return {
          publicKey: account,
          signature: signature.signature,
          msgParams: signature.msgParams,
          username: account.slice(-12)
        }
      }
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
  }
}
