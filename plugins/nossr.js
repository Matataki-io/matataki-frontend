import Vue from 'vue'
import '@vant/touch-emulator' // 桌面端使用 vant
import wechatShare from './wechat_share'

Vue.prototype.$wechatShare = wechatShare
