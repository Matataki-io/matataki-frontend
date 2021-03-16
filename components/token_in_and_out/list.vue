<template>
  <div class="crosschain-token-list">
    <el-table
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="名字"
        width="180"
      />
      <el-table-column
        prop="uid"
        label="发行人UID"
        width="180"
      />
      <el-table-column
        prop="crossTokenAddress"
        :label="`在 ${chain} 上的地址`"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CrossChainTokenList',
  props: {
    chain: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    list: [
    ]
  }),
  async mounted() {
    if (this.chain !== 'rinkeby') {
      await this.fetchAllCrosschain()
    } else {
      await this.fetchTokens()
    }
  },
  methods: {
    async fetchAllCrosschain() {
      const { data } = await this.$API.listAllCrossChainToken(this.chain)
      console.info('fetchAllCrosschain', data)
      this.list = data.list
    },
    async fetchTokens() {
      // for rinkeby
      const { data } = await this.$API.allToken(1, 1000)
      this.list = data.list.map(({ contract_address, ...rest }) => {
        return {...rest, crossTokenAddress: contract_address}
      })
    }
  }
}
</script>