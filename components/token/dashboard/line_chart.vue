<template>
  <div class="line-chart">
    <v-chart
      id="linechart"
      ref="chart1"
      class="chart"
      :options="orgOptions"
      :auto-resize="true"
    />
  </div>
</template>
<script>

export default {
  components: {
  },
  // props: {
  //   minetokenToken: {
  //     type: Object,
  //     required: true
  //   },
  // },
  data() {
    return {
      orgOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '50px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [{
          type: 'inside'
        },{}],
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            itemStyle : {
              normal : {
                color:'#542DE0',
                lineStyle:{
                  color:'#542DE0'
                }
              }
            },
          }
        ]
      }
    }
  },
  mounted() {
    window.onresize = () => {
      const echarts = this.$echarts.getInstanceByDom(document.getElementById('linechart'))
      echarts.resize()
    }
    this.initList()
  },
  methods: {
    initList() {
      let data = new Date()
      let oldNum = Number((Math.random()*40).toFixed(4))
      for(let i = 30; i > 0; i--) {
        let data2 = new Date()
        data2.setDate(data.getDate() - i)
        this.orgOptions.xAxis.data.push(`${data2.getMonth() + 1}.${data2.getDate()}`)
        let num = Math.abs(Number((Math.random()*20 - 10 + oldNum).toFixed(4)))
        this.orgOptions.series[0].data.push(num)
        oldNum = num
      }
    }
  }
}
</script>
<style lang="less" scoped>
.line-chart {
  height: 300px;
  .chart {
    width: 100%;
    height: 100%;
  }
}
// @media screen and (max-width: 600px) {
// }
</style>
