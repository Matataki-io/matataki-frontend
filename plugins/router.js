import Vue from 'vue'
import { getCookie } from '@/utils/cookie'
// import wechatShare from './wechat_share'

export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    const hasLoginPage = [
      'account', 'points', 'invite',
      'tokens', 'tokens-id', 'holdliquidity',
      'minetoken', 'editminetoken', 'postminetoken',
      'user-id-buy', 'publish-type-id',
      'user-id-buy', 'user-id-buy-other',
      'setting', 'setting-account', 'setting-system' // setting page
    ] // 需要登陆才能进入
    // TODO: 单纯用 document.referrer判断暂未想好, 目前跳转到首页
    // 需要登陆的页面没有token
    if (hasLoginPage.includes(to.name) && !getCookie('ACCESS_TOKEN')) next('/')
    else next()
  })
  app.router.afterEach((to) => {
    // Vue.nextTick(() => {
    //   wechatShare({})
    // })
    const autoAlertLoginPage = [] // 进入页面没有登陆则弹出信息框
    // 需要登陆的页面没有登陆, 弹出登陆框
    if (autoAlertLoginPage.includes(to.name) && !getCookie('ACCESS_TOKEN')) {
      Vue.nextTick(() => {
        setTimeout(() => { // TODO: 需要settimeout才能正常执行 需要调整
          app.store.commit('setLoginModal', true)
        }, 0)
      })
    }
  })
}
