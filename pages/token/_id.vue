<template>
  <layout
    v-model="tabPage"
    :minetoken-token="minetokenToken"
    :minetoken-user="minetokenUser"
    :minetoken-exchange="minetokenExchange"
  >
    <tokenFanCoins v-if="tabPage === 0" />
    <tokenFanCoinsDetail v-if="tabPage === 1" />
    <tokenLiquidity v-if="tabPage === 2" />
    <tokenLiquidityDetail
      v-if="tabPage === 3"
      :token="minetokenToken"
    />
  </layout>
</template>

<script>
// import userPagination from '@/components/user/user_pagination.vue'
// import minetokenCard from '@/components/user/minetoken_card'
import layout from '@/components/token/token_layout.vue'
import tokenFanCoins from '@/components/token/token_fan_coins'
import tokenFanCoinsDetail from '@/components/token/token_fan_coins_detail'
import tokenLiquidity from '@/components/token/token_liquidity'
import tokenLiquidityDetail from '@/components/token/token_liquidity_detail'
import { extractChar } from '@/utils/reg'

export default {
  components: {
    layout,
    tokenFanCoins,
    tokenFanCoinsDetail,
    tokenLiquidity,
    tokenLiquidityDetail
  },
  head() {
    return {
      title: `${this.minetokenToken.symbol}-${this.minetokenToken.name}`,
      meta: [
        { hid: 'description', name: 'description', content: `${this.minetokenToken.brief}` || `${this.minetokenToken.symbol}-${this.minetokenToken.name}` },
        /* <!--  Meta for Twitter Card --> */
        { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: '@Andoromeda' },
        { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: `${this.minetokenToken.symbol}-${this.minetokenToken.name}` },
        { hid: 'twitter:description', name: 'description', property: 'twitter:description', content: `${this.minetokenToken.brief}` || `${this.minetokenToken.symbol}-${this.minetokenToken.name}` },
        { hid: 'twitter:url', name: 'twitter:url', property: 'twitter:url', content: `${process.env.VUE_APP_PC_URL}/token/${this.$route.params.id}` },
        { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: this.$API.getImg(this.minetokenToken.logo) },
        /* <!--  Meta for OpenGraph --> */
        { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: '瞬MATATAKI' },
        { hid: 'og:title', name: 'og:title', property: 'og:title', content: `${this.minetokenToken.symbol}-${this.minetokenToken.name}` },
        { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', name: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_PC_URL}/token/${this.$route.params.id}` },
        { hid: 'og:image', name: 'og:image', property: 'og:image', content: this.$API.getImg(this.minetokenToken.logo) },
        { hid: 'og:description', name: 'description', property: 'og:description', content: `${this.minetokenToken.brief}` || `${this.minetokenToken.symbol}-${this.minetokenToken.name}` }
        /* end */
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css' }
      ]
    }
  },
  data() {
    return {
      tabPage: Number(this.$route.query.tab) || 0,
      minetokenToken: Object.create(null),
      minetokenUser: Object.create(null),
      minetokenExchange: Object.create(null)
    }
  },
  async asyncData({ $axios, route, req }) {
    // 获取cookie token
    let accessToekn = ''
    // 请检查您是否在服务器端
    if (process.server) {
      const cookie = req && req.headers.cookie ? req.headers.cookie : ''
      const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
      accessToekn = token ? token[0] : ''
    }
    const res = await $axios({
      url: `/minetoken/${route.params.id}`,
      methods: 'get',
      headers: { 'x-access-token': accessToekn }
    })

    if (res.code === 0) {
      return {
        minetokenToken: res.data.token || Object.create(null),
        minetokenUser: res.data.user || Object.create(null),
        minetokenExchange: res.data.exchange || Object.create(null)
      }
    } else {
      console.error(res.message)
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
