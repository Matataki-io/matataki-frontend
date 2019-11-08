<template>
  <div class="trade">
    <div class="hYLPFg">
      <div class="header">
        <div class="token-info">
          <avatar :src="logo" size="20px" />
          <span>{{minetokenToken.symbol}}视角</span>
          <span title="切换视角" v-if="tokensId.length >= 2"><svg-icon class="refresh" icon-class="refresh" @click="changeView"/></span>
        </div>
        <span><span class="black">{{price}}</span> 最新价格</span>
        <span><span :class="changeClass">{{change}}</span> 24h涨跌</span>
        <span><span class="black">{{volume}}</span> 24h成交</span>
      </div>
      <div class="jJSpkX" />
    </div>
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="content">
          <span class="title">{{ type === 'purchase' ? '交易记录' : '流动金记录'}}</span>
          <n-link v-if="currentId" target='_blank' class="gray-btn btn" :to="{name: 'token-id', params: {id: currentId}}">
            <div class="link">
              <svg-icon icon-class="share-link" class="icon"/>
            </div>
          </n-link>
          <el-tabs type="border-card"  v-model="activeName">
            <el-tab-pane label="我的流水" name="my">
              <TradeTable v-if="type === 'purchase'" :list="myLogs" :symbol="symbol"/>
              <LiquidityTable v-else :list="myLogs" :symbol="symbol"/>
            </el-tab-pane>
            <el-tab-pane label="全部流水" name="all">
              <TradeTable v-if="type === 'purchase'" :list="logs" :symbol="symbol"/>
              <LiquidityTable v-else :list="logs" :symbol="symbol"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import TradeTable from './TradeTable'
import LiquidityTable from './LiquidityTable'
import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    tokensId: {
      type: Array,
      default: () => ([])
    },
    type: {
      type: String,
      default: 'purchase'
    }
  },
  components: {
    avatar,
    TradeTable,
    LiquidityTable
  },
  watch: {
    tokensId(ids) {
      if (ids.length > 0) {
        this.currentId = ids[0]
        this.update()
      } else {
        this.currentId = null
        this.logs = []
        this.myLogs = []
        this.minetokenToken = Object.create(null)
        this.minetokenUser = Object.create(null)
        this.minetokenExchange = Object.create(null)
      }
    }
  },
  data() {
    return {
      logs: [],
      myLogs: [],
      minetokenToken: Object.create(null),
      minetokenUser: Object.create(null),
      minetokenExchange: Object.create(null),
      currentId: null,
      activeName: 'all'
    }
  },
  computed: {
    symbol() {
      return this.minetokenToken.symbol
    },
    logo() {
      if (!this.minetokenToken.logo) return ''
      return this.minetokenToken.logo ? this.$API.getImg(this.minetokenToken.logo) : ''
    },
    volume() {
      const tokenamount = precision(this.minetokenExchange.volume_24h || 0, 'CNY', this.minetokenToken.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    change() {
      if (this.minetokenExchange.change_24h) {
        let type = ''
        if (this.minetokenExchange.change_24h > 0) type = '+'
        return type + (this.minetokenExchange.change_24h * 100).toFixed(2) + '%'
      } else return '0%'
    },
    price() {
      return this.minetokenExchange.price || 0
    },
    changeClass() {
      if (this.minetokenExchange.change_24h < 0) {
        return 'red'
      } else if (this.minetokenExchange.change_24h > 0) {
        return 'green'
      } else {
        return 'black'
      }
    }
  },
  beforeUpdate() {
    console.log(this.tokensId)
  },
  methods: {
    update() {
      this.minetokenId(this.currentId)
      if (this.type === 'purchase') {
        this.getPurchaseLogs(this.currentId)
        this.getMyPurchaseLogs(this.currentId)
      } else {
        this.getLiquidityLogs(this.currentId)
        this.getMyLiquidityLogs(this.currentId)
      }
    },
    changeView() {
      if (this.tokensId[0] === this.currentId) {
        this.currentId = this.tokensId[1]
      } else {
        this.currentId = this.tokensId[0]
      }
      this.update()
    },
    calPrice(cnyReserve, tokenReserve) {
      if (tokenReserve === 0) {
        return 0
      }
      return (cnyReserve / tokenReserve).toFixed(4)
    },
    getPurchaseLogs(tokenId) {
      this.$API.getPurchaseLogs(tokenId).then(res => {
        this.logs = this.handleLog(res.data)
      })
    },
    getMyPurchaseLogs(tokenId) {
      this.$API.getMyPurchaseLogs(tokenId).then(res => {
        this.myLogs = this.handleLog(res.data)
      })
    },
    getLiquidityLogs(tokenId) {
      this.$API.getLiquidityLogs(tokenId).then(res => {
        this.logs = this.handleLog(res.data.list)
      })
    },
    getMyLiquidityLogs(tokenId) {
      this.$API.getMyLiquidityLogs(tokenId).then(res => {
        this.myLogs = this.handleLog(res.data.list)
      })
    },
    handleLog(list = []) {
      const { isNullExcept0 } = this
      const len = list.length
      for (let i = 0; i < len; i++) {
        const ele = list[i]
        // 计算价格
        if (!isNullExcept0(ele.cny_reserve_before) && !isNullExcept0(ele.token_reserve_before)) {
          ele.price = this.calPrice(ele.cny_reserve_before, ele.token_reserve_before)
        }
        if (!isNullExcept0(ele.cny_amount)) {
          ele.cny_amount = this.$utils.fromDecimal(ele.cny_amount)
        }
        if (!isNullExcept0(ele.token_amount)) {
          ele.token_amount = this.$utils.fromDecimal(ele.token_amount)
        }
        if (!isNullExcept0(ele.create_time)) {
          ele.create_time = moment(ele.create_time).utcOffset(480).format('YYYY.MM.DD HH:mm')
        }
        if (!isNullExcept0(ele.liquidity)) {
          ele.liquidity = this.$utils.fromDecimal(ele.liquidity)
        }
      }
      return list
    },
    async minetokenId(id) {
      await this.$API.minetokenId(id).then(res => {
        if (res.code === 0) {
          this.minetokenToken = res.data.token || Object.create(null)
          this.minetokenUser = res.data.user || Object.create(null)
          this.minetokenExchange = res.data.exchange || Object.create(null)
        } else {
          this.$message.error(res.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    isNullExcept0(v) {
      return v === '' || v === null || v === undefined
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
<style lang="less" scoped>
.trade {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #542de0;
    flex-flow: row nowrap;
    padding: 0.5rem 0.8rem;
  }
  .content {
    position: relative;
    display: flex;
    align-items: center;
    color: #542de0;
    font-size: 1rem;
    line-height: 1rem;
    flex-flow: row nowrap;
    padding: 1px;
    .title {
      position: absolute;
      left: 20px;
      top: 20px;
      z-index: 2;
    }
    .btn {
      position: absolute;
      right: 20px;
      top: 16px;
      z-index: 2;
      .link {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #f1f1f1;
        border-color: #f1f1f1;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          color: #B2B2B2;
          font-size: 10px;
        }
      }
    }
  }
  .token-info {
    display: flex;
    align-self: center;
    justify-content: center;
    span {
      line-height: 20px;
      height: 20px;
      margin-left: 5px;
    }
    .refresh {
      cursor: pointer;
    }
  }
  .red {
    color: #FB6877;
  }
  .green {
    color: #44D7B6;
  }
  .black {
    color: #000000;
  }
}
</style>
