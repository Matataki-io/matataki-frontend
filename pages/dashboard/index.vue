<template>
  <div>
    <!-- head tab 切换 -->
    <headTab :sort-value="sortValue" @change="val => sortValue = val" />

    <!-- 数据统计 -->
    <div class="c-card dashboard-container">
      <h4 class="db-title">
        {{ $t("dashboard.statistics") }}
      </h4>
      <div v-if="sortValue !== 'all' && noData" class="nodata-switch">
        <p>
          {{ $t('dashboard.noNewData', [sortValue]) }}
          <a @click="sortValue = 'all'">
            {{ $t('dashboard.viewAll') }}
          </a>
        </p>
      </div>
      <div class="db-toggle">
        <div
          v-for="(item, index) in typeToggle"
          :key="index"
          class="db-t-block"
          :class="item.type === typeToggleBlockVal && 'active'"
          @click="() => { typeToggleBlockVal = typeToggleVal = typeToggleValArticleList = item.type }"
        >
          <p class="db-t-b-title">
            {{ item.title }}&nbsp;<span>{{ $t("dashboard.today") }}<span>+{{ item.now || 0 }}</span></span>
          </p>
          <client-only>
            <ICountUp
              :delay="delay"
              :end-val="item.count"
              :options="options"
              class="db-t-b-number"
            />
          </client-only>
        </div>
      </div>
      <!-- 数据增量趋势 -->
      <h4 class="db-title db-mt20">
        {{ $t("dashboard.dataIncrementTrend") }}
      </h4>
      <tab
        class="db-mt10"
        :value="typeToggleVal"
        :tab="tabListData"
        @change="chartsTabChange"
      />
      <div class="charts">
        <client-only>
          <v-chart
            id="dashboard-chart"
            :class="(!isHaveData && !chartLoading) && 'hide'" 
            :options="chartsOptionsLine"
            :auto-resize="true"
            class="db-chart"
          />
        </client-only>

        <div v-show="!isHaveData" class="not">
          {{ $t("noData") }}
        </div>
      </div>
    </div>

    <!-- 来源稿件 -->
    <div class="c-card dashboard-container">
      <h4 class="db-title">
        {{ $t("dashboard.sourceManuscript") }}
      </h4>
      <tab
        class="db-mt10"
        :value="typeToggleValArticleList"
        :tab="articleListData" 
        @change="articleListTabChange"
      />
      <client-only>
        <el-table
          v-show="$utils.clientWidth() >= 768"
          class="db-mt20 table-list"
          :data="pull.list"
          style="width: 100%"
        >
          <el-table-column :label="$t('rank')" width="50">
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">{{ rank(scope.$index, pull.currentPage, pull.params.pagesize) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('title')"
          >
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">
                <n-link target="_blank" :to="{name: 'p-id', params: { id: scope.row.id }}">
                  {{ scope.row.title }}
                </n-link>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('releaseTime')"
            width="200"
          >
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">{{ time(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="articleListData.find(tab => tab.value === typeToggleValArticleList).label + $t('dashboard.frequency')"
            width="100"
          >
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">{{ scope.row.count }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-show="$utils.clientWidth() < 768"
          class="db-mt20 table-list"
          :data="pull.list"
          style="width: 100%"
        >
          <el-table-column :label="$t('rank')" width="50">
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">{{ rank(scope.$index, pull.currentPage, pull.params.pagesize) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('title')"
          >
            <template slot-scope="scope">
              <span class="table-text" :class="getRankClass(rank(scope.$index, pull.currentPage, pull.params.pagesize))">
                <n-link target="_blank" :to="{name: 'p-id', params: { id: scope.row.id }}">
                  {{ scope.row.title }}
                </n-link>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
      <c-user-pagination
        :url-replace="typeToggleValArticleList"
        :current-page="pull.currentPage"
        :params="pull.params"
        :api-url="pull.apiUrl"
        :page-size="pull.params.pagesize"
        :total="pull.total"
        :reload="pull.reload"
        :need-access-token="true"
        class="pagination"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

import headTab from '@/components/dashboard/dashboard_head_tab'
import tab from '@/components/dashboard/dashboard_tab'

let ICountUp = null
if (process.client) {
  ICountUp = require('vue-countup-v2')
}

