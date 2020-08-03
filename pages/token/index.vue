<template>
  <div class="token-container">
    <tokenBanner :show-publish-btn="showPublishBtnComputed" />
    <!-- 判断是否已经发币了 -->
    <!-- <tokenBannerFan v-if="!isPublishToken" class="token-banner-fan" /> -->
    <myTokenHeader />
    <!-- 申请的token -->
    <tokenHeaderApplication v-if="minetokenApplicationShow" :info="minetokenApplication" />
    <!-- 登录后显示 -->
    <!-- fan ticket -->
    <div v-if="isLogined" class="c-card">
      <span class="token-title" :class="ticketTab === 0 && 'active'" @click="ticketTab = 0">Fan票夹</span>
      <span class="token-title" :class="ticketTab === 1 && 'active'" @click="ticketTab = 1">我的流动金</span>
      <holdTicket v-if="ticketTab === 0" />
      <holdLiquidity v-if="ticketTab === 1" />
    </div>

    <!-- 登录后显示 -->
    <div v-if="isLogined" class="c-card">
      <span class="token-title" :class="flowTab === 0 && 'active'" @click="flowTab = 0">交易总流水</span>
      <span class="token-title" :class="flowTab === 1 && 'active'" @click="flowTab = 1">流动金总流水</span>
      <tokenTotalTransactionFlow v-if="flowTab === 0" class="token-flow" />
      <liquidityTotalTransactionFlow v-if="flowTab === 1" class="token-flow" />
    </div>

    <!-- 总会显示 -->
    <div class="c-card">
      <span class="ticket-title">全部Fan票</span>
      <tokenList class="mt" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import tokenBanner from '@/components/token_banner.vue'
// import tokenBannerFan from '@/components/token_banner_fan.vue'
import myTokenHeader from '@/components/token/my_token_header.vue'
import tokenHeaderApplication from '@/components/token_page/token_header_application'
import holdTicket from '@/components/hold_ticket.vue'
import holdLiquidity from '@/components/holdliquidity/index.vue'
import tokenList from '@/components/token_list.vue'
import tokenTotalTransactionFlow from '@/components/token_total_transaction_flow.vue'
import liquidityTotalTransactionFlow from '@/components/liquidity_total_transaction_flow.vue'
import { isEmpty } from 'lodash'
export default {
  components: {
    tokenBanner,
    // tokenBannerFan,
    myTokenHeader,
    tokenHeaderApplication,
    holdTicket,
    tokenList,
    holdLiquidity,
    tokenTotalTransactionFlow,
    liquidityTotalTransactionFlow,
  },
  data() {
    return {
      ticketTab: 0,
      flowTab: 0,
      showPublishBtn: false,
      isPublishToken: true, // 是否发行token 默认为 true 没有 banner 体验会好一点
      minetokenApplication: Object.create(null) // 申请信息
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    minetokenApplicationShow() {
      // 如果已经发币了直接返回
      if (this.isPublishToken) {
        return false
      } else {
        let token = this.minetokenApplication
        return !isEmpty(token) && (token.status !== 1)
      }
    },
    showPublishBtnComputed() {
      // 没登录直接显示
      // 登录后判断其他条件
      return !this.isLogined || this.showPublishBtn
    }
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

      // 申请信息
      let resultMinetokenApplication = await this.$utils.factoryRequest(this.$API.apiGetMinetokenApplication())
      if (resultMinetokenApplication) {
        this.minetokenApplication = resultMinetokenApplication.data
      }

      // 如果没有发币则继续往下判断
      if (!this.isPublishToken) {
        // 没有申请 || 或者申请没有提交 &&
        // 没有发币的用户
        if (
          (isEmpty(this.minetokenApplication) || this.minetokenApplication.status === 1) && 
        !this.isPublishToken
        ) {
          this.showPublishBtn = true
        } else {
          this.showPublishBtn = false
        }
      }

 
    },
  }
}
</script>

<style lang="less" scoped>
.token-container {
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

.mt {
  margin-top: 20px;
}
.token-flow {
  margin-top: 10px;
}

</style>