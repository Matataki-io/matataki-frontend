import Cookies from 'js-cookie'

export function getCookie(key) {
  return Cookies.get(key)
}

export function setCookie(key, val, expires = 7) {
  return Cookies.set(key, val, { expires: expires })
}

export function removeCookie(key) {
  return Cookies.remove(key)
}
