import backendAPI from '@/api/backend'

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  // eslint-disable-next-line no-empty-pattern
  async signIn({}, { code }) {
    if (!code) throw new Error('GitHub login faild, no code.')
    const res = await backendAPI.loginGitHub(code)
    if (res.status === 200 && res.data.code === 0) return res.data.data
    else {
      console.log('github 获取签名失败')
      return ''
    }
  }
}
