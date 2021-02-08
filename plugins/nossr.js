import Vue from 'vue'

import '@vant/touch-emulator' // 桌面端使用 vant
import wechatShare from './wechat_share'

import(/* webpackChunkName: "vconsole" */ 'vconsole').then(module => {
  const { default:  VConsole } = module
  // new VConsole()
  Vue.prototype.$VConsole = VConsole
})


Vue.prototype.$wechatShare = wechatShare
