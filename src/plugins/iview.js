import Vue from 'vue'
import {
  BackTop,
  Button,
  Icon,
  Divider,
  Message,
  Modal,
  RadioGroup,
  Radio,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  Input,
  Tabs,
  TabPane,
  Scroll,
  Poptip
} from 'iview'

import 'iview/dist/styles/iview.css'

Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal

// Vue.use(iView);
Vue.component('BackTop', BackTop)
Vue.component('Button', Button)
Vue.component('Icon', Icon)
Vue.component('Divider', Divider)
Vue.component('Message', Message) // 好像没有已组件的形式使用 后续用不到就可以删除
Vue.component('Modal', Modal)
Vue.component('RadioGroup', RadioGroup)
Vue.component('Radio', Radio)
Vue.component('Dropdown', Dropdown)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('DropdownItem', DropdownItem)
Vue.component('Checkbox', Checkbox)
Vue.component('Input', Input)
Vue.component('Tabs', Tabs)
Vue.component('TabPane', TabPane)
Vue.component('Scroll', Scroll)
Vue.component('Poptip', Poptip)
