import store from 'store'
// 操作localstore
export default {
  get(key) {
    return store.get(key)
  },
  set(key, val) {
    store.set(key, val)
  },
  remove(key) {
    store.remove(key)
  },
  clearAll() {
    store.clearAll()
  },
  clear() {
    // 清除全部缓存时不会清空白名单内容
    // 白名单
    // likeVisible shareVisible userVisible 文章详情的新手引导
    const whitelist = ['likeVisible', 'shareVisible', 'userVisible']
    store.each((value, key) => !whitelist.includes(key) && store.remove(key))
  }
}
