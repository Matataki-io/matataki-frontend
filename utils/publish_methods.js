export default {
// 无法赞赏的账号类型
  invalidId(id) {
    if (id === 'GitHub' || id === 'Email') return true
    return false
  }
}
