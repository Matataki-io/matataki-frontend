/* eslint-disable no-console */

import { register } from 'register-service-worker'

const consoleForSW = str =>
  console.log('%c%s', 'color: red; background: yellow; font-size: 16px;', `[Service worker] ${str}`)

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      consoleForSW(
        'App 正在使用 Service worker 缓存.\n' +
          '更多关于 Service worker 的详情请访问： https://goo.gl/AFskqB'
      )
    },
    registered() {
      consoleForSW('注册成功')
    },
    cached() {
      consoleForSW('已缓存网站前端')
    },
    updatefound() {
      consoleForSW('发现更新，后台正在静默下载中。')
    },
    updated() {
      consoleForSW('静默更新完毕，请关闭这个标签并在新的标签页打开以使用更新后的版本。')
      window.updateNotify('新更新可用')
    },
    offline() {
      consoleForSW('无网络链接。正在使用离线模式')
    },
    error(error) {
      console.error('Service worker 注册时出错:', error)
    }
  })
}
