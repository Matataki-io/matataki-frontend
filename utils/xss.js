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





  const options = {
    whiteList,
    // eslint-disable-next-line no-unused-vars
    onIgnoreTag(tag, html, options) {
      console.log(`不支持的标签属性，请联系客服：${tag}`)
    },
    // eslint-disable-next-line no-unused-vars
    onIgnoreTagAttr(tag, name, value, isWhiteAttr) {
      console.log(`不支持的标签属性，请联系客服：${tag} ${name}`)
    },
    // > 放过md引用
    escapeHtml(html) {
      return html.replace(/</g, '&lt;')
    }
  }
  const myxss = new xss.FilterXSS(options)

  return myxss.process(html)
}
