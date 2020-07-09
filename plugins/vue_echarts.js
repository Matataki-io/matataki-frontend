import Vue from 'vue'
import VueECharts from 'vue-echarts'
import ECharts from 'echarts'

// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

Vue.prototype.$echarts = ECharts
Vue.component('v-chart', VueECharts)
