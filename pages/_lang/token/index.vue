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
            蠢朋克钱多多通证
          </p>
          <p class="token-info-name">
            蠢朋克钱多多通证是由鼎鼎大名的蠢朋克组合所设置的粉丝通证，被广大通证圈玩家所看好，一推出通证价便直线上涨。
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
      <div class="fl jsb">
        <!-- <nav class="tokens-list-nav">
          <div :class="sort === 'id' && 'active'" @click="toggleSort('id')">
            发布顺序
            <i class="el-icon-d-caret" />
          </div>
          <div :class="sort === 'symbol' && 'active'" @click="toggleSort('symbol')">
            字母顺序
            <i class="el-icon-d-caret" />
          </div>
        </nav>
        <a
          class="help-link"
          href="https://www.matataki.io/p/977"
          target="_blank"
        >什么是粉丝通证?</a> -->
        <div class="tokens-list-header">
          <div class="tokens-list-header-left-column">
            <el-dropdown trigger="click" @command="toggleDropdown">
              <span class="el-dropdown-link" :class="sort === selectedDropdown && 'active'">
                <span v-if="selectedDropdown === 'name-asc'">首字母升序</span>
                <span v-else-if="selectedDropdown === 'name-desc'">首字母降序</span>
                <span v-else>综合排序</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="general">综合排序</el-dropdown-item>
                <el-dropdown-item command="name-asc">首字母升序</el-dropdown-item>
                <el-dropdown-item command="name-desc">首字母降序</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="tokens-list-header-medium-column">
            <div class="sub-column" :class="sort.startsWith('danjia') && 'active'" @click="toggleSort('danjia')">
              单价
              <i class="el-icon-d-caret" />
            </div>
            <div class="sub-column" :class="sort.startsWith('liquidity') && 'active'" @click="toggleSort('liquidity')">
              流动金
              <i class="el-icon-d-caret" />
            </div>
            <div class="sub-column" :class="sort.startsWith('exchange') && 'active'" @click="toggleSort('exchange')">
              24h 成交量
              <i class="el-icon-d-caret" />
            </div>
          </div>
          <div class="tokens-list-header-right-column">
            发布时间
          </div>
        </div>
      </div>

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
        @paginationData="paginationData"
        @togglePage="togglePage"
        class="pagination"
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
      sort: this.$route.query.id || 'general',
      pull: {
        params: {
          pagesize: 10,
          sort: this.$route.query.sort || 'general'
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
      amount: 0,
      selectedDropdown: 'general'
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
    },
    toggleSort(name) {
      let sort

      switch (name) {
        case 'general':
        case 'name-asc':
        case 'name-desc':
          sort = name
          break

        default:
          if (this.sort.startsWith(name)) {
            sort = this.sort.endsWith('-desc') ? name + '-asc' : name + '-desc'
          } else {
            sort = name + '-desc'
          }
          break
      }

      this.sort = sort
      this.pull.params.sort = sort
      this.$router.replace({
        query: {
          sort,
          page: this.currentPage
        }
      })
    },
    toggleDropdown(command) {
      this.selectedDropdown = command
      this.toggleSort(command)
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
