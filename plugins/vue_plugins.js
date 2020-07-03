import Vue from 'vue'
import clampy from '@clampy-js/vue-clampy'
import VueClipboard from 'vue-clipboard2'
import { ContentLoader } from 'vue-content-loader'
import 'hover.css'

import moment from 'moment'
import '@/icons'
moment.locale('zh-CN')
Vue.prototype.moment = moment
Vue.use(clampy)
Vue.use(VueClipboard)

Vue.component(ContentLoader) // svg component

// directives 未使用
// export default {
//   name: 'app',
//   directives: {
//     clampy
//   }
// };