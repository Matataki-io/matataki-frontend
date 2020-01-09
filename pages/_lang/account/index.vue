<template>
  <userLayout :need-frame="false">
    <template slot="main">
      <div class="cny-main">
        <h2 class="tag-title">
          余额 ¥
        </h2>
        <template v-if="viewStatus === 0">
          <assets :assets="assets" @toggleWithdraw="status => viewStatus = status" type="CNY" class="assets-margin" />
          <div v-loading="loading" class="card-container">
            <no-content-prompt :list="articleCardData.articles">
              <assetCard v-for="(item, index) in articleCardData.articles" :key="index" :asset="item" />
            </no-content-prompt>
          </div>
          <user-pagination
            v-show="!loading"
            :current-page="currentPage"
            :params="articleCardData.params"
            :api-url="articleCardData.apiUrl"
            :page-size="articleCardData.params.pagesize"
            :total="total"
            :need-access-token="true"
            @paginationData="paginationData"
            @togglePage="togglePage"
            class="pagination"
          />
        </template>
        <template v-else>
          <withdraw @toggleWithdraw="status => viewStatus = status" @withdrawDone="viewStatus = 0" type="ONT" class="withdraw" />
        </template>
      </div>
      <points />
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userPagination from '@/components/user/user_pagination.vue'
import assetCard from '@/components/asset_card/index.vue'
import assets from '@/components/user/assets.vue'
import withdraw from '@/components/user/withdraw.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'
import points from '@/components/points/index.vue'
export default {
  components: {
    userLayout,
    myAccountNav,
    userPagination,
    assetCard,
    assets,
    withdraw,
    points
  },
  data() {
    return {
      articleCardData: {
        params: {
          symbol: (this.$route.query.type || 'CNY').toUpperCase(),
          pagesize: 4
        },
        apiUrl: 'assetList',
        articles: []
      },
      currentPage: Number(this.$route.query.moneyPage) || 1,
      loading: false, // 加载数据
      total: 0,
      assets: {},
      viewStatus: 0 // 0 1
    }
  },
  methods: {
    paginationData(res) {
      // console.log(res)
      this.articleCardData.articles = res.data.logs
      this.assets = res.data
      this.total = res.data.count || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.articleCardData.articles = []
      this.currentPage = i
      const query = { ...this.$route.query }
      query.moneyPage = i
      this.$router.push({
        query
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cny-main {
  background-color: #fff;
  padding: 20px;
  border-radius: @br10;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  padding-left: 10px;
  padding-bottom: 10px;
  margin: 0;
}
</style>
