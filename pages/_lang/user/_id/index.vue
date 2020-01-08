
<template>
  <userPage>
    <div slot="list" v-loading="loading">
      <no-content-prompt :list="articleCardData.articles">
        <articleCardListNew
          v-for="(item, index) in articleCardData.articles"
          :key="index"
          :card="item"
          :hide-author="true"
        />
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
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import userPagination from '@/components/user/user_pagination.vue'
import articleCardListNew from '@/components/article_card_list_new/index.vue'

export default {
  components: {
    userPage,
    userPagination,
    articleCardListNew
  },
  data() {
    return {
      articleCardData: {
        params: {
          author: this.$route.params.id,
          pagesize: 20,
          extra: 'short_content'
        },
        apiUrl: 'homeTimeRanking',
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
