<template>
  <div class="rinkeby-in-n-out">
    <el-alert type="warning">
      <h2 class="title">
        ⚠️你找到了暂未对公众开放的试验性功能⚠️
      </h2>
      提取出站外的Fan票为普通的 ERC20 代币。（在 Rinkeby Testnet 上）
      <br>
      请确保你自己知道你在做啥，并提供的一个有效的以太坊地址，我们不为搞错地址所造成的丢币负责。
    </el-alert>
    <el-alert type="info">
      <h2 class="title">
        ❓怎么在以太坊钱包显示我提现出来的Fan票？ 
      </h2>
      <a 
        style="color: #1989FA;"
        href="https://matataki.io/p/4881" 
        target="_blank" 
        rel="noreferrer"
      >👉在 MetaMask 添加 Fan票的指南👈</a>
    </el-alert>
    <Deposit v-if="isDepositSelected" />
    <Withdraw v-else />
  </div>
</template>

<script>
import Deposit from './rinkeby/deposit'
import Withdraw from './rinkeby/withdraw'
export default {
  name: 'RinkebyInAndOut',
  components: {
    Deposit,
    Withdraw
  },
  props: {
    direction: {
      type: String,
      required: true
    }
  },
  computed: {
    isWithdrawSelected() {
      return this.direction === 'withdraw'
    },
    isDepositSelected() {
      return this.direction === 'deposit'
    },
  },
}
</script>