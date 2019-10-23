<template>
  <layout>
    <div v-loading="loading" class="coins">
      <minetokenCard :card="pull.list" :decimals="4" />
    </div>
    <user-pagination
      v-show="!loading"
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
import minetokenCard from '@/components/user/minetoken_card'
import layout from '@/components/token/token_layout.vue'
export default {
  components: {
    layout,
    userPagination,
    minetokenCard
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 10
        },
        apiUrl: 'tokenUserList',
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
