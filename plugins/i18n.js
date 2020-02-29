import Cookies from 'js-cookie'
import zh from '../locale/zh'
import en from '../locale/en'


export default {
  // locales: [
  //   { name: '中文简体', code: 'zh', file: zh },
  //   { name: 'English', code: 'en', file: en },
  // ],
  locales: ['zh', 'en'],
  strategy: 'no_prefix',
  defaultLocale: Cookies.get('language') || 'zh',
  vueI18n: {
    fallbackLocale: 'zh',
    messages: {
      zh: zh,
      en: en
    }
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