<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="setting" />
      <!-- todo 目前得不到页数, 页面太后没数据会一直loading  -->
      <div v-loading="loading" class="card-container">
        <no-content-prompt :list="articleCardData.articles">
          <buy v-for="(item, index) in articleCardData.articles" :key="index" :buy="item" />
        </no-content-prompt>
      </div>
      <user-pagination
        v-show="!loading"
        :current-page="currentPage"
        :params="articleCardData.params"
        :api-url="articleCardData.apiUrl"
        :page-size="3"
        :total="total"
        class="pagination"
        :need-access-token="true"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import userPagination from '@/components/user/user_pagination.vue'
import buy from '@/components/buy_card/index.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    userPagination,
    buy
  },
  data() {
    return {
      articleCardData: {
        params: {
          pagesize: 3
        },
        apiUrl: 'buyHistory',
        articles: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0
    }
  },
  computed: {

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

<style lang="less" scoped src="../../index.less">
</style>