export default {
  components: {
    headTab,
    tab,
    ICountUp
  },
  data() {
    return {
      sortValue: '30', // 天数排序
      typeToggleBlockVal: 'read', // tab 切换
      typeToggleVal: 'read', // tab 切换
      typeToggleValArticleList: 'read', // tag 切换
      chartLoading: false,
      // tab list
      typeToggle: {
        readCount: {
          type: 'read',
          title: this.$t('read'),
          count: 0,
          now: 0,
        },
        likeCount: {
          type: 'like',
          title: this.$t('like'),
          count: 0,
          now: 0,
        },
        bookmarkCount: {
          type: 'bookmark',
          title: this.$t('bookmark'),
          count: 0,
          now: 0,
        },
        commentCount: {
          type: 'comment',
          title: this.$t('comment'),
          count: 0,
          now: 0,
        },
        shareCount:{
          type: 'share',
          title: this.$t('share'),
          count: 0,
          now: 0,
        },
        unlockCount:{
          type: 'unlock',
          title: this.$t('unlock'),
          count: 0,
          now: 0,
        },
        saleCount: {
          type: 'sale',
          title: this.$t('pay'),
          count: 0,
          now: 0,
        },
        rewardCount: {
          type: 'reward',
          title: this.$t('reward'),
          count: 0,
          now: 0,
        }
      },
      // tab list
      tabListData: [
        {
          value: 'read',
          label: this.$t('read'),
        },
        {
          value: 'like',
          label: this.$t('like'),
        },
        {
          value: 'bookmark',
          label: this.$t('bookmark'),
        },
        {
          value: 'comment',
          label: this.$t('comment'),
        },
        {
          value: 'share',
          label: this.$t('share'),
        },
        {
          value: 'unlock',
          label: this.$t('unlock'),
        },
        {
          value: 'sale',
          label: this.$t('pay'),
        },
        {
          value: 'reward',
          label: this.$t('reward'),
        },
      ],
      // tab list
      articleListData: [
        {
          value: 'read',
          label: this.$t('read'),
        },
        {
          value: 'like',
          label: this.$t('like'),
        },
        {
          value: 'bookmark',
          label: this.$t('bookmark'),
        },
        {
          value: 'comment',
          label: this.$t('comment'),
        },
        {
          value: 'share',
          label: this.$t('share'),
        },
        {
          value: 'unlock',
          label: this.$t('unlock'),
        },
        {
          value: 'sale',
          label: this.$t('pay'),
        },
        {
          value: 'reward',
          label: this.$t('reward'),
        },
      ],
      chart: null,
      resizeEvent: null,
      // charts options
      chartsOptionsLine: {
        title: {
          text: this.$t('dashboard.frequency'),
          top: '20px',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        color: [ '#542DE0' ],
        grid: {
          top: '60px',
          left: '4%',
          right: '4%',
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true,
        }],
        animationDuration: 2000
      },
      // 数字动画 config
      delay: 1000,
      endVal: 120500,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      },
      // 数字动画 config end
      // 分页数据
      pull: {
        params: {
          days: this.sortValue === 'all' ? '' : this.sortValue,
          pagesize: 10
        },
        apiUrl: 'dbBrowseRankType',
        list: [],
        currentPage:1,
        total: 0,
        loading: false,
        reload: 0
      },
    }
  },
  computed: {
    isHaveData() {
      return this.chartsOptionsLine.xAxis.data.length > 0 || this.chartsOptionsLine.series[0].data.length > 0
    },
    noData() {
      let count = 0
      Object.keys(this.typeToggle).forEach(key => count += this.typeToggle[key].count)
      return count === 0
    }
  },
  watch: {
    // 天数切换
    sortValue(val) {
      this.getData(val)
      this.getChartsData(this.typeToggleVal, val)

      this.pull.params.days = this.sortValue === 'all' ? '' : this.sortValue
      this.toggleRankList()
    },
    // 类别切换
    typeToggleVal(val) {
      this.getChartsData(val, this.sortValue)
    },
    // 数据统计切换
    typeToggleValArticleList() {
      this.toggleRankList()
    }
  },
  created() {
    if (process.browser) {
      this.$nextTick(() => {
        try {
          this.chart = this.getChartsDom()
        } catch (e) {
          console.log('error', e)
        }
        
        this.resizeEvent = throttle(this.resizeChart, 300)
        window.addEventListener('resize', this.resizeEvent)
      })

      this.getData(this.sortValue)
      this.getChartsData(this.typeToggleVal, this.sortValue)
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },
  methods: {
    // 获取数据
    async getData(days) {
      let dataCountParams = null
      if (days !== 'all') {
        dataCountParams = {
          days
        }
      }
      const dataCountResult = await this.$utils.factoryRequest(this.$API.dbBrowseCount(dataCountParams))
      if (dataCountResult) {
        this.formatDataCount(dataCountResult.data, 'count')
      }
      // 今天的数据
      const nowDataCountResult = await this.$utils.factoryRequest(this.$API.dbBrowseCount({
        days: 1
      }))
      if (nowDataCountResult) {
        this.formatDataCount(nowDataCountResult.data, 'now')
      }
    },
    // 获取图表数据
    async getChartsData(type, days) {
      let chartsDataParams = null
      if (days !== 'all') {
        chartsDataParams = {
          days
        }
      }

      // 检查 dom
      if (!this.chart) {
        this.chart = this.getChartsDom()
      }

      if (this.chart) {
        this.resizeChart()
        this.chart.showLoading({
          text: this.$t('dashboard.requestingData'),
        })
        this.chartLoading = true
      }

      const chartsRes = await this.$utils.factoryRequest(this.$API.dbBrowseHistoryType(type, chartsDataParams))
      this.chartLoading = false

      if (this.chart) {
        this.chart.hideLoading()
      }

      if (chartsRes) {
        
        // 如果没数据
        if (chartsRes.data.length <= 0) {
          this.chartsOptionsLine.xAxis.data = []
          this.chartsOptionsLine.series[0].data = []
          return
        }

        if (days === 'all') {
          let res = this.chartsFormat(chartsRes.data)

          this.chartsOptionsLine.xAxis.data = res.map(i => i.create_time)
          this.chartsOptionsLine.series[0].data = res.map(i => i.count)
        } else {
          let res = this.chartsFormatDays(days, chartsRes.data)

          this.chartsOptionsLine.xAxis.data = res.map(i => i.create_time)
          this.chartsOptionsLine.series[0].data = res.map(i => i.count)
        }
        
      }
    },
    // 格式化数据统计
    formatDataCount(data, keyName) {
      for (const key in data) {
        if (this.typeToggle[key]) {
          this.typeToggle[key][keyName] = data[key]
        }
      }
    },
    // charts format days
    // 需要的天数 需要的数据
    chartsFormatDays(days, data) {
      days = parseInt(days)

      const date = []
      const dateList = []
      for (let i = days - 1; i >= 0; i--) {
        const dayCalendar = this.moment().subtract(i, 'days')
        const day = this.moment(dayCalendar).format('YYYY-MM-DD')
        date.push(day)
      }

      for (let i = 0; i < date.length; i++) {
        const result = data.filter(item => item.create_time === date[i])
        if (result.length >= 1) {
          dateList.push({
            create_time: date[i],
            count: result[0].count,
          })
        } else {
          dateList.push({
            create_time: date[i],
            count: 0,
          })
        }
      }
      return dateList
    },
    /** 给历史数据折线图补全无数据的天数 */
    chartsFormat(data) {
      if (!data || !data.length) return []
      const date = new Date(data[0].create_time)
      const now = new Date()
      let res = []
      do {
        const dateText = this.moment(date).format('YYYY-MM-DD')
        res.push({
          create_time: dateText,
          count: { ...data.find(item => item.create_time === dateText) }.count || 0
        })
        date.setDate(date.getDate() + 1)
      } while(date < now)
      return res
    },
    // tab切换
    chartsTabChange: debounce(function(label) {
      this.typeToggleVal = label
    }, 300),
    // tab切换
    articleListTabChange: debounce(function(label) {
      this.typeToggleValArticleList = label
    }, 300),
    // 返回排名
    getRankClass(rank) {
      let list = {
        1: 'one',
        2: 'two',
        3: 'three'
      }
      return list[rank] || ''
    },
    // 缩放图表
    resizeChart() {
      try {
        if (this.chart) {
          this.chart.resize()
        } else {
          let chart = this.$echarts.init(document.querySelector('#dashboard-chart'))
          chart.resize()
        }
      } catch (e) {
        console.log('resizeChart error', e)
      }
    },
    // 获取图表Dom
    getChartsDom() {
      try {
        return this.$echarts.init(document.querySelector('#dashboard-chart'))	
      } catch (e) {
        return null 
      }
    },
    time(time) {
      return time ? this.moment(time).format('YYYY-MM-DD HH:mm') : ''
    },
    // index rank
    rank(index, page, pagesize) {
      const indexFunc = (index, page, pagesize) => {
        let limit = (page - 1) * pagesize
        return (index + limit) + 1
      }
      return indexFunc(index, page, pagesize)
    },
    // 切换数据统计数据
    toggleRankList() {
      if (this.pull.currentPage === 1) {
        this.pull.reload = Date.now()
      } else {
        this.pull.currentPage = 1
      }
    },
    paginationData(res) {
      // console.log('res', res)
      this.pull.list = res.data.list
      this.pull.total = res.data.count || 0
      this.pull.loading = false
    },
    togglePage(i) {
      this.pull.loading = true
      this.pull.currentPage = i
      this.pull.list.length = 0
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>


<style lang="less" scoped>
.charts {
  position: relative;
  height: 400px;
}
.db-chart {
  width: 100%;
  &.hide {
    opacity: 0;
    visibility: hidden;
  }
}
.not {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>