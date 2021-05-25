export default function ({ redirect, route }) {
  redirect('/article' + route.fullPath)
}
