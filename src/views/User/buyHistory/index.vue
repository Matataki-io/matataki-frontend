<template>
  <div class="mw buy">
    <BaseHeader :pageinfo="{ title: '购买记录' }" />
    <BasePull
      :params="params"
      :api-url="apiUrl"
      :loading-text="'暂无购买记录'"
      :is-obj="{ type: 'Object', key: 'data' }"
      :need-access-token="true"
      @getListData="getListData"
    >
      <buyCard v-for="(item, index) in buyList" :key="index" :buy="item" />
    </BasePull>
  </div>
</template>

<script>
import buyCard from './buyCard.vue'

export default {
  name: 'BuyHistory',
  components: {
    buyCard
  },
  data() {
    return {
      buyList: [],
      params: '',
      apiUrl: 'buyHistory'
    }
  },
  created() {},
  methods: {
    getListData(res) {
      this.buyList = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.buy {
  background-color: #f7f7f7;
  min-height: 100%;
  padding-top: 45px;
}
</style>
