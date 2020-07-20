/* eslint-disable */
import moment from 'moment'

export default {
  setCookie(name, value, days = 1) {
    let d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
  },
  getCookie(name) {
    let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  },
  delCookie(name) {
    this.setCookie(name, '', -1);
  },
  deleteAllCookies() {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf('=');
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },
  isNDaysAgo(n, time) {
    const nowTime = moment()
      .subtract(n, 'days')
      .format('YYYY-MM-DD')
    const timeFormat = moment(time).format('YYYY-MM-DD')
    return moment(nowTime).isAfter(timeFormat)
  },
  // 格式化时间
  formatTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
    return time ? moment(time).format(format) : ''
  },
  isNull(v) {
    return v === '' || v === null || v === undefined || JSON.stringify(v) === '{}' || JSON.stringify(v) === '[]';
  },
  sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
  },
  isEmptyArray(arr){
    return Array.isArray(arr) && arr.length !== 0
  },
  toDecimal(v, decimal = 4) {
    return parseFloat(v) * Math.pow(10, decimal)
  },
  fromDecimal(v, decimal = 4) {
    return (parseFloat(v) / Math.pow(10, decimal))
  },
  formatCNY(v) {
    return Math.ceil((parseFloat(v) / 100)) / Math.pow(10, 2)
  },
  // 向上取两位小数，0.022 => 0.03
  up2points(n) {
    n = parseFloat(n)
    return Math.ceil(n*100)/100
  },
  // 向下取两位小数， 0.022 => 0.02
  down2points(n) {
    n = parseFloat(n)
    return Math.floor(n*100) / 100
  },
  // compose
  compose(...fn) {
    if (fn.length === 0) {
      return arg => arg
    }

    if (fn.length === 1) {
      return fn[0]
    }

    return fn.reduce((a, b) => (...args) => a(b(...args)))
  },
  // 工厂函数 返回接口数据
  // TODO: 需要调整
  async factoryRequest(api) {
    try {
      const res = await api
      if (res.code === 0) {
        return res
      } else {
        console.log(res.message)
        return
      }
    } catch (error) {
      console.log(error)
      return
    }
  },
  // 外观模式(高级叫法)
  stopEvent (e) {
    e.preventDefault()
    e.stopPropagation()
  },
  // 是否处于微信浏览器
  isInWeixin() {
    const isWeixin = () => /micromessenger/.test(navigator.userAgent.toLowerCase())
    return isWeixin()
  },
  // 处于io/cn
  isDomain(url) {
    return new RegExp(url).test(window.location.hostname.toLowerCase())
  },
  // 数量颜色
  amountColor(val) {
    // 显示转换
    const amount = parseFloat(val)
    if (amount < 0) {
      return '#d74e5a'
    } else if (amount > 0) {
      return '#41b37d'
    } else {
      return 'rgb(153, 153, 153)'
    }
  },
  // 获取客户端的宽度 高度
  clientWidth() {
    try {
      return (document.body.clientWidth || document.documentElement.clientWidth) || 0
    } catch (e) {
      console.log(e)
      return 0
    }
  },
  clientHeight() {
    try {
      return (document.body.clientHeight || document.documentElement.clientHeight) || 0
    } catch (e) {
      console.log(e)
      return 0
    }
  }
};
