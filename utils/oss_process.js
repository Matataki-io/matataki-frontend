import API from '@/api/API'
// 这里和移动端有细微差别, 因为nuxt....... 于是多加了一个判断
const isSupportWebp = process.browser ? !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0 : false
if (process.browser) {
  console.log('oss_process support webp', isSupportWebp)
}

/** oss process image
 * @param {String} src 地址
 * @param {String} w 宽度
 * @param {String} h 高度
*/

// interlaceOrWebp 是否开启webp和interlace (这个还没想好要不要)
export default (src, { w, h, interlace } = {}) => {
  let ossprocess = '?x-oss-process=image'

  // 对宽高的处理
  const whStatus = !!(w || h)
  whStatus && (ossprocess += '/resize') // 如果有w or h 添加 resize
  w && (ossprocess += `,w_${w}`)
  h && (ossprocess += `,h_${h}`)

  // 渐进显示处理
  const interlaceStatus = (interlace && interlace === 1)
  interlaceStatus && (ossprocess += `/format,jpg/interlace,${interlace}`) // 如果有interlace并且为1

  // 是否支持webp 没有设置interlace
  if (isSupportWebp && !interlaceStatus) {
    ossprocess += '/format,webp'
  }

  return (whStatus || interlaceStatus || isSupportWebp) ? API.getImg(src).concat(ossprocess) : API.getImg(src)
}

// console.log(this.$ossProcess('123'))
// console.log(this.$ossProcess('123', {h: 60}))
// console.log(this.$ossProcess('123', {interlace: 0}))
// console.log(this.$ossProcess('123', {interlace: 1}))
// console.log(this.$ossProcess('123', {h: 60, interlace: 1}))
