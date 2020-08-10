<template>
  <div
    v-loading="lockLoading"
    class="lock"
  >
    <div class="lock-left">
      <img
        v-if="!hasPaied"
        class="lock-img"
        src="@/assets/img/lock.png"
        alt="lock"
      >
      <img
        v-else
        class="lock-img"
        src="@/assets/img/unlock.png"
        alt="lock"
      >
    </div>
    <div class="lock-info">
      <h3 class="lock-info-title">
        {{ !hasPaied ? unlockText + $t('paidRead.article') : $t('paidRead.already') + unlockText + $t('paidRead.article') }}
      </h3>
      <h5 class="lock-info-subtitle">
        {{ !hasPaied ? $t('paidRead.needToReach') : $t('paidRead.hasBeenReached') }}
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('paidRead.meetAllConditions') "
          placement="top-start"
        >
          <svg-icon
            icon-class="anser"
            class="prompt-svg"
          />
        </el-tooltip>
      </h5>
      <p
        v-if="!isMe(article.uid)"
        class="lock-info-des"
      >
        <ul>
          <li
            v-if="isPriceArticle"
            class="fl"
          >
            <div class="fl price">
              {{ $t('paidRead.pay') }}
              <span class="amount">{{ getArticlePrice }}</span>
              <template v-if="getPayToken.token_id !== 0">
                <router-link
                  :to="{name: 'token-id', params:{ id:getPayToken.token_id }}"
                  target="_blank"
                  class="fl"
                >
                  <avatar
                    :size="'16px'"
                    :src="$API.getImg(getPayToken.logo)"
                    class="avatar-token"
                  />
                  {{ getPayToken.symbol }} <template v-if="getPayToken.name">（{{ getPayToken.name }}）</template>
                </router-link>
              </template>
              <template v-else>
                <svg-icon
                  icon-class="currency"
                  class="avatar-cny"
                />
                {{ getPayToken.symbol }}
              </template>
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('paidRead.purchaseHistory')"
              placement="left"
            >
              <svg-icon icon-class="anser" />
            </el-tooltip>
          </li>
          <li
            v-if="isTokenArticle"
            class="fl"
          >
            <div class="fl price">
              {{ $t('paidRead.hold') }}
              <span class="amount">{{ needTokenAmount }}</span>
              <router-link
                :to="{name: 'token-id', params:{ id:needTokenId }}"
                target="_blank"
                class="fl"
              >
                <avatar
                  :size="'16px'"
                  :src="needTokenLogo"
                  class="avatar-token"
                />
                {{ needTokenSymbol }}（{{ needTokenName }}）
              </router-link>
            </div>
            <!-- 不显示 - 号 -->
            <span> {{ !tokenHasPaied ? $t('paidRead.stillNeedToHold') : $t('paidRead.alreadyHeld') }}{{ isLogined ? differenceToken.slice(1) : needTokenAmount }} {{ needTokenSymbol }}</span>
          </li>
        </ul>
      </p>
      <p
        v-else
        class="lock-info-des"
      >
        {{ $t('paidRead.myArticles') }}
      </p>
      <div
        v-if="!hasPaied"
        class="lock-bottom"
      >
        <!-- <span class="lock-bottom-total">{{ $t('paidRead.totalAbout') + totalCny }}CNY</span> -->
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('paidRead.tounlockThisArticle')"
          placement="top-end"
        >
          <el-button
            type="primary"
            size="small"
            @click="wxpayArticle"
          >
            {{ $t('paidRead.oneKey') + unlockText }}
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BigNumber from 'bignumber.js'
import { CNY } from '@/components/exchange/consts.js'

