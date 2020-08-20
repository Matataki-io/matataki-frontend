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
        <div v-for="(item, index) in typeToggle" :key="index" class="db-t-block">
          <p class="db-t-b-title">
            {{ item.type }}&nbsp;<span>昨日<span>+{{ item.yesterday }}</span></span>
          </p>
          <no-ssr>
            <ICountUp
              :delay="delay"
              :end-val="item.nowadays"
              :options="options"
              class="db-t-b-number"
            />
          </no-ssr>
        </div>
      </div>
      <!-- 数据增量趋势 -->
      <h4 class="db-title db-mt20">
        数据增量趋势
      </h4>
      <tab class="db-mt10" :tab="tabListData" />
      <dbChart class="db-mt20" :options="chartsOptionsLine" />
    </div>

    <!-- 来源稿件 -->
    <div class="c-card dashboard-container">
      <h4 class="db-title">
        数据统计
      </h4>
      <tab class="db-mt10" :tab="tabListData" />
      <el-table
        v-show="$utils.clientWidth() >= 768"
        class="db-mt20 table-list"
        :data="articleList"
        style="width: 100%"
      >
        <el-table-column label="排名" width="50">
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.rank }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="标题" 
        >
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间"
          width="200"
        >
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="点赞次数"
          width="100"
        >
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.like }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="$utils.clientWidth() < 768"
        class="db-mt20 table-list"
        :data="articleList"
        style="width: 100%"
      >
        <el-table-column label="排名" width="50">
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.rank }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="标题" 
        >
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import headTab from '@/components/dashboard/dashboard_head_tab'
import tab from '@/components/dashboard/dashboard_tab'
import dbChart from '@/components/dashboard/dashboard_chart'

let ICountUp = null
if (process.client) {
  ICountUp = require('vue-countup-v2')
}

export default {
  components: {
    headTab,
    tab,
    dbChart,
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
      typeToggle: [
        {
          type: '阅读',
          yesterday: 123,
          nowadays: 1111,
        },
        {
          type: '点赞',
          yesterday: 3,
          nowadays: 23,
        },
        {
          type: '收藏',
          yesterday: 12,
          nowadays: 444,
        },
        {
          type: '评论',
          yesterday: 333,
          nowadays: 3144124,
        },
        {
          type: '分享',
          yesterday: 11,
          nowadays: 232,
        },
        {
          type: '解锁',
          yesterday: 1123,
          nowadays: 123,
        },
        {
          type: '支付',
          yesterday: 3342,
          nowadays: 1242,
        },
        {
          type: '打赏',
          yesterday: 55,
          nowadays: 122,
        }
      ],
      tabListData: [
        {
          value: 'read',
          label: '阅读',
        },
        {
          value: 'like',
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
