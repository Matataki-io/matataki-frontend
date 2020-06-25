<template>
  <div v-loading="pull.loading">
    <div class="reward-list">
      <rewardCard
        v-for="(item, index) in pull.list"
        :key="index"
        class="reward-item"
        :card="item"
      />
    </div>
    <user-pagination
      :url-replace="$route.params.id + ''"
      :current-page="pull.currentPage"
      :params="pull.params"
      :api-url="pull.apiUrl"
      :page-size="10"
      :total="pull.total"
      :need-access-token="true"
      :reload="pull.reload"
      class="pagination"
      @paginationData="paginationData"
      @togglePage="togglePage"
    />
  </div>
</template>

<script>
import userPagination from '@/components/user/user_pagination.vue'
import rewardCard from './reward_card'
export default {
  components: { userPagination, rewardCard },
  data() {
    return {
      pull: {
        loading: false,
        reload: 0,
        params: {
          pagesize: 10
        },
        apiUrl: 'postsReward',
        list: [],
        currentPage: 1,
        total: 0
      },
    }
  },
  methods: {
    paginationData(res) {
      this.pull.list = []
      this.pull.list = res.data.list
      this.pull.total = res.data.count || 0
      this.pull.loading = false
    },
    togglePage(i) {
      this.pull.loading = true
      this.pull.currentPage = i
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  margin-top: 40px;
  margin-bottom: 40px;
}
.reward-list {
  padding: 0 0 0 60px;
}
.reward-item {
  padding: 20px 0;
  border-bottom: 1px solid #DBDBDB;
  &:nth-last-of-type(1) {
    border: none;
  }
}
@media screen and (max-width: 860px) {
  .reward-list  {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>