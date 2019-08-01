<template>
  <button v-if="!isLoadEnd" class="load-more" @click="loadMore">
    <slot>查看更多</slot>
  </button>
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
    }
  },
  data() {
    return {
      isLoadEnd: false,
      page: 1 // 分页
    }
  },
  created() {
    this.getLoadMore(this.apiUrl, this.params)
    // console.log(this.params, this.apiUrl)
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
        // console.log(res)
        if (res.data.length < 20) this.isLoadEnd = true
        this.$emit('buttonLoadMore', {
          index: this.typeIndex,
          data: res.data
        })
      }
      const getDataFail = message => message ? console.log(message) : console.log('获取数据失败')

      // 获取数据
      try {
        const res = await this.$backendAPI.getBackendData({ url, params }, false)
        if (res.status === 200 && res.data.code === 0) getDataSuccess(res.data)
        else getDataFail(res.data.message)
      } catch (error) {
        console.log(error)
        getDataFail()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.load-more {
  width: 240px;
  height: 60px;
  background: #000000;
  border-radius: @borderRadius10;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin: 120px 0;
  display: block;
  cursor: pointer;
  outline: none;
  border: none;
}
</style>
