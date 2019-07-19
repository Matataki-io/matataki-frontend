// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackCdnPlugin = require('webpack-cdn-plugin')

const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 动态计算环境变量并以 `process.env.` 注入网站
// trick from: https://cli.vuejs.org/zh/guide/mode-and-env.html#在客户端侧代码中使用环境变量
process.env.VUE_APP_VERSION = require('./package.json').version

process.env.VUE_APP_COMMIT_HASH = process.env.COMMIT_REF
// console.log(process.env.NODE_ENV);
const { NODE_ENV } = process.env
// console.debug(process.env.VUE_APP_SIGNATURE_CONTRACT);
if (NODE_ENV === 'test') {
  module.exports = {
    chainWebpack: config => {
      // 移除 prefetch 插件
      config.plugins.delete('prefetch')

      if (NODE_ENV === 'test') {
        config.merge({
          target: 'node',
          devtool: 'inline-cheap-module-source-map',
          externals: [
            {
              canvas: 'commonjs canvas'
            },
            'bufferutil',
            'utf-8-validate'
          ]
        })
        // when target === 'node', vue-loader will attempt to generate
        // SSR-optimized code. We need to turn that off here.
        config.module
          .rule('vue')
          .use('vue-loader')
          .tap(options => {
            options.optimizeSSR = false
            return options
          })
      }
    }
  }
  return
}
module.exports = {
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    if (NODE_ENV === 'test') {
      config.merge({
        target: 'node',
        devtool: 'inline-cheap-module-source-map',
        externals: [
          {
            canvas: 'commonjs canvas'
          },
          'bufferutil',
          'utf-8-validate'
        ]
      })
      // when target === 'node', vue-loader will attempt to generate
      // SSR-optimized code. We need to turn that off here.
      config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          options.optimizeSSR = false
          return options
        })
    }
  },
  configureWebpack: {
    externals: [
      'axios',
      {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        'mavon-editor': 'MavonEditor'
        // eosjs: 'Eos',
      },
      'moment',
      'encoding',
      'bufferutil',
      'memcpy',
      'utf-8-validate'
    ],
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      // 为生产环境修改配置...
      // new BundleAnalyzerPlugin(),
      new WebpackCdnPlugin({
        modules: [
          {
            name: 'axios',
            var: 'axios',
            path: 'dist/axios.min.js'
          },
          {
            name: 'moment',
            paths: ['min/moment.min.js', 'locale/zh-cn.js']
          },
          {
            name: 'vue',
            var: 'Vue',
            path: 'dist/vue.runtime.min.js'
          },
          {
            name: 'vue-router',
            var: 'VueRouter',
            path: 'dist/vue-router.min.js'
          },
          {
            name: 'vuex',
            var: 'Vuex',
            path: 'dist/vuex.min.js'
          },
          {
            name: 'mavon-editor',
            var: 'mavonEditor',
            cssOnly: true,
            style: 'dist/css/index.css'
          },
          {
            name: 'mavon-editor',
            var: 'mavonEditor',
            prodUrl:
              'https://cdn.jsdelivr.net/gh/zhaokuohaha/mavonEditor@feature/lib-name/dist/mavon-editor.js'
          }
          /* {
            name: 'eosjs',
            var: 'Eos',
          }, */
        ],
        publicPath: '/node_modules',
        crossOrigin: true
      })
      /*
      new webpack.ContextReplacementPlugin( // 减少moment体积
        /moment[/\\]locale$/,
        /zh-cn/,
      ),
      */
    ]
  },
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: []
      }
    }
  },
  pwa: {
    msTileColor: '#1C9CFE',
    themeColor: '#FFF',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    },
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  productionSourceMap: NODE_ENV === 'development' // 去掉map文件
  // 代理
  // devServer: {
  //   proxy: {
  //     "/": {
  //       target: "https://apitest.smartsignature.io"
  //     }
  //   }
  // }
}
