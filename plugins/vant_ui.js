import Vue from 'vue'
// import '@vant/touch-emulator' // 桌面端使用 vant
import 'vant/lib/index.css'

import {
  Swipe,
  SwipeItem,
} from 'vant'

// 增加前缀 区分多个组件库 防止冲突
Vue
  .use(Swipe) // 轮播图
  .use(SwipeItem) // 轮播图
