import API from '@/api/API'

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  // eslint-disable-next-line no-empty-pattern
  async signIn({}, { code }) {
    if (!code) throw new Error('GitHub login faild, no code.')
    try {
      const res = await API.loginGitHub(code)
      if (res.code === 0) return res.data
      else {
        console.log(res.message)
        return res.data
      }
    } catch (error) {
      console.log(error)
      return ''
    }
  }
}
