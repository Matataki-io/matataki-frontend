/**
 * ONT 地址验证
 * @param {地址} address
 */
// eslint-disable-next-line import/prefer-default-export
export const ontAddressVerify = address => /^A[0-9a-zA-Z]{33}$/.test(address)

// 去除空格
export const strTrim = str => str.replace(/\s+/g, '')
