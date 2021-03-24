<template>
  <settingLayout>
    <div v-loading="loading" class="cross-chain-settings">
      <h2 v-if="tokenData.bsc_contract_address || tokenData.matic_contract_address" class="subtitle">已经跨链 Fan 票</h2>
      <div v-if="!tokenData" class="loading">
        Loading
      </div>
      <div v-else class="deployed-crosschain">
        <crosschainCard v-if="tokenData.bsc_contract_address" :chain-detail="bscDetail" :token-address="tokenData.bsc_contract_address" />
        <crosschainCard v-if="tokenData.matic_contract_address" :chain-detail="maticDetail" :token-address="tokenData.matic_contract_address" />
      </div>
      <div v-if="tokenData.id" class="not-deployed">
        <h2 class="subtitle">创建跨链 Fan 票</h2>
        <EnvironmentCheck />
        <crosschainDeploy v-if="!tokenData.bsc_contract_address" :chain-detail="bscDetail" :token-id="tokenData.id" />
        <crosschainDeploy v-if="!tokenData.matic_contract_address" :chain-detail="maticDetail" :token-id="tokenData.id" />
      </div>
    </div>
  </settingLayout>
</template>

<script>
import { getCookie } from '@/utils/cookie'
import settingLayout from '@/components/token/setting_layout.vue'
import EnvironmentCheck from '@/components/EnvironmentCheck.vue'
import crosschainCard from '@/components/token/crosschain_card.vue'
import crosschainDeploy from '@/components/token/crosschain_deploy.vue'

export default {
  components: {
    settingLayout,
    crosschainDeploy,
    EnvironmentCheck,
    crosschainCard,
  },
  data() {
    return {
      tokenData: {
        bsc_contract_address: null,
        matic_contract_address: null
      },
      bscDetail: {
        name: 'BSC',
        tag: 'bsc',
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB8c77482e45F1F44dE1745F52C74426C631bDD52/logo.png'
      },
      maticDetail: {
        name: 'Polygon (Matic)',
        tag: 'matic',
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/matic/info/logo.png'
      },
      loading: false
    }
  },
  computed: {
  },
  watch: {
  },
  async mounted() {
    if (!getCookie('ACCESS_TOKEN')) {
      this.$router.go(-1)
      return
    }
    this.getTokenData()
  },
  methods: {
    async getTokenData() {
      this.loading = true
      try {
        const { data } = await this.$API.tokenDetail()
        console.info('getTokenData', data)
        if (!data.token) return this.$router.go(-1)

        this.tokenData = data.token
      } catch (e) {
        console.log('e', e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cross-chain-settings {
  min-height: 300px;
}
.subtitle {
  padding: 0;
  margin: 20px 0;
  color: #333;
  font-size: 24px;
}
</style>
