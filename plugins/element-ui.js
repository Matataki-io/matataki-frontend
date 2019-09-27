import Vue from 'vue'
import '../assets/theme/index.css'
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
  Icon,
  Image,
  Progress,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Select,
  Option
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
Vue.use(Image)
Vue.use(Progress)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Select)
Vue.use(Option)

Vue.use(Loading.directive)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

// Vue.use(Element, { locale })
