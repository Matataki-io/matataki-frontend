/* eslint-disable */
import backendAPI from '@/api/backend'
import { accessTokenAPI } from '@/api/backend'

export const state = () => ({
  userConfig: {
    // Identity Provider, IdP
    idProvider: null
  },
  userInfo: {
    accessToken: null, // 僅為通過 signIn 的
    nickname: ''
  },
  loginModalShow: false
})

export const getters = {
  currentUserInfo: (
    { userConfig: { idProvider }, userInfo },
    { 'scatter/currentBalance': scatterBalance, 'ontology/currentBalance': ontologyBalance }
  ) => {
    let balance = null
    if (idProvider === 'EOS') {
      balance = scatterBalance
    } else if (idProvider === 'ONT') {
      balance = ontologyBalance
    } else if (idProvider === 'GitHub') {
      balance = null
    }
    const { id, iss: name } = accessTokenAPI.disassemble(userInfo.accessToken)
    return {
      id,
      idProvider,
      name,
      balance,
      ...userInfo
    }
  },
  //  displayName.length <= 12 ? name : name.slice(0, 12);
  displayName: ({ userInfo }, { currentUserInfo }) => userInfo.nickname || currentUserInfo.name,
  isLogined: ({ userInfo: { accessToken } }) => accessToken !== null,
  isMe: (state, { currentUserInfo: { id } }) => target => id === Number(target),
  // for store
  prefixOfType: ({ userConfig: { idProvider } }) => {
    if (idProvider === 'EOS') return 'scatter'
    if (idProvider === 'ONT') return 'ontology'
    if (idProvider === 'GitHub') return 'github'
    return null
  },
  // for store
  asset: ({ userConfig: { idProvider } }) => {
    let contract = null
    let symbol = null
    if (idProvider === 'EOS') {
      contract = 'eosio.token'
      symbol = 'EOS'
    } else if (idProvider === 'ONT') {
      contract = 'AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV'
      symbol = 'ONT'
    }
    return { contract, symbol }
  }
}

export const mutations = {
  setAccessToken(state, accessToken = null) {
    state.userInfo.accessToken = accessToken
    if (accessToken) accessTokenAPI.set(accessToken)
    else accessTokenAPI.rm()
    // console.info('set access token :', accessToken);
  },
  setNickname(state, nickname = '') {
    state.userInfo.nickname = nickname
  },
  setUserConfig(state, config = null) {
    // only idProvider now
    if (config) {
      this.$utils.setCookie('idProvider', config.idProvider)
      state.userConfig.idProvider = config.idProvider
    } else {
      this.utils.delCookie('idProvider')
      state.userConfig.idProvider = null
    }
    if (config) state.userConfig.idProvider = config.idProvider
    else state.userConfig.idProvider = null
  },
  setLoginModal(state, show) {
    state.loginModalShow = show
  }
}

