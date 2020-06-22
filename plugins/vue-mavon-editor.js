import Vue from 'vue'
import mavonEditor from '@matataki/editor'
import '@matataki/editor/dist/css/index.css'

Vue.prototype.$mavonEditor = mavonEditor
Vue.use(mavonEditor)
