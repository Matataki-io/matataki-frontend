import { testDecimal } from '@/utils/reg'

export default {
// 无法赞赏的账号类型
/**
 *
 * @param {String} id 登录类型
 */
  invalidId(id) {
    const lowerId = id.toLocaleLowerCase()
    if (lowerId === 'github' || lowerId === 'email') return true
    return false
  },
  /**
   * 格式化小数点处理 保留位数 不四舍五入
   * @param {*} tokenamount 金额
   * @param {*} decimal 小数点
   */
  formatDecimal(tokenamount, decimal) {
    if (testDecimal(tokenamount)) {
      const index = String(tokenamount).indexOf('.')
      // 小数点四位
      if (~index) return String(tokenamount).substr(0, index + (decimal + 1))
      return tokenamount
    } return tokenamount
  }
}
