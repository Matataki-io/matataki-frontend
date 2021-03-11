<template>
  <client-only>
    <div class="checklist">
      <h4 class="title">
        {{ $t('environmental-inspection') }}
      </h4>
      <ul class="info-list">
        <li>
          MetaMask: {{ renderIconWithBool(isMetaMaskActive) }}&nbsp;
          {{ $t('wallet-connection') }}: {{ renderIconWithBool(selectedWallet) }}&nbsp;
          {{ $t('network') }}: {{ renderIconWithBool(isOnBsc) }}
          <a 
            v-if="!isOnBsc"
            class="link"
            href="https://www.readblocks.com/archives/32275"
            target="_blank"
            rel="noopener noreferrer"
          >👉{{ $t('guide-to-add-Binance-Smartchain-in-MetaMask') }} ↗️ 👈</a>
          <el-button v-if="!selectedWallet && isMetaMaskActive" @click="requestEtherumAccounts">
            {{ $t('connection') }}
          </el-button>
        </li>
        <li v-if="selectedWallet">
          👛&nbsp;{{ $t('address') }}: <span class="address">{{ selectedWallet }}</span>， {{ $t('balance') }} <b>{{ bnbBalance }}</b> MATIC
        </li>
      </ul>
    </div>
  </client-only>
</template>

<script>
import { ethers, utils } from 'ethers'

export default {
  data: () => ({
    isMetaMaskActive: false,
    isOnBsc: false,
    selectedWallet: null,
    bnbBalance: null
  }),
  computed: {
    // ...mapGetters(['isMe', 'isLogined']),
  },
  async mounted() {
    if (!process.browser) return // NO SSR 
    this.isMetaMaskActive = (typeof window.ethereum !== 'undefined')
    if (!window.ethereum) return
    const { networkVersion, selectedAddress } = window.ethereum 
    this.selectedWallet = selectedAddress
    this.isOnBsc = (137 === Number(networkVersion) || 80001 === Number(networkVersion))
    if (selectedAddress) { this.fetchBNBBalance() }
    window.ethereum.on('chainChanged', chainId => {
      // handle the new network
      this.isOnBsc = (80001 === Number(chainId) || 137 === Number(chainId))
    })
    window.ethereum.on('accountsChanged',  ([ primaryAcc ]) => {
      this.selectedWallet = primaryAcc
      if (primaryAcc) {
        this.fetchBNBBalance()
      } else {
        this.bnbBalance = null
      }
    })
  },
  methods: {
    renderIconWithBool(val) {
      return val ? '✅': '❌'
    },
    async fetchBNBBalance() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum
      )
      const balanceBN = await provider.getBalance(this.selectedWallet)
      this.bnbBalance = utils.formatEther(balanceBN)
    },
    async requestEtherumAccounts() {
      try {
        const [ defaultAccount ] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        this.selectedWallet = defaultAccount
      } catch (error) {
        this.$message.error('对不起，这个操作需要你授权我们访问你的 MetaMask 钱包')
      }
    },
  }
}
</script>

<style lang="less" scoped>
.checklist {
  .title {
    margin: 10px 0;
    padding: 0;
    font-size: 18px;
  }
  .info-list {
    li {
      margin: 8px 0;
      .address {
        font-size: 14px;
    color: #9f9f9f;
    font-weight: 400;
      }
    }
  }
}
</style>