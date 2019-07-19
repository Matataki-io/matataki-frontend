import { backendAPI } from '@/api'

/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */

// initial state
const state = {}

const getters = {}

const actions = {
  async signIn({}, { code }) {
    if (!code) throw new Error('GitHub login faild, no code.')
    const { data: accessToken } = await backendAPI.loginGitHub(code)
    return accessToken
  }
}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
