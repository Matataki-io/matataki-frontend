import i18n from './plugins/i18n'
import ENV from './env'
// import path from 'path'

const metaTitle = '瞬MATATAKI—发布瞬间，灵感永存'
const metaDescription = '瞬MATATAKI是一个永久存储和版权确权的内容平台，通过IPFS协议保障内容的永久可访问和确权信息可查询。使用了Fan票来激励创作者、探索者、布道者共建未来的超级知识链接网络。'
const metaKeywords = '岛娘,小岛美奈子,唐飞虎,仙女座科技,瞬MATATAKI,智能公告牌,智能投资,裂变营销,价值投资,区块链,比特币,以太坊,去中心化社交,去中心化商店,去中心化,DApp,EOS,ETH,BTC,DAO'
const metaImage = 'https://smartsignature-img.oss-cn-hongkong.aliyuncs.com/avatar/2019/08/30/c1d6ae7ed4e6102cb45d0a8f656d5569.png'

// const resolve = (dir) => path.join(__dirname, dir)

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '瞬MATATAKI',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover' },
      // ---
      { hid: 'robots', name: 'robots', property: 'robots', content: 'index,follow' },
      { hid: 'copyright', name: 'copyright', property: 'copyright', content: 'Copyright © 2018-2021 ANDOROMEDA TECH.ltd' },
      { hid: 'description', name: 'description', content: metaDescription },
      { hid: 'keywords', name: 'keywords', content: metaKeywords },
      /* <!--  Meta for Twitter Card --> */
      { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: metaTitle },
      { hid: 'twitter:title', property: 'twitter:title', content: metaTitle },
      { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: metaImage },
      { hid: 'twitter:description', name: 'description', property: 'twitter:description', content: metaDescription },
      /* <!--  Meta for OpenGraph --> */
      { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: metaTitle },
      { hid: 'og:title', property: 'og:title', content: metaTitle },
      { hid: 'og:image', name: 'og:image', property: 'og:image', content: metaImage },
      { hid: 'og:description', name: 'description', property: 'og:description', content: metaDescription },
      { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'article' }
      /* end */
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // { rel: 'stylesheet', type: 'text/css', href: '/theme/index.css' }, // element ui css
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.3.1/css/hover-min.css' }
      // { rel: 'stylesheet', type: 'text/css', href: '/vant/index.css' }, // vant ui css
    ],
    script: [
      { src: '/bowl.min.js' },
      { src: '/bowlStore.js' }
    ]
  },
  loading: {
    color: '#542DE0'
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    './assets/css/index.less'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/combined-inject.js',
    '@/plugins/vue_plugins.js',
    '@/plugins/vue_components.js',
    // '~/plugins/i18n.js',
    '@/plugins/vue_directive.js',
    '@/plugins/vue_lazyload.js',
    { src: '@/plugins/broadcastchannel.js', mode: 'client' },
    { src: '@/plugins/router.js', mode: 'client', ssr: false },
    { src: '@/plugins/element-ui', ssr: true },
    { src: '@/plugins/vant_ui', ssr: true },
    { src: '@/plugins/nossr', ssr: false },
    { src: '@/plugins/vue-mavon-editor', ssr: false },
    { src: '@/plugins/vue_scroll_reveal.js', ssr: false },
    // { src: '~/plugins/fundebug.js', ssr: false },
    { src: '@/plugins/sentry.js', ssr: false },
    { src: '@/plugins/v-viewer.js', ssr: false },
    { src: '@/plugins/vue_echarts.js', ssr: false },
    { src: '@/plugins/build-info.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    ['nuxt-i18n', i18n],
    [
      '@nuxtjs/component-cache',
      {
        max: 10000,
        maxAge: 1000 * 60 * 60
      }
    ],
    'nuxt-ssr-cache',
    ['~/modules/nuxt-svg-sprite-loader.js', { 
      symbolId: 'icon-[name]'
    }]
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},
  cache: {
    useHostPrefix: false,
    pages: ['/dapp', '/agreement', '/policy'],
    store: {
      // 使用内存来存储页面内容
      type: 'memory',
      // 最多缓存100个页面
      max: 100,
      // 缓存时间，秒
      ttl: 60
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      name: 'Matataki',
      gcm_sender_id: '1011435306795'
    }
  },
  styleResources: {
    less: './assets/css/global.less'
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    analyze: false,
    transpile: [/^element-ui/],
    optimization: {
      splitChunks: {
        cacheGroups: {
          editor: {
            test: /node_modules[\\/]@matataki\/editor/,
            chunks: 'all',
            priority: 20,
            name: () => {
              return 'chunk-editor'
            }
          },
          elementUI: {
            test: /node_modules\/element-ui/,
            chunks: 'all',
            priority: 30,
            name: () => {
              return 'chunk-elementUI'
            }
          },
          vant: {
            test: /node_modules[\\/]vant/,
            chunks: 'all',
            priority: 30,
            name: () => {
              return 'chunk-vant'
            }
          },
          echarts: {
            test: /node_modules\/(echarts|zrender\/lib)/,
            chunks: 'all',
            priority: 20,
            name: () => {
              return 'chunk-echarts'
            }
          },
          ethers: {
            test: /node_modules[\\/]ethers/,
            chunks: 'all',
            priority: 20,
            name: () => {
              return 'chunk-ethers'
            }
          },
          web3: {
            test: /node_modules[\\/]web3/,
            chunks: 'all',
            priority: 20,
            name: () => {
              return 'chunk-web3'
            }
          },
          // TODO: 有点问题 如果 priority 高于其他会有问题 小于又打包不进来
          // utils: { // qs xss viewerjs
          //   test: /node_modules\/(qs\/lib|xss\/lib|viewerjs\/dist|bignumber\.js|weixin-js-sdk)/,
          //   chunks: 'all',
          //   priority: 10,
          //   name: () => {
          //     return 'chunk-utils'
          //   }
          // },
        }
      }
    },
    extend (config, { isDev }) {
      config.devtool = isDev && 'cheap-module-source-map'
    }
  },
  env: ENV[process.env.NODE_ENV]
}
