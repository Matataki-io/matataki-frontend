import BigNumber from 'bignumber.js'
import { getToken, setToken, removeToken } from '../utils/auth'
import API from '@/api/API'

export const state = () => ({
  // token: 'token',
  balances: 0
})

export const getters = {
}

export const mutations = {
  SET_BALANCE(state, data) {
    state.balances = data
  }
}

// 授权 方法
const requestAuthorization = callback =>
  window.vnt.requestAuthorization(callback)

export const actions = {
  networkUrl() { // TODO 切换网络等考虑
    window.vnt.getNetworkUrl((err, result) => {
      if (err) return console.log('vnt network url error', err)
      else {
        // console.log(result);
        if (!result.chainId) return
        if (result.chainId === 1) {
          console.log('主网')
        } else if (result.chainId === 2) {
          console.log('测试网')
        }
      }
    })
  },
  login({ commit }) {
    console.log('vnt登陆')
    const init = () => {
      if (typeof window.vnt !== 'undefined') {
        console.log('已经安装了钱包')
        return true
      } else {
        console.log('您还没有安装钱包')
        return false
      }
    }
    if (!init()) return
    console.log('vnt', window.vnt)

    // 登录
    const login = () => {
      const loginAuth = async (coinbase, coinbaseBalance) => {
        const params = {
          platform: 'vnt',
          publickey: 'vnt',
          sign: 'vnt',
          username: coinbase
        }
        const res = await API.auth(params).then(async res => {
          if (res.code === 0) {
            await setToken(res.data)
            commit('SET_BALANCE', coinbaseBalance)
            return true
          } else {
            console.log('获取签名失败')
            return false
          }
        })
        return res
      }

      // 获取账号 余额
      const getCoinbaseBalance = () => {
        let coinbase = ''
        let balance = 0
        let coinbaseBalance = 0
        try {
          coinbase = window.vnt.core.coinbase
        } catch (error) {
          console.log('coinbase error', error)
        }
        try {
          balance = window.vnt.core.getBalance(coinbase)
          coinbaseBalance = new BigNumber(balance).times(10 ** -18).toString()
        } catch (error) {
          console.log('balance error', error)
        }
        return loginAuth(coinbase, coinbaseBalance)
      }

      if (window.vnt.isConnected()) {
        console.log('已连接')
        return getCoinbaseBalance()
      } else {
        console.log('没有连接,请授权解锁')
        requestAuthorization((err, res) => {
          if (err) console.log('err 取消了授权或者失败', err)
          else {
            if (!res) return
            return getCoinbaseBalance()
          }
        })
      }
    }

    return login()
  }

}
