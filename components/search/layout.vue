<template>
  <div class="search">
    <g-header :search-query-val="searchQueryVal" @search="search" />
    <div class="search-container">
      <div class="search-head">
        <router-link v-for="(tag, index) in tagList" :key="index" :to="{name: tag.url, query: {q: $route.query.q}}" :class="$route.name === tag.url && 'active'">
          {{ tag.label }}
          <span>
            {{ tag.numResults > 99 ? '99+' : tag.numResults }}
          </span>
        </router-link>
      </div>

      <div v-loading="loading" v-show="searchQueryValLen">
        <!-- 文章 -->
        <template v-if="$route.name === 'search'">
          <articleCardListNew
            v-for="item in articleCardData[0].articles"
            :key="item.id"
            :card="item"
          />
        </template>
        <!-- 分享 -->
        <template v-if="$route.name === 'search-share'">
          <articleCardListNew
            v-for="item in articleCardData[0].articles"
            :key="item.id"
            :card="item"
          />
        </template>
        <!-- Fan票 -->
        <template v-if="$route.name === 'search-token'">
          <articleCardListNew
            v-for="item in articleCardData[0].articles"
            :key="item.id"
            :card="item"
          />
        </template>
        <div v-else-if="$route.name === 'search-user'" class="search-list">
          <!-- 用户 -->
          <searchUserList
            v-for="item in articleCardData[0].articles"
            :key="item.id"
            :card="item"
            @updateList="updateList"
          />
        </div>
        <!-- 商品 -->
        <!-- <el-row v-else-if="$route.name === 'search-shop'" class="search-card">
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
        </el-row> -->

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
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import searchUserList from '@/components/search_user_list/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    articleCardListNew,
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
      reload: 0,
      tagList: [
        {
          url: 'search',
          label: this.$t('search.optionText11'),
          numResults: 1222
        },
        {
          url: 'search-share',
          label: this.$t('search.optionText12'),
          numResults: 46
        },
        {
          url: 'search-token',
          label: this.$t('search.optionText13'),
          numResults: 7
        },
        {
          url: 'search-user',
          label: this.$t('search.optionText14'),
          numResults: 34
        }
      ]
    }
  },
  computed: {
    searchQueryValLen() {
      return !(this.articleCardData[0].articles.length === 0 && this.paginationDataLoaded)
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
