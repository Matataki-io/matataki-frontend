<template>
  <BasePull
    :loading-text="'暂无明细'"
    :params="params"
    :api-url="apiUrl"
    :need-access-token="needAccessToken"
    :is-obj="isObj"
    @getListData="getListData"
  >
    <AssetCard v-for="(item, index) in asset" :key="index" :asset="item" />
  </BasePull>
</template>

<script>
import { AssetCard } from '@/components/'

export default {
  name: 'AssetList',
  components: { AssetCard },
  props: ['type'],
  data() {
    return {
      params: {
        symbol: this.type
      },
      apiUrl: 'assetList',
      asset: [],
      isObj: { type: 'newObject', key: 'data', keys: 'logs' },
      needAccessToken: true
    }
  },
  computed: {},
  created() {},
  methods: {
    getListData(res) {
      const historyFilter = res.list.filter(i => i.amount !== 0) // 过滤金额为0
      this.asset = historyFilter
      this.$emit('getOtherAsset', res)
    }
  }
}
</script>
