import Vue from 'vue'
import '@matataki/editor/dist/css/index.css'

(async function() {
  const { default: mavonEditor } = await import(/* webpackChunkName: "mavonEditor" */ '@matataki/editor')
  // import mavonEditor from '@matataki/editor'
  Vue.prototype.$mavonEditor = mavonEditor

  Vue.use(mavonEditor)


})()