import Vue from 'vue'
import { Tag, Dialog, Backtop, Input, Message, Loading } from 'element-ui'
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Backtop)
Vue.use(Input)

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

// Vue.use(Element, { locale })
