<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="user" />
      <!-- todo 目前得不到页数, 页面太后没数据会一直loading  -->
      <div v-loading="loading" class="card-container">
        <article-card-mini v-for="(item, index) in articleCardData.articles" :key="index" :card="item" class="card-container-block" />
      </div>
      <user-pagination
        v-show="!loading"
        :current-page="currentPage"
        :params="articleCardData.params"
        :api-url="articleCardData.apiUrl"
        class="pagination"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </template>
    <template slot="info">
      <userInfo />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import userPagination from '@/components/user/user_pagination.vue'
import articleCardMini from '@/components/artifcle_card_mini/index.vue'
export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    userPagination,
    articleCardMini
  },
  data() {
    return {
      articleCardData: {
        params: {
          author: this.$route.params.id,
          pagesize: 9
        },
        apiUrl: 'homeTimeRanking',
        articles: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false // 加载数据
    }
  },
  computed: {
    showCard() {
      return this.articleCardData.articles.length !== 0
    }
  },
  methods: {
    paginationData(data) {
      this.articleCardData.articles = data
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

<style lang="less" scoped src="../index.less">
</style>
