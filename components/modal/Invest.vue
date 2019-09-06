<template>
  <el-dialog
    v-loading="loading"
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
import { toPrecision } from '@/utils/precisionConversion'

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
      comment: '',
      loading: false
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
      let idProviderLower = this.currentUserInfo.idProvider.toLocaleLowerCase()

      if (idProviderLower === 'eos') {
        // 小数点后三位 如果后面需要解除限制修改正则  {0,3}
        amountValue = amountValue.match(/^\d*(\.?\d{0,3})/g)[0] || null
      } else if (idProviderLower === 'ont' || idProviderLower === 'vnt') {
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
      let idProviderLower = this.currentUserInfo.idProvider.toLocaleLowerCase()


      if (this.$publishMethods.invalidId(idProvider)) return this.$message.warning(`${idProvider}账号暂不支持`)

      // 默认 ‘’ 转成了 NAN
      const amount = this.amount === '' ? 0 : parseFloat(this.amount)
      // 检查金额是否符合
      let checkPricesMatch = true

      // 检查价格
      const checkPrices = (prices, range, message) => {
        if (prices < range) {
          this.$message.warning(message)
          return false
        }
        return true
      }
      // 文章投资金额
      const minimumAmount = idProvider => {
        let idProviderLower = idProvider.toLocaleLowerCase()
        if (idProviderLower === 'eos') return 0.01
        if (idProviderLower === 'ont') return 1
        if (idProviderLower === 'vnt') return 1
      }
      checkPricesMatch = checkPrices(
        amount,
        minimumAmount(idProvider),
        `请输入正确的金额 最小${action_text}金额为 ${minimumAmount(idProvider)} ${idProvider}`
      )
      if (!checkPricesMatch) return

      // 检查商品价格
      // const checkCommodityPrices = () => {
      //   const filterBlockchain = this.findBlockchain(article.prices, idProvider)
      //   if (filterBlockchain.length !== 0) {
      //     const { symbol, price, decimals } = filterBlockchain[0]
      //     // exponentiation operator (**)
      //     if (symbol === 'EOS')
      //       checkPricesMatch = checkPrices(
      //         amount,
      //         price / 10 ** decimals,
      //         `${action_text}金额不能小于商品价格`
      //       )
      //     else if (symbol === 'ONT')
      //       checkPricesMatch = checkPrices(
      //         amount,
      //         price / 10 ** decimals,
      //         `${action_text}金额不能小于商品价格`
      //       )
      //   }
      // }

      // 文章是商品判断价格
      // if (article.channel_id === 2) checkCommodityPrices();
      // if (!checkPricesMatch) return done(false)

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
      try {
        // 如果是ONT true 如果是 EOS或者其他 false
        const isOntAddressVerify = ontAddressVerify(sponsor.username)
        // 如果是EOS账户投资 但是邀请人是ONT用户 则认为没有邀请
        if (idProviderLower === 'eos' && isOntAddressVerify) sponsor = { id: null, username: null }
        // 如果是ONT账户投资 但是邀请人EOS账户 则认为没有邀请
        else if (idProviderLower === 'ont' && !isOntAddressVerify) sponsor = { id: null, username: null }
        else if (idProviderLower === 'vnt') sponsor = { id: null, username: null } // getInvite 都没有东西 邀请失效, 购买商品也一样 TODO !!!

        this.loading = true
        // 暂时同步商品购买, vnt走下面 其他默认没修改
        if (idProviderLower === 'vnt') {
          const faild = error => {
            this.loading = false
            this.$message.closeAll()
            this.$message.error(error.toString())
          }
          try {
            let hash = ''
            // 提交订单hash
            const postOrderHah = async supportId => {
              let params = {
                supportId: supportId,
                txhash: hash,
              }
              await this.$API.supportSaveHash(params)
                .then(res => {
                  if (res.code === 0) {
                    this.loading = false
                    this.$message.closeAll()
                    this.$message.success('购买成功')
                    this.showModal = false
                  } else {
                    console.log('购买商品失败 提交hash')
                    reject(new Error('购买商品失败'))
                  }
                })
                .catch(err => {
                  console.log('购买商品失败 提交hash err')
                    reject(new Error('购买商品失败'))
                })
            }

            const postSupport = async () => {
              let params = {
                signId: signId,
                amount: toPrecision(amount, idProviderLower),
                comment: comment
              }
              if (sponsor.id) {
                Object.assign(params, {
                  referrer: sponsor.id,
                })
              }
              await this.$API.support(params)
                .then(res => {
                  if (res.code === 0) {
                    postOrderHah(res.data.supportId)
                  }
                  else faild('购买商品失败 创建订单失败')
                }).catch(err => {
                  faild('购买商品失败')
                })
            }
            // 转账
            const transaction = async () => {
              let data = { // 交易数据
                data: `sid:${signId}`,
                value: amount
              }
              try {
                let res = await this.$store.dispatch('vnt/sendTransaction', data)
                hash = res
                postSupport()
              } catch (error) {
                faild(error)
              }
            }

            transaction()

          } catch (error) {
            faild(error)
          }
        } else {
          this.loading = false
          await this.makeShare({ amount, signId, sponsor, comment })
          this.$message.success(`${action_text}成功！`)
          this.$emit('investDone')
          done()
        }


      } catch (error) {
        this.loading = false
        console.error(error)
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
      color: @purpleDark;
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
