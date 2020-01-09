
<template>
  <userLayout>
    <template slot="main">
      <div v-loading="loading">
        <no-content-prompt :list="articleCardData.articles">
          <buy v-for="(item, index) in articleCardData.articles" :key="index" :buy="item" type="article" />
          <user-pagination
            v-show="!loading"
            :current-page="currentPage"
            :params="articleCardData.params"
            :api-url="articleCardData.apiUrl"
            :page-size="articleCardData.params.pagesize"
            :total="total"
            @paginationData="paginationData"
            @togglePage="togglePage"
            class="pagination"
          />
        </no-content-prompt>
      </div>
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import userPagination from '@/components/user/user_pagination.vue'
import buy from '@/components/buy_card/index.vue'
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'

export default {
  components: {
    userPagination,
    userLayout,
    myAccountNav,
    buy
  },
  data() {
    return {
      articleCardData: {
        params: {
          pagesize: 20,
          platform: 'cny'
        },
        apiUrl: 'buyHistory',
        articles: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0
    }
  },
  methods: {
    paginationData(res) {
      this.articleCardData.articles = res.data.list
      this.total = res.data.count || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.articleCardData.articles = []
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
  padding: 40px 5px;
}
</style>
