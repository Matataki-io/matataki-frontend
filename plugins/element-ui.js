import Vue from 'vue'
// import '../assets/theme/index.css'
import '../static/theme/index.css'
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
  CheckboxButton,
  CheckboxGroup,
  Slider,
  Popover,
  Tooltip,
  Button,
  Switch,
  Steps,
  Step,
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
  Option,
  Divider,
  Radio,
  Alert,
  Carousel,
  CarouselItem,
  Badge,
  Autocomplete,
  DatePicker
} from 'element-ui'

Vue.use(Row)
  .use(Col)
  .use(Tag)
  .use(Dialog)
  .use(Backtop)
  .use(Input)
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Pagination)
  .use(Checkbox)
  .use(CheckboxButton)
  .use(CheckboxGroup)
  .use(Slider)
  .use(Popover)
  .use(Tooltip)
  .use(Button)
  .use(Switch)
  .use(Steps)
  .use(Step)
  .use(InputNumber)
  .use(Form)
  .use(FormItem)
  .use(Icon)
  .use(Image)
  .use(Progress)
  .use(Table)
  .use(TableColumn)
  .use(Tabs)
  .use(TabPane)
  .use(Select)
  .use(Option)
  .use(Divider)
  .use(Radio)
  .use(Alert)
  .use(Carousel)
  .use(CarouselItem)
  .use(Badge)
  .use(Autocomplete)
  .use(DatePicker)

Vue.use(Loading.directive)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

// Vue.use(Element, { locale })