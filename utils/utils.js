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
  }
};
