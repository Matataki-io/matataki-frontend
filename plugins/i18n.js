import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from '../locale/zh'
import en from '../locale/en'

Vue.use(VueI18n)

// TODO 本地存储 语言状态 优化
export default ({ app }) => {
  // Set the i18n instance on app
  // This way we can use it globally in our components through this.$i18n
  app.i18n = new VueI18n({
    // Set the initial locale
    locale: 'zh',

    // Set the fallback locale in case the current locale can't be found
    fallbackLocale: 'en',

    // Associate each locale to a content file
    messages: {
      zh: zh,
      en: en
    }
  })
}
