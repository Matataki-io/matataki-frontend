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
        {{ $t('noData') }}
      </div>
    </div>
  </div>
</template>
<script>
import { precision } from '@/utils/precisionConversion'

export default {
  components: {
  },
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
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
          type: 'inside',
          filterMode: 'none'
        },{}],
        series: [
          {
            name: this.minetokenToken.symbol,
            type: 'line',
            step: 'end',
            itemStyle : {
              normal : {
                color:'#542DE0',
                lineStyle:{
                  color:'#542DE0'
                }
              }
            },
            data: []
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
    this.getIssuedHistory()
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
    async getIssuedHistory() {
      try {
        const res = await this.$API.getIssuedHistory(this.$route.params.id)
        this.loading = false
        if (res.code !== 0) {
          this.$message.error(res.message)
          return
        }

        if(res.data) {
          this.rawList = res.data
          if (this.period === '30d')
            this.set30dList(res.data)
          else
            this.setAllList(res.data)
        }
      }
      catch  (e) {
        this.loading = false
        console.error(e)
      }
    },
    unitConversion(num) {
      const tokenamount = precision(
        num || 0,
        'CNY',
        this.minetokenToken.decimals
      )
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    set30dList() {
      this.orgOptions.series[0].data = []
    },
    setAllList(list) {
      this.orgOptions.series[0].data = []
      let value = 0
      if (this.listAll.length === 0) {
        for (let i = 0; i < list.length; i++) {
          value += list[i].amount
          const dateText = this.moment(list[i].create_time).format('YYYY-MM-DD')
          this.listAll.push([dateText, this.unitConversion(value)])
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
