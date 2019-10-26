/**
 * ONT 地址验证
 * @param {地址} address
 */
// eslint-disable-next-line import/prefer-default-export
export const ontAddressVerify = address => /^A[0-9a-zA-Z]{33}$/.test(address)

// 去除空格
export const strTrim = str => str.replace(/\s+/g, '')

export const internetUrl = url => {
  // eslint-disable-next-line no-useless-escape
  const reg = new RegExp('[a-zA-z]+://[^\s]*')
  return reg.test(url)
}

// 判断多少位小数
export const testDecimal = (num, decimal = 1) => {
  // eslint-disable-next-line no-useless-escape
  const pattern = new RegExp('^[0-9]+(\.[0-9]{' + decimal + ',})$')
  return pattern.test(num)
}

// 提取两个字符之间的字符
export const extractChar = (str, left, right) => {
  const pattern = new RegExp(`(?<=${left}).*?(?=${right})`)
  return str.match(pattern)
}

// 替换两个字符之间的字符
export const replaceStr = (str, left, right, content) => {
  const pattern = new RegExp(`(?=${left}).*?(?=${right})`)
  return str.replace(pattern, content)
}
