<template>
  <div class="search">
    <g-header :search-query-val="searchQueryVal" @search="search" />
    <div class="search-container">
      <div class="search-head">
        <p class="search-title">
          <span>{{ searchQueryVal }}</span>
          {{ $t('search.result') }}
        </p>
        <el-dropdown>
          <el-button>
            {{ nowSearch }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown" class="search-dropdown">
            <el-dropdown-item>
              <n-link :to="{name: 'search', query: {q: $route.query.q}}">
                {{ $t('search.optionText11') }}
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link :to="{name: 'search-shop', query: {q: $route.query.q}}">
                {{ $t('search.optionText12') }}
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link :to="{name: 'search-user', query: {q: $route.query.q}}">
                {{ $t('search.optionText13') }}
              </n-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div v-loading="loading" v-show="searchQueryValLen">
        <!-- 文章 -->
        <template v-if="$route.name === 'search'">
          <articleCardList
            v-for="item in articleCardData[0].articles"
            :key="item.id"
            :card="item"
            :is-search-card="true"
          />
        </template>
        <!-- 商品 -->
        <el-row v-else-if="$route.name === 'search-shop'" class="search-card">
          <el-col
            v-for="item in articleCardData[0].articles"
            :key="item.id"
            :span="8"
          >
            <articleCard
              :type-index="1"
              :card="item"
              :is-search-card="true"
              card-type="commodity-card"
            />
          </el-col>
        </el-row>
        <div v-else-if="$route.name === 'search-user'" class="search-list">
          <!-- 用户 -->
          <searchUserList
            v-for="item in articleCardData[0].articles"
            :key="item.id"
            :card="item"
            @updateList="updateList"
          />
        </div>

        <div class="pagination">
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
      <p v-show="!searchQueryValLen" class="not-val">
        {{ $t('search.notResult') }}
      </p>
    </div>
  </div>
</template>

<script>
import { strTrim } from '@/utils/reg'
import articleCardList from '@/components/article_card_list/index.vue'
import articleCard from '@/components/articleCard/index.vue'
import searchUserList from '@/components/search_user_list/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    articleCardList,
    articleCard,
    searchUserList,
    userPagination
  },
  props: {
    params: {
      type: Object,
      required: true
    },
    apiUrlPath: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      paginationDataLoaded: false,
      searchQueryVal: '',
      articleCardData: [
        {
          params: { },
          apiUrl: this.apiUrlPath,
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
      return !(this.articleCardData[0].articles.length === 0 && this.paginationDataLoaded)
    },
    // 当前搜索属于什么页面
    nowSearch() {
      if (this.$route.name === 'search-shop') return this.$t('search.optionText12')
      else if (this.$route.name === 'search-user') return this.$t('search.optionText13')
      else return this.$t('search.optionText11')
    }
  },
  created() {
  },
  mounted() {
    this.query()
  },
  methods: {
    // 搜索 修改val 和 重置page
    search(val) {
      this.searchQueryVal = val
      this.currentPage = 1

      this.articleCardData[0].params.word = this.searchQueryVal

      this.reload = Date.now()
    },
    query() {
      if (!strTrim(this.$route.query.q)) return this.$message.warning(this.$t('warning.searchContent'))
      this.searchQueryVal = strTrim(this.$route.query.q)

      const params = {
        pagesize: 9,
        word: this.searchQueryVal
      }

      this.articleCardData[0].params = Object.assign(params, this.params)

      // console.log(this.articleCardData[0].params)
    },
    paginationData(res) {
      this.articleCardData[0].articles = []
      this.articleCardData[0].articles = res.data.list
      this.paginationDataLoaded = true
      this.total = res.data.count
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.currentPage = i
      this.$router.push({
        query: {
          q: strTrim(this.$route.query.q),
          page: i
        }
      })
    },
    updateList() {
      this.reload = Date.now()
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
