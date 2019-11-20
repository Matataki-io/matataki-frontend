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
  let result = 'BY-' // 自2004年以来，当前所有的许可协议要求原作者署名
  if (ShareAlike) result += 'SA'
  if (Noncommercial) result += 'NC'
  if (NoDerivativeWorks) result += 'ND'
  return result
}

export default CreativeCommonsLicenseGenerator
