/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
// precision 精度
const EOS = 10000
const ONT = 10000

/**
 *
 * @param {币} amount 需要转换的币
 * @param {类型} symbol 需要转换的类型
 */
export const precision = (amount, symbol) => {
  const symbolLower = symbol.toLowerCase()
  if (symbolLower === 'eos') return amount / EOS
  if (symbolLower === 'ont') return amount / ONT
}
/**
 *
 * @param {币} amount 需要转换的币
 * @param {类型} symbol 需要转换的类型
 */
export const toPrecision = (amount, symbol) => {
  const symbolLower = symbol.toLowerCase()
  if (symbolLower === 'eos') return amount * EOS
  if (symbolLower === 'ont') return amount * ONT
}
