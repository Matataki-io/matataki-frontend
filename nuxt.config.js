import path from 'path'
import webpack from 'webpack'
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import env from './env'
function genENV() {
  const keys = Object.keys(env.production)
  const result = {}
  keys.forEach((item) => {
    result[item] = env[process.env.NODE_ENV][item]
  })
  return result
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    // title: process.env.npm_package_name || '',
    title: '瞬MATATAKI',
    meta: [
      // { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
      { hid: 'og:title', name: 'og:title', content: '瞬MATATAKI' },
      { hid: 'og:site_name', name: 'og:site_name', content: '瞬MATATAKI' },
      { hid: 'og:image', name: 'og:image', content: 'https://ssimg.frontenduse.top/avatar/2019/08/30/c1d6ae7ed4e6102cb45d0a8f656d5569.png' },
      { hid: 'og:description', name: 'og:description', content: '发布瞬间 灵感永存' },
      { hid: 'description', name: 'description', content: '瞬MATATAKI - 由仙女座科技公司开发的促进优质内容裂变传播的工具，凭借经验丰富的区块链应用和智能合约设计开发能力，为用户提供旨在为创作者和分享者创造价值，为接收者发现价值。' },
      { hid: 'keywords', name: 'keywords', content: '岛娘,小岛美奈子,唐飞虎,仙女座科技,瞬MATATAKI,智能公告牌,智能投资,裂变营销,价值投资,区块链,比特币,以太坊,去中心化社交,去中心化商店,去中心化,DApp,EOS' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/html2canvas.min.js' },
      { src: '/qrcode.min.js' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#542DE0'
  },
  /*
  ** Global CSS
  */
  css: [
    'normalize.css',
    'element-ui/lib/theme-chalk/index.css',
    './assets/css/index.less'

  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/combined-inject.js',
    '~/plugins/element-ui',
    '~/plugins/vue_plugins.js',
    '~/plugins/vue_components.js',
    { src: '@/plugins/vue-mavon-editor', ssr: false },
    { src: '~/plugins/vue_scroll_reveal.js', ssr: false }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/pwa'
  ],
  styleResources: {
    less: './assets/css/global.less'
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, { isDev, isClient }) {
      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map'
      }
      // set svg-sprite-loader
      if (isClient) {
        config.module.rules.forEach((rule) => {
          if (~rule.test.source.indexOf('|svg')) {
            rule.exclude = [resolve('icons/svg')]
          }
        })

        config.module.rules.push({
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: [resolve('icons/svg')], // include => 只处理指定的文件夹下的文件
          options: {
            symbolId: 'icon-[name]'
          }
        })
        // console.log(config.module.rules)
      // set svg-sprite-loader end
      }
    },
    plugins: [
      new SpriteLoaderPlugin(), // set svg-sprite-loader
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /zh-cn/
      )
      // new BundleAnalyzerPlugin()
    ]
  },
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0'
  },
  env: genENV()
}
