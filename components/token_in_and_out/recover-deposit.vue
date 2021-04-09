<template>
  <div class="recover-deposit">
    <h1 class="title">找回交易</h1>
    <el-alert type="warning">
      <p>跨链 Fan 票已销毁却迟迟未存入到 Matataki 账户？现在你可以自助找回啦。</p>
      <p>注意事项：必须是在 TokenBurner 合约发生的销毁才能算。</p>
    </el-alert>
    <el-input v-model="txHash" :placeholder="placeholderForTxHash" />
    <el-button type="primary" @click="checkThisTx">
      提交
    </el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'RecoverDeposit',
  props: {
    chain: {
      type: String,
      required: true
    }
  },
  data: () => ({
    txHash: '',
    result: null
  }),
  computed: {
    placeholderForTxHash() {
      return `请输入 ${this.chain} 的交易哈希（Transaction Hash)`
    }
  },
  methods: {
    async checkThisTx() {
      try {
        const { data } = await this.$API.depositFromExternalChain({
          txHash: this.txHash
        }, this.chain)
        this.result = data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$message.error('请检查交易是否已经入账或哈希是否正确')
        } else {
          console.error('err', error)
          this.$message.error('error', error)
        }
      }
    }
  }
}
</script>