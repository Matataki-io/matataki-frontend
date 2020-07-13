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
      <rectangleTree />
      <rectangularPie />
    </div>
    <div class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          增发持仓分布图
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
          @switch-permanent="cardData.permanent = !cardData.permanent"
        />
      </div>
    </div>
    <div class="dashboard-block">
      <div class="dashboard-block-head">
        <h4>
          当前价格
        </h4>
      </div>
      <lineChart />
    </div>
    <p>
      <i class="el-icon-s-cooperation" />
      Dashboard卡片正在施工中
    </p>
  </div>
</template>
<script>
import rectangleTree from './rectangle_tree'
import rectangularPie from './rectangular_pie'
import dataCard from './data_card'
import lineChart from './line_chart'

export default {
  components: {
    rectangleTree,
    rectangularPie,
    lineChart,
    dataCard
  },
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
  },
  data() {  
    return {
      active: 0,
      dataList: [
        {
          name: '当前价格',
          symbol: '',
          value: 0,
          float: 0,
          permanent: false
        },
        {
          name: '流动金',
          symbol: '',
          value: 0,
          float: 0,
          permanent: false
        },
        {
          name: '24h交易额',
          symbol: '',
          value: 0,
          float: 0,
          permanent: false
        },
        {
          name: '24h交易量',
          symbol: '',
          value: 0,
          float: 0,
          permanent: false
        },
        {
          name: '已发行',
          symbol: '',
          value: 0,
          float: 0,
          permanent: false
        },
        {
          name: '收益',
          symbol: '',
          value: 0,
          float: 0,
          permanent: false
        },
        {
          name: '持币者',
          symbol: '',
          value: 0,
          float: 0,
          permanent: false
        },
        {
          name: '做市商',
          symbol: '',
          value: 0,
          float: 0,
          permanent: false
        }
      ]
    }
  },
  created() {
    this.dataList.forEach(data => {
      data.value = Number((Math.random()*10000000).toFixed(4))
      data.float = Number((Math.random()*20000 - 10000).toFixed(4))
    })
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
