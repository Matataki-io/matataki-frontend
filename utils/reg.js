/* eslint-disable no-useless-escape */ // regRemoveContent
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

// 提取内容 删除多余的标签
export const regRemoveContent = str => {
  // 去除空格
  const strTrim = str => str.replace(/\s+/g, '')
  // 去除html video标签
  const regRemoveHtmlVideoTag = str => str.replace(/\<video.*?\>.*?\<\/video\>/g, '123')
  // 去除标签
  const regRemoveTag = str => str.replace(/<[^>]+>/gi, '')
  // 去除markdown img
  const regRemoveMarkdownImg = str => str.replace(/!\[.*?\]\((.*?)\)/gi, '')
  // 去除 markdown 标签
  const regRemoveMarkdownTag = str => str.replace(/[\\\`\*\_\[\]\#\+\-\!\>]/gi, '')

  // 去除 剩下的括号内容(链接地址)
  const regRemoveLinkBrackets = str => str.replace(/\(.*?\)/gi, '')

  // 回车 ↵ 复制下来的时候会有, 那就多一层处理吧!
  const regRemoveLinkEnter = str => str.replace(/↵/gi, '')

  // 提前去一次换行空格
  const regRemoveHtmlVideoTagResult = regRemoveHtmlVideoTag(strTrim(str))
  const regRemoveTagResult = regRemoveTag(regRemoveHtmlVideoTagResult)
  const regRemoveMarkdownImgResult = regRemoveMarkdownImg(regRemoveTagResult)
  const regRemoveMarkdownTagResult = regRemoveMarkdownTag(regRemoveMarkdownImgResult)
  const regRemoveLinkBracketsResult = regRemoveLinkBrackets(regRemoveMarkdownTagResult)
  const regRemoveLinkEnterResult = regRemoveLinkEnter(regRemoveLinkBracketsResult)
  return strTrim(regRemoveLinkEnterResult)
}
