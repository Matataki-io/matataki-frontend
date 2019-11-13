<template>
  <layout>
    <div v-loading="loading">
      <minetokenDetailCard v-for="item in pull.list" :key="item.id" :card="item" />
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
  </layout>
</template>

<script>
import userPagination from '@/components/user/user_pagination.vue'
import minetokenDetailCard from '@/components/user/minetoken_card_liquidity_detail'
import layout from '@/components/token/token_layout.vue'
export default {
  components: {
    layout,
    userPagination,
    minetokenDetailCard
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 10
        },
        apiUrl: 'liquidityTransactions',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
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
      this.$router.push({
        query: {
          page: i
        }
      })
    }
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 40px;
}
</style>
