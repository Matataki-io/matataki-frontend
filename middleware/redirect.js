export default function ({ store, redirect, route }) {
  // console.log('store', store.state.locales)
  // console.log('store', route)
  if (route.name === 'index') {
    // 如果是首页 直接重定向
    return redirect('/article')
  } else if (route.name === 'lang') {
    // 如果是多语言下的页面
    const routeName = route.params.lang
    if (store.state.locales.includes(routeName)) {
      // 如果是支持的语言
      return redirect(`/${route.params.lang}/article`)
    } else {
      // 乱七八糟的语言和不支持的直接默认
      return redirect('/article')
    }
  }
}
