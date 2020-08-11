<template>
  <div class="related">
    <h2 class="token-title">
      {{ $t('token.relatedCreations') }}
    </h2>
    <div class="header">
      <div class="post-nav">
        <a
          v-for="(tab, index) in tabs"
          :key="index"
          :class="tabPage === index && 'active'"
          @click="tabPage = index"
        >
          {{ tab.title }}
        </a>
      </div>
      <div class="post-filter">
        <el-checkbox
          v-model="onlyCreator"
          :true-label="1"
          :false-label="0"
          class="only-creator"
        >
          只看创始人
        </el-checkbox>
        <el-dropdown
          class="sort"
          trigger="click"
          @command="toggleDropdown"
        >
          <span class="el-dropdown-link">
            <span v-if="sort === 'popular-desc'">{{ $t('token.sortByPopularity') }}</span>
            <span v-else-if="sort === 'time-desc'">{{ $t('token.sortByTime') }}</span>
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="popular-desc">
              {{ $t('token.sortByPopularity') }}
            </el-dropdown-item>
            <el-dropdown-item command="time-desc">
              {{ $t('token.sortByTime') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="list">
      <div v-loading="loading">
        <no-content-prompt
          :prompt="$t('notArticle')"
          :list="articles"
        >
          <articleCardListNew
            v-for="(item, index) in articles"
            :key="index"
            :card="item"
            class="related-post-card"
          />
        </no-content-prompt>
      </div>
      <user-pagination
        v-show="!loading"
        :url-replace="$route.params.id + ''"
        :current-page="currentPage"
        :params="params"
        :api-url="tabs[tabPage].apiUrl"
        :page-size="10"
        :total="total"
        :need-access-token="false"
        class="pagination"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </div>
  </div>
</template>

<script>
// import debounce from 'lodash/debounce'
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    articleCardListNew,
    userPagination
  },
  data() {
    return {
      articles: [],
      currentPage: Number(this.$route.query.page) || 1,
      loading: true,
      total: 0,
      checkedFilter: ['1', '2'],
      tabPage: Number(this.$route.query.tab) || 0,
      sort: this.$route.query.sort || 'popular-desc',
      onlyCreator: Number(this.$route.query.solo) || 0,
      tabs: [
        {
          title: '全部',
          apiUrl: 'minetokenRelated',
          params: {
            filter: 3
          }
        },
        {
          title: '需持币',
          apiUrl: 'minetokenRelated',
          params: {
            filter: 1
          }
        },
        {
          title: '需支付',
          apiUrl: 'minetokenRelated',
          params: {
            filter: 2
          }
        },
      ]
    }
  },
  computed: {
    filter() {
      let result = 0
      for (const item of this.checkedFilter) {
        result |= parseInt(item)
      }
      return result
    },
    params() {
      return {
        ...this.tabs[this.tabPage].params,
        sort: this.sort,
        onlyCreator: this.onlyCreator
      }
    }
  },
  watch: {
    tabPage() {
      this.loading = true
      this.articles = []
      this.currentPage = 1
      this.total = 0
      this.updateQuery()
    },
    onlyCreator() {
      this.loading = true
      this.articles = []
      this.currentPage = 1
      this.total = 0
      this.updateQuery()
    }
  },
  mounted() {

  },
  methods: {
    paginationData(res) {
      this.articles = res.data.list
      this.total = res.data.count || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.articles = []
      this.currentPage = i

      this.updateQuery()
    },
    toggleDropdown(sort) {
      if (this.sort !== sort) {
        this.sort = sort
        this.articles = []
        this.currentPage = 1
        this.loading = true
        this.updateQuery()
      }
    },
    updateQuery() {
      this.$router.replace({
        query: {
          tab: this.tabPage,
          sort: this.sort,
          solo: this.onlyCreator,
          page: this.currentPage
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.related {
  margin: 20px 0 0;
  display: flex;
  flex-direction: column;
  
  .token-title {
    font-size: 24px;
    font-weight: bold;
    color: @black;
    line-height: 33px;
    padding: 0;
    margin: 0 0 14px 0;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    .post-nav {
      display: flex;
      flex-direction: row;
      flex: 1;
      a {
        font-size: 20px;
        font-weight: 600;
        color: #B2B2B2;
        line-height: 28px;
        margin-right: 40px;
        cursor: pointer;
        &.active {
          color: black;
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }

    .post-filter {
      display: flex;
      flex-direction: row;
      align-items: center;

      .only-creator {
        /deep/ span {
          font-size: 16px;
        }
      }

      .sort {
        margin-left: 16px;
        .el-dropdown-link {
          border-radius: 6px;
          border: 1px solid black;
          padding: 5px 10px;
          background: white;
          height: 100%;
          display: flex;
          align-items: center;
          cursor: pointer;
          span {
            margin-right: 20px;
          }
        }
      }
    }
  }
}

.list {
  clear: left;
  margin-top: 4px;
  .related-post-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  }
}

@media screen and (max-width: 600px) {
  .container .header {
    font-size: 20px;
  }
  .token-title {
    font-size: 20px;
  }
  .related {
    margin: 20px 0 50px;
    .header {
      display: block;
      .post-nav {
        margin-bottom: 10px;
        justify-content: space-around;
        a {
          font-size: 18px;
        }
      }
      .post-filter {
        justify-content: flex-end;
      }
    }
  }
}
</style>
