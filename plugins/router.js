import Vue from 'vue'
import { getCookie } from '@/utils/cookie'
import wechatShare from './wechat_share'

export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    const hasLoginPage = [
      'account', 'points', 'invite',
      'tokens', 'tokens-id', 'holdliquidity',
      'minetoken', 'editminetoken', 'postminetoken',
      'user-id-buy', 'publish-type-id',
      'user-id-buy', 'user-id-buy-other',
      'setting', 'setting-account', 'setting-system', // setting page
      'dashboard'
    ] // 需要登陆才能进入
    // TODO: 单纯用 document.referrer判断暂未想好, 目前跳转到首页
    // 需要登陆的页面没有token
    if (hasLoginPage.includes(to.name) && !getCookie('ACCESS_TOKEN')) next('/')
    else next()
  })
  app.router.afterEach((to) => {
    // 微信分享list 手动维护一套分享 title list
    // 如果写在文件里面太分散了
    // 顺序按照编辑器的目录结构排列
    let weChatShareList = {
      'account-eos': '资产-瞬MATATAKI',
      'account-eth': '资产-瞬MATATAKI',
      'account': '资产-瞬MATATAKI',
      'account-ont': '资产-瞬MATATAKI',
      'account-vnt': '资产-瞬MATATAKI',

      'agreement': '用户服务协议-瞬MATATAKI',

      'article-circle': 'Fan圈-瞬MATATAKI',
      'article-follow': '关注-瞬MATATAKI',
      'article': '文章-瞬MATATAKI',
      'article-latest': '最新文章-瞬MATATAKI',

      'bookmark': '收藏-瞬MATATAKI',

      'buy': '购买-瞬MATATAKI',

      'editminetoken': 'Fan票-瞬MATATAKI',

      'exchange': 'Fan票交换-瞬MATATAKI',

      'home': '首页-瞬MATATAKI',

      'invite': '邀请-瞬MATATAKI',

      'ipfs-hash': '文章-瞬MATATAKI',

      'login-email': '登录-瞬MATATAKI',
      'login-github': '登录-瞬MATATAKI',
      'login-telegram': '登录-瞬MATATAKI',
      'login-twitter': '登录-瞬MATATAKI',
      'login-weixin': '登录-瞬MATATAKI',

      'minetoken': 'Fan票-瞬MATATAKI',

      'notification': '通知-瞬MATATAKI',

      'order': '订单-瞬MATATAKI',
      'order-id': '订单-瞬MATATAKI',

      'policy-id': '用户隐私政策-瞬MATATAKI',

      'postminetoken': 'Fan票-瞬MATATAKI',

      'preview': '草稿预览-瞬MATATAKI',

      'publish-type-id': '创作文章-瞬MATATAKI',

      'ring-id': 'Fan票圈详情-瞬MATATAKI',
      'ring-id-founder': 'Fan票圈详情-瞬MATATAKI',

      'search': '搜索-瞬MATATAKI',

      'setting': '设置-瞬MATATAKI',
      'setting-account': '设置-瞬MATATAKI',
      'setting-system': '设置-瞬MATATAKI',

      'tags': '标签-瞬MATATAKI',
      'tags-id': '标签-瞬MATATAKI',

      'timeline': '动态-瞬MATATAKI',

      'token': 'Fan票-瞬MATATAKI',

      'tokens': 'Fan票-瞬MATATAKI',
      'tokens-apply': 'Fan票-瞬MATATAKI',

      'user-id-buyarticle': '用户文章-瞬MATATAKI',
      'user-id-draft': '用户草稿-瞬MATATAKI',
      'user-id-fan': '用户粉丝-瞬MATATAKI',
      'user-id-follow': '用户关注-瞬MATATAKI',
      'user-id-info': '用户信息-瞬MATATAKI',
      'token-withdraw': '提取代币 - 瞬MATATAKI',
      'token-deposit': '转入代币 - 瞬MATATAKI',
      'token-withdrawToBsc': '提取代币到币安智能链 - 瞬MATATAKI',
      'token-myBscPermit': '我的提取许可 - 瞬MATATAKI',
      'token-bscMintWithPermit': '上传提取许可 - 瞬MATATAKI',
    }
    // 不需要设置微信分享的页面列表
    let weChatShareNoSetList = [
      'p-id'
    ]
    Vue.nextTick(() => {
      if (!(weChatShareNoSetList.includes(to.name))) {
        wechatShare({
          title: weChatShareList[to.name] || ''
        })
      }
    })

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
