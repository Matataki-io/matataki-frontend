<template>
  <div class="container">
    <div class="header">
      <h2 class="title">
        相关文章
      </h2>
      <div>
        <el-popover class="filter" placement="bottom-end" trigger="click">
          <el-button class="filter-button" slot="reference" type="text"><img class="filter-icon" src="@/assets/img/filter.svg" /></el-button>
          <div style="font-size: 16px">
            <el-checkbox-group v-model="checkedFilter" :min="1" @change="handleCheckedFilterChanged">
              <div style="margin-bottom: 8px"><el-checkbox label="1">持币可见</el-checkbox></div>
              <div><el-checkbox label="2">付费可见</el-checkbox></div>
            </el-checkbox-group>
          </div>
        </el-popover>
      </div>
    </div>

    <div class="list">
      <div v-loading="loading">
        <no-content-prompt :prompt="$t('notArticle')" :list="articles">
          <articleCardList
            v-for="(item, index) in articles"
            :key="index"
            :card="item"
          />
        </no-content-prompt>
      </div>
      <user-pagination
        v-show="!loading"
        :url-replace="$route.params.id + ''"
        :current-page="currentPage"
        :params="pull.params"
        :api-url="pull.apiUrl"
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
import debounce from 'lodash/debounce'
import articleCardList from '@/components/article_card_list/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    articleCardList,
    userPagination
  },
  data() {
    return {
      articles: [],
      pull: {
        apiUrl: 'minetokenRelated',
        params: {
          filter: 3
        }
      },
      currentPage: 1,
      loading: true,
      total: 0,
      checkedFilter: ['1', '2']
    }
  },
  computed: {
    filter() {
      let result = 0
      for (const item of this.checkedFilter) {
        result |= parseInt(item)
      }
      return result
    }
  },
  mounted() {

  },
  methods: {
    buttonLoadMore(res) {
      this.articles = this.articles.concat(res.data.list)
    },
    handleCheckedFilterChanged(value) {
      this.onCheckedFilterChanged()
    },
    onCheckedFilterChanged: debounce(function () {
      this.pull.params.filter = this.filter

      // try {
      //   const res = await this.$API.getBackendData({ url: this.pull.apiUrl, params: this.pull.params, urlReplace: this.$route.params.id }, false)
      //   if (res.code !== 0) console.error(res.message)
      //   else if (res.data) {
      //     this.articles = res.data.list
      //   }
      // } catch (error) {
      //   console.error(error)
      // }
    }, 500),

    paginationData(res) {
      this.articles = res.data.list
      this.total = res.data.count || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.articles = []
      this.currentPage = i
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    flex-direction: row;

    .title {
      font-size:24px;
      font-weight:bold;
      color:@black;
      line-height:33px;
      padding: 0;
      margin: 0;
      flex: 1;
    }

    .filter {
      &-button {
        padding: 0;
      }
      &-icon {
        width: 25px;
        height: 25px;
      }
    }
  }
}

.list {
  clear: left;
  margin-top: 20px;
}
</style>
