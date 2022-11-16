<template>
  <div class="rinkeby-in-n-out">
    <el-alert type="warning" class="elalert">
      <h2 class="title">
        ⚠️{{ $t('you-found-an-experimental-feature-that-is-not-yet-open-to-the-public') }}⚠️
      </h2>
      <p class="description">
        {{ $t('fan-tickets-drawn-out-of-the-station-are-ordinary-ERC20-tokens-On-Rinkeby-Testnet') }}
      </p>
      <p class="description">
        {{ $t('please-make-sure-you-know-what-you-are-doing-and-provide-a-valid-Ethereum-address-we-are-not-responsible-for-the-loss-of-coins-caused-by-incorrect-addresses') }}
      </p>
    </el-alert>
    <el-alert type="info" class="elalert">
      <h2 class="title">
        ❓{{ $t('how-to-display-the-Fan-ticket-that-I-have-withdrawn-in-the-Ethereum-wallet') }}
      </h2>
      <a
        class="link"
        style="color: #1989fa"
        href="https://meta.io/p/4881"
        target="_blank"
        rel="noreferrer"
      >👉{{ $t('guide-to-add-fan-tickets-to-MetaMask') }}👈</a>
    </el-alert>
    <Deposit v-if="isDepositSelected" />
    <Withdraw v-if="isWithdrawSelected" />
    <ListCrosschain v-if="isLsSelected" chain="rinkeby" />
  </div>
</template>

<script>
import Deposit from './rinkeby/deposit'
import Withdraw from './rinkeby/withdraw'
import ListCrosschain from './list'

export default {
  name: 'RinkebyInAndOut',
  components: {
    Deposit,
    ListCrosschain,
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
    isLsSelected() {
      return this.direction === 'ls'
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
