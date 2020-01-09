import Vue from 'vue'
import { BroadcastChannel } from 'broadcast-channel'

const userMsgChannel = new BroadcastChannel('user')

userMsgChannel.onmessage = (ev) => {
  console.info('userMsgChannel get new msg from other tab: ', ev)
  switch (ev) {
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
// 后续或许不需要注入 window，这个纯粹为了开发方便
window.userMsgChannel = userMsgChannel

Vue.prototype.$userMsgChannel = userMsgChannel

export default userMsgChannel
