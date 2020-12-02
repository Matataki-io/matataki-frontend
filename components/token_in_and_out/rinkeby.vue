<template>
  <div class="rinkeby-in-n-out">
    <el-alert type="warning" class="elalert">
      <h2 class="title">
        ⚠️你找到了暂未对公众开放的试验性功能⚠️
      </h2>
      <p class="description">
        提取出站外的Fan票为普通的 ERC20 代币。（在 Rinkeby Testnet 上）
      </p>
      <p class="description">
        请确保你自己知道你在做啥，并提供的一个有效的以太坊地址，我们不为搞错地址所造成的丢币负责。
      </p>
    </el-alert>
    <el-alert type="info" class="elalert">
      <h2 class="title">
        ❓怎么在以太坊钱包显示我提现出来的Fan票？
      </h2>
      <a
        class="link"
        style="color: #1989fa"
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
    Withdraw,
  },
  props: {
    direction: {
      type: String,
      required: true,
    },
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

<style lang="less" scoped>
.rinkeby-in-n-out {
  .elalert {
    margin: 10px 0;
    .title {
      padding: 0;
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.5;
    }
    .description {
      font-size: 14px;
      padding: 0;
      margin: 4px 0 0 0;
      line-height: 1.5;
    }
    .link {
      color: rgb(25, 137, 250);
      display: inline-block;
      font-size: 14px;
      text-decoration: underline;
      padding: 0;
      margin: 4px 0 0 0;
      line-height: 1.5;
    }
  }
}
</style>