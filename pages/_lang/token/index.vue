<template>
  <div class="token">
    <g-header />
    <!-- <div class="fl tokens">
      <avatar size="45px" />
      <div class="fl tokens-content">
        <div class="token-info">
          <h2 class="token-info-symbol">
            DDD
          </h2>
          <p class="token-info-name">
            蠢朋克钱多多币
          </p>
          <p class="token-info-name">
            蠢朋克钱多多币是由鼎鼎大名的蠢朋克组合所设置的粉丝币，被广大币圈玩家所看好，一推出币价便直线上涨。
          </p>
        </div>
        <div class="token-user">
          <div class="fl ac">
            <avatar size="30px" />
            <span class="token-username">xxxxxxx</span>
          </div>
          <div class="token-user-icon">
            持仓占位
          </div>
          <el-button type="primary" size="small">
            交易
          </el-button>
        </div>
      </div>
    </div> -->

    <div class="tokens-list">
      <!-- <nav class="tokens-list-nav">
        <router-link class="active" :to="{ name: 'token' }">
          发布顺序
        </router-link>
        <router-link :to="{ name: 'token' }">
          字母顺序
        </router-link>
      </nav> -->

      <div v-loading="loading" class="card-container">
        <no-content-prompt :list="pull.list">
          <tokenCard v-for="(item, index) in pull.list" :key="index" :card="item" />
        </no-content-prompt>
      </div>
      <user-pagination
        v-show="!loading"
        :current-page="currentPage"
        :params="pull.params"
        :api-url="pull.apiUrl"
        :page-size="10"
        :total="total"
        :need-access-token="true"
        class="pagination"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </div>
  </div>
</template>

<script>
// import avatar from '@/components/avatar/index.vue'
import tokenCard from '@/components/token_card/index.vue'
import userPagination from '@/components/user/user_pagination.vue'
export default {
  components: {
    // avatar,
    tokenCard,
    userPagination
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 10
        },
        apiUrl: 'tokenAll',
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
  methods: {
    paginationData(res) {
      // console.log(res)
      this.pull.list = res.data.list
      this.assets = res.data
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
          page: i
        }
      })
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
