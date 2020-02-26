import Vue from 'vue'
import mavonEditor from 'mavon-editor-matataki'
import 'mavon-editor-matataki/dist/css/index.css'
import 'mavon-editor-matataki/dist/markdown/github-markdown.min.css'

Vue.prototype.$mavonEditor = mavonEditor

Vue.use(mavonEditor)

