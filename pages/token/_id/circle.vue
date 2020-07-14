<template>
  <div>
    <!-- Fan票基础信息卡片 -->
    <basicInfoHead
      :minetoken-token="minetokenToken"
      :minetoken-user="minetokenUser"
      :minetoken-exchange="minetokenExchange"
      :is-my-token="isMyToken"
      :balance="balance"
      @display-angle="setDisplayAngle"
    />
    <tokenNav :display-angle="displayAngle" />
    <el-row class="token-container">
      <!-- 左侧卡片 -->
      <el-col :span="17">
        <relatedActivities :minetoken-token="minetokenToken" />
        <tokenRelated />
      </el-col>
      <!-- 右侧卡片 -->
      <el-col :span="7">
        <tokenBuyCard
          :token="minetokenToken"
          :current-pool-size="currentPoolSize"
        />
        <tokenJoinFandom
          :token-symbol="minetokenToken.symbol || ''"
          :token-id="Number($route.params.id)"
          :balance="balance"
        />
        <relatedWebsites :resources-websites="resourcesWebsites" />
        <socialAccount :resources-socialss="resourcesSocialss" />
        <widgetCopyBox />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { extractChar } from '@/utils/reg'
import { getCookie } from '@/utils/cookie'
import utils from '@/utils/utils'
import socialTypes from '@/config/social_types'
import { accessTokenAPI } from '@/api/backend'

import basicInfoHead from '@/components/token/basic_info_head'
import tokenNav from '@/components/token/token_nav'
// 左侧
import relatedActivities from '@/components/token/related_activities'
import tokenRelated from '@/components/token/token_related'
// 右侧
import tokenBuyCard from '@/components/token/token_buy_card'
import tokenJoinFandom from '@/components/token/token_join_fandom'
import relatedWebsites from '@/components/token/related_websites'
import socialAccount from '@/components/token/social_account'
import widgetCopyBox from '@/components/token/widget_copy_box'

export default {
  components: {
    basicInfoHead,
    tokenNav,
    // 左侧
    relatedActivities,
    tokenRelated,
    // 右侧
    tokenBuyCard,
    tokenJoinFandom,
    relatedWebsites,
    socialAccount,
    widgetCopyBox
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
    }
  },
  data() {
    return {
      tabPage: Number(this.$route.query.tab) || 0,
      minetokenToken: Object.create(null),
      minetokenUser: Object.create(null),
      minetokenExchange: Object.create(null),
      currentPoolSize: {},
      resourcesWebsites: [],
      resourcesSocialss: [],
      balance: 0,
      isMyToken: false,
      displayAngle: 'client'
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
    if (process.browser) {
      accessToekn = getCookie('ACCESS_TOKEN')
    }

    const res = await $axios({
      url: `/minetoken/${route.params.id}`,
      methods: 'get',
      headers: { 'x-access-token': accessToekn }
    })

    if (res.code !== 0) {
      console.error(res.message)
      return
    }

    let balance = 0
    let isMyToken = false
    if (accessToekn) {
      const { id: userId } = accessTokenAPI.disassemble(accessToekn)
      isMyToken = res.data.token.uid === userId

      const balanceRes = await $axios({
        url: '/minetoken/balance',
        methods: 'get',
        params: {
          tokenId: route.params.id
        },
        headers: { 'x-access-token': accessToekn }
      })
      if (balanceRes.code === 0)
        balance = parseFloat(utils.fromDecimal(balanceRes.data, 4))
      else console.error(balanceRes.message)
    }

    return {
      minetokenToken: res.data.token || Object.create(null),
      minetokenUser: res.data.user || Object.create(null),
      minetokenExchange: res.data.exchange || Object.create(null),
      balance,
      isMyToken,
      displayAngle: 'client'
    }
  },
  created() {
    if (process.browser) {
      this.setWeChatShare()
    }
    this.minetokenGetResources(this.$route.params.id)
    this.getCurrentPoolSize(this.$route.params.id)
  },
  methods: {
    async minetokenGetResources(id) {
      try {
        const res = await this.$API.minetokenGetResources(id)

        if (res.code === 0) {
          const socialFilter = res.data.socials.filter(i =>
            socialTypes.includes(i.type)
          ) // 过滤
          const socialFilterEmpty = socialFilter.filter(i => i.content) // 过滤
          this.resourcesSocialss = socialFilterEmpty
          this.resourcesWebsites = res.data.websites
        } else {
          this.$message({ showClose: true, message: res.message, type: 'success'})
        }
      }
      catch(e) {
        console.error(e)
      }
    },
    // 设置微信分享
    setWeChatShare() {
      this.$wechatShare({
        title: `${this.minetokenToken.symbol}-${this.minetokenToken.name}`,
        desc: this.minetokenToken.brief || '暂无',
        imgUrl: this.minetokenToken.logo ? this.$ossProcess(this.minetokenToken.logo) : ''
      })
    },
    setDisplayAngle(val) {
      this.displayAngle = val
      if(val === 'creator') this.$router.replace({name: 'token-id', params: {id : this.$route.params.id}})
    },
    getCurrentPoolSize(tokenId) {
      this.$API.getCurrentPoolSize(tokenId).then(res => {
        if (res.code === 0) {
          this.currentPoolSize = {
            cny_amount: this.$utils.fromDecimal(res.data.cny_amount, 4),
            token_amount: this.$utils.fromDecimal(res.data.token_amount, 4),
            total_supply: this.$utils.fromDecimal(res.data.total_supply, 4)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.token-container {
  max-width: 1200px;
  width: 100%;
  margin: 20px auto 40px;

  .el-col-17 {
    padding-left: 10px;
    padding-right: 10px;
  }
  .el-col-7 {
    padding-left: 10px;
    padding-right: 10px;
  }
}
// 小于992
@media screen and (max-width: 992px) {
  .token-container {
    .el-col-17 {
      width: 100%;
      margin-bottom: 10px;
    }
    .el-col-7 {
      width: 100%;
    }
  }
}
</style>
