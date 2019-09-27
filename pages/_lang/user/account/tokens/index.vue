<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="account" />

      <div v-loading="loading" class="card-container buycoins">
        <div class="line" />

        <el-table
          :data="pointLog.list"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="$t('user.coins')"
          >
            <template slot-scope="scope">
              <n-link class="invite-block avatar" :to="{name: 'user-id', params: {id: scope.row.uid}}">
                <avatar :src="cover(scope.row.avatar)" size="30px" />
                jia
                <span class="username">{{ scope.row.symbol }}</span>
              </n-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_supply"
            :label="$t('user.buyCoins')"
          >
            <template slot-scope="scope">
              <span class="username">{{ scope.row.total_supply }}jia</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_supply"
            :label="$t('user.positionCoins')"
          >
            <template slot-scope="scope">
              <span class="username">{{ tokenAmount(scope.row.total_supply, scope.row.decimals) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label=""
            width="100"
          >
            <template>
              <div class="invite-block btn">
                <router-link :to="{name: 'exchange'}">
                  <el-button class="info-button" size="small">
                    {{ $t('transaction') }}
                  </el-button>
                </router-link>
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
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import moment from 'moment'
import userPagination from '@/components/user/user_pagination.vue'
import avatar from '@/components/avatar/index.vue'
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import { precision } from '@/utils/precisionConversion'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    userPagination,
    avatar
  },
  data() {
    return {
      isPublishCoins: true,
      pointLog: {
        params: {
          pagesize: 10
        },
        apiUrl: 'tokenTokenList',
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
  methods: {
    createTime(time) {
      return moment(time).format('MMMDo HH:mm')
    },
    cover(cover) {
      return cover ? this.$API.getImg(cover) : ''
    },
    tokenAmount(amount, decimals) {
      const tokenamount = precision(amount, 'CNY', decimals)
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
.line {
  height: 1px;
  background-color: #DBDBDB;
  margin: 20px 0 0;
}

.invite-block.btn {
  display: flex;
  justify-content: flex-end;
}
.invite-block.avatar{
  display: flex;
  align-items: center;
}
.username {
  margin-left: 10px;
  font-size: 16px;
  color:#333;
}

.point {
  font-size: 16px;
  font-weight: bold;
  color:rgba(251,104,119,1);
}
.invite-des {
  font-size:14px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:20px;
  margin: 0 10px 20px;
}
.pagination {
  margin-top: 40px;
}
</style>

<style lang="less">
.buycoins {
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
