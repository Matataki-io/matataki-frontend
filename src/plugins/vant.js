import Vue from 'vue'
import '@vant/touch-emulator' // 桌面端使用 vant
import {
  Toast,
  PullRefresh,
  Loading,
  Dialog,
  Field,
  Switch,
  Lazyload,
  Swipe,
  SwipeItem,
  Cell,
  CellGroup,
  Popup,
  Stepper,
  Icon,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  List
} from 'vant'

// 增加前缀 区分多个组件库 防止冲突
Vue.component('vanPullRefresh', PullRefresh) // 下拉刷新
Vue.component('vanLoading', Loading) // 加载中
Vue.component('vanSwitch', Switch) // 加载中
Vue.component('vanPopup', Popup) // 侧边栏
Vue.component('vanCell', Cell) // 侧边栏
Vue.component('vanCellGroup', CellGroup) // 侧边栏
Vue.component('vanStepper', Stepper) // 侧边栏
Vue.component('vanIcon', Icon) // 侧边栏
Vue.component('vanRadioGroup', RadioGroup) // 侧边栏
Vue.component('vanRadio', Radio) // 侧边栏
Vue.component('vanCheckboxGroup', CheckboxGroup) // 侧边栏
Vue.component('vanCheckbox', Checkbox) // 侧边栏
Vue.use(Toast) // 轻提示
Vue.use(Dialog) // 对话框
Vue.use(Field) // 输入框
Vue.use(Lazyload) //
Vue.use(Swipe).use(SwipeItem) // 轮播图
Vue.use(List) //
