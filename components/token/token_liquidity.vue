<template>
  <div>
    <div v-loading="loading" class="coins">
      <minetokenCardLiquidity :card="pull.list" :decimals="4" @sort-changed="toggleSort" />
    </div>
    <user-pagination
      v-show="!loading"
      :url-replace="$route.params.id + ''"
      :current-page="currentPage"
      :params="pull.params"
      :api-url="pull.apiUrl"
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
import userPagination from '@/components/user/user_pagination.vue'
import minetokenCardLiquidity from '@/components/user/minetoken_card_liquidity'
export default {
  components: {
    userPagination,
    minetokenCardLiquidity
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 10,
          sort: this.$route.query.sort || 'amount-desc'
        },
        apiUrl: 'liquidityUserList',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: true, // 加载数据
      total: 0
    }
  },
  methods: {
    paginationData(res) {
      // console.log(res)
      this.pull.list = res.data.list
      this.total = res.data.count || 0
      this.amount = res.data.amount || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pull.list = []
      this.currentPage = i
      this.$router.replace({
        query: {
          ...this.$route.query,
          page: i,
          sort: this.pull.params.sort
        }
      })
    },
    toggleSort({ prop, order }) {
      if (order === 'ascending') order = 'asc'
      else order = 'desc'

      const sort = `${prop}-${order}`

      this.$router.replace({
        query: {
          ...this.$route.query,
          page: this.currentPage,
          sort
        }
      })
      this.pull.params.sort = sort
    }
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 40px;
}
</style>
