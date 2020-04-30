export default function ({ redirect, route }) {
  // console.log('store', store.state.locales)
  // console.log('store', route)
  // console.log('route', route)
  redirect('/article' + route.fullPath)
}
