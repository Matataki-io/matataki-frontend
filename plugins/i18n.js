import Cookies from 'js-cookie'
import zh from '../locale/zh'
import en from '../locale/en'
import ja from '../locale/ja'

// TODO: Element-ui lang 需要处理
// import ElementLocale from 'element-ui/lib/locale'
import elementEn from 'element-ui/lib/locale/lang/en'
import elementZh from 'element-ui/lib/locale/lang/zh-CN'

// ElementLocale.i18n((key, value) => app.i18n.t(key, value))

export default {
  // locales: [
  //   { name: '中文简体', code: 'zh', file: zh },
  //   { name: 'English', code: 'en', file: en },
  // ],
  locales: ['zh', 'en', 'ja'],
  strategy: 'no_prefix',
  defaultLocale: Cookies.get('language') || 'zh',
  vueI18n: {
    fallbackLocale: 'zh',
    messages: {
      zh: {
        ...elementZh,
        ...zh
      },
      en: {
        ...elementEn,
        ...en
      },
      ja: {
        ...ja
      }
    },
  },
  detectBrowserLanguage: {
    // If enabled, a cookie is set once a user has been redirected to his
    // preferred language to prevent subsequent redirections
    // Set to false to redirect every time
    useCookie: true,
    // Set to override the default domain of the cookie. Defaults to host of the site.
    cookieDomain: null,
    // Cookie name
    cookieKey: 'language',
    // Set to always redirect to value stored in the cookie, not just once
    alwaysRedirect: false,
    // If no locale for the browsers locale is a match, use this one as a fallback
    fallbackLocale: 'zh'
  },
}