import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from '../locale/zh'
import en from '../locale/en'

Vue.use(VueI18n)

// TODO 本地存储 语言状态 优化
export default ({ app, store }) => {
  app.i18n = new VueI18n({
    locale: store.state.i18n.locale,
    fallbackLocale: 'en',

    messages: {
      zh: zh,
      en: en
    }
  })
  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }
    console.log(app.i18n.locale, link)
    return `/${app.i18n.locale}/${link}`
  }
}
