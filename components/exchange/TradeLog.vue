<template>
  <div class="trade">
    <div class="hYLPFg">
      <div class="header">
        <div class="token-info">
          <avatar :src="logo" size="20px" />
          <span>{{minetokenToken.symbol}}视角</span>
        </div>
        <span>{{price}} 最新价格</span>
        <span>{{change}} 24h涨跌</span>
        <span>{{volume}} 24h成交</span>
      </div>
      <div class="jJSpkX" />
    </div>
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="content">
          <el-tabs type="border-card">
            <el-tab-pane label="我的流水">
              <el-table size="medium" :data="tableData" style="width: 100%" header-cell-class-name="trade-log-header" cell-class-name="trade-log-row">
                <el-table-column prop="type" label="方向" width="50"></el-table-column>
                <el-table-column prop="cny" label="价格/CNY"></el-table-column>
                <el-table-column prop="total" label="金额/CNY"></el-table-column>
                <el-table-column prop="amount" label="数量/KJM"></el-table-column>
                <el-table-column prop="time" label="时间"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="全部流水">ces1</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'

export default {
  components: {
    avatar
  },
  data() {
    return {
      tableData: [{
        type: '买',
        cny: 16.34,
        total: 1213321,
        amount: 15600,
        time: '2019.10.29 08:34'
      }],
      minetokenToken: Object.create(null),
      minetokenUser: Object.create(null),
      minetokenExchange: Object.create(null)
    }
  },
  computed: {
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
        return (this.minetokenExchange.change_24h * 100).toFixed(2) + '%'
      } else return '0%'
    },
    price() {
      return this.minetokenExchange.price || 0
    }
  },
  mounted() {
    this.mimetokenId(14)
  },
  methods: {
    async mimetokenId(id) {
      await this.$API.mimetokenId(id).then(res => {
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
    display: flex;
    align-items: center;
    color: #542de0;
    font-size: 1rem;
    line-height: 1rem;
    flex-flow: row nowrap;
    padding: 1px;
  }
  .token-info {
    display: flex;
    align-self: center;
    justify-content: center;
    span {
      line-height: 20px;
      height: 20px;
    }
  }
}
</style>
<style lang="less">
@t-h: 30px;
.trade {
  .el-tabs {
    width: 100%;
  }
  .el-tabs__item {
    font-size: 14px !important;
    height: @t-h!important;
  }
  .el-tabs__content {
    background: #ffffff !important;
    padding: 0 10px 10px;
  }
  .el-tabs--border-card > .el-tabs__header {
    background: #ffffff !important;
  }
  .el-tabs__header {
    .el-tabs__nav-scroll {
      margin-bottom: 0;
    }
    .el-tabs__nav {
      width: 220px;
      height: @t-h;
    }
  }
  .el-table::before {
    height: 0;
  }
}
.trade-log-header {
  color: #542DE0;
  font-weight: 400;
  border-bottom: 0!important;
}
.trade-log-row {
  border-bottom: 0!important;
}
</style>
