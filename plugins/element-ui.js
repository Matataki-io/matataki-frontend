import Vue from 'vue'

import {
  Tag,
  Dialog,
  Backtop,
  Input,
  Message,
  Loading,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  MessageBox,
  Row,
  Col,
  Checkbox,
  Slider,
  Tooltip
} from 'element-ui'

Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Backtop)
Vue.use(Input)

Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)
Vue.use(Row)
Vue.use(Col)
Vue.use(Checkbox)
Vue.use(Slider)
Vue.use(Tooltip)

Vue.use(Loading.directive)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

// Vue.use(Element, { locale })
