
<template>
  <userLayout>
    <template slot="main">
      <h2 class="tag-title">
        文章
      </h2>
      <div slot="list" v-loading="loading">
        <no-content-prompt :list="pull.list">
          <articleCardListNew
            v-for="(item, index) in pull.list"
            :key="index"
            :card="item"
          />
          <user-pagination
            v-show="!loading"
            :current-page="currentPage"
            :params="pull.params"
            :api-url="pull.apiUrl"
            :page-size="pull.params.pagesize"
            :total="total"
            @paginationData="paginationData"
            @togglePage="togglePage"
            class="pagination"
          />
        </no-content-prompt>
      </div>

      <h2 class="tag-title">
        分享
      </h2>
      <div slot="list" v-loading="loadingShare">
        <no-content-prompt :list="pullShare.list">
          <!-- 暂时处理  by xiaotian -->
          <!-- 下次功能调整重构 -->
          <router-link
            :to="{name: 'share-id', params: {id: item.id}}"
            v-for="(item, index) in pullShare.list"
            :key="index"
            target="_blank"
            class="card-bookmark"
          >
            <p>{{ item.short_content }}</p>
            <div>
              <span>
                <svg-icon class="icon" icon-class="eye" />{{ item.read }}
              </span>
              <span>
                <svg-icon class="icon" icon-class="like_thin" />{{ item.likes }}
              </span>
            </div>
          </router-link>
          <user-pagination
            v-show="!loadingShare"
            :current-page="currentPageShare"
            :params="pullShare.params"
            :api-url="pullShare.apiUrl"
            :page-size="pullShare.params.pagesize"
            :total="totalShare"
            @paginationData="paginationDataShare"
            @togglePage="togglePageShare"
            class="pagination"
          />
        </no-content-prompt>
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
    font-size: 14px;
    font-weight: bold;
    word-break: break-all;
    white-space: pre-wrap;
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
</style>

<style scoped>
.pagination {
  padding: 40px 5px;
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  margin: 0 0 20px 20px;
  padding: 0;
}
</style>
