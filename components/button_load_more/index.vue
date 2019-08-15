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
    },
    returnType: {
      type: String,
      default: 'Object'
    },
    commentRequest: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      isLoadEnd: false,
      page: this.params.page || 1 // 分页
    }
  },
  watch: {
    commentRequest() {
      this.reload()
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
    async getLoadMore(url, params, isEmpty = false) {
      if (this.isLoadEnd) return
      params.page = this.page
      const getDataSuccess = (res) => {
        // 判断是否加载完成
        if ((this.returnType === 'Object') && (res.data && res.data.list && res.data.list.length < 20)) {
          this.isLoadEnd = true
          // console.log(this.returnType)
        } else if ((this.returnType === 'Array') && (res.data && res.data.length < 20)) {
          this.isLoadEnd = true
          // console.log(this.returnType)
        }

        this.$emit('buttonLoadMore', {
          index: this.typeIndex,
          data: res.data,
          isEmpty: isEmpty
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
    },
    reload() {
      this.page = 1
      this.loading = false
      this.isLoadEnd = false
      this.getLoadMore(this.apiUrl, this.params, true)
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
