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
  ButtonGroup,
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
  RadioGroup,
  RadioButton,
  Alert,
  Carousel,
  CarouselItem,
  Badge,
  Autocomplete,
  PageHeader,
  DatePicker,
  Upload
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
  .use(PageHeader)
  .use(CheckboxButton)
  .use(CheckboxGroup)
  .use(Slider)
  .use(Popover)
  .use(Tooltip)
  .use(Button)
  .use(ButtonGroup)
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
  .use(RadioGroup)
  .use(RadioButton)
  .use(Alert)
  .use(Carousel)
  .use(CarouselItem)
  .use(Badge)
  .use(Autocomplete)
  .use(DatePicker)
  .use(Upload)

Vue.use(Loading.directive)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

// Vue.use(Element, { locale })