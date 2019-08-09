export default {
// 无法赞赏的账号类型
/**
 *
 * @param {String} id 登陆类型
 */
  invalidId(id) {
    const lowerId = id.toLocaleLowerCase()
    if (lowerId === 'github' || lowerId === 'email') return true
    return false
  }
}
