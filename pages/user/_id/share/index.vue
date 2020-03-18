
<template>
  <userPage>
    <div
      slot="list"
      v-loading="loading"
    >
      <no-content-prompt :list="articleCardData.articles">
        <shareCard
          v-for="(item, index) in articleCardData.articles"
          :key="index"
          :card="item"
          :blank="false"
          class="list-card"
          @refClick="pushShare"
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
import shareCard from '@/components/share_card/index.vue'

export default {
  components: {
    userPage,
    userPagination,
    shareCard
  },
  data() {
    return {
      articleCardData: {
        params: {
          author: this.$route.params.id,
          pagesize: 20
        },
        apiUrl: 'share',
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
    },
    pushShare(card) {
      // 优化体验, 大厅取这个key
      sessionStorage.setItem('shareRef', card.id)
      this.$router.push({ name: 'sharehall' })
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  padding: 40px 5px;
}
.list-card {
  margin-top: 20px;
  &:nth-child(1) {
    margin-top: 0;
  }
}
</style>
