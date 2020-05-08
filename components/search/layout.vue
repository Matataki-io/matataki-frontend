<template>
  <div class="search">
    <g-header
      :search-query-val="searchQueryVal"
      @search="search"
    />
    <div class="search-container">
      <div class="search-head fl">
        <p
          v-for="(tag, index) in tagList"
          :key="index"
          :class="searchType === index && 'active'"
          replace
          @click="toggleType(index)"
        >
          {{ tag.label }}
          <span>
            {{ articleCardData[index].count > 99 ? '99+' : articleCardData[index].count }}
          </span>
        </p>
      </div>

      <div
        v-show="searchQueryValLen"
        v-loading="loading"
      >
        <!-- 文章 -->
        <template v-if="searchType === 0">
          <articleCardListNew
            v-for="item in articleCardData[0].articles"
            :key="item.id"
            :card="item"
          />
        </template>
        <!-- Fan票 -->
        <template v-else-if="searchType === 1">
          <tokenCard
            v-for="item in articleCardData[1].articles"
            :key="item.id"
            :card="item"
          />
        </template>
        <div
          v-else-if="searchType === 2"
          class="search-list"
        >
          <!-- 用户 -->
          <searchUserList
            v-for="item in articleCardData[2].articles"
            :key="item.id"
            :card="item"
            @updateList="updateList"
          />
        </div>
        <div class="pagination">
          <user-pagination
            :current-page="currentPage"
            :params="articleCardData[searchType].params"
            :api-url="articleCardData[searchType].apiUrl"
            :page-size="9"
            :total="total"
            :reload="reload"
            @paginationData="paginationData"
            @togglePage="togglePage"
          />
        </div>
      </div>
      <p
        v-show="!searchQueryValLen"
        class="not-val"
      >
        {{ $t('search.notResult') }}
      </p>
    </div>
  </div>
</template>

<script>
import { strTrim } from '@/utils/reg'
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import searchUserList from '@/components/search_user_list/index.vue'
import userPagination from '@/components/user/user_pagination.vue'
import tokenCard from '@/components/token_card/search_token.vue'

export default {
  components: {
    articleCardListNew,
    searchUserList,
    userPagination,
    tokenCard
  },
  data() {
    return {
      paginationDataLoaded: false,
      searchQueryVal: '',
      articleCardData: [
        {
          params: {
            channel: 1,
            type: 'post'
          },
          apiUrl: 'searchArticleList',
          articles: [],
          count: 0,
          isAtuoRequest: false
        },
        {
          params: {
            channel: 1,
            type: 'post'
          },
          apiUrl: 'searchTokenList',
          articles: [],
          count: 0,
          isAtuoRequest: false
        },
        {
          params: {},
          apiUrl: 'searchUserList',
          articles: [],
          count: 0,
          isAtuoRequest: false
        }
      ],
      loading: false, // 加载数据
      currentPage: Number(this.$route.query.page) || 1,
      total: 0,
      reload: 0,
      tagList: [
        {
          label: this.$t('search.optionText11')
        },
        {
          label: this.$t('search.optionText13')
        },
        {
          label: this.$t('search.optionText14')
        }
      ],
      searchType: Number(this.$route.query.type) || 0
    }
  },
  computed: {
    searchQueryValLen() {
      return !(this.articleCardData[this.searchType].articles.length === 0 && this.paginationDataLoaded)
    }
  },
  created() {
    this.query()
  },
  mounted() {
    this.getOtherResults()
  },
  methods: {
    // 搜索 修改val 和 重置page
    search(val) {
      this.searchQueryVal = val
      this.currentPage = 1

      this.articleCardData[this.searchType].params.word = this.searchQueryVal
      this.getOtherResults()

      this.reload = Date.now()
    },
    query() {
      if (!strTrim(this.$route.query.q)) return this.$message.warning(this.$t('warning.searchContent'))
      this.searchQueryVal = strTrim(this.$route.query.q)

      const params = {
        pagesize: 9,
        word: this.searchQueryVal
      }

      this.articleCardData[this.searchType].params = Object.assign(params, this.articleCardData[this.searchType].params)
    },
    paginationData(res) {
      this.articleCardData[this.searchType].articles = []
      this.articleCardData[this.searchType].articles = res.data.list
      this.articleCardData[this.searchType].count = res.data.count
      this.paginationDataLoaded = true
      this.total = res.data.count
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.currentPage = i
      this.$router.push({
        query: {
          type: this.searchType,
          q: strTrim(this.$route.query.q),
          page: i
        }
      })
    },
    toggleType(type) {
      this.currentPage = 1
      this.searchType = type
      this.$router.replace({
        query: {
          type: this.searchType,
          q: strTrim(this.$route.query.q)
        }
      })
    },
    updateList() {
      this.reload = Date.now()
    },
    getOtherResults() {
      const otherRoutings = this.articleCardData.filter((value, index) => index !== this.searchType)
      for (let i = 0; i < otherRoutings.length; i++) {
        this.getSearchDate(otherRoutings[i])
      }
    },
    async getSearchDate(otherRouting) {
      otherRouting.params.page = 1
      otherRouting.params.pagesize = 9
      otherRouting.params.word = this.searchQueryVal
      const getDataFail = message => message ? console.error(message) : console.error('获取数据失败')

      // 获取数据
      try {
        const res = await this.$API.getBackendData({ url: otherRouting.apiUrl, params: otherRouting.params }, false)
        // console.log('结果：', otherRouting.apiUrl, res)
        if (res.code === 0) {
          otherRouting.articles = res.data.list
          otherRouting.count = res.data.count
        } else getDataFail(res.message)
      } catch (error) { getDataFail() }
    },
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
