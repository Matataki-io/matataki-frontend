<template>
  <div class="dashboard">
    <h2 class="token-title">
      Dashboard
    </h2>
    <div class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          增发持仓分布图
        </h4>
        <router-link
          :to="{name: 'exchange', hash: '#pool', query: { output: minetokenToken.symbol }}"
        >
          <el-button
            class="link-btn"
            size="small"
          >
            <svg-icon icon-class="eth_mini" />
            添加流动金
          </el-button>
        </router-link>
      </div>
      <rectangleTree :minetoken-token="minetokenToken" />
      <rectangularPie
        :minetoken-token="minetokenToken"
        :current-pool-size="currentPoolSize"
        :balance="balance"
      />
    </div>
    <div class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          数据中心
        </h4>
      </div>
      <div class="card-list">
        <dataCard
          v-for="(cardData, index) in dataList"
          :key="index"
          :data="cardData"
          :active="active === index"
          :permanent="cardData.permanent"
          @set-active="active = index"
        />
      </div>
    </div>

    <!-- 历史价格 -->
    <div v-if="active === 0" class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          历史价格
        </h4>
        <div class="chart-period">
          <el-radio v-model="dataList[0].period" label="all">
            全部
          </el-radio>
          <el-radio v-model="dataList[0].period" label="30d">
            30天
          </el-radio>
        </div>
      </div>
      <historyPrice :period="dataList[0].period" />
    </div>

    <!-- 历史价格 -->
    <div v-if="active === 1" class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          历史流动性池
        </h4>
        <div class="chart-period">
          <el-radio v-model="dataList[1].period" label="all">
            全部
          </el-radio>
          <el-radio v-model="dataList[1].period" label="30d">
            30天
          </el-radio>
        </div>
      </div>
      <historyLiquidity
        :minetoken-token="minetokenToken"
        :period="dataList[1].period"
      />
    </div>

    <!-- 历史交易额 -->
    <div v-if="active === 2" class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          历史交易额
        </h4>
        <div class="chart-period">
          <el-radio v-model="dataList[2].period" label="all">
            全部
          </el-radio>
          <el-radio v-model="dataList[2].period" label="30d">
            30天
          </el-radio>
        </div>
      </div>
      <historyAmount
        :minetoken-token="minetokenToken"
        :period="dataList[2].period"
      />
    </div>

    <!-- 历史交易量 -->
    <div v-if="active === 3" class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          历史交易量
        </h4>
        <div class="chart-period">
          <el-radio v-model="dataList[3].period" label="all">
            全部
          </el-radio>
          <el-radio v-model="dataList[3].period" label="30d">
            30天
          </el-radio>
        </div>
      </div>
      <historyVolume
        :minetoken-token="minetokenToken"
        :period="dataList[3].period"
      />
    </div>

    <!-- 历史增发 -->
    <div v-if="active === 4" class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          历史增发
        </h4>
      </div>
      <historyIssued :minetoken-token="minetokenToken" />
    </div>

    <!-- 不支持 -->
    <div v-if="active === 5 || active === 6" class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          {{ dataList[active].name }}
        </h4>
      </div>
      <div class="chart-no-data">
        <div>
          暂不支持查看 {{ dataList[active].name }} 的历史数据
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { precision } from '@/utils/precisionConversion'

import rectangleTree from './rectangle_tree'
import rectangularPie from './rectangular_pie'
import dataCard from './data_card'
import historyPrice from './line_chart/history_price'
import historyLiquidity from './line_chart/history_liquidity'
import historyIssued from './line_chart/history_issued'
import historyAmount from './line_chart/history_amount'
import historyVolume from './line_chart/history_volume'

export default {
  components: {
    rectangleTree,
    rectangularPie,
    historyPrice,
    historyLiquidity,
    historyIssued,
    historyAmount,
    historyVolume,
    dataCard
  },
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
    minetokenExchange: {
      type: Object,
      required: true
    },
    currentPoolSize: {
      type: Object,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  data() {  
    return {
      active: 0,
      dataList: [
        {
          name: '当前价格',
          label: 'price',
          symbol: '￥',
          value: 0,
          float: 0,
          openChart: false,
          permanent: false,
          period: 'all'
        },
        {
          name: '流动性',
          label: 'cny_reserve',
          symbol: '￥',
          value: 0,
          float: 0,
          openChart: false,
          permanent: false,
          period: 'all'
        },
        {
          name: '24h交易额',
          label: 'amount_24h',
          symbol: '￥',
          value: 0,
          float: 0,
          openChart: false,
          permanent: false,
          period: 'all'
        },
        {
          name: '24h交易量',
          label: 'volume_24h',
          symbol: '',
          value: 0,
          float: 0,
          openChart: false,
          permanent: false,
          period: 'all'
        },
        {
          name: '已发行',
          label: 'total_supply',
          symbol: '',
          value: 0,
          float: 0,
          openChart: false,
          permanent: false,
          period: 'all'
        },
        // {
        //   name: '收益',
        //   label: '',
        //   symbol: '￥',
        //   value: 0,
        //   float: 0,
        //   permanent: false
        // },
        {
          name: '持币者',
          label: 'number_of_holders',
          symbol: '',
          value: 0,
          float: 0,
          openChart: false,
          permanent: false,
          period: 'all'
        },
        {
          name: '做市商',
          label: 'number_of_liquidity_holders',
          symbol: '',
          value: 0,
          float: 0,
          openChart: false,
          permanent: false,
          period: 'all'
        }
      ]
    }
  },
  computed: {
  },
  created() {
    this.initValues()
    // this.dataList.forEach(data => {
    //   // data.value = Number((Math.random()*10000000).toFixed(4))
    //   data.float = Number((Math.random()*2000 - 1000).toFixed(4))
    // })
  },
  methods: {
    initValues() {
      this.dataList.forEach(data => {
        if(!['price', 'number_of_holders', 'number_of_liquidity_holders'].includes(data.label)) {
          const tokenLabel = data.label === 'total_supply' ? 'minetokenToken' : 'minetokenExchange'
          data.value = this.unitConversion(this[tokenLabel][data.label])
        }
        else {
          data.value = this.minetokenExchange[data.label] || 0
        }

        if(data.label === 'price') {
          data.float = this.percentage(this.minetokenExchange.change_24h)
        }
      })
    },
    unitConversion(num) {
      const tokenamount = precision(
        num || 0,
        'CNY',
        this.minetokenToken.decimals
      )
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    percentage(num) {
      if (num) {
        const amount = (num * 100).toFixed(2)
        return Number(amount) > 0 ? `+${amount}` : amount
      } else return 0
    },
  }
}
</script>
<style lang="less" scoped>
.dashboard {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 20px 0 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  &-block {
    margin-top: 20px;
    &-head {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      h4 {
        flex: 1;
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: black;
        line-height: 22px;
      }
      .chart-period {
        margin-right: 4%;
      }
    }

    .chart-no-data {
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
}
.token-title {
  font-size: 24px;
  font-weight: bold;
  color: @black;
  line-height: 33px;
  padding: 0;
  margin: 0 0 20px 0;
}
.link-btn {
  padding: 7px 7px;
  font-size: 14px;
  border-radius: 6px;
}
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-gap: 10px 10px;
  justify-content: space-between;
}
@media screen and (max-width: 600px) {
  .token-title {
    font-size: 20px;
  }
  .card-list {
    grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
  }
}
</style>
