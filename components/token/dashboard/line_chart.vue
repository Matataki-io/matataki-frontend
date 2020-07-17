<template>
  <div v-loading="loading" class="line-chart">
    <v-chart
      v-show="loading || rawList.length > 0"
      id="linechart"
      ref="chart1"
      class="chart"
      :options="orgOptions"
      :auto-resize="true"
    />
    <div
      v-show="!loading && rawList.length === 0"
      class="noData"
    >
      <div>
        暂无数据
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {
  },
  props: {
    period: {
      type: String,
      default: 'all'
    },
  },
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
          data: [],
          type: 'time',
          boundaryGap: false,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          splitLine: {
            show: false
          }
        },
        dataZoom: [{
          type: 'inside'
        },{}],
        series: [
          {
            data: [],
            type: 'line',
            smooth: 0.25,
            showSymbol: false,
            sampling: 'average',
            itemStyle : {
              normal : {
                color:'#542DE0',
                lineStyle:{
                  color:'#542DE0'
                }
              }
            },
            // areaStyle: {
            //   color: null
            // },
          }
        ]
      },
      echarts: null,
      rawList: [],
      list30d: [],
      listAll: [],
      loading: true
    }
  },
  watch: {
    period(val) {
      if(this.rawList.length === 0) return
      if (val === '30d')
        this.set30dList(this.rawList)
      else
        this.setAllList(this.rawList)

      if(!this.echarts) this.echarts = this.$echarts.getInstanceByDom(document.getElementById('linechart'))
      this.echarts.setOption(this.orgOptions)
      this.echarts.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 100
      })
    }
  },
  created() {
    this.getHistoryPrice()
  },
  mounted() {
    window.onresize = () => {
      if(!this.echarts) this.echarts = this.$echarts.getInstanceByDom(document.getElementById('linechart'))
      this.echarts.resize()
    }
    // this.orgOptions.series[0].areaStyle.color = new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //   {
    //     offset: 0,
    //     color: '#D4C9FF'
    //   },
    //   {
    //     offset: 1,
    //     color: '#f1f1f100'
    //   }
    // ])
  },
  methods: {
    async getHistoryPrice() {
      try {
        const res = await this.$API.getHistoryPrice(this.$route.params.id)
        this.loading = false
        if (res.code !== 0) {
          this.$message.error(res.message)
          return
        }

        if(res.data.arr) {
          this.rawList = res.data.arr
          if (this.period === '30d')
            this.set30dList(res.data.arr)
          else
            this.setAllList(res.data.arr)
        }
      }
      catch  (e) {
        this.loading = false
        console.error(e)
      }
    },
    setList(list) {
      list.forEach(item => {
        this.orgOptions.series[0].data.push([item.time, item.price])
      })
    },
    set30dList(list) {
      this.orgOptions.series[0].data = []
      if (this.list30d.length === 0) {
        let date30d = new Date()
        date30d.setDate(date30d.getDate() - 29)
        let value
        for (let i = 0; i < list.length; i++) {
          const date = new Date(list[i].time)
          if (date <= date30d) {
            value = list[i].price
            break
          }
        }

        for (let i = 0; i < 30; i++) {
          const dateText = this.moment(date30d).format('YYYY-MM-DD')
          let res = list.find(item => item.time === dateText)
          if (res) value = res.price
          this.list30d.push([dateText, value])
          date30d.setDate(date30d.getDate() + 1)
        }
      }
      this.orgOptions.series[0].data.push(...this.list30d)
    },
    setAllList(list) {
      this.orgOptions.series[0].data = []
      if(this.listAll.length === 0) {
        let date = new Date(list[list.length - 1].time)
        let value
        const nowDate = new Date()
        while(date <= nowDate) {
          const dateText = this.moment(date).format('YYYY-MM-DD')
          let res = list.find(item => item.time === dateText)
          if(res) value = res.price
          this.listAll.push([dateText, value])
          date.setDate(date.getDate() + 1)
        }
      }
      this.orgOptions.series[0].data.push(...this.listAll)
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
  .noData {
    padding: 0 3% 30px 3%;
    div {
      width: 100%;
      height: 270px;
      background: #F1F1F1;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
// @media screen and (max-width: 600px) {
// }
</style>
