/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-empty-pattern */

// initial state
export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async signIn({}, { code }) {
    if (!code) throw new Error('GitHub login faild, no code.')
    const { data: accessToken } = await this.$axios.$post(code)
    return accessToken
  }
}
