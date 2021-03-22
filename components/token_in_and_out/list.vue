<template>
  <div class="crosschain-token-list">
    <el-table
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        prop="symbol"
        label="Token"
      >
        <template slot-scope="scope">
          <n-link class="link" :to="{ name: 'token-id', params: { id: scope.row.id } }" target="_blank">
            <avatar
              size="30px"
              :src="$API.getImg(scope.row.logo)"
              class="avatar"
            />
            {{ scope.row.symbol }}({{ scope.row.name }})
          </n-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="uid"
        label="User"
      >
        <template slot-scope="scope">
          <n-link class="link" :to="{ name: 'user-id', params: { id: scope.row.uid } }" target="_blank">
            <avatar
              size="30px"
              :src="$API.getImg(scope.row.avatar)"
              class="avatar"
            />
            <span>{{ scope.row.nickname || scope.row.username }}</span>
          </n-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="crossTokenAddress"
        label="Address"
      >
        <template slot="header">
          <el-tooltip
            class="item"
            effect="dark"
            :content="`${$utils.firstUpperCase(chain)} 地址`"
            placement="top"
          >
            <span>Address <i class="el-icon-question" /></span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <a class="link" :href="addressScan({ address: scope.row.crossTokenAddress, chain: chain })" target="_blank">
            {{ scope.row.crossTokenAddress }}
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'

export default {
  name: 'CrossChainTokenList',
  components: {
    avatar
  },
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
    },
    // 返回地址的scan
    addressScan({ address, chain }) {
      let list = {
        'rinkeby': process.env.VUE_APP_ETHERSCAN,
        'bsc': process.env.VUE_APP_BSCSCAN,
        'matic': process.env.VUE_APP_MATICSCAN,
      }
      return list[chain] ? `${list[chain]}/address/${address}` : '#'
    },
  }
}
</script>

<style lang="less" scoped>
.link {
  color: #333;
  display: flex;
  align-items: center;
  .avatar {
    margin-right: 4px;
  }
  &:hover {
    text-decoration: underline;
  }
  span {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>