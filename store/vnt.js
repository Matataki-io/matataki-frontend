import BigNumber from 'bignumber.js'
import { setToken, removeToken } from '../utils/auth'
import API from '@/api/API'


// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  console.log('vnt')
  return {
    // token: 'token',
    balances: 0
  }
}

export const state = getDefaultState

export const getters = {
}

export const mutations = {
  SET_BALANCE(state, data) {
    state.balances = data
  },
  // 重置
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}
// 授权 方法
const requestAuthorization = callback =>
  window.vnt.requestAuthorization(callback)

// 获取账号
const getCoinbase = () => {
  try {
    return window.vnt.core.coinbase
  } catch (error) {
    console.log('coinbase error', error)
    return false
  }
}
// 获取账号 余额
const getBalance = coinbase => {
  try {
    const balance = window.vnt.core.getBalance(coinbase)
    return new BigNumber(balance).times(10 ** -18).toString()
  } catch (error) {
    console.log('balance error', error)
    return false
  }
}

// TODO 网络切换
// TODO 钱包登出

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
          const dev = process.env.NODE === 'development'
          if (!dev && networkId === 2) {
            reject(new Error('钱包测试网不能登陆, 请切换'))
            return false
          } else if (dev && networkId === 1) {
            reject(new Error('钱包主网不能登陆, 请切换'))
            return false
          } else if (networkId === -1) {
            reject(new Error('获取网络失败, 请重试'))
            return false
          } else {
            return true
          }
        } catch (error) {
          reject(new Error('获取当前网络失败'))
          return false
        }
      }
      // TODO 由于不去区分网络 开放账号
      // if (!getNetwork()) return

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
          const coinbase = getCoinbase()
          if (!coinbase) return reject(new Error('获取钱包账户名称失败'))
          const coinbaseBalance = getBalance(coinbase)
          if (!coinbaseBalance) return reject(new Error('获取钱包账户余额失败'))

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

  bind({ commit }) {
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
          const dev = process.env.NODE === 'development'
          if (!dev && networkId === 2) {
            reject(new Error('钱包测试网不能登陆, 请切换'))
            return false
          } else if (dev && networkId === 1) {
            reject(new Error('钱包主网不能登陆, 请切换'))
            return false
          } else if (networkId === -1) {
            reject(new Error('获取网络失败, 请重试'))
            return false
          } else {
            return true
          }
        } catch (error) {
          reject(new Error('获取当前网络失败'))
          return false
        }
      }
      // TODO 由于不去区分网络 开放账号
      // if (!getNetwork()) return

      // 登录
      const bind = () => {
        // 获取账号
        const getCoinbaseBalance = () => {
          const coinbase = getCoinbase()
          if (!coinbase) return reject(new Error('获取钱包账户名称失败'))
          return resolve(coinbase)
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

      bind()
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
  },
  // 转账
  sendTransaction({ commit }, { data, value }) {
    return new Promise((resolve, reject) => {
      const transaction = coinbase => {
        window.vnt.core.sendTransaction(
          {
            from: coinbase,
            to: process.env.VUE_APP_VNT_CONTRACT,
            gasPrice: window.vnt.toHex(window.vnt.core.gasPrice.toString(10)),
            gasLimit: window.vnt.toHex(4000000),
            data: window.vnt.toHex(data),
            value: window.vnt.toWei(value)
          },
          (err, result) => {
            if (err) {
              if ((err.toString()).includes('insufficient')) {
                console.log('余额不足', err)
                reject(new Error('余额不足'))
              } else if ((err.toString().includes('user denied'))) {
                console.log('拒绝转账', err)
                reject(new Error('拒绝转账'))
              } else {
                console.log('转账失败', err)
                reject(new Error('转账失败'))
              }
            } else {
              console.log('转账成功', result)
              resolve(result)
            }
          }
        )
      }

      const send = () => {
        const coinbase = getCoinbase()
        if (!coinbase) return reject(new Error('获取钱包账户名称失败'))
        transaction(coinbase)
      }

      if (window.vnt.isConnected()) {
        // console.log('已连接')
        send()
      } else {
        // console.log('没有连接,请授权解锁')
        requestAuthorization((err, res) => {
          if (err) reject(new Error('取消了授权或者失败'))
          else if (!res) reject(new Error('取消了授权或者失败'))
          else send()
        })
      }
    })
  },
  coinbase() {
    return new Promise((resolve, reject) => {
      // 获取账号 余额
      const getCoinbaseBalance = () => {
        const coinbase = getCoinbase()
        if (!coinbase) return reject(new Error('获取钱包账户名称失败'))
        else return resolve(coinbase)
      }

      if (window.vnt.isConnected()) {
      // console.log('已连接')
        return getCoinbaseBalance()
      } else {
      // console.log('没有连接,请授权解锁')
        requestAuthorization((err, res) => {
          if (err) reject(new Error('取消了授权或者失败'))
          else if (!res) reject(new Error('取消了授权或者失败'))
          else return getCoinbaseBalance()
        })
      }
    })
  },
  // 重置
  resetState ({ commit }) {
    commit('resetState')
  },

}