export const actions = {
  testLogin({ commit }) {
    const accessToken = this.$utils.getCookie('ACCESS_TOKEN')
    const idProvider = this.$utils.getCookie('idProvider')
    if (accessToken) commit('setAccessToken', accessToken)
    if (idProvider) commit('setUserConfig', { idProvider })
  },
  async accountCheck({
    dispatch,
    state,
    getters
  }) {
    console.log('account check start...')
    if (state[`${getters.prefixOfType}`].account === null) {
      return dispatch('signIn', {})
    }
  },
  async getAuth({ dispatch }, { name = null, oldAccessToken = null }) {
    let newAccessToken = oldAccessToken
    if (!name) throw new Error('no name')
    const { exp, iss } = accessTokenAPI.disassemble(newAccessToken)
    if (!iss || iss !== name || exp < new Date().getTime()) {
      try {
        console.log('Retake authtoken...')
        const sg = await dispatch('getSignatureOfAuth', { name });
        console.log(sg);
        console.log(backendAPI);
        const { data } = await backendAPI.auth(sg)
        // this.$axios.$post(this.$API.auth, await dispatch('getSignatureOfAuth', { name }))
        newAccessToken = data
      } catch (error) {
        console.warn('取得 access token 出錯', error)
        throw error
      }
    }
    return newAccessToken
  },
  // output: { publicKey, signature, username }
  async getSignature({ dispatch, getters }, data = { mode: null, rawSignData: null }) {
    // console.debug(getters.currentUserInfo, data.mode, data.rawSignData);
    await dispatch('accountCheck')
    const { currentUserInfo, prefixOfType } = getters
    const { idProvider } = currentUserInfo
    return { idProvider, ...(await dispatch(`${prefixOfType}/getSignature`, data)) }
  },
  async getSignatureOfArticle({ dispatch }, { author, hash }) {
    return dispatch('getSignature', { mode: 'Article', rawSignData: [author, hash] })
  },
  async getSignatureOfAuth({ dispatch }, { name = null }) {
    return dispatch('getSignature', { mode: 'Auth', rawSignData: [name] })
  },
  /*
   * 只有刷新時才會從本地存储抓取 accessToken ，並立即 signIn ，
   * signIn 時針對該 accessToken 驗證，不合規跟後端重要一份，並寫入store和本地存储，
   * 並且之後送到後端的都是 store 那份，更改本地存储不影響送到後端的 accessToken
   */
  async signIn(
    { commit, dispatch, state, getters },
    { code = null, idProvider = null, accessToken = null }
  ) {
    console.debug(
      'signIn:',
      'code:',
      code,
      'idProvider:',
      idProvider,
      'accessToken:',
      accessToken
    )
    // 从cookie中取....
    const idProviderInCookie = this.$utils.getCookie('idProvider')
    if (!idProvider && idProviderInCookie) {
      idProvider = idProviderInCookie
    }
    if (!idProvider) throw new Error('did not choice idProvider')
    commit('setUserConfig', { idProvider })

    // recover
    if (accessToken) {
      console.log('signIn recover mode')
      if (idProvider === 'GitHub') {
        commit('setAccessToken', accessToken)
        return true
      }
    }

    try {
      const { prefixOfType } = getters
      const oldAccessToken = accessToken // null or from localStorage
      // Scatter
      if (idProvider === 'EOS') {
        if (!state.scatter.isConnected) {
          const result = await dispatch(`${prefixOfType}/connect`)
          if (!result) throw new Error('Scatter: connection failed')
        }
        if (!state.scatter.isLoggingIn) {
          const result = await dispatch(`${prefixOfType}/login`)
          if (!result) throw new Error('Scatter: login failed')
        }
        accessToken = await dispatch('getAuth', {
          name: getters[`${prefixOfType}/currentUsername`],
          oldAccessToken
        })
      }
      // Ontology
      else if (idProvider === 'ONT') {
        if (!state.ontology.account) await dispatch(`${prefixOfType}/getAccount`)
        await dispatch('ontology/getBalance').catch(error =>
          console.warn('Ontology: Failed to get balance :', error)
        )
        accessToken = await dispatch('getAuth', {
          name: state.ontology.account,
          oldAccessToken
        })
      }
      // GitHub
      else if (idProvider === 'GitHub') {
        accessToken = await dispatch(`${prefixOfType}/signIn`, { code })
      }
    } catch (error) {
      console.error('store出错', error)
      // dispatch('signOut')
      throw new Error(`Unable to get ${idProvider}'s id`)
    }

    // 成功後的處理
    commit('setAccessToken', accessToken)
    console.log('idProvider', state.userConfig.idProvider)

    // localStorage.setItem('idProvider', state.userConfig.idProvider)
    this.$utils.setCookie('idProvider', state.userConfig.idProvider)
    return state.userInfo.accessToken
  },
  /*
   * 購買，會自動代入目前登錄帳號，自動分流到不同合約填寫不同的合約參數格式
   * 1. 提交 order 給後端獲得 orderId
   * 2. 把其他參數打包分發給合約
   *
   * @param order - { num, amount: num * 20000, signId: 100455, sponsor: { id: null, username: null } }

    makeOrder 用法跟 makeShare 一樣，流程都打包好了，只要傳參
    推薦人參數務必用這種格式 sponsor: { id: null, username: null }
    id 和 username 有就塞沒有就 null
    一個是後端要用一個是合約要用 so...

    ex:
    makeOrder({ num, amount: num * 20000, signId: 100455, sponsor: { id: null, username: null } });
  */
  async makeOrder(
    {
      dispatch,
      getters,
      state: {
        userConfig: { idProvider }
      }
    },
    order
  ) {
    await dispatch('accountCheck')
    const order2 = { ...order, idProvider, ...getters.asset }
    const api = backendAPI
    api.accessToken = getters.currentUserInfo.accessToken
    const {
      data: {
        data: { orderId }
      }
    } = await api.reportOrder(order2)
    // console.debug(oid);
    return dispatch(`${getters.prefixOfType}/recordOrder`, {
      ...order2,
      oId: orderId,
      sponsor: order2.sponsor.username
    })
  },
  async makeShare(
    {
      dispatch,
      getters,
      state: {
        userConfig: { idProvider }
      }
    },
    share
  ) {
    await dispatch('accountCheck')
    share.idProvider = idProvider
    if (idProvider === 'EOS') {
      share.contract = 'eosio.token'
      share.symbol = 'EOS'
    } else if (idProvider === 'ONT') {
      share.contract = 'AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV'
      share.symbol = 'ONT'
    }
    await dispatch(`${getters.prefixOfType}/recordShare`, {
      ...share,
      sponsor: share.sponsor.username
    })
    const api = backendAPI
    api.accessToken = getters.currentUserInfo.accessToken
    return api.reportShare(share)
  },
  async getCurrentUser({ commit, getters: { currentUserInfo } }) {
    const api = backendAPI
    api.accessToken = currentUserInfo.accessToken
    const {
      data: { data }
    } = await api.getUser({ id: currentUserInfo.id })
    console.info(data)
    commit('setNickname', data.nickname)
    return data
  },
  signOut({ commit, dispatch, getters: { prefixOfType } }) {
    dispatch(`${prefixOfType}/logout`)
    commit('setUserConfig')
    commit('setAccessToken')
    commit('setNickname')
    // localStorage.clear()
    this.$utils.deleteAllCookies()
  },
  // data: { amount, toaddress, memo }
  async withdraw({ dispatch, getters }, data) {
    if (!this.$publishMethods.invalidId(getters.currentUserInfo.idProvider)){
      await dispatch('accountCheck')
    }
    console.debug(data)
    // 根据传进来的mode判断提现什么币
    if (data.tokenName === 'EOS') {
      data.contract = 'eosio.token'
      data.symbol = 'EOS'
      data.idProvider = 'eos'
    } else if (data.tokenName === 'ONT') {
      data.contract = 'AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV'
      data.symbol = 'ONT'
      data.idProvider = 'ont'
    }
    data.amount *= 10000 // 前端统一*10000

    const { amount, contract, symbol, toaddress, tokenName } = data
    if (!this.$publishMethods.invalidId(getters.currentUserInfo.idProvider)) {
      data.signature = await dispatch('getSignature', {
        mode: 'withdraw',
        rawSignData: [toaddress, contract, symbol, amount],
        tokenName
      })
    }
    const api = backendAPI
    api.accessToken = getters.currentUserInfo.accessToken
    return api.withdraw(data)
  }
}
