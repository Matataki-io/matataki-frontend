<template>
  <div v-loading="pull.loading">
    <div>
      <span class="head-title" :class="headTitle === 0 && 'active'" @click="headTitle = 0">{{ $t('all') }}</span>
      <span class="head-title" :class="headTitle === 1 && 'active'" @click="headTitle = 1">{{ $t('transferMoney') }}</span>
      <span class="head-title" :class="headTitle === 2 && 'active'" @click="headTitle = 2">{{ $t('transaction') }}</span>
      <span class="head-title" :class="headTitle === 3 && 'active'" @click="headTitle = 3">{{ $t('add-to') }}</span>
      <span class="head-title" :class="headTitle === 4 && 'active'" @click="headTitle = 4">{{ $t('delete') }}</span>
      <span class="head-title" :class="headTitle === 5 && 'active'" @click="headTitle = 5">{{ $t('reward') }}</span>
      <span class="head-title" :class="headTitle === 6 && 'active'" @click="headTitle = 6">{{ $t('pay') }}</span>
      <span class="head-title" :class="headTitle === 7 && 'active'" @click="headTitle = 7">{{ $t('additional-issuance') }}</span>
    </div>

    <tableCard class="table-card" :data="pull.list" />
    <user-pagination
      :current-page="pull.currentPage"
      :params="pull.params"
      :api-url="pull.apiUrl"
      :page-size="pull.params.pagesize"
      :total="pull.total"
      :reload="pull.reload"
      :need-access-token="true"
      class="pagination"
      @paginationData="paginationData"
      @togglePage="togglePage"
    />
  </div>
</template>

<script>
import userPagination from '@/components/user/user_pagination.vue'
import tableCard from './token_total_transaction_flow_card'
export default {
  components: {
    userPagination,
    tableCard
  },
  data() {
    return {
      headTitle: 0,
      pull: {
        params: {
          pagesize: 10
        },
        apiUrl: 'tokenAllLogs',
        list: [],
        loading: false,
        currentPage: 1,
        total: 0,
        reload: 0,
      },
    }
  },
  watch: {
    headTitle(newVal) {
      this.toggleTab(newVal)
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
    },
    toggleTab(val) {

      if (val === 0) {
        this.pull.params = {
          pagesize: 10
        }
      } else if (val === 1) {
        this.pull.params.type = 'transfer'
      }else if (val === 2) {
        this.pull.params.type = 'exchange_purchase'
      }else if (val === 3) {
        this.pull.params.type = 'exchange_addliquidity'
      }else if (val === 4) {
        this.pull.params.type = 'exchange_removeliquidity'
      }else if (val === 5) {
        this.pull.params.type = 'reward_article'
      }else if (val === 6) {
        this.pull.params.type = 'pay_article'
      }else if (val === 7) {
        this.pull.params.type = 'mint'
      }else {
        this.pull.params = {
          pagesize: 10
        }
      }
      this.pull.loading = true
      this.pull.currentPage = 1
      this.pull.total = 0
      this.pull.reload = Date.now()
    } 
  }
}
</script>

<style lang="less" scoped>
.head-title {
  font-size:16px;
  font-weight:500;
  color:rgba(178,178,178,1);
  line-height:22px;
  padding: 0;
  margin: 10px 20px 0 0;
  display: inline-block;
  cursor: pointer;
  &:nth-last-of-type(1) {
    margin-right: 0;
  }
  &.active {
    color: #000;
  }
}

.table-card {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
}
</style>