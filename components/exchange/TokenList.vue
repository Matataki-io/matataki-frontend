<template>
  <el-dialog
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="showModal"
    :lock-scroll="false"
    :before-close="handleClose"
    :title="$t('choose-coin')"
    width="600px"
    custom-class="br10 black-theme-dialog token-list"
  >
    <div class="container">
      <div class="csvLqB">
        <div class="search-box">
          <i class="el-icon-search" />
        </div>
        <el-input
          v-model="search"
          type="text"
          :placeholder="$t('search-coin')"
          class="dHtVAe"
        />
      </div>
      <div
        v-loading="loading"
        class="cotdDw br10"
        element-loading-background="rgba(0, 0, 0, 0.3)"
      >
        <el-table
          v-if="tableConfig.mode === 'all'"
          :data="tokenList"
          height="50vh"
          style="width: 100%"
          @row-click="selectToken"
        >
          <el-table-column :label="$t('coin')">
            <template slot-scope="scope">
              <div class="sc-fYxtnH cjqFX">
                <div class="favMUS">
                  <avatar
                    v-if="scope.row.logo"
                    :src="getImg(scope.row.logo)"
                    size="30px"
                  />
                </div>
                <div class="sc-tilXH egNEUM">
                  <span id="symbol">{{ exchangeSymbol(scope.row.symbol) }}</span>
                  <div class="sc-hEsumM iHXZgD">
                    {{ scope.row.name }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('circulation')">
            <template slot-scope="scope">
              <span>
                {{ scope.row.amount || $t('no-liquidity') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('token.founder')"
          >
            <template slot-scope="scope">
              <span style="white-space: nowrap;">
                {{ scope.row.nickname || scope.row.email }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label=""
            width="100px"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('go-to-coin-homepage')"
                placement="top"
              >
                <n-link
                  v-if="scope.row.id !== 0"
                  :to="{name: 'token-id', params: {id: scope.row.id}}"
                  target="_blank"
                  class="gray-btn"
                >
                  <el-button circle>
                    <svg-icon
                      icon-class="fan-home"
                      class="fan-home"
                    />
                  </el-button>
                </n-link>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-if="tableConfig.mode === 'simplify'"
          :data="tokenList"
          height="50vh"
          style="width: 100%"
          @row-click="selectToken"
        >
          <el-table-column :label="$t('coin')">
            <template slot-scope="scope">
              <div class="sc-fYxtnH cjqFX">
                <div class="favMUS">
                  <avatar
                    v-if="scope.row.logo"
                    :src="getImg(scope.row.logo)"
                    size="30px"
                  />
                </div>
                <div class="sc-tilXH egNEUM">
                  <span id="symbol">{{ exchangeSymbol(scope.row.symbol) }}</span>
                  <div class="sc-hEsumM iHXZgD">
                    {{ scope.row.name }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('circulation')">
            <template slot-scope="scope">
              <span>
                {{ scope.row.amount || $t('no-liquidity') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="showLoadMore"
          class="loadmore"
        >
          <span @click="loadMore">
            {{ $t('load-more') }}<i class="el-icon-arrow-down" />
          </span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { CNY } from './consts.js'
import utils from '@/utils/utils'
import avatar from '@/components/avatar/index.vue'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

export default {
  name: 'TokenListModal',
  components: {
    avatar
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    addon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      search: '',
      showModal: false,
      tokenList: [],
      page: 1,
      pagesize: 100,
      count: 0,
      loading: false,
      resizeEvent: null,
      tableConfig: {
        mode: '', // simplify all
      }
    }
  },
  computed: {
    showLoadMore() {
      const { page, pagesize, count } = this
      if (page * pagesize > count) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    search() {
      this.searchToken()
    },
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    },
  },
  created() {
    if (process.browser) {
      this.$nextTick(() => {
        this.initTokenList()
        this.resizeEvent = throttle(this.initTokenList, 300)
        window.addEventListener('resize', this.resizeEvent)
      })
    }
  },
  mounted() {
    this.getAllToken()
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },
  methods: {
    getImg(url) {
      return this.$ossProcess(url)
    },
    handleClose() {
      this.search = ''
      this.showModal = false
    },
    searchToken: debounce(function() {
      this.page = 1
      this.getAllToken()
    }, 300),
    loadMore() {
      this.page = this.page + 1
      this.getAllToken()
    },
    selectToken(token) {
      this.showModal = false
      this.$emit('selectToken', token)
    },
    getAllToken() {
      const { page, pagesize, search } = this
      this.loading = true
      this.$API.allToken({ page, pagesize, search }).then(res => {
        this.loading = false
        let listFromDecimal = this.listFromDecimal(res.data.list || [])
        if (search === '') {
          if (page === 1) {
            this.count = res.data.count
            let list = []
            if (this.addon) {
              let CNYItem = Object.assign(CNY, {
                name: this.$t('mttk-points')
              })
              list = [
                CNYItem,
                ...listFromDecimal
              ]
            } else {
              list = listFromDecimal
            }
            this.tokenList = list
          } else {
            this.tokenList.push(...listFromDecimal)
          }
        } else {
          if (page === 1) {
            this.count = res.data.count
            this.tokenList = listFromDecimal
          } else {
            this.tokenList.push(...listFromDecimal)
          }
        }
      })
    },
    listFromDecimal(list) {
      list.forEach((item) => {
        item.amount = utils.fromDecimal(item.amount)
      })
      return list
    },
    // 初始化list
    initTokenList() {
      try {
        const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        // console.log('clientWidth', clientWidth)
        if (clientWidth <= 600) {
          this.tableConfig = {
            mode: 'simplify'
          }
        } else {
          this.tableConfig = {
            mode: 'all'
          }
        }
      } catch(e) {
        console.log(e)
      }
    },
    // 转换Symbol
    exchangeSymbol(symbol) {
      if (!symbol) return symbol
      return symbol.toLocaleUpperCase() === 'CNY' ? this.$t('mttk-points') : symbol
    }
  }
}
</script>
<style lang="less">
.cotdDw {
  .el-table .cell {
    padding-left: 20px;
  }
}
.gray-btn {
  .el-button {
    background-color: transparent;
    border-radius: 100%;
    padding: 0;
    border: none;
    outline: none;
  }
  .fan-home {
    font-size: 32px;
  }
}
.black-theme-dialog {
  background-color: #ffffff;
  .el-dialog__body {
    padding: 10px 0 0 0;
    color: #000000;
    font-size: 14px;
    word-break: break-all;
  }
  .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #000000;
  }
}
</style>
<style scoped lang="less">
::placeholder {
  color: #b2b2b2;
}
.container {
  .favMUS {
    width: 2rem;
    height: 2rem;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
  .hDyKIS:hover {
    background-color: @purpleLight;
  }
  .search-box {
    font-size: 1.5rem;
    color: #b2b2b2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cotdDw {
    flex-grow: 1;
    overflow-y: auto;
  }
  .hDyKIS {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    flex-flow: row nowrap;
    padding: 1rem;
    color: #000000;
  }

  .cjqFX {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
  }

  .egNEUM {
    display: flex;
    margin-left: 1rem;
    flex-flow: column nowrap;
  }

  .iHXZgD {
    color: #b2b2b2;
  }

  .bELmls {
    display: flex;
    align-items: flex-end;
    flex-flow: column nowrap;
  }

  .etGoql {
    font-size: 1rem;
    line-height: 20px;
  }

  .eAstpp {
    font-size: 1rem;
    line-height: 1.5rem;
    color: rgb(123, 123, 123);
  }
  .csvLqB {
    display: flex;
    -webkit-box-pack: start;
    justify-content: flex-start;
    background-color: #f1f1f1;
    flex-flow: row nowrap;
    padding: 0.5rem 1.5rem;
  }

  .dHtVAe {
    color: #000000;
    font-size: 1rem;
    width: 0px;
    min-height: 2.5rem;
    text-align: left;
    padding-left: 1.6rem;
    flex: 1 0 auto;
    /deep/ .el-input__inner {
      outline: none;
      border-image: initial;
      border: none;
      background: transparent;
      border-radius: 0;
    }
  }

  input {
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: initial;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    -webkit-appearance: textfield;
    background-color: white;
    -webkit-rtl-ordering: logical;
    cursor: text;
    margin: 0em;
    font: 400 13.3333px Arial;
    padding: 1px 0px;
    border-width: 2px;
    border-style: inset;
    border-color: initial;
    border-image: initial;
  }
  .loadmore {
    text-align: center;
    color: #409eff;
    padding: 1rem;
    span {
      cursor: pointer;
    }
  }
  .noData {
    text-align: center;
    margin-top: 15vh;
    font-size: 1.2rem;
  }
}
</style>

<style lang="less" scoped>
// <600
@media screen and (max-width: 600px) {
  /deep/ .token-list {
    max-width: 90% !important;
  }
}
</style>
