<template>
  <settingLayout>
    <NoTokenTip v-if="NoToken" />
    <div v-else class="trade-setting">
      <a href="https://www.yuque.com/matataki/matataki">{{ $t('fan-ticket-user-manual') }} ></a>
      <div v-loading="loading" class="form-container">
        <el-form 
          v-if="NoMarket" 
          :model="form" 
          label-position="top" 
          label-width="80px"
        >
          <el-form-item label="单价">
            <el-input v-model="form.price" :placeholder="$t('enter-the-unit-price-of-your-fan-ticket')" class="trade-setting-input" />
            <el-button type="primary" class="trade-setting-btn" @click="create">
              {{ $t('setting') }}
            </el-button>
            <span class="price-setting-tip">* {{ $t('the-price-cannot-be-modified-after-setting') }}</span>
          </el-form-item>
        </el-form>
        <div v-else>
          <div class="token-trade-disabled">
            <span class="trade-setting-label">{{ $t('through-train-sales-function') }}</span>
            <el-switch v-model="form.enabled" @change="changeStatus" />
          </div>
          <ul class="token-trade-info">
            <li>
              <span class="trade-setting-label black">{{ $t('price') }}：</span>
              <span class="trade-setting-num">{{ market.price }}</span> 
              <span class="trade-setting-symbol">CNY/{{ market.symbol }}</span> 
            </li>
            <li v-if="market.amount > 0">
              <span class="trade-setting-label black">{{ $t('for-sale') }}：</span>
              <span class="trade-setting-num">{{ market.restAmount }}</span> <span class="trade-setting-div">/</span> <span class="trade-setting-num gray">{{ market.amount }}</span>
              <span class="trade-setting-symbol">{{ market.symbol }}</span> 
            </li>
          </ul>
          <div>
            <el-input v-model="form.amount" :placeholder="$t('input-quantity')" class="trade-setting-input" />
            <el-button 
              type="primary" 
              class="trade-setting-btn" 
              :disabled="!form.enabled" 
              @click="updateAmount"
            >
              {{ $t('transfer-now') }}
            </el-button>
            <p class="balance-tip">{{ $t('available-balance') }} {{ tokenBalance }} {{ market.symbol }}</p>
          </div>
        </div>
      </div>
      <el-divider class="colla-splitline" />
      <p class="colla-help">
        {{ $t('what-is-a-through-train') }}： <br>
        {{ $t('in-addition-to-the-fan-ticket-sales-channels-outside-the-exchange-you-set-the-direct-purchase-price') }}  <br>
        1. {{ $t('fan-tickets-in-the-through-train-are-automatically-sold-at-the-price-set-by-the-issuer') }}  <br>
        2. {{ $t('the-sales-revenue-will-go-directly-to-the-issuers-account-balance') }}  <br>
        3. {{ $t('the-through-train-function-is-only-responsible-for-fan-ticket-sales-not-for-repurchase-or-destruction') }}  <br>
        <br>
        {{ $t('through-train-transfer-to-fan-ticket') }}：  <br>
        1. {{ $t('issuers-can-recharge-their-own-fan-tickets-into-the-through-train-for-sale-at-any-time') }}  <br>
        2. {{ $t('the-issuer-cannot-directly-retrieve-the-transferred-fan-ticket-from-the-through-train') }}  <br>
      </p>
    </div>
  </settingLayout>
</template>

<script>
import settingLayout from '@/components/token/liquidity_setting.vue'
import NoTokenTip from '@/components/NoTokenTip.vue'

export default {
  components: {
    settingLayout,
    NoTokenTip
  },
  data() {
    return {
      loading: true,
      form: {
        price: null,
        enabled: true,
        amount: null
      },
      NoToken: false,
      NoMarket: true,
      market: {
        price: 0, // 价格
        amount: 0, // 总量
        restAmount: 0, // 剩余量
        symbol: ''
      },
      tokenBalance: 0
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getItem()
  },
  methods: {
    async getItem() {
      this.loading = true
      const result = await this.$API.directTrade.getItemByUser()
      this.loading = false
      const code = result.code
      // get item success
      if (code === 0) {
        this.NoToken = false
        this.NoMarket = false
        const market = result.data
        this.market = {
          price: this.$utils.fromDecimal(market.price), // 价格
          amount: this.$utils.fromDecimal(market.amount), // 总量
          restAmount: this.$utils.fromDecimal(market.balance), // 剩余量
          symbol: market.symbol
        }
        this.form.enabled = !market.status
        this.getUserBalance(market.token_id)
      }
      // token not exist
      if (code === 10802) {
        this.NoToken = true
        this.NoMarket = true
      }
      // market not exist
      if (code === 11300) {
        this.NoToken = false
        this.NoMarket = true
      }
    },
    async getUserBalance(tokenId) {
      const result = await this.$API.getUserBalance(tokenId)
      this.tokenBalance =  this.$utils.fromDecimal(result.data)
    },
    async create() {
      if (parseFloat(this.form.price) <= 0) {
        this.$message.warning('请输入大于0的数字！')
      }
      const price = this.$utils.toDecimal(this.form.price)
      this.loading = true
      await this.$API.directTrade.create(price)
      this.resetForm()
      this.loading = false
      this.getItem()
    },
    async changeStatus(v) {
      let enabled = 1
      if (v === true) {
        enabled = 0
      } else {
        enabled = 1
      }
      await this.$API.directTrade.set({
        enabled
      })
    },
    async updateAmount() {
      if (parseFloat(this.form.amount) <= 0) {
        this.$message.warning('请输入大于0的数字！')
      }
      if (parseFloat(this.form.amount) > this.tokenBalance) {
        this.$message.warning('余额不足！')
      }
      const amount = this.$utils.toDecimal(this.form.amount)
      this.loading = true
      await this.$API.directTrade.set({
        amount
      })
      await this.getItem()
      this.resetForm()
      this.loading = false
    },
    resetForm() {
      this.form.price = null
      this.form.amount = null
    }
  }
}
</script>

<style lang="less" scoped>
.trade-setting {
  a {
    columns: #542DE0;
  }
  .form-container {
    max-width: 500px;
    margin-top: 20px;
  }
  .price-setting-tip {
    font-size: 12px;
    color: #FB6877;
    margin-left: 10px;
  }
  &-label {
    font-size: 14px;
    color: #333333;
    line-height: 40px;
    margin-right: 10px;
  }
  &-num {
    font-size: 30px;
    font-weight: bolder;
    color: #000000;
  }
  &-symbol {
    font-size: 14px;
    color: #B2B2B2;
  }
  &-div {
    font-size: 30px;
    font-weight: 100;
  }
  .black {
    color: #000000;
  }
  .gray {
    color: #B2B2B2;
  }
  .token-trade-disabled {
    margin-bottom: 10px;
  }
  .token-trade-info {
    li {
      margin-bottom: 10px;
    }
  }
  .balance-tip {
    font-size: 12px;
    color: #B2B2B2;
  }
}
.colla-add {
  display: flex;
  max-width: 340px;
  button {
    margin-left: 20px;
    height: 40px;
    width: 120px;
  }
}
.colla-splitline {
  max-width: 500px;
}
.colla-help {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
}
// <440
@media screen and (max-width: 550px) {
  .price-setting-tip {
    display: block;
  }
}
</style>
<style lang="less">
.trade-setting {
  .form-container {
    .el-input {
      width: auto;
    }
    .trade-setting-input {
      margin-right: 20px;
    }
    .trade-setting-btn {
      width: 100px;
    }
  }
}
</style>
