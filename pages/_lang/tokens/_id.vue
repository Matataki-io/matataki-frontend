<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="token" />
      <div v-loading="loading" class="card-container">
        <no-content-prompt :list="pointLog.list">
          <!-- <div class="point-card">
            <span class="title">{{ $t('user.remainingPoints') }}</span>
            <h1 class="point-pricing">
              {{ amount }}
            </h1>
          </div> -->
          <tokensCard v-for="(item, index) in pointLog.list" :key="index" :card="item" />
        </no-content-prompt>
      </div>
      <user-pagination
        v-show="!loading"
        :current-page="currentPage"
        :params="pointLog.params"
        :api-url="pointLog.apiUrl"
        :page-size="10"
        :total="total"
        :need-access-token="true"
        @paginationData="paginationData"
        @togglePage="togglePage"
        class="pagination"
      />
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
import tokensCard from '@/components/tokens_card/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    tokensCard,
    userPagination
  },
  data() {
    return {
      pointLog: {
        params: {
          tokenId: this.$route.params.id,
          pagesize: 10
        },
        apiUrl: 'tokenUserLogs',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,
      assets: {
      },
      viewStatus: 0, // 0 1
      amount: 0
    }
  },
  created() {
    if (!this.$route.params.id) this.$router.go(-1)
  },
  methods: {
    paginationData(res) {
      // console.log(res)
      this.pointLog.list = res.data.list
      this.assets = res.data
      this.total = res.data.count || 0
      this.amount = res.data.amount || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pointLog.list = []
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

<style lang="less" scoped>
.card-container {
  margin: 20px 0 80px;
}
.point-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  margin: 10px 0;
  background-color: #fff;
  padding: 16px 20px;
  border-bottom: 1px solid #DBDBDB;
  .title {
    font-size: 18px;
    font-weight: 400;
    color: #000000;
    line-height: 28px;
  }
  .point-pricing {
    padding: 0;
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    color: #000000;
    line-height: 28px;
  }
}
</style>
