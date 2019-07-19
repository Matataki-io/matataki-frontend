import Vue from 'vue'
import VueHead from 'vue-head'

import moment from 'moment'
// 记录路由并缓存页面，像原生APP导航一样。
import Navigation from 'vue-navigation'
// 复制内容
import VueClipboard from 'vue-clipboard2'

import App from './App.vue'
import router from './router'
import store from './store'
import { backendAPI } from '@/api'
import errorHandling from '@/common/errorHandling'

import './registerServiceWorker'
// import "lib-flexible"; // 适配

// Vue plugins
import './plugins/iview'
import './plugins/vant'
import './plugins/baseComponents'

// global css
import '@/assets/css/index.less'

import './icons'

Vue.prototype.$backendAPI = backendAPI
Vue.prototype.$errorHandling = errorHandling

Vue.use(VueClipboard)

// 记录路由并缓存页面，像原生APP导航一样。
Vue.use(Navigation, { router, store, keyName: 'CACHE' })
;[VueHead].map(c => Vue.use(c))

Vue.config.productionTip = false

// Register moment's default language
moment.locale('zh-CN')
/*
router.beforeResolve(async (to, from) => {
  // 根据本地存储的状态来自动登陆。失败之后再重试一次
  console.log("sign in form localStorage");
  const data = {
    accessToken: accessTokenAPI.get(),
    idProvider: localStorage.getItem("idProvider")
  };
  if (data.idProvider && data.accessToken) {
    await this.$store.dispatch('signIn', data)
    .then(() => { this.$backendAPI.accessToken = this.currentUserInfo.accessToken; })
    .catch(() => this.$store.dispatch('signIn', data).then(() => { this.$backendAPI.accessToken = this.currentUserInfo.accessToken; }));
  }
}); */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
