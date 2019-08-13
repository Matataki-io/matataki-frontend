<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="account" />
      <userNavType nav-list-url="setting" />
      <template v-if="viewStatus === 0">
        <assets :assets="assets" type="EOS" class="assets-margin" @toggleWithdraw="status => viewStatus = status" />
        <!-- todo 目前得不到页数, 页面太后没数据会一直loading  -->
        <div v-loading="loading" class="card-container">
          <no-content-prompt :list="articleCardData.articles">
            <assetCard v-for="(item, index) in articleCardData.articles" :key="index" :asset="item" />
          </no-content-prompt>
        </div>
        <user-pagination
          v-show="!loading"
          :current-page="currentPage"
          :params="articleCardData.params"
          :api-url="articleCardData.apiUrl"
          :page-size="9"
          :total="total"
          :need-access-token="true"
          class="pagination"
          @paginationData="paginationData"
          @togglePage="togglePage"
        />
      </template>
      <template v-else>
        <withdraw class="withdraw" @toggleWithdraw="status => viewStatus = status" @withdrawDone="viewStatus = 0" />
      </template>
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import userNavType from '@/components/user/user_nav_type.vue'
import userPagination from '@/components/user/user_pagination.vue'
import assetCard from '@/components/asset_card/index.vue'
import assets from '@/components/user/assets.vue'
import withdraw from '@/components/user/withdraw.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    userNavType,
    userPagination,
    assetCard,
    assets,
    withdraw
  },
  data() {
    return {
      articleCardData: {
        params: {
          symbol: (this.$route.query.type || 'eos').toUpperCase(),
          pagesize: 9
        },
        apiUrl: 'assetList',
        articles: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,
      assets: {},
      viewStatus: 0 // 0 1
    }
  },
  methods: {
    paginationData(res) {
      console.log(res)
      this.articleCardData.articles = res.data.logs
      this.assets = res.data
      this.total = res.data.count || 0
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

<style lang="less" scoped src="./index.less"></style>

<style>
.assets-margin {
  margin: 40px 0 0;
}
.withdraw {
  margin: 40px 0 0;
}
</style>
