
<template>
  <userPage>
    <div
      slot="list"
      v-loading="loading"
      class="wrapper"
    >
      <no-content-prompt :list="articleCardData.articles">
        <fansCard
          v-for="(item, i) in articleCardData.articles"
          :key="i"
          :card="{
            ...item,
            id: item.fuid }"
          class="fans-card"
          type="follow"
        />
        <user-pagination
          v-show="!loading"
          :current-page="currentPage"
          :params="articleCardData.params"
          :api-url="articleCardData.apiUrl"
          :page-size="articleCardData.params.pagesize"
          :total="total"
          class="pagination"
          @paginationData="paginationData"
          @togglePage="togglePage"
        />
      </no-content-prompt>
    </div>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import userPagination from '@/components/user/user_pagination.vue'
import fansCard from '@/components/fansCard.vue'

export default {
  components: {
    userPage,
    userPagination,
    fansCard
  },
  data() {
    return {
      articleCardData: {
        params: {
          uid: this.$route.params.id,
          pagesize: 20
        },
        apiUrl: 'followsList',
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
      this.total = res.data.totalFollows || 0
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
.wrapper {
  max-width: 766px;
  margin: 0 auto;
}
.pagination {
  padding: 40px 5px;
}
</style>
