/* eslint-disable */
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
  }
};
