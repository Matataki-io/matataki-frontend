import Vue from 'vue'
import clampy from '@clampy-js/vue-clampy'
import { ContentLoader } from 'vue-content-loader'
import '@/icons'
Vue.use(clampy)

Vue.component(ContentLoader)

// directives 未使用
// export default {
//   name: 'app',
//   directives: {
//     clampy
//   }
// };
