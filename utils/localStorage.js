export default {
  get(name) {
    if (!name) return console.log('get localStorage name not empty')
    return window.localStorage.getItem(name)
  },
  set(name, val) {
    if (!name || !val) return console.log('set localStorage name or val not empty')
    window.localStorage.setItem(name, val)
  },
  clear() {
    window.localStorage.clear()
  }
}
