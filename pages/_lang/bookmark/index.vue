
<template>
  <userLayout>
    <template slot="main">
      <h2 class="tag-title">
        {{ $t('user.myBookmark') }}
      </h2>
      <div slot="list" v-loading="loading">
        <no-content-prompt :list="pull.list">
          <articleCardListNew
            v-for="(item, index) in pull.list"
            :key="index"
            :card="item"
          />
          <user-pagination
            v-show="!loading"
            :current-page="currentPage"
            :params="pull.params"
            :api-url="pull.apiUrl"
            :page-size="pull.params.pagesize"
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
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'

export default {
  components: {
    userPagination,
    userLayout,
    myAccountNav,
    articleCardListNew
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
.tag-title {
  font-weight: bold;
  font-size: 20px;
  padding-left: 20px;
  padding-bottom: 10px;
  margin: 0;
}
</style>
