<template>
  <el-dialog
    title="选择Token"
    :close-on-click-modal="false"
    :visible.sync="showModal"
    width="600px"
    :lock-scroll="false"
    :before-close="handleClose"
    custom-class="br10 black-theme-dialog"
  >
    <div class="container">
      <div class="sc-uJMKN csvLqB">
        <div class="search-box"><i class="el-icon-search"></i></div>
        <input type="text" placeholder="搜索通证或粘贴地址" class="dHtVAe" v-model="search" @keyup.enter="searchToken">
      </div>
      <div class="cotdDw" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.3)">
        <div class="sc-jnlKLf hDyKIS" v-for="item in tokenList" :key="item.id" @click="selectToken(item)">
          <div class="sc-fYxtnH cjqFX">
            <div class="favMUS"><img v-if="item.logo" :src="getImg(item.logo)" alt="logo"></div>
            <div class="sc-tilXH egNEUM">
              <span id="symbol">{{ item.symbol }}</span>
              <div class="sc-hEsumM iHXZgD">{{ item.name }}</div>
            </div>
          </div>
          <div class="sc-kafWEX bELmls">
            <div class="sc-ktHwxA etGoql"> - </div>
            <div class="sc-cIShpX eAstpp"></div>
          </div>
        </div>
        <div v-if="tokenList.length <= 0" class="noData">😭暂无内容</div>
        <div class="loadmore" v-if="showLoadMore">
          <span @click="loadMore">
          加载更多<i class="el-icon-arrow-down"></i>
          </span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import { CNY } from './consts.js'
export default {
  name: 'TokenListModal',
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
      pagesize: 10,
      count: 0,
      loading: false
    }
  },
  mounted() {
    this.getAllToken()
  },
  methods: {
    getImg(url) {
      return this.$API.getImg(url)
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
        if (search === '') {
          if (page === 1) {
            this.count = res.data.count
            let list = []
            if (this.addon) {
              list = [
                CNY,
                ...res.data.list
              ]
            } else {
              list = res.data.list
            }
            this.tokenList = list
          } else {
            this.tokenList.push(...res.data.list)
          }
        } else {
          if (page === 1) {
            this.count = res.data.count
            this.tokenList = res.data.list
          } else {
            this.tokenList.push(...res.data.list)
          }
        }
      })
    },
  }
}
</script>

<style lang="less">
.black-theme-dialog {
  background-color: rgb(51, 54, 57);
  .el-dialog__body {
    padding: 10px 0 0 0;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #ffffff;
  }
}
</style>
<style scoped lang="less">
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
    background-color: rgb(64, 64, 64);
  }
  .search-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cotdDw {
    -webkit-box-flex: 1;
    flex-grow: 1;
    max-height: 50vh;
    min-height: 40vh;
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
    color: #fff;
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
    color: rgb(123, 123, 123);
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
    background-color: rgb(41, 44, 47);
    flex-flow: row nowrap;
    padding: 0.5rem 1.5rem;
  }

  .dHtVAe {
    color: rgb(255, 255, 255);
    font-size: 1rem;
    width: 0px;
    min-height: 2.5rem;
    text-align: left;
    padding-left: 1.6rem;
    background-color: rgb(41, 44, 47);
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
