// precision 精度
const EOS = 10000
const ONT = 10000
const CNY = 10

/**
 *
 * @param {通证} amount 需要转换的通证
 * @param {类型} symbol 需要转换的类型
 */
export const precision = (amount, symbol = '', precision = 4) => {
  const symbolLower = symbol.toLowerCase()
  if (symbolLower === 'eos') return amount / EOS
  if (symbolLower === 'ont') return amount / ONT
  if (symbolLower === 'cny') return amount / (CNY ** precision)
  return amount
}
/**
 *
 * @param {通证} amount 需要转换的通证
 * @param {类型} symbol 需要转换的类型
 */
export const toPrecision = (amount, symbol, precision = 4) => {
  const symbolLower = symbol.toLowerCase()
  if (symbolLower === 'eos') return amount * EOS
  if (symbolLower === 'ont') return amount * ONT
  if (symbolLower === 'cny') return amount * (CNY ** precision)
}
