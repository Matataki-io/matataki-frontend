import wx from 'weixin-js-sdk'
import axios from 'axios'

export default ({ title = '', desc = '', link = '', imgUrl = '' }) => {
  // if (process.env.VUE_APP_WX_URL !== window.location.origin) return console.log('当前域名或环境不在微信内, 无需调用')
  let defaultTitle = '瞬MATATAKI—发布瞬间，灵感永存'
  let defaultDesc =
    '瞬MATATAKI是一个永久存储和版权确权的内容平台，通过IPFS协议保障内容的永久可访问和确权信息可查询。使用了Fan票来激励创作者、探索者、布道者共建未来的超级知识链接网络。'
  // const regCache = str => {
  //   let reg = /CACHE=(.*?)*$/
  //   return str.replace(reg, '')
  // }
  // 非history, 但是我们用的是history 加上多一层保障吧
  // let regStr = regCache(window.location.href.split('#')[0])
  // let defaultLink = regStr.substring(0, regStr.length - 1) //为了去掉 CACHE=xxxxxx
  let defaultLink = window.location.href

  let defaultimgUrl =
    'https://ssimg.frontenduse.top/avatar/2019/08/30/c1d6ae7ed4e6102cb45d0a8f656d5569.png'
  axios
    .get(`${process.env.VUE_APP_API}/wx/sign?url=${encodeURIComponent(defaultLink)}`)
    .then(res => {
      if (res.status === 200 && res.data.code === 0) {
        let { hash, timestamp, nonce } = res.data.data
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx5c94f87f6c670341', // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr: nonce, // 必填，生成签名的随机串
          signature: hash, // 必填，签名
          jsApiList: [
            'updateAppMessageShareData',
            'updateTimelineShareData',
            'onMenuShareAppMessage'
          ]
        })
        wx.error(function(res) {
          console.log('wechat error', res)
        })
        wx.ready(function() {
          wx.updateAppMessageShareData({
            title: title || defaultTitle,
            desc: desc || defaultDesc,
            link: link || defaultLink,
            imgUrl: imgUrl || defaultimgUrl,
            success: function() {
              console.log('wechat share success updateAppMessageShareData')
            }
          })
          wx.updateTimelineShareData({
            title: title || desc || defaultTitle,
            link: link || defaultLink,
            imgUrl: imgUrl || defaultimgUrl,
            success: function() {
              console.log('wechat share success updateTimelineShareData')
            }
          })
          // 即将废弃，适配电脑版微信，参考：https://mp.weixin.qq.com/wiki?action=doc&id=mp1421141115#10
          wx.onMenuShareAppMessage({
            title: title || defaultTitle,
            desc: desc || defaultDesc,
            link: link || defaultLink,
            imgUrl: imgUrl || defaultimgUrl,
            success: function() {
              console.log('wechat share success onMenuShareAppMessage')
            }
          })
        })
      }
    })
}
