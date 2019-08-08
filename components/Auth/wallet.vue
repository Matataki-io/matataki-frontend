<template>
  <section class="step">
    <h1 class="step-title">
      EOS钱包
    </h1>
    <div class="wallet">
      <a
        v-for="(itemWallet, indexWallet) in wallet.eos"
        :key="indexWallet"
        :href="itemWallet.href"
        target="_blank"
      >
        <img :src="itemWallet.url" :alt="itemWallet.alt">
      </a>
    </div>
    <h1 class="step-title">
      ONT钱包
    </h1>
    <div class="wallet">
      <a
        v-for="(itemWallet, indexWallet) in wallet.ont"
        :key="indexWallet"
        :href="itemWallet.href"
        target="_blank"
      >
        <img :src="itemWallet.url" :alt="itemWallet.alt">
      </a>
    </div>
  </section>
</template>

<script>
import { wallet } from './icon.js'

export default {
  name: 'Wallet',
  data() {
    return {
      wallet
    }
  }
}
</script>

<style lang="less" scoped>
.step {
  padding: 0 20px 30px 20px;
  width: 300px;
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  text-align: center;
  .wallet {
    max-width: 250px;
    margin-bottom: 20px;
    a {
      margin: 0 10px 10px 0;
      img {
        width: 48px;
        border-radius: 50%;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      }
    }
  }
  .guide {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 195px;
  }
  .step-title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