export default {
  name: 'ExsModal',
  props: {
    // 文章数据
    article: {
      type: Object,
      required: true
    },
    // 是否已解锁（购买）编辑权限
    hasPaied: {
      type: Boolean,
      default: false
    },
    // 是否已解锁（购买）编辑权限
    tokenHasPaied: {
      type: Boolean,
      default: false
    },
    priceHasPaied: {
      type: Boolean,
      default: false
    },
    lockLoading: {
      type: Boolean,
      default: false
    },
    differenceToken: {
      type: String,
      default: '0'
    },
    form: {
      type: Object,
      required: true
    },
    inputAmountError: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      copyForm: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      showExs: false
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    unlockText() {
      if (this.isPriceArticle) {
        return this.$t('p.buy')
      }
      return this.$t('p.unlock')
    },
    getArticlePrice() {
      if (this.isPriceArticle) {
        const ad = this.article.prices[0]
        return this.$utils.fromDecimal(ad.price)
      } else {
        return 0
      }
    },
    getPayToken() {
      if (this.isPriceArticle) {
        const ad = this.article.prices[0]
        return ad
      } else {
        return {}
      }
    },
    // 是否是付费文章
    isPriceArticle() {
      return (this.article.prices && this.article.prices.length !== 0)
    },
    // 是否是持通证文章
    isTokenArticle() {
      return (this.article.tokens && this.article.tokens.length !== 0)
    },
    // 需要多少Fan票
    needTokenAmount() {
      if (this.article.tokens.length !== 0) {
        return this.$utils.fromDecimal(this.article.tokens[0].amount)
      } else return 0
    },
    needTokenId() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].id
      } else return -1
    },
    // 需要多少Fan票代号
    needTokenSymbol() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].symbol
      } else return ''
    },
    // 需要多少Fan票名称
    needTokenName() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].name
      } else return ''
    },
    // 需要多少Fan票LOGO
    needTokenLogo() {
      if (this.article.tokens.length !== 0) {
        return this.$ossProcess(this.article.tokens[0].logo)
      } else return ''
    },
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    async wxpayArticle() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      if (this.inputAmountError) {
        this.$message.error(this.inputAmountError)
        return
      }
      // 如果是付币阅读的文章
      if (this.isPriceArticle && !this.priceHasPaied && this.getPayToken.token_id !== 0) {
        await this.handlePayToken()
      } else {
        this.createOrder()
      }
    },
    async handlePayToken() {
      // 判断余额，余额不足->去创建买币订单，余额足->直接支付
      const {
        decimals,
        logo,
        token_id: id,
        name,
        symbol
      } = this.article.prices[0]
      this.form.outputToken = {
        decimals,
        id,
        logo,
        name,
        symbol
      }
      const needPay = this.getArticlePrice
      // 查看余额
      const res = await this.$API.getUserBalance(id)
      const balance = this.$utils.fromDecimal(res.data, decimals)
      // 余额不足，去创建买币订单
      if (balance < needPay) {
        const _needPay = new BigNumber(needPay)
        this.form.output = parseFloat(_needPay.minus(balance).toString())
        this.createOrder()
      } else { // 余额足，直接支付
        this.form.output = 0
        this.$alert('是否直接支付？', '余额充足', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              this.payTokenToArticle()
            }
          }
        })
      }
      console.log('balance', balance, 'this.form.output', this.form.output)
    },
    async createOrder(nt, np, _form) {
      let needToken = nt === undefined ? false : nt
      let needPrice = np === undefined ? false : np
      if (nt === undefined) {
        // 是持币阅读文章 或者 是需要买币阅读（非cny）
        if ((this.isTokenArticle && !this.tokenHasPaied) || this.getPayToken.token_id !== 0) {
          needToken = true
        }
      }
      if (np === undefined) {
        if (this.isPriceArticle && !this.priceHasPaied && this.getPayToken.token_id === 0) {
          needPrice = true
        }
      }
      if (_form === undefined) {
        this.copyForm = {
          input: this.form.input,
          inputToken: Object.assign({}, this.form.inputToken),
          output: this.form.output,
          outputToken: Object.assign({}, this.form.outputToken),
        }
      } else {
        this.copyForm = _form
      }
      if (needPrice) {
        // type这个字段不重要，可以去除
        this.$store.dispatch('order/createOrder', {
          ...this.copyForm,
          needToken,
          needPrice,
          signId: this.article.id
        })
      } else {
        this.showExs = true
      }
    },
    // 直接支付token
    async payTokenToArticle() {
      const loading = this.$loading({
        lock: false,
        text: '购买中',
        background: 'rgba(0, 0, 0, 0.4)'
      })
      this.$API.payTokenToArticle({
        pid: this.article.id
      })
        .then(res => {
          loading.close()
          if (res.code === 0) {
            window.location.reload()
          } else {
            this.$message({
              showClose: true,
              message: res.message || '支付失败，请刷新页面重试',
              type: 'error'
            })
          }
        })
    },
  }
}
</script>

<style lang="less" scoped>
</style>