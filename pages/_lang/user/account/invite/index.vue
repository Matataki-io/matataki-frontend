<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="account" />
      <div v-loading="loading" class="card-container invite">
        <div class="line" />
        <el-table
          :data="pointLog.list"
          style="width: 100%"
        >
          <el-table-column
            prop="username"
            label="我邀请的用户"
          >
            <template slot-scope="scope">
              <n-link class="invite-block" :to="{name: 'user-id', params: {id: scope.row.id}}">
                <avatar :src="cover(scope.row.avatar)" size="30px" />
                <span class="username">{{ scope.row.username }}</span>
              </n-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="注册时间"
          >
            <template slot-scope="scope">
              <div class="invite-block">
                <span class="time">{{ createTime(scope.row.create_time) }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="point"
            label="为我产生的收益"
            :formatter="formatterPoint"
          >
            <template slot-scope="scope">
              <div class="invite-block">
                <span class="point">+{{ scope.row.point }}</span>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <p class="invite-des">
        注：未激活者阅读5篇文章并作出评价后即可完成激活，激活后您即可领取额外{{ $point.regInviteFinished }}积分。
      </p>
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

import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import userPagination from '@/components/user/user_pagination.vue'
import avatar from '@/components/avatar/index.vue'

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
      pointLog: {
        params: {
          pagesize: 10
        },
        apiUrl: 'userInvitees',
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
    },
    formatterDate(row, column) {
      console.log(row, column)
      return row.date + 1
    },
    formatterPoint(row, column) {
      console.log(row, column)
      return row.point + 11
    }
  }
}
</script>

<style lang="less" scoped src="../index.less"></style>

<style lang="less" scoped>
.line {
  height: 1px;
  background-color: #DBDBDB;
  margin: 20px 0 0;
}
.invite-block {
  flex: 1;
  &:nth-child(1){
    flex: 3;
    display: flex;
    align-items: center;
  }
  &:nth-child(2){
    flex: 2;
  }
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
.invite-des {
  font-size:14px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:20px;
  margin: 0 10px 20px;
}
</style>

<style lang="less">
.invite {
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
