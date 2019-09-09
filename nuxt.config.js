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
      { hid: 'robots', name: 'robots', property: 'robots', content: 'index,follow' },
      { hid: 'copyright', name: 'copyright', property: 'copyright', content: 'Copyright © 2018-2019 ANDOROMEDA TECH.ltd' },
      { hid: 'description', name: 'description', property: 'description', content: '瞬MATATAKI是一个永久存储和版权确权的内容平台，通过IPFS协议保障内容的永久可访问和确权信息可查询。使用了通证经济来激励创作者、探索者、布道者共建未来的超级知识链接网络。' },
      { hid: 'keywords', name: 'keywords', content: '岛娘,小岛美奈子,唐飞虎,仙女座科技,瞬MATATAKI,智能公告牌,智能投资,裂变营销,价值投资,区块链,比特币,以太坊,去中心化社交,去中心化商店,去中心化,DApp,EOS' },
      /* <!--  Meta for Twitter Card --> */
      { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: '瞬MATATAKI—发布瞬间，灵感永存' },
      { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: '瞬MATATAKI—发布瞬间，灵感永存' },
      { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: 'https://ssimg.frontenduse.top/avatar/2019/08/30/c1d6ae7ed4e6102cb45d0a8f656d5569.png' },
      { hid: 'twitter:description', name: 'description', property: 'twitter:description', content: '瞬MATATAKI是一个永久存储和版权确权的内容平台，通过IPFS协议保障内容的永久可访问和确权信息可查询。使用了通证经济来激励创作者、探索者、布道者共建未来的超级知识链接网络。' },
      /* <!--  Meta for OpenGraph --> */
      { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: '瞬MATATAKI—发布瞬间，灵感永存' },
      { hid: 'og:title', name: 'og:title', property: 'og:title', content: '瞬MATATAKI—发布瞬间，灵感永存' },
      { hid: 'og:image', name: 'og:image', property: 'og:image', content: 'https://ssimg.frontenduse.top/avatar/2019/08/30/c1d6ae7ed4e6102cb45d0a8f656d5569.png' },
      { hid: 'og:description', name: 'description', property: 'og:description', content: '瞬MATATAKI是一个永久存储和版权确权的内容平台，通过IPFS协议保障内容的永久可访问和确权信息可查询。使用了通证经济来激励创作者、探索者、布道者共建未来的超级知识链接网络。' },
      { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'article' }
      /* end */
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/html2canvas.min.js' },
      { src: '/qrcode.min.js' },
      { src: '/gt.js' }
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
    // '~/plugins/element-ui',
    '~/plugins/vue_plugins.js',
    '~/plugins/vue_components.js',
    { src: '@/plugins/element-ui', ssr: true },
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
