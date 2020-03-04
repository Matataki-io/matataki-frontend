<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    :lock-scroll="false"
    :before-close="handleClose"
    title="选择Fan票"
    width="600px"
    custom-class="br10 black-theme-dialog"
  >
    <div class="container">
      <div class="csvLqB">
        <div class="search-box">
          <i class="el-icon-search" />
        </div>
        <input v-model="search" @keyup.enter="searchToken" type="text" placeholder="搜索Fan票" class="dHtVAe">
      </div>
      <div v-loading="loading" class="cotdDw br10" element-loading-background="rgba(0, 0, 0, 0.3)">
        <el-table
          :data="tokenList"
          @row-click="selectToken"
          height="50vh"
          style="width: 100%"
        >
          <el-table-column
            width="250px"
            label="Fan票"
          >
            <template slot-scope="scope">
              <div class="sc-fYxtnH cjqFX">
                <div class="favMUS">
                  <avatar v-if="scope.row.logo" :src="getImg(scope.row.logo)" size="30px" />
                </div>
                <div class="sc-tilXH egNEUM">
                  <span id="symbol">{{ scope.row.symbol }}</span>
                  <div class="sc-hEsumM iHXZgD">
                    {{ scope.row.name }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="流通量"
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.amount || '暂无流通量' }}
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
          >
            <template slot-scope="scope">
              <n-link v-if="scope.row.id !== 0" :to="{name: 'token-id', params: {id: scope.row.id}}" target="_blank" class="gray-btn">
                <el-button circle>
                  <svg-icon icon-class="share-link" style="color: #B2B2B2;" />
                </el-button>
              </n-link>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="showLoadMore" class="loadmore">
          <span @click="loadMore">
            加载更多<i class="el-icon-arrow-down" />
          </span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import { CNY } from './consts.js'
import utils from '@/utils/utils'
import avatar from '@/components/avatar/index.vue'

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
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    },
    search(v) {
      if (v === '') {
        this.page = 1
        this.getAllToken()
      }
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
      loading: false
    }
  },
  mounted() {
    this.getAllToken()
  },
  methods: {
    getImg(url) {
      return this.$ossProcess(url)
    },
    handleClose() {
      this.search = ''
      this.showModal = false
    },
    searchToken() {
      this.page = 1
      this.getAllToken()
    },
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
              list = [
                CNY,
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
    background-color: #f1f1f1;
    border-color: #f1f1f1;
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
  color: #B2B2B2;
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
    color: #B2B2B2;
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
    color: #B2B2B2;
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
    background-color: #F1F1F1;
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
    background-color: #F1F1F1;
    outline: none;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    flex: 1 0 auto;
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
    color: #409EFF;
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
