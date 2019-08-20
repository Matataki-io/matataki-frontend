<template>
  <div class="search">
    <g-header :search-query-val="searchQueryVal" @search="search" />
    <div v-if="searchQueryValLen" class="search-container">
      <p class="search-title">
        <span>{{ searchQueryVal }}</span>的搜索结果
      </p>
      <articleCardList
        v-for="(item, index) in articleCardData[0].articles"
        :key="index"
        :card="item"
        :is-search-cad="true"
      />
      <div v-loading="loading" class="pagination">
        <user-pagination
          :current-page="currentPage"
          :params="articleCardData[0].params"
          :api-url="articleCardData[0].apiUrl"
          :page-size="9"
          :total="total"
          :reload="reload"
          @paginationData="paginationData"
          @togglePage="togglePage"
        />
      </div>
    </div>
    <p v-else class="not-val">
      请输入搜索内容
    </p>
  </div>
</template>

<script>
import { strTrim } from '@/utils/reg'
import articleCardList from '@/components/article_card_list/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    articleCardList,
    userPagination
  },
  data() {
    return {
      searchQueryVal: '',
      articleCardData: [
        {
          params: {
            channel: 1,
            pagesize: 9,
            extra: 'short_content'
          },
          apiUrl: 'homeScoreRanking',
          articles: [],
          isAtuoRequest: false
        }
      ],
      loading: false, // 加载数据
      currentPage: Number(this.$route.query.page) || 1,
      total: 0,
      reload: 0
    }
  },
  computed: {
    searchQueryValLen() {
      return strTrim(this.$route.query.q).length !== 0
    }
  },
  created() {
    this.query()
  },
  methods: {
    // 搜索 修改val 和 重置page
    search(val) {
      this.searchQueryVal = val
      this.currentPage = 1
      this.reload = Date.now()
    },
    query() {
      if (!strTrim(this.$route.query.q)) this.$message.warning('搜索内容不能为空')
      else this.searchQueryVal = strTrim(this.$route.query.q)
    },
    paginationData(res) {
      this.articleCardData[0].articles = res.data.list
      this.total = res.data.count
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.articleCardData.articles = []
      this.currentPage = i
      this.$router.push({
        query: {
          q: strTrim(this.$route.query.q),
          page: i
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .minHeight()
}
.search-title {
  font-size:24px;
  font-weight:600;
  color: #000;
  padding: 0;
  margin: 40px 0 0;
  span {
    color:rgba(28,156,254,1);
  }
}
.search-container {
  max-width: 890px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.pagination {
  height: 152px;
  margin: 20px 0 0 0;
  padding: 20px 0 80px;
  box-sizing: border-box;
}

.not-val {
  padding: 0;
  margin: 100px 0 0;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
