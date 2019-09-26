
// // import getCookie from '@/config/get-cookie'
// import Cookies from 'js-cookie'

// export default function ({ store, route, redirect, req }) {
//   const { lang } = Cookies.get('language')
//   if (lang) {
//     store.commit('setLang', lang)
//   }
//   const routePath = route.path
//   if (store.state.lang === 'en' && routePath.indexOf(`/${store.state.lang}/`) === -1) {
//     console.log('redirect')
//     return redirect({ path: `/${store.state.lang}${routePath}`, query: route.query })
//   }
// }
