<template>
  <div v-if="isPublishCoins" class="coins-publish">
    <div class="fl ac coins-head">
      <h1>
        {{ tokenDetailData.token.symbol }}
      </h1>
      <el-tooltip effect="dark" content="如何管理你的粉丝币?" placement="top-start">
        <svg-icon
          class="help-icon"
          icon-class="help"
        />
      </el-tooltip>
      <a class="help-link" target="_blank" href="">如何管理你的粉丝币?</a>
    </div>

    <div class="fl ac coins-info">
      <div class="fl ac jsb info-block">
        <div class="info-data">
          <p class="info-data-number">
            {{ totalAmount }}<sub>枚</sub>
          </p>
          <p class="info-data-title">
            印发总量
          </p>
        </div>
        <div class="info-data">
          <p class="info-data-number">
            300<sub>枚</sub>
          </p>
          <p class="info-data-title">
            待售量jia
          </p>
        </div>
        <div class="info-data">
          <p class="info-data-number">
            2000<sub>枚</sub>
          </p>
          <p class="info-data-title">
            资金池jia
          </p>
        </div>
      </div>
      <div class="info-line" />
      <div class="fl ac jsb info-block">
        <div class="info-data">
          <p class="info-data-number">
            1000<sub>枚</sub>
          </p>
          <p class="info-data-title">
            持仓总量jia
          </p>
        </div>
        <div class="info-data">
          <p class="info-data-number">
            0.25<sub>元</sub>
          </p>
          <p class="info-data-title">
            现价jia
          </p>
        </div>
        <div class="info-data">
          <p class="info-data-number">
            0.1<sub>元</sub>
          </p>
          <p class="info-data-title">
            发行价jia
          </p>
        </div>
      </div>
      <div class="fl fdc info-btn">
        <el-button class="info-button" size="small" @click="addCoins">
          增发
        </el-button>
        <el-button class="info-button" size="small">
          交易
        </el-button>
      </div>
    </div>

    <div v-loading="loading" class="card-container coins">
      <el-table
        :data="pointLog.list"
        style="width: 100%"
      >
        <el-table-column
          prop="username"
          label="持仓者"
        >
          <template slot-scope="scope">
            <n-link class="invite-block avatar" :to="{name: 'user-id', params: {id: scope.row.uid}}">
              <avatar :src="cover(scope.row.avatar)" size="30px" />
              <span class="username">{{ scope.row.nickname || scope.row.username }}</span>
            </n-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="持仓/枚"
        >
          <template slot-scope="scope">
            <div class="invite-block">
              <span class="time">{{ tokenAmount(scope.row.amount) }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <user-pagination
      v-show="!loading"
      :current-page="currentPage"
      :params="pointLog.params"
      :api-url="pointLog.apiUrl"
      :page-size="10"
      :total="total"
      :need-access-token="true"
      class="pagination"
      @paginationData="paginationData"
      @togglePage="togglePage"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import userPagination from '@/components/user/user_pagination.vue'
import avatar from '@/components/avatar/index.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'
import { testDecimal } from '@/utils/reg'

export default {
  components: {
    userPagination,
    avatar
  },

  data() {
    return {
      isPublishCoins: false,
      tokenDetailData: Object.create(null),
      pointLog: {
        params: {
          pagesize: 10
        },
        apiUrl: 'tokenUserList',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,
      assets: {
      },
      viewStatus: 0, // 0 1
      amount: 0
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    totalAmount() {
      if (this.tokenDetailData.token) {
        const tokenamount = precision(this.tokenDetailData.token.total_supply, 'CNY', this.tokenDetailData.token.decimals)
        return this.$publishMethods.formatDecimal(tokenamount, 4)
      } else return 0
    }
  },
  created() {
    this.tokenDetail()
    // 根据token判断是否有币 如果有显示当前页面并且调用list
    // 否则修改界面显示
  },
  mounted() {},
  methods: {
    async tokenDetail() {
      await this.$API.tokenDetail().then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.isPublishCoins = true
            this.tokenDetailData = res.data
          } else {
            this.$emit('notToken')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    async minetokenMint(amount) {
      const data = {
        amount: toPrecision(amount, 'CNY', this.tokenDetailData.token.decimals)
      }
      await this.$API.minetokenMint(data)
        .then(res => {
          if (res.code === 0) {
            this.tokenDetail()
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    addCoins() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      this.$prompt('增发数量(总量最多发行一亿)', '提示', {
        inputPattern: /^\d{0,9}$/,
        inputErrorMessage: '请输入数字(总量最多发行一亿)',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if ((Number(value) + Number(this.totalAmount)) > 100000000) return this.$message.warning('发行总量不能超过一亿')
        if (Number(value) > 0) this.minetokenMint(Number(value))
      })
    },
    createTime(time) {
      return moment(time).format('MMMDo HH:mm')
    },
    cover(cover) {
      return cover ? this.$API.getImg(cover) : ''
    },
    tokenAmount(amount) {
      const tokenamount = precision(amount, 'CNY', this.tokenDetailData.token.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    paginationData(res) {
      console.log(res)
      this.pointLog.list = res.data.list
      this.assets = res.data
      this.total = res.data.count || 0
      this.amount = res.data.amount || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pointLog.list = []
      this.currentPage = i
      this.$router.push({
        query: {
          page: i
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.coins-publish {
  padding: 10px;
}
.coins-head {
  margin: 20px 0 20px;
  h1 {
    font-size:24px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:33px;
    padding: 0;
    margin: 0;
  }
  .help-icon {
    color:rgba(219,219,219,1);
    margin-left: 10px;
    margin-right: 10px;
  }
  .help-link {
    font-size:14px;
    color:rgba(178,178,178,1);
    line-height:20px;
    text-decoration: underline;
  }
}

.coins-info {
  border-bottom: 1px solid #ececec;
  padding: 0 0 20px;
}
.info-line {
  width:1px;
  height:40px;
  background: #dbdbdb;
  margin: 0 40px;
}
.info-block {
  flex: 1;
  .info-data {
    text-align: center;
    &-number {
      font-size:24px;
      font-weight:bold;
      color:rgba(84,45,224,1);
      line-height:28px;
      padding: 0;
      margin: 0;
      sub {
        bottom: 0;
        font-size: 70%;
      }
    }
    &-title {
      font-size:14px;
      color:rgba(0,0,0,1);
      line-height:20px;
      padding: 0;
      margin: 0;
    }
  }
}
.info-btn {
  margin-left: 40px;
  .info-button {
    margin: 4px 0;
  }
}

.pagination {
  margin-top: 40px;
}

</style>

<style lang="less" scoped>

.invite-block.avatar{
  display: flex;
  align-items: center;
}
.username {
  margin-left: 10px;
  font-size: 16px;
  color:#333;
}
.time {
  font-size: 16px;
  color:#333;
}
.point {
  font-size: 16px;
  font-weight: bold;
  color:rgba(251,104,119,1);
}
</style>

<style lang="less">
.coins {
  .el-table th>.cell {
    font-size: 16px !important;
    font-weight: 400 !important;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: none;
  }
  .el-table::before {
    height: 0;
  }
}
</style>
