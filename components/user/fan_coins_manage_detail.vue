<template>
  <layout @notToken="$emit('notToken')">
    <div v-loading="loading" class="card-container coins">
      <minetokenDetailCard v-for="item in pointLog.list" :key="item.id" :card="item" />
    </div>
    <user-pagination
      v-show="!loading"
      :current-page="currentPage"
      :params="pointLog.params"
      :api-url="pointLog.apiUrl"
      :page-size="10"
      :total="total"
      :need-access-token="true"
      class="pagination"
      @paginationData="paginationData"
      @togglePage="togglePage"
    />
  </layout>
</template>

<script>
import layout from './fan_coins_manage_layout'
import userPagination from '@/components/user/user_pagination.vue'
import minetokenDetailCard from '@/components/user/minetoken_card_detail'
export default {
  components: {
    userPagination,
    minetokenDetailCard,
    layout
  },
  data() {
    return {
      pointLog: {
        params: {
          pagesize: 10
        },
        apiUrl: 'tokenTokenLogs',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0
    }
  },
  created() {
  },
  mounted() {},
  methods: {
    paginationData(res) {
      // console.log(res)
      this.pointLog.list = res.data.list
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
.coins-publish {
  padding: 10px;
}
.coins-head {
  margin: 20px 0 20px;
  h1 {
    font-size:24px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:33px;
    padding: 0;
    margin: 0;
  }
  .help-icon {
    color:rgba(219,219,219,1);
    margin-left: 10px;
    margin-right: 10px;
  }
  .help-link {
    font-size:14px;
    color: #868686;
    line-height:20px;
    text-decoration: underline;
  }
}

.coins-info {
  border-bottom: 1px solid #ececec;
  padding: 0 0 20px;
}
.info-line {
  width:1px;
  height:40px;
  background: #dbdbdb;
  margin: 0 40px;
}
.info-block {
  flex: 1;
  .info-data {
    text-align: center;
    &-number {
      font-size:24px;
      font-weight:bold;
      color:rgba(84,45,224,1);
      line-height:28px;
      padding: 0;
      margin: 0;
      sub {
        bottom: 0;
        font-size: 70%;
      }
    }
    &-title {
      font-size:14px;
      color:rgba(0,0,0,1);
      line-height:20px;
      padding: 0;
      margin: 0;
    }
  }
}
.info-btn {
  margin-left: 40px;
  .info-button {
    margin: 4px 0;
  }
}

.pagination {
  margin-top: 40px;
}

.tokens-tab {
  padding: 20px 0;
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
}
</style>
