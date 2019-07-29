<template>
  <userLayout>
    <template slot="main">
      <user-nav />
      <!-- todo 目前得不到页数, 页面太后没数据会一直loading  -->
      <div v-loading="!showCard" class="card-container">
        <article-card-mini v-for="(item, index) in articleCardData.articles" :key="index" :card="item" class="card-container-block" />
      </div>
      <user-pagination
        v-show="showCard"
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
      currentPage: Number(this.$route.query.page) || 1
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
    },
    togglePage(i) {
      this.articleCardData.articles = []
      this.currentPage = i
      this.$router.push({
        naem: this.$route.name,
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
