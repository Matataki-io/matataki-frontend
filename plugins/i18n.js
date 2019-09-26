import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import zh from '../locale/zh'
import en from '../locale/en'

// export default {
//   locales: [{
//     code: 'en',
//     iso: 'en-US',
//     name: 'English'
//   },
//   {
//     code: 'zh',
//     iso: 'zh-ZH',
//     name: '中文'
//   }
//   ],
//   defaultLocale: 'zh',
//   routes: {
//     article: {
//       zh: '/article',
//       en: '/en/article'
//     }
//   },
//   vueI18n: {
//     fallbackLocale: 'zh',
//     messages: {
//       zh: zh,
//       en: en
//     }
//   }
// }

Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it globaly in our components
  app.i18n = new VueI18n({
    // Set the initial locale (here, based on our store's initial value)
    locale: Cookies.get('language') || 'zh',

    // Set the fallback locale in case the current lovcale can't be found
    fallbackLocale: 'en',

    // Associate each locale to a content file
    messages: {
      zh: zh,
      en: en
    }
  })
}
