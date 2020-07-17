<template>
  <userLayout :need-frame="false">
    <template slot="main">
      <div class="cny-main">
        <asset
          :assets="assets"
          type="CNY"
          class="assets-margin"
          @toggleWithdraw="status => viewStatus = status"
        />
        <div v-loading="loading" class="card-container">
          <no-content-prompt :list="pull.articles">
            <card
              v-for="(item, index) in pull.articles"
              :key="index"
              :data="item"
            />
          </no-content-prompt>
        </div>
        <user-pagination
          v-show="!loading"
          :current-page="currentPage"
          :params="pull.params"
          :api-url="pull.apiUrl"
          :page-size="pull.params.pagesize"
          :total="total"
          :need-access-token="true"
          class="pagination"
          @paginationData="paginationData"
          @togglePage="togglePage"
        />
      </div>
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userPagination from '@/components/user/user_pagination.vue'
import asset from '@/components/asset_cny'
import myAccountNav from '@/components/my_account/my_account_nav.vue'
import card from '@/components/asset_cny_card'
export default {
  components: {
    userLayout,
    myAccountNav,
    userPagination,
    asset,
    card
  },
  data() {
    return {
      pull: {
        params: {
          symbol: (this.$route.query.type || 'CNY').toUpperCase(),
          pagesize: 10
        },
        apiUrl: 'assetList',
        articles: []
      },
      currentPage: Number(this.$route.query.moneyPage) || 1,
      loading: false, // 加载数据
      total: 0,
      assets: {},
    }
  },
  methods: {
    paginationData(res) {
      // console.log(res)
      this.pull.articles = res.data.logs
      this.assets = res.data
      this.total = res.data.count || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pull.articles = []
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
  margin-bottom: 40px;
}

.pagination {
  margin-top: 20px;
}

</style>
