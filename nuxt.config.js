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
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
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
  loading: { color: '#fff' },
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
    { src: '@/plugins/vue-mavon-editor', ssr: false }
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
      // set svg-sprite-loader
      if (isDev && isClient) {
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
