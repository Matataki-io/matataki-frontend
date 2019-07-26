import Vue from 'vue'
import clampy from '@clampy-js/vue-clampy'
import { ContentLoader } from 'vue-content-loader'

// import '@/icons/index.js'
Vue.use(clampy)

Vue.component(ContentLoader) // svg component

// directives 未使用
// export default {
//   name: 'app',
//   directives: {
//     clampy
//   }
// };
