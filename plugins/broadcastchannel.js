import Vue from 'vue'
import { BroadcastChannel } from 'broadcast-channel'

const userMsgChannel = new BroadcastChannel('user')

userMsgChannel.onmessage = (ev) => {
  if (!ev.isTrusted) return console.warn('not trusted event catched, i am not doing anything until it is safe again.', ev)
  console.log('Trusted message event received')
  if (typeof ev.data === 'string') {
    switch (ev.data) {
      case 'login': {
        console.info('User login from other page, refreshing now to sync login status.')
        window.location.reload()
        break
      }
      case 'logout': {
        console.info('User logout from other page, refreshing now to sync login status.')
        window.location.reload()
        break
      }
      default: console.log('I don\'t know how to handle this: ', ev)
    }
  }
}
// 后续或许不需要注入 window，这个纯粹为了开发方便
window.userMsgChannel = userMsgChannel

Vue.prototype.$userMsgChannel = userMsgChannel

export default userMsgChannel
