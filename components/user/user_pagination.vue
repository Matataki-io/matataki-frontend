<template>
  <el-pagination
    :total="total"
    :page-size="pageSize"
    :current-page.sync="currentPageCopy"
    :small="small"
    :class="selectClass"
    layout="prev, pager, next"
    background
    @prev-click="prevClick"
    @next-click="nextClick"
    @current-change="currentChange"
  />
</template>

<script>
export default {
  props: {
    currentPage: { // 当前页数
      type: Number,
      default: 1
    },
    // 传进来的params
    params: {
      type: Object,
      default: () => {}
    },
    // api 地址
    apiUrl: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 20
    },
    needAccessToken: {
      type: Boolean,
      default: false
    },
    // 刷新
    reload: {
      type: Number,
      default: 0
    },
    // 需要替换的url
    urlReplace: {
      type: String,
      default: ''
    },
    small: {
      type: Boolean,
      default: false
    },
    selectClass: {
      type: String,
      default: 'user-pagination'
    }
  },
  data() {
    return {
      currentPageCopy: this.currentPage
    }
  },
  computed: {

  },
  watch: {
    currentPage(newVal) {
      this.currentPageData(this.apiUrl, this.params, newVal)
    },
    params: {
      handler() {
        this.currentPageCopy = this.currentPage
        this.currentPageData(this.apiUrl, this.params, this.currentPage)
      },
      deep: true
    },
    // 刷新 改变当前页数和重新请求
    reload() {
      this.currentPageCopy = this.currentPage
      this.reloadFunc()
    }
  },
  created() {
    this.currentPageData(this.apiUrl, this.params, this.currentPage)
  },
  methods: {
    // 得到总页数
    totalPage() {},
    async currentPageData(url, params, page) {
      // console.log(url, params, page)
      if (Object.keys(params).length === 0) return
      params.page = page
      const getDataSuccess = res => this.$emit('paginationData', res)
      const getDataFail = message => message ? console.log(message) : console.log('获取数据失败')

      // 获取数据
      try {
        const res = await this.$API.getBackendData({ url, params, urlReplace: this.urlReplace }, this.needAccessToken)
        if (res.code === 0) getDataSuccess(res)
        else getDataFail(res.message)
      } catch (error) { getDataFail() }
    },
    togglePage(i) {
      this.$emit('togglePage', i)
    },
    prevClick(i) {
      // console.log('prevClick', i)
      this.togglePage(i)
    },
    nextClick(i) {
      // console.log('nextClick', i)
      this.togglePage(i)
    },
    currentChange(i) {
      // console.log('currentChange', i)
      this.togglePage(i)
    },
    // 刷新方法
    reloadFunc() {
      this.currentPageData(this.apiUrl, this.params, this.currentPage)
    }
  }
}
</script>

<style lang="less">
.user-pagination {
  text-align: center;
}
.user-pagination.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #000;
}
.user-pagination.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #000;
}
.user-pagination.el-pagination.is-background .el-pager li:not(.disabled):hover.active {
  color: #fff;
}

.user-pagination-light {
  text-align: center;
}
.user-pagination-light.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color:#000;
}
.user-pagination-light.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #000;
}
.user-pagination-light.el-pagination.is-background .el-pager li:not(.disabled):hover.active {
  color: #fff;
}
.user-pagination-light.el-pagination.is-background .btn-prev {
  background-color: white;
}
.user-pagination-light.el-pagination.is-background .btn-next {
  background-color: white;
}
</style>
