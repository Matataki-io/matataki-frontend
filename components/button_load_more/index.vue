<template>
  <el-button v-if="!isLoadEnd" :loading="loading" class="load-more" @click="loadMore">
    <slot>查看更多</slot>
  </el-button>
</template>
<script>
export default {
  props: {
    typeIndex: {
      type: Number,
      required: true
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
    // 是否自动请求
    isAtuoRequest: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      isLoadEnd: false,
      page: this.params.page || 1 // 分页
    }
  },
  created() {
    if (this.isAtuoRequest) {
      this.getLoadMore(this.apiUrl, this.params)
      // console.log(this.isAtuoRequest, this.params, this.apiUrl)
    }
  },
  methods: {
    loadMore() {
      this.page++
      this.getLoadMore(this.apiUrl, this.params)
    },
    async getLoadMore(url, params) {
      if (this.isLoadEnd) return
      params.page = this.page
      const getDataSuccess = (res) => {
        if ((res.data && res.data.list && res.data.list.length < 20) || (res.data.length === 0)) {
          this.isLoadEnd = true
        }
        this.$emit('buttonLoadMore', {
          index: this.typeIndex,
          data: res.data
        })
      }
      const getDataFail = message => message ? console.log(message) : console.log('获取数据失败')

      // 获取数据
      try {
        this.loading = true
        const res = await this.$backendAPI.getBackendData({ url, params }, false)
        if (res.status === 200 && res.data.code === 0) getDataSuccess(res.data)
        else getDataFail(res.data.message)
        this.loading = false
      } catch (error) {
        console.log(error)
        getDataFail()
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.load-more {
  background: #000000;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  margin:60px 0;
  display: block;
  cursor: pointer;
  outline: none;
  border: none;
  width: 190px;
  height: 48px;
  border-radius: 4px;
}
</style>
