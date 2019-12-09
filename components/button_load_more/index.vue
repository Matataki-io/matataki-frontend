<template>
  <el-button v-if="!isLoadEnd" :loading="loading" :class="buttonType" @click="loadMore" class="load-more">
    <slot>{{ $t('viewMore') }}</slot>
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
    },
    buttonType: {
      type: String,
      default: 'btn'
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
        const res = await this.$API.getBackendData({ url, params }, false)
        if (res.code === 0) getDataSuccess(res)
        else getDataFail(res.message)
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
  text-align: center;
  display: block;
  outline: none;
  border: none;
  font-weight: 400;
  cursor: pointer;
  &.btn {
    font-size: 18px;
    width: 190px;
    height: 48px;
    border-radius: 4px;
    background: #000000;
    color: #fff;
    margin:60px 0;
  }
  &.article-comment {
    background: transparent;
    color: #333;
    font-size: 16px;
    height: auto;
    width: auto;
    margin: 20px auto;
    padding: 0;
    text-decoration: underline;
  }
}
</style>
