<template>
  <div class="tokens-list">
    <div class="fl jsb">
      <div class="tokens-list-header">
        <div class="tokens-list-header-left-column">
          <el-dropdown
            trigger="click"
            @command="toggleDropdown"
          >
            <span
              :class="sort === selectedDropdown && 'active'"
              class="el-dropdown-link"
            >
              <span v-if="selectedDropdown === 'name-asc'">{{ $t('token.ascendingAlphabeticalOrder') }}</span>
              <span v-else-if="selectedDropdown === 'name-desc'">{{ $t('token.descendingFirstLetter') }}</span>
              <span v-else-if="selectedDropdown === 'time-asc'">{{ $t('token.ascendingTime') }}</span>
              <span v-else-if="selectedDropdown === 'time-desc'">{{ $t('token.descendingTime') }}</span>
              <span v-else>{{ $t('token.comprehensiveSort') }}</span>
              <i
                v-if="selectedDropdown.includes('-asc')"
                class="el-icon-arrow-up el-icon--right"
              />
              <i
                v-else
                class="el-icon-arrow-down el-icon--right"
              /> 
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="general">
                {{ $t('token.comprehensiveSort') }}
              </el-dropdown-item>
              <el-dropdown-item command="name-asc">
                {{ $t('token.ascendingAlphabeticalOrder') }}
              </el-dropdown-item>
              <el-dropdown-item command="name-desc">
                {{ $t('token.descendingFirstLetter') }}
              </el-dropdown-item>
              <el-dropdown-item command="time-asc">
                {{ $t('token.ascendingTime') }}
              </el-dropdown-item>
              <el-dropdown-item command="time-desc">
                {{ $t('token.descendingTime') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="tokens-list-header-medium-column">
          <div
            :class="sort.startsWith('unit-price') && 'active'"
            class="sub-column"
            @click="toggleSort('unit-price')"
          >
            {{ $t('token.unitPrice') }}
            <i class="el-icon-d-caret" />
          </div>
          <div
            :class="sort.startsWith('liquidity') && 'active'"
            class="sub-column"
            @click="toggleSort('liquidity')"
          >
            {{ $t('token.liquidGold') }}
            <i class="el-icon-d-caret" />
          </div>
          <div
            :class="sort.startsWith('exchange') && 'active'"
            class="sub-column"
            @click="toggleSort('exchange')"
          >
            {{ $t('token.turnover24h') }}
            <i class="el-icon-d-caret" />
          </div>
        </div>
        <div class="tokens-list-header-right-column">
          {{ $t('token.founder') }}
        </div>
      </div>
    </div>

    <div v-loading="loading" class="card-container">
      <no-content-prompt :list="pull.list">
        <tokenCard
          v-for="(item, index) in pull.list"
          :key="index"
          :card="item"
        />
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
</template>

<script>
// import avatar from '@/components/avatar/index.vue'
import tokenCard from '@/components/token_card/index.vue'
import userPagination from '@/components/user/user_pagination.vue'
export default {
  components: {
    // avatar,
    tokenCard,
    userPagination,
  },
  data() {
    return {
      sort: this.$route.query.sort || 'general',
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
      selectedDropdown: this.$route.query.sort || 'general'
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
          sort: this.$route.query.sort,
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
        case 'time-asc':
        case 'time-desc':
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

      this.currentPage = 1
      // const query = {
      //   sort
      // }
      this.pull.list = []

      this.sort = sort
      this.pull.params.sort = sort
      this.$router.push({
        query: {
          sort
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


<style lang="less" scoped>
@width: 1160px;

// .token {
//   max-width: 1200px;
//   width: 100%;
//   margin: 0 auto;
//   padding-left: 10px;
//   padding-right: 10px;
//   box-sizing: border-box;
// }

.tokens {
  width: @width;
  margin: 20px auto 0;
  padding: 20px;
  background: @white;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04)
}

.tokens-content {
  flex: 1;
  margin-left: 10px;
}

.token-info {
  width: 50%;

  &-symbol {
    font-size: 20px;
    font-weight: 400;
    color: @black;
    line-height: 28px;
    padding: 0;
    margin: 0;
  }

  &-name {
    font-size: 14px;
    font-weight: 400;
    color: @gray;
    line-height: 20px;
    padding: 0;
    margin: 4px 0 0 0;
  }
}

.token-user {
  width: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: column;
}

.token-username {
  margin-left: 6px;
  font-size: 14px;
  font-weight: 400;
  color: @black;
  line-height: 20px;
}

.token-user-icon {
  padding: 40px 0;
}

.tokens-list {
  .help-link {
    font-size: 14px;
    color: #868686;
    text-decoration: underline;
  }
}

.tokens-list-header {
  width: 100%;
  font-size: 16px;
  color: @gray;
  line-height: 28px;

  .el-dropdown-link {
    color: @gray;
  }

  div {
    float: left;
  }

  .active {
    color: black;
  }

  &-left-column {
    width: 35%;

    .el-dropdown {
      font-size: 16px;
    }
  }

  &-medium-column {
    width: 39%;
    text-align: center;

    .sub-column {
      width: 33%;
    }
  }

  &-right-column {
    width: 26%;
    text-align: right;
  }
}

.card-container {
  margin: 20px 0 40px;
}



// <880
@media screen and (max-width: 880px) {
  .tokens-list-header-right-column {
    display: none;
  }

  .tokens-list-header-medium-column {
    width: 65%;
  }
}

// < 580
@media screen and (max-width: 580px) {

  .tokens-list-header-left-column .el-dropdown {
    font-size: 14px;
  }

  .tokens-list-header-left-column,
  .tokens-list-header-medium-column,
  .tokens-list-header-right-column {
    float: none;
    width: 100%;
  }

  .tokens-list-header-medium-column {
    margin-top: 10px;
  }

  .tokens-list-header-medium-column {
    .sub-column:nth-child(1) {
      text-align: left;
    }

    .sub-column:nth-last-child(1) {
      text-align: right;
    }
  }
}

</style>