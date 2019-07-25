<template>
  <button class="load-more">
    查看更多
  </button>
</template>
<script>
export default {
  props: {
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
  created() {
    this.getLoadMore(this.apiUrl, this.params)
  },
  methods: {
    async getLoadMore(url, params) {
      console.log(this.params, this.apiUrl)
      // 获取数据
      try {
        const res = await this.$backendAPI.getBackendData({ url, params }, false)
        if (res.status === 200 && res.data.code === 0) console.log(1)
        else console.log(2)
      } catch (error) {
        console.log(error)
        console.log(2)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.load-more {
  width: 300px;
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
}
</style>
