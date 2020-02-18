/**
 * 用户文章的XSS过滤, 开发者如果修改规则请同步两端规则
 */
/* eslint-disable */
import xss from 'xss'

// eslint-disable-next-line import/prefer-default-export
export const xssFilter = html => {
  // 自定义规则
  const { whiteList } = xss

  xss.cssFilter.options.whiteList['justify-content'] = true
  xss.cssFilter.options.whiteList['flex'] = true

  whiteList.iframe = [
    'id',
    'src',
    'height',
    'width',
    'frameborder',
    'allowfullscreen',
    'style',
    'scrolling'
  ]
  whiteList.embed = ['src', 'allowFullScreen', 'quality', 'width', 'height', 'align', 'type']
  whiteList.section = [
    'class',
    'style',
    'data-color',
    'data-bgless',
    'data-bglessp',
    'data-custom',
    'data-brushtype',
    'data-width',
    'data-role',
    'data-autoskip',
    'data-ratio',
    'data-id',
    'data-tools'
  ]
  whiteList.span = ['class', 'style']
  whiteList.p = ['class', 'style']
  let aTag = ['class', 'style', 'href', 'data-url', 'target']
  whiteList.a.push(...aTag)
  whiteList.img.push('data-ratio')
  whiteList.img.push('style')
  whiteList.img.push('referrer')
  whiteList.div.push('align')
  whiteList.div.push('style')

  let brTag = ['style']
  let strongTag = ['style']
  let h2Tag = ['style']
  let svgTag = ['svg', 'x', 'y', 'viewbox', 'width', 'style', 'g', 'line', 'xmlns']
  let lineTag = ['style', 'x1', 'x2', 'y1', 'y2', 'fill', 'stroke', 'stroke-width', 'stroke-miterlimit']
  let gTag = ['style']
  let ulTag = ['style']
  let polygonTag = ['style', 'fill' ,'points']
  let sectionTag = ['style']
  whiteList.br.push(...brTag)
  whiteList.strong.push(...strongTag)
  whiteList.h2.push(...h2Tag)

  whiteList.svg = [...svgTag]
  whiteList.g = [...gTag]
  whiteList.polygon = [...polygonTag]
  whiteList.line = [...lineTag]
  whiteList.ul.push(...ulTag)
  whiteList.section.push(...sectionTag)

  let rulePush = [
    {
      tag: 'h1',
      attributes: ['style']
    },
    {
      tag: 'h2',
      attributes: ['style']
    },
    {
      tag: 'h3',
      attributes: ['style']
    },
    {
      tag: 'h4',
      attributes: ['style']
    },
    {
      tag: 'h5',
      attributes: ['style']
    },
    {
      tag: 'h6',
      attributes: ['style']
    },
    {
      tag: 'hr',
      attributes: ['style']
    },
    {
      tag: 'code',
      attributes: ['style']
    },
  ]

  let ruleAdd = [
    {
      tag: 'figure',
      attributes: ['style']
    },
    {
      tag: 'figcaption',
      attributes: ['style']
    },
    {
      tag: 'blockquote',
      attributes: ['style']
    },
    {
      tag: 'em',
      attributes: ['style']
    },
    {
      tag: 'th',
      attributes: ['style']
    },
    {
      tag: 'td',
      attributes: ['style']
    },
    // id 因为有个锚点插件需要这个id所以开放规则防止toc目录的锚地失败
    {
      tag: 'h1',
      attributes: ['id']
    },
    {
      tag: 'h2',
      attributes: ['id']
    },
    {
      tag: 'h3',
      attributes: ['id']
    },
    {
      tag: 'h4',
      attributes: ['id']
    },
    {
      tag: 'h5',
      attributes: ['id']
    },
    {
      tag: 'h6',
      attributes: ['id']
    },
  ]

  for (const key of rulePush) whiteList[key.tag].push(...key.attributes)
  for (const key of ruleAdd) whiteList[key.tag] = key.attributes

  const options = {
    whiteList,
    onIgnoreTag(tag, html, options) {
      console.log(`Tag 不支持的标签属性，请联系客服：${tag}, ${html}, ${options}`)
    },
    onIgnoreTagAttr(tag, name, value, isWhiteAttr) {
      // 过滤输出data-自定义属性
      if (!(/data-.*?/.test(name))) {
        console.log(`Attr 不支持的标签属性，请联系客服：${tag}, ${name}, ${value}`)
      }
    },
    // > 放过md引用
    escapeHtml(html) {
      return html.replace(/</g, '&lt;')
    }
  }
  const myxss = new xss.FilterXSS(options)

  return myxss.process(html)
}
