<template>
  <el-pagination
    class="user-pagination"
    background
    layout="prev, pager, next"
    :total="total"
    :page-size="pageSize"
    :current-page.sync="currentPageCopy"
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
      params.page = page
      const getDataSuccess = res => this.$emit('paginationData', res)
      const getDataFail = message => message ? console.log(message) : console.log('获取数据失败')

      // 获取数据
      try {
        const res = await this.$backendAPI.getBackendData({ url, params }, this.needAccessToken)
        if (res.status === 200 && res.data.code === 0) getDataSuccess(res.data)
        else getDataFail(res.data.message)
      } catch (error) { getDataFail() }
    },
    togglePage(i) {
      this.$emit('togglePage', i)
    },
    prevClick(i) {
      console.log('prevClick', i)
      this.togglePage(i)
    },
    nextClick(i) {
      console.log('nextClick', i)
      this.togglePage(i)
    },
    currentChange(i) {
      console.log('currentChange', i)
      this.togglePage(i)
    }
  }
}
</script>

<style lang="less">
.user-pagination.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #000;
}
.user-pagination.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #000;
}
</style>
