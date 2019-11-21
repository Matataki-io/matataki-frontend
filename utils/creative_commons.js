/**
 * CreativeCommons License Generator
 * @param {object} param 包含了 ShareAlike Noncommercial NoDerivativeWorks 三个属性的 object
 * @param {boolean} param.ShareAlike 可以自由复制、散布、展示及演出本作品；若您改变、转变或更改本作品，仅在遵守与本作品相同的许可条款下，您才能散布由本作品产生的派生作品。
 * @param {boolean} param.Noncommercial 可以自由复制、散布、展示及演出本作品；您不得为商业目的而使用本作品。
 * @param {boolean} param.NoDerivativeWorks 可以自由复制、散布、展示及演出本作品；您不得改变、转变或更改本作品
 */
function CreativeCommonsLicenseGenerator({
  ShareAlike = false,
  Noncommercial = false,
  NoDerivativeWorks = false
}) {
  if (ShareAlike && NoDerivativeWorks) throw new Error("You can't use ShareAlike and NoDerivativeWorks at the same time.")
  const result = ['BY'] // 自2004年以来，当前所有的许可协议要求必须原作者署名
  if (Noncommercial) result.push('NC')
  if (NoDerivativeWorks) result.push('ND')
  if (ShareAlike) result.push('SA')
  return result.join('-')
}

function convertLicenseToChinese(str) {
  const splitted = str.split('-')
  return splitted.map(item => {
    switch (item) {
      case 'BY': return '署名'
      case 'NC': return '非商业性使用'
      case 'ND': return '禁止演绎'
      case 'SA': return '相同方式共享'
      default: return ''
    }
  }).join('-')
}

const licenseDetailLink = (license) => `https://creativecommons.org/licenses/${license.toLowerCase()}/4.0/deed.zh`

export { convertLicenseToChinese, CreativeCommonsLicenseGenerator, licenseDetailLink }
export default CreativeCommonsLicenseGenerator
