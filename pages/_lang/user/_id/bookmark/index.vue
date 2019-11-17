
<template>
  <userPage>
    <div slot="list" v-loading="loading">
      <no-content-prompt :list="pull.list">
        <n-link
          v-for="(item, index) in pull.list"
          :key="index"
          target="_blank"
          :to="{
            name: 'p-id',
            params: { id: item.id }
          }"
        >
          <articleCardList :card="item" />
        </n-link>
        <user-pagination
          v-show="!loading"
          :current-page="currentPage"
          :params="pull.params"
          :api-url="pull.apiUrl"
          :page-size="pull.params.pagesize"
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
import articleCardList from '@/components/article_card_list/index.vue'

export default {
  components: {
    userPage,
    userPagination,
    articleCardList
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 20
        },
        apiUrl: 'userBookmarks',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0
    }
  },
  methods: {
    paginationData(res) {
      this.pull.list = res.data.list
      this.total = res.data.count || 0
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
  padding: 40px 5px;
}
</style>
