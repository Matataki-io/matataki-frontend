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
        <div v-for="item in [1,2,3,4]" :key="item" class="db-t-block">
          <p class="db-t-b-title">
            阅读次数&nbsp;<span>昨日<span>+182</span></span>
          </p>
          <no-ssr>
            <ICountUp
              :delay="delay"
              :end-val="endVal"
              :options="CountUpOptions"
              class="db-t-b-number"
              @ready="onReady"
            />
          </no-ssr>
        </div>
      </div>
    </div>

    <!-- 来源稿件 -->
    <div class="c-card dashboard-container">
      <h4 class="db-title">
        来源稿件
      </h4>
      <tab class="db-mt10" :tab="tabListArticleType" />
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
        <el-table-column label="支付金额" width="100">
          <template slot-scope="scope">
            <span class="table-text" :class="getRankClass(scope.row.rank)">{{ scope.row.money }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 收益流水 -->
    <div class="c-card dashboard-container">
      <div class="fl ac jsb">
        <h4 class="db-title">
          收益流水
        </h4>
        <el-select
          v-model="value"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-table
        class="db-mt20 table-list"
        :data="incomeList"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          width="80"
          type="index"
        />
        <el-table-column label="明细">
          <template slot-scope="scope">
            <span class="table-text">{{ scope.row.detail }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="200">
          <template slot-scope="scope">
            <span class="table-text">{{ scope.row.create_time }}</span>
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
    return {
      tabListArticleType: [
        {
          value: 'reward',
          label: '打赏',
        },
        {
          value: 'pay',
          label: '支付',
        }
      ],
      options: [{
        value: 'follow',
        label: '跟随筛选'
      }, {
        value: 'notFollow',
        label: '不跟随筛选'
      }],
      value: 'follow',
      articleList: [
        {
          rank: 1,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          money: 19
        },
        {
          rank: 2,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          money: 19
        },
        {
          rank: 3,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          money: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          money: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          money: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          money: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          money: 19
        },
        {
          rank: 4,
          title: '当你的产品面临先有鸡还是先有蛋的问题...',
          create_time: '2020-20-20 11:11:11',
          money: 19
        }
      ],
      incomeList: [
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        },
        {
          detail: '蠢朋克天下第一DJ组合 在「当你的产品面临先有鸡还是先有蛋的问题…」打赏了1000KJM',
          create_time: '2020-20-20 11:11:11',
        }
      ],
      delay: 1000,
      endVal: 120500,
      CountUpOptions: {
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