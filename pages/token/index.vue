<template>
  <div class="token">
    <tokenBanner />
    <!-- 判断是否已经发币了 -->
    <tokenBannerFan v-if="!isPublishToken" class="token-banner-fan" />
    <myTokenHeader />
    <!-- 登录后显示 -->
    <!-- fan ticket -->
    <div class="c-card">
      <span class="token-title" :class="ticketTab === 0 && 'active'" @click="ticketTab = 0">Fan票夹</span>
      <span class="token-title" :class="ticketTab === 1 && 'active'" @click="ticketTab = 1">我的流动金</span>
      <holdTicket v-if="ticketTab === 0" />
      <holdLiquidity v-if="ticketTab === 1" />
    </div>

    <!-- 登录后显示 -->
    <div class="c-card">
      <span class="pipeline-title">交易总流水</span>
    </div>
    
    <!-- 总会显示 -->
    <div class="c-card">
      <span class="ticket-title">全部Fan票</span>
      <tokenList />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import tokenBanner from '@/components/token_banner.vue'
import tokenBannerFan from '@/components/token_banner_fan.vue'
import myTokenHeader from '@/components/token/my_token_header.vue'
import holdTicket from '@/components/hold_ticket.vue'
import holdLiquidity from '@/components/holdliquidity/index.vue'
import tokenList from '@/components/token_list.vue'

export default {
  components: {
    tokenBanner,
    tokenBannerFan,
    myTokenHeader,
    holdTicket,
    tokenList,
    holdLiquidity
  },
  data() {
    return {
      ticketTab: 0,
      isPublishToken: true, // 是否发行token 默认为 true 没有 banner 体验会好一点
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
  },
  watch: {
    isLogined() {
      this.getTokenUserData()
    }
  },
  created() {
    if (process.browser) {
      if (this.isLogined) {
        this.getTokenUserData()
      }
    }
  },
  methods: {
    // 获取 token user 的信息
    async getTokenUserData() {
      const userResult = await this.$utils.factoryRequest(this.$API.tokenUserId(this.currentUserInfo.id))
      if (userResult) {
        this.isPublishToken = !!userResult.data // 没有信息是 null
      }
    }
  }
}
</script>

<style lang="less">
.token {
  max-width: 1200px;
  width: 100%;
  margin: 40px auto 0;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}

.token-banner-fan {
  margin-top: 40px;
}
.token-title {
  font-size: 20px;
  font-weight: 500;
  color: #B2B2B2;
  line-height: 28px;
  padding: 0;
  margin: 0 40px 0 0;
  cursor: pointer;
  &:nth-last-of-type(1) {
    margin-right: 0;
  }
  &.active {
    color: #000;
  }
}
.pipeline-title,
.ticket-title {
  font-size:20px;
  font-weight:500;
  color:rgba(0,0,0,1);
  line-height:28px;
  padding: 0;
  margin: 0;
}

.c-card {
  padding: 20px;
  margin: 20px 0;
}


</style>