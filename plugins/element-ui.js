import Vue from 'vue'

import {
  Row,
  Col,
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
  Checkbox,
  Slider,
  Popover,
  Tooltip,
  Button,
  Switch,
  InputNumber,
  Form,
  FormItem,
  Icon
} from 'element-ui'

Vue.use(Row)
Vue.use(Col)

Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Backtop)
Vue.use(Input)

Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Slider)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Button)
Vue.use(Switch)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)

Vue.use(Loading.directive)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

// Vue.use(Element, { locale })
