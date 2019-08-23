<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="account" />
      <div v-loading="loading" class="card-container">
        <no-content-prompt :list="pointLog.list">
          <div class="point-card">
            <span class="title">剩余SS积分</span>
            <h1 class="point-pricing">
              {{ amount }}
            </h1>
          </div>
          <assetCard v-for="(item, index) in pointLog.list" :key="index" :asset="item" />
        </no-content-prompt>
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
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import assetCard from '@/components/asset_card/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    assetCard,
    userPagination
  },
  data() {
    return {
      pointLog: {
        params: {
          pagesize: 10
        },
        apiUrl: 'userPoint',
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
    paginationData(res) {
      console.log(res)
      this.pointLog.list = res.data.logs
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

<style lang="less" scoped src="../index.less"></style>

<style lang="less" scoped>
.point-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  margin: 10px 0;
  background-color: #fff;
  padding: 16px 20px;
  border-bottom: 1px solid #DBDBDB;
  .title {
    font-size: 18px;
    font-weight: 400;
    color: #000000;
    line-height: 28px;
  }
  .point-pricing {
    padding: 0;
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    color: #000000;
    line-height: 28px;
  }
}
</style>
