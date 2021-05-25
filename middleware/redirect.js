import { getCookie } from '@/utils/cookie'
import { extractChar } from '@/utils/reg'

export default function ({ redirect, route, req }) {
  // 获取cookie token
  // eslint-disable-next-line no-unused-vars
  let accessToekn = ''
  // 请检查您是否在服务器端
  if (process.server) {
    const cookie = req && req.headers.cookie ? req.headers.cookie : ''
    const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
    accessToekn = token ? token[0] : ''
  }
  if (process.browser) {
    accessToekn = getCookie('ACCESS_TOKEN')
  }

  // if (accessToekn) redirect('/timeline' + route.fullPath)
  else redirect('/article' + route.fullPath)
}
