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
  login({ commit }) {
    // TODO 优化
    return new Promise((resolve, reject) => {
      const init = () => window.vnt !== 'undefined'
      if (!init()) reject(new Error('您还没有安装钱包'))
      // console.log('vnt', window.vnt)

      const networkUrl = () => { // TODO 切换网络等考虑
        // 尚未获取到 -1
        // 主网 1
        // 测试网 2
        return new Promise((resolve, reject) => {
          window.vnt.getNetworkUrl((err, result) => {
            if (err) {
              console.log('vnt network url error', err)
              reject(new Error(err))
            } else {
              if (!result.chainId) return resolve(-1)
              if (result.chainId === 1) resolve(1)
              else if (result.chainId === 2) resolve(2)
            }
          })
        })
      }

      // 判断网络
      const getNetwork = async () => {
        try {
          const networkId = await networkUrl()
          const dev = process.env.NODE_ENV === 'development'
          if (!dev && networkId === 2) reject(new Error('钱包测试网不能登陆, 请切换'))
          else if (dev && networkId === 1) reject(new Error('钱包主网不能登陆, 请切换'))
          else if (networkId === -1) reject(new Error('获取网络失败, 请重试'))
        } catch (error) {
          reject(new Error('获取当前网络失败'))
        }
      }
      getNetwork()

      // 登录
      const login = () => {
        const loginAuth = async (coinbase, coinbaseBalance) => {
          const params = {
            platform: 'vnt',
            publickey: 'vnt',
            sign: 'vnt',
            username: coinbase
          }
          await API.auth(params).then(res => {
            if (res.code === 0) {
              setToken(res.data)
              commit('SET_BALANCE', coinbaseBalance)
              resolve('登录成功')
            } else {
              // console.log('获取签名失败')
              reject(new Error('登录失败'))
            }
          })
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
            reject(new Error('获取钱包信息失败请重试'))
          }
          try {
            balance = window.vnt.core.getBalance(coinbase)
            coinbaseBalance = new BigNumber(balance).times(10 ** -18).toString()
          } catch (error) {
            reject(new Error('获取余额失败请重新登录'))
            console.log('balance error', error)
          }
          loginAuth(coinbase, coinbaseBalance)
        }

        if (window.vnt.isConnected()) {
          // console.log('已连接')
          getCoinbaseBalance()
        } else {
          // console.log('没有连接,请授权解锁')
          requestAuthorization((err, res) => {
            if (err) reject(new Error('取消了授权或者失败'))
            else if (!res) reject(new Error('取消了授权或者失败'))
            else getCoinbaseBalance()
          })
        }
      }

      login()
    })
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
