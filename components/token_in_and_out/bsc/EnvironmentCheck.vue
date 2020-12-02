<template>
  <client-only>
    <div class="checklist">
      <h4>环境检查</h4>
      <ul>
        <li> 
          MetaMask: {{ renderIconWithBool(isMetaMaskActive) }}，
          钱包连接: {{ renderIconWithBool(selectedWallet) }}，
          网络: {{ renderIconWithBool(isOnBsc) }} 
          <a 
            v-if="!isOnBsc"
            class="link"
            href="https://www.readblocks.com/archives/32275"
            target="_blank"
            rel="noopener noreferrer"
          >👉在 MetaMask 添加币安智能链的指南 ↗️ 👈</a>
          <el-button v-if="!selectedWallet && isMetaMaskActive" @click="requestEtherumAccounts">
            连接
          </el-button>
        </li>
        <li v-if="selectedWallet">
          👛地址: <code>{{ selectedWallet }}</code>， 余额 <code>{{ bnbBalance }}</code> BNB
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
    this.isOnBsc = (56 === Number(networkVersion) || 97 === Number(networkVersion))
    if (selectedAddress) { this.fetchBNBBalance() }
    window.ethereum.on('chainChanged', chainId => {
      // handle the new network
      this.isOnBsc = (56 === Number(chainId) || 97 === Number(chainId))
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
      return val ? '☑️': '✖️'
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