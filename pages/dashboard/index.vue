<template>
  <div>
    <!-- head tab 切换 -->
    <headTab />

    <!-- 数据统计 -->
    <div class="c-card dashboard-container">
      <h4 class="db-title">
        数据统计
      </h4>
      <div class="db-toggle">
        <div v-for="item in [1,2,3,4,5,6,7,8]" :key="item" class="db-t-block">
          <p class="db-t-b-title">
            阅读次数&nbsp;<span>昨日<span>+182</span></span>
          </p>
          <no-ssr>
            <ICountUp
              :delay="delay"
              :end-val="endVal"
              :options="options"
              class="db-t-b-number"
              @ready="onReady"
            />
          </no-ssr>
        </div>
      </div>
      <!-- 数据增量趋势 -->
      <h4 class="db-title db-mt20">
        数据增量趋势
      </h4>
      <tab class="db-mt10" :tab="tabListData" />
      <no-ssr>
        <v-chart :options="chartsOptionsLine" class="db-chart" />
      </no-ssr>
    </div>

    <!-- 来源稿件 -->
    <div class="c-card dashboard-container">
      <h4 class="db-title">
        数据统计
      </h4>
      <tab class="db-mt10" :tab="tabListData" />
      <el-table
        class="db-mt20 table-list"
        :data="articleList"
        style="width: 100%"
      >
        <el-table-column label="排名" width="80">
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.rank }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="200">
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="点赞次数" width="100">
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.like }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
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
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }

    return {
      tabListData: [
        {
          value: 'read',
          label: '阅读',
        },
        {
          value: '点赞',
          label: '点赞',
        },
        {
          value: '收藏',
          label: '收藏',
        },
        {
          value: '评论',
          label: '评论',
        },
        {
          value: '分享',
          label: '分享',
        },
        {
          value: '解锁',
          label: '解锁',
        },
        {
          value: '支付',
          label: '支付',
        },
        {
          value: '打赏',
          label: '打赏',
        },
      ],
      articleList: [
        {
          rank: 1,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          like: 19
        },
        {
          rank: 2,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          like: 19
        },
        {
          rank: 3,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          like: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          like: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          like: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          like: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          like: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          like: 19
        }
      ],
      chartsOptionsLine: {
        title: {
          text: '阅读次数'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        color: [ '#542DE0' ],
        grid: {
          left: '60px',
          right: '60px',
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 1,
            // color: '#542DE0'
          },
        }],
        animationDuration: 2000
      },
      delay: 1000,
      endVal: 120500,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      }
    }
  },
  methods: {
    onReady(instance) {
      const that = this
      instance.update(that.endVal + 100)
    },
    // 返回排名
    getRankClass(rank) {
      let list = {
        1: 'one',
        2: 'two',
        3: 'three'
      }
      return list[rank] || ''
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>

<style lang="less" scoped>
.db-chart {
  width: 100%;
  margin-top: 20px;
}
</style>