
<template>
  <userLayout :need-frame="false">
    <template slot="main">
      <div class="bookmark-container">
        <h2 class="tag-title">
          {{ $t('home.navArticle') }}
        </h2>
        <div
          slot="list"
          v-loading="loading"
        >
          <no-content-prompt :list="pull.list">
            <articleCardListNew
              v-for="(item, index) in pull.list"
              :key="index"
              class="article-list"
              :card="item"
            />
            <user-pagination
              v-show="!loading"
              :current-page="currentPage"
              :params="pull.params"
              :api-url="pull.apiUrl"
              :page-size="pull.params.pagesize"
              :total="total"
              class="pagination"
              @paginationData="paginationData"
              @togglePage="togglePage"
            />
          </no-content-prompt>
        </div>
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
          pagesize: 5
        },
        apiUrl: 'userBookmarks',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,

      pullShare: {
        params: {
          pagesize: 5,
          channel_id: 3
        },
        apiUrl: 'userBookmarks',
        list: []
      },
      currentPageShare: Number(this.$route.query.page) || 1,
      loadingShare: false, // 加载数据
      totalShare: 0
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
    },
    paginationDataShare(res) {
      this.pullShare.list = res.data.list
      this.totalShare = res.data.count || 0
      this.loadingShare = false
    },
    togglePageShare(i) {
      this.loadingShare = true
      this.pullShare.list = []
      this.currentPageShare = i
    }
  }
}
</script>

<style lang="less" scoped>
.card-bookmark {
  padding: 20px;
  background-color: #fff;
  display: block;
  margin: 0;
  border-radius: 3px;
  border-bottom: 1px solid #efefef;
  p {
    color: #333;
    font-size: 16px;
    line-height: 1.5;
    font-weight: bold;
    word-break: break-all;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
  div {
    margin-top: 10px;
    span {
      color: #949494;
      font-size: 14px;
      margin-right: 8px;
    }
    .icon {
      margin-right: 2px;
    }
  }

}
/deep/ .article-list {
  margin: 0;
  &:hover {
    transform: inherit;
    box-shadow: inherit;
  }
}
.article-list /deep/ .article {
  padding-left: 0;
  padding-right: 0;
}
.bookmark-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  margin-bottom: 40px;
}
.pagination {
  margin-top: 20px;
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  margin: 0;
  padding: 0;
}
</style>