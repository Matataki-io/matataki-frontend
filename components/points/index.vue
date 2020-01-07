<template>
  <div class="points-main">
    <h2 class="tag-title">
      {{ $t('user.point') }}
    </h2>
    <div class="line" />
    <div v-loading="loading" class="card-container">
      <no-content-prompt :list="pointLog.list">
        <div class="point-card">
          <span class="title">{{ $t('user.remainingPoints') }}</span>
          <h1 class="point-pricing">
            {{ amount }}
          </h1>
        </div>
        <pointCard v-for="(item, index) in pointLog.list" :key="index" :asset="item" />
      </no-content-prompt>
    </div>
    <user-pagination
      v-show="!loading"
      :current-page="currentPage"
      :params="pointLog.params"
      :api-url="pointLog.apiUrl"
      :page-size="pointLog.params.pagesize"
      :total="total"
      :need-access-token="true"
      @paginationData="paginationData"
      @togglePage="togglePage"
      class="pagination"
    />
  </div>
</template>

<script>
import pointCard from '@/components/point_card/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    pointCard,
    userPagination
  },
  data() {
    return {
      pointLog: {
        params: {
          pagesize: 5
        },
        apiUrl: 'userPoint',
        list: []
      },
      currentPage: Number(this.$route.query.pointsPage) || 1,
      loading: false, // 加载数据
      total: 0,
      assets: {
      },
      viewStatus: 0, // 0 1
      amount: 0
    }
  },
  methods: {
    paginationData(res) {
      // console.log(res)
      this.pointLog.list = res.data.logs
      this.assets = res.data
      this.total = res.data.count || 0
      this.amount = res.data.amount || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pointLog.list = []
      this.currentPage = i
      const query = { ...this.$route.query }
      query.pointsPage = i
      this.$router.push({
        query
      })
    }
  }
}
</script>

<style lang="less">
.point-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  margin: 10px 0;
  background-color: #fff;
  padding: 16px 20px 16px 10px;
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
.points-main {
  background-color: #fff;
  padding: 20px;
  border-radius: @br10;
  box-sizing: border-box;
  margin-bottom: 120px;
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  padding-left: 10px;
  padding-bottom: 10px;
  margin: 0;
}
.line {
  width: 100%;
  height: 1px;
  background-color: #DBDBDB;
}
</style>
