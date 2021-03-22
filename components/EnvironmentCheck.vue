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
          {{ '现在 Metamask 的网络' }}: {{ getCurrentNetworkNameById }}

          <el-button v-if="!selectedWallet && isMetaMaskActive" @click="requestEtherumAccounts">
            {{ $t('connection') }}
          </el-button>
        </li>
        <li v-if="selectedWallet">
          👛&nbsp;{{ $t('address') }}: <span class="address">{{ selectedWallet }}</span>， {{ $t('balance') }} <b>{{ bnbBalance }}</b> {{ getCurrentNetworkTokenName }}
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
    currentChainId: -1,
    selectedWallet: null,
    bnbBalance: null
  }),
  computed: {
    getCurrentNetworkNameById() {
      return this.getNetworkNameById(this.currentChainId)
    },
    getCurrentNetworkTokenName() {
      return this.getNetworkTokenById(this.currentChainId)
    },
  },
  async mounted() {
    if (!process.browser) return // NO SSR 
    this.isMetaMaskActive = (typeof window.ethereum !== 'undefined')
    if (!window.ethereum) return
    const { networkVersion, selectedAddress } = window.ethereum 
    this.selectedWallet = selectedAddress
    this.currentChainId = parseInt(networkVersion)
    if (selectedAddress) { this.fetchBNBBalance() }
    window.ethereum.on('chainChanged', chainId => {
      // handle the new network
      this.currentChainId = parseInt(chainId)
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
    getNetworkNameById(id) {
      switch(id) {
        case -1: return 'Loading'
        case 1: return 'Ethereum Mainnet'
        case 56: return 'BSC Mainnet'
        case 137: return 'Polygon(Matic) Mainnet'
        case 80001: return 'Polygon(Matic) Testnet'
        case 97: return 'BSC Testnet'
        default: return `Chain ID ${this.network}`
      }
    },
    getNetworkTokenById(id) {
      switch(id) {
        case -1: return 'Loading'
        case 1: return 'ETH'
        case 56: return 'BNB'
        case 137: return 'Matic'
        case 80001: return 'Matic'
        case 97: return 'BNB'
        default: return 'Unknown Native Token'
      }
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