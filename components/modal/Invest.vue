<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    width="400px"
    :lock-scroll="false"
    custom-class="br10"
  >
    <div class="buy-product-modal">
      <h1 class="title">
        {{ article.title }}
      </h1>
      <div class="invest-info">
        <div class="info-item">
          <span class="info-number">{{ article.fission_factor / 1000 }}</span>
          <span class="info-subtitle">裂变系数</span>
        </div>
        <div class="info-item">
          <span class="info-number percent">{{ article.fission_rate }}</span>
          <span class="info-subtitle">裂变返利</span>
        </div>
        <div class="info-item">
          <span class="info-number percent">{{ article.referral_rate }}</span>
          <span class="info-subtitle">推荐返利</span>
        </div>
      </div>
      <el-input
        v-model="amount"
        :placeholder="`请输入投资金额`"
        class="comment-container"
        @input="handleChange(amount)"
      />
      <el-input
        v-model="comment"
        type="textarea"
        class="comment-container"
        :rows="4"
        placeholder="请输入您的留言"
      />
      <div class="invest-container">
        <div class="invest-btn" @click="investProduct">
          投资
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex'
import { ontAddressVerify } from '@/utils/reg'
const RewardStatus = {
  // 0=加载中,1=未打赏 2=已打赏, -1未登录
  NOT_LOGGINED: -1,
  LOADING: 0,
  NOT_REWARD_YET: 1,
  REWARDED: 2
}
export default {
  name: 'InvestModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    article: {
      type: Object,
      default: () => ({
        title: '',
        fission_factor: '',
        fission_rate: '',
        referral_rate: '',
        id: 1,
        prices: 0
      })
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    }
  },
  data() {
    return {
      showModal: false,
      amount: '',
      comment: ''
    }
  },
  components: {},
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe'])
  },
  methods: {
    ...mapActions(['makeShare', 'makeOrder']),
    handleChange(amount) {
      let amountValue = amount
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'EOS') {
        // 小数点后三位 如果后面需要解除限制修改正则  {0,3}
        amountValue = amountValue.match(/^\d*(\.?\d{0,3})/g)[0] || null
      } else if (idProvider === 'ONT') {
        amountValue = amountValue.match(/^\d*/g)[0] || null
      }
      this.amount = amountValue
    },
    investProduct() {
      this.support(() => {
        this.showModal = false
      })
    },
    async support(done) {
      let action_text = '投资'
      const { article, comment } = this
      const signId = this.article.id
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'GitHub') return
      // 默认 ‘’ 转成了 NAN
      const amount = this.amount === '' ? 0 : parseFloat(this.amount)
      // 检查金额是否符合
      let checkPricesMatch = true

      // 检查价格
      const checkPrices = (prices, range, message) => {
        if (prices < range) {
          this.$message(message)
          return false
        }
        return true
      }
      // 文章投资金额
      const minimumAmount = idProvider => {
        if (idProvider === 'EOS') return 0.01
        if (idProvider === 'ONT') return 1
      }
      checkPricesMatch = checkPrices(
        amount,
        minimumAmount(idProvider),
        `请输入正确的金额 最小${action_text}金额为 ${minimumAmount(idProvider)} ${idProvider}`
      )
      if (!checkPricesMatch) return done(false)

      // 检查商品价格
      const checkCommodityPrices = () => {
        const filterBlockchain = this.findBlockchain(article.prices, idProvider)
        if (filterBlockchain.length !== 0) {
          const { symbol, price, decimals } = filterBlockchain[0]
          // exponentiation operator (**)
          if (symbol === 'EOS')
            checkPricesMatch = checkPrices(
              amount,
              price / 10 ** decimals,
              `${action_text}金额不能小于商品价格`
            )
          else if (symbol === 'ONT')
            checkPricesMatch = checkPrices(
              amount,
              price / 10 ** decimals,
              `${action_text}金额不能小于商品价格`
            )
        }
      }

      // 文章是商品判断价格
      // if (article.channel_id === 2) checkCommodityPrices();
      if (!checkPricesMatch) return done(false)

      const toSponsor = async idOrName => {
        if (!idOrName) return { id: null, username: null }
        if (/^(0|[1-9][0-9]*)$/.test(idOrName)) {
          try {
            const id = idOrName
            const { status, data } = await this.$backendAPI.getUser({ id })
            if (status === 200 && data.code === 0) return { id, username: data.data.username }
          } catch (error) {
            console.error(error)
          }
        }
        return { id: null, username: idOrName }
      }

      let sponsor = await toSponsor(this.getInvite)
      // 需要先登录
      // await this.$store.dispatch('signIn', {})
      try {
        this.isSupported = RewardStatus.LOADING
        // 如果是ONT true 如果是 EOS或者其他 false
        const isOntAddressVerify = ontAddressVerify(sponsor.username)
        // 如果是EOS账户投资 但是邀请人是ONT用户 则认为没有邀请
        if (idProvider === 'EOS' && isOntAddressVerify) sponsor = { id: null, username: null }
        // 如果是ONT账户投资 但是邀请人EOS账户 则认为没有邀请
        else if (idProvider === 'ONT' && !isOntAddressVerify) sponsor = { id: null, username: null }

        await this.makeShare({ amount, signId, sponsor, comment })
        this.isSupported = RewardStatus.REWARDED // 按钮状态
        this.$message.success(`${action_text}成功！`)
        this.$emit('investDone')
        done()
      } catch (error) {
        console.error(error)
        this.isSupported = RewardStatus.NOT_REWARD_YET
        this.$message.error(`${action_text}失败，可能是由于网络故障或账户余额不足等原因。`)
        done(false)
      }
    }
  }
}
</script>

<style scoped lang="less">
.invest-info {
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .info-number {
      font-weight: 700;
      font-size: 30px;
      color: #1C9CFE;
      line-height: 30px;
      &:after {
        content: ' ';
        font-size: 14px;
        font-weight: 400;
      }
    }
    .percent:after {
      content: '%';
      font-size: 14px;
      font-weight: 400;
    }
    .info-subtitle {
      font-size: 14px;
      line-height: 20px;
      color: #000;
    }
  }
}
.invest-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .invest-btn {
    border-radius: 6px;
    text-align: center;
    background: #000000;
    width: 75px;
    height: 30px;
    line-height: 30px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }
}
.buy-product-modal {
  width: 320px;
  border-radius: 10px;
  color: #000;
  margin: auto;
  .title {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cover {
      width: 120px;
      height: 60px;
      border-radius: 6px;
      object-fit: cover;
      margin-right: 10px;
    }
    .info-inner {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      .product-price {
        color: #F7B500;
        font-size: 18px;
        font-weight: 700;
        line-height: 28px;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .ont-price {
          display: flex;
          align-items: center;
          margin-right: 10px;
          img {
            margin-right: 5px;
          }
        }
        .eos-price {
          display: flex;
          align-items: center;
          img {
            margin-right: 5px;
          }
        }
      }
      .product-amount {
        font-size: 14px;
        display: flex;
        align-items: center;
        >span {
          margin-right: 10px;
        }
      }
    }
  }
  .comment-container {
    background: #F1F1F1;
    margin: 20px 0;
    border-radius: 8px;
  }
  .buy-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .storage {
      color: #B2B2B2;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
    .buy-btn {
      border-radius: 6px;
      text-align: center;
      background: #000000;
      width: 75px;
      height: 30px;
      line-height: 30px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
  }
  .tip {
    line-height: 20px;
    font-size: 14px;
    color: #000000;
  }
}
</style>
