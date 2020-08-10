/**
 * 用户文章的XSS过滤, 开发者如果修改规则请同步两端规则
 */
/* eslint-disable */
import xss from 'xss'
const isSupportWebp = process.browser ? !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0 : false
console.log('xss', isSupportWebp)

export const xssFilter = html => {
  // 自定义规则
  const { whiteList } = xss

  xss.cssFilter.options.whiteList['justify-content'] = true
  xss.cssFilter.options.whiteList['flex'] = true
  xss.cssFilter.options.whiteList['left'] = true
  xss.cssFilter.options.whiteList['right'] = true
  xss.cssFilter.options.whiteList['top'] = true
  xss.cssFilter.options.whiteList['bottom'] = true
  xss.cssFilter.options.whiteList['height'] = true

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
  whiteList.span = ['class', 'style', 'aria-hidden', 'data-linenumber']
  let aTag = ['class', 'style', 'href', 'data-url', 'target', 'id']
  whiteList.a.push(...aTag)
  whiteList.img.push('data-ratio')
  whiteList.img.push('style')
  whiteList.img.push('referrer')
  whiteList.div.push('align')
  whiteList.div.push('style')

  let brTag = ['style']
  let strongTag = ['style']
  let svgTag = ['svg', 'x', 'y', 'viewbox', 'width', 'height', 'style', 'g', 'line', 'xmlns', 'preserveaspectratio']
  let lineTag = ['style', 'x1', 'x2', 'y1', 'y2', 'fill', 'stroke', 'stroke-width', 'stroke-miterlimit']
  let gTag = ['style']
  let ulTag = ['style']
  let polygonTag = ['style', 'fill' ,'points']
  let sectionTag = ['style']
  whiteList.br.push(...brTag)
  whiteList.strong.push(...strongTag)

  whiteList.svg = [...svgTag]
  whiteList.g = [...gTag]
  whiteList.polygon = [...polygonTag]
  whiteList.line = [...lineTag]
  whiteList.ul.push(...ulTag)
  whiteList.section.push(...sectionTag)

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
      attributes: ['style', 'class']
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
    {
      tag: 'source',
      attributes: ['src', 'type']
    },
    {
      tag: 'input',
      attributes: ['type', 'disabled', 'checked', 'class']
    },
    {
      tag: 'math',
      attributes: ''
    },
    {
      tag: 'math',
      attributes: ''
    },
    {
      tag: 'semantics',
      attributes: ''
    },
    {
      tag: 'annotation',
      attributes: 'encoding'
    },
    {
      tag: 'mrow',
      attributes: ''
    },
    {
      tag: 'mn',
      attributes: ''
    },
    {
      tag: 'mo',
      attributes: ''
    },
    {
      tag: 'mi',
      attributes: ['mathvariant', 'normal']
    },
    {
      tag: 'msub',
      attributes: ''
    },
    {
      tag: 'msubsup',
      attributes: ''
    },
    {
      tag: 'mtext',
      attributes: ''
    },
    {
      tag: 'munderover',
      attributes: ''
    },
    {
      tag: 'mspace',
      attributes: ['width']
    },
    {
      tag: 'mfrac',
      attributes: ''
    },
    {
      tag: 'msqrt',
      attributes: ''
    },
    {
      tag: 'msup',
      attributes: ''
    },
    {
      tag: 'summary',
      attributes: ''
    },
    {
      tag: 'path',
      attributes: ['path', 'd']
    },
  ]

  let rulePush = [
    {
      tag: 'div',
      attributes: ['class', 'data-need', 'data-hold', 'role', 'data-pdfurl']
    },
    {
      tag: 'h1',
      attributes: ['id', 'style', 'class']
    },
    {
      tag: 'h2',
      attributes: ['id', 'style', 'class']
    },
    {
      tag: 'h3',
      attributes: ['id', 'style', 'class']
    },
    {
      tag: 'h4',
      attributes: ['id', 'style', 'class']
    },
    {
      tag: 'h5',
      attributes: ['id', 'style', 'class']
    },
    {
      tag: 'h6',
      attributes: ['id', 'style', 'class']
    },
    {
      tag: 'p',
      attributes: ['style', 'class', 'hold']
    },
    {
      tag: 'hr',
      attributes: ['style', 'class']
    },
    {
      tag: 'code',
      attributes: ['class', 'style']
    },
    {
      tag: 'pre',
      attributes: ['class', 'style']
    },
    {
      tag: 'ol',
      attributes: ['style', 'class', 'start']
    },
    {
      tag: 'ul',
      attributes: ['class']
    },
    {
      tag: 'li',
      attributes: ['class', 'id']
    },
    {
      tag: 'sup',
      attributes: ['class']
    },
    {
      tag: 'table',
      attributes: ['class']
    },
    {
      tag: 'i',
      attributes: ['class', 'hidden']
    },
    {
      tag: 'details',
      attributes: ['class']
    },
  ]

  for (const key of ruleAdd) whiteList[key.tag] = key.attributes
  for (const key of rulePush) whiteList[key.tag].push(...key.attributes)

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
  }

  const myxss = new xss.FilterXSS(options)

  return myxss.process(html)
}

// 通过xss处理图片
export const xssImageProcess = html => {

  const isSelfOss = url => {
    let oss = process.env.ssImgAddress
    return new RegExp(oss).test(url)
  }

  return xss(html, {
    onTagAttr: function(tag, name, value, isWhiteAttr) {
      if (tag === "img" && name === "src") {

        let url = xss.friendlyAttrValue(value)

        if (isSelfOss(url)) {

          // gif 不处理
          let suffix = url.substring(url.lastIndexOf('.') + 1);
          if (suffix.includes('gif')) {
            return `${name}='${url}' alt='${url}'`
          }

          // 是自己的oss
          if (isSupportWebp) {
            // 如果支持webp

            if (new RegExp(/\?x-oss-process=image/).test(url)) {
              // 有x-ossprocess=image
              if (!new RegExp(/\/format,webp/).test(url)) {
                // 如果没有/format,webp 则添加
                url += '/format,webp'
              }
            } else {
              // 没有x-ossprocess=image
              if (new RegExp(/\?*\=/).test('')) {
                // 有别的参数了
                url+= '&x-oss-process=image/format,webp'
              } else {
                // 没有别的参数
                url+= '?x-oss-process=image/format,webp'
              }
            }
          } else {
            // 如果不支持webp

            if (new RegExp(/\?x-oss-process=image/).test(url)) {
              // 有x-ossprocess=image
              if (new RegExp(/\/format,webp/).test(url)) {
                // 如果有/format,webp 则替换/format,png
                url = url.replace(/\/format,webp/gi, '/format,png')
              }
            }

          }
          // console.log('url', url)
          return `${name}='${url}' alt='${url}'`
        }
      }
    }
  });
}

// 过滤html标签
export const filterOutHtmlTags = (html, whiteList = []) => {
  // 没有用markdownit渲染markdown文档, 因为可能造成不必要的消耗,(他只是一个摘要而已)
  return xss(html, {
    whiteList: whiteList,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"]
  });
}

// 处理文章 link 增加 属性, 新页面打开
export const processLink = html => {
  return xss(html, {
    onTagAttr: function(tag, name, value, isWhiteAttr) {
      // 为 a 并且有 href 则添加 target
      if (tag === "a" && name === "href") {
        let val = xss.friendlyAttrValue(value)

        let firstStr = val.slice(0, 1) // #
        // 认为是 TOC 或者其他 ID 跳转标签
        if (firstStr !== '#') {
          return `${name}='${val}' target='_blank' rel='noreferrer noopener'`
        }
      }
    }
  });
}