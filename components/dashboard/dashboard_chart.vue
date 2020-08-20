<template>
  <no-ssr>
    <v-chart
      id="dashboard-chart" 
      :options="options"
      :auto-resize="true"
      class="db-chart"
    />
  </no-ssr>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      resizeEvent: null
    }
  },
  created() {
    if (process.browser) {
      this.$nextTick(() => {
        try {
          this.chart  = this.$echarts.init(document.querySelector('#dashboard-chart'))	
        } catch (e) {
          console.log('error', e)
        }
        
        this.resizeEvent = throttle(this.resizeChart, 300)
        window.addEventListener('resize', this.resizeEvent)
      })
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },
  methods: {
    resizeChart() {
      try {
        this.chart.resize()
      } catch (e) {
        console.log('resizeChart error', e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.db-chart {
  width: 100%;
}
</style>