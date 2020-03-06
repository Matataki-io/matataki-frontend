<template>
  <div>
    <div class="header fl jsb">
      <div class="title">
        {{ $t('token.directionAndTime') }}
      </div>
      <div class="amount">
        {{ $t('home.fanTicket')}}
      </div>
      <div class="amount">
        {{ $t('amount') }}
      </div>
      <div class="amount">
        {{ $t('token.liquidGoldToken') }}
      </div>
    </div>
    <div v-loading="loading" class="pillar">
      <minetokenDetailCard v-for="item in pull.list" :key="item.id" :card="item" :token="token" />
      <div v-if="pull.list.length === 0 && !loading" class="no-data">
        {{ $t('not') }}
      </div>
    </div>
    <user-pagination
      v-show="!loading"
      :url-replace="$route.params.id + ''"
      :current-page="currentPage"
      :params="pull.params"
      :api-url="pull.apiUrl"
      :page-size="10"
      :total="total"
      :need-access-token="true"
      @paginationData="paginationData"
      @togglePage="togglePage"
      class="pagination"
    />
  </div>
</template>

<script>
import userPagination from '@/components/user/user_pagination.vue'
import minetokenDetailCard from '@/components/user/minetoken_card_liquidity_detail'
export default {
  components: {
    userPagination,
    minetokenDetailCard
  },
  props: {
    token: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 10
        },
        apiUrl: 'liquidityTransactions',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: true, // 加载数据
      total: 0
    }
  },
  methods: {
    paginationData(res) {
      // console.log(res)
      this.pull.list = res.data.list
      this.total = res.data.count || 0
      this.amount = res.data.amount || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pull.list = []
      this.currentPage = i
      this.$router.push({
        query: {
          ...this.$route.query,
          page: i
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.pagination {
  margin-top: 40px;
}
.pillar {
  min-height: 99px;
}
.no-data {
  line-height: 99px;
  text-align: center;
  margin-top: 40px;
  font-size:14px;
  color:rgba(178,178,178,1);
}
.header {
  color: black;
  font-size: 18px;
  line-height:22px;
  font-weight:600;
  .title {
    width: 335px;
  }
  .amount {
    width: 150px;
  }
}
</style>
