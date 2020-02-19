import Vue from 'vue'

const HelloJs = require('hellojs/dist/hello.all.js')
const VueHello = require('vue-hellojs')

HelloJs.init({
  twitter: 'psCq7zJc8a9UyNOX5etVSuKVh'
}, {
  redirect_uri: '/login/twitter_logined'
})

Vue.use(VueHello, HelloJs)
