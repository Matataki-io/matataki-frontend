<template>
  <el-dialog :visible.sync="showModal" :lock-scroll="false" width="400px" custom-class="br10">
    <div class="buy-product-modal">
      <h1 class="title">
        {{ $t('p.buyShop') }}
      </h1>
      <div class="info-container">
        <img :src="article.cover" alt="cover" class="cover">
        <div class="info-inner">
          <div class="product-price">
            <span class="type-price">
              <svg-icon icon-class="ont" />
              <span>{{ product.ontPrice }}</span>
            </span>
            <span class="type-price">
              <svg-icon icon-class="eos" />
              <span>{{ product.eosPrice }}</span>
            </span>
            <span class="type-price">
              <svg-icon icon-class="vnt" />
              <span>{{ product.vntPrice }}</span>
            </span>
          </div>
          <div class="product-amount">
            <span>
              {{ $t('p.amount') }}
            </span>
            <el-input-number v-model="productNumber" size="mini" disabled />
          </div>
        </div>
      </div>
      <el-input
        v-model="comment"
        :rows="4"
        :placeholder="$t('p.buyPlaceholder')"
        type="textarea"
        class="comment-container"
      />
      <div class="buy-container">
        <span class="storage">
          {{ $t('p.remainingStock', [product.stock ]) }}
        </span>
        <div @click="buyProduct" class="buy-btn">
          {{ $t('p.buy') }}
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
  name: 'PurchaseModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    article: {
      type: Object,
      required: true
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
      productNumber: 1,
      comment: ''
    }
  },
  components: {},
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    product() {
      const { article } = this
      if (article.channel_id === 2 && !this.$utils.isNull(article.prices)) {
        let price = {
          eosPrice: 0,
          ontPrice: 0,
          vntPrice: 0,
          stock: 0
        }

        if (article.prices[0]) {
          price.stock = article.prices[0].stock_quantity
        }

        article.prices.map((i, index) => {
          if (i.platform.toLocaleLowerCase() === 'eos'){
           price.eosPrice = article.prices[index].price / 10 ** article.prices[index].decimals
          } else if (i.platform.toLocaleLowerCase() === 'ont'){
          price.ontPrice = article.prices[index].price / 10 ** article.prices[index].decimals
          }
          else if (i.platform.toLocaleLowerCase() === 'vnt'){
            price.vntPrice = article.prices[index].price / 10 ** article.prices[index].decimals
          }
        })
        return price
      } else {
        return {
          eosPrice: 0,
          ontPrice: 0,
          vntPrice: 0,
          stock: 0
        }
      }
    },
    signId() {
      return this.article.id
    }
  },
  methods: {
    ...mapActions(['makeShare', 'makeOrder']),
        ...mapActions('vnt', [
      'sendTransaction',
    ]),
    async buyProduct() {

      // TODO 没有配置商品价格的 不支持购买
      if ( this.currentUserInfo.idProvider.toLocaleLowerCase() === 'eos') {
        if (this.product.eosPrice <= 0) return this.$message.error(this.$t('p.shopNotBuy', ['EOS']));
      }
      else if ( this.currentUserInfo.idProvider.toLocaleLowerCase() === 'ont') {
        if (this.product.ontPrice <= 0) return this.$message.error(this.$t('p.shopNotBuy', ['Ont']));
      }
      else if ( this.currentUserInfo.idProvider.toLocaleLowerCase() === 'vnt') {
        if (this.product.vntPrice <= 0) return this.$message.error(this.$t('p.shopNotBuy', ['Vnt']));
      }

      // console.log(this.product)

      const loading = this.$loading({
        text: `${this.$t('p.buying')}...`
      })
      const { comment, signId, product } = this
      let idProviderLower = this.currentUserInfo.idProvider.toLocaleLowerCase()
      if (idProviderLower === 'GitHub') return
      const num = this.productNumber
      const amount =
        idProviderLower === 'ont'
          ? num * product.ontPrice
          : idProviderLower === 'eos'
          ? num * product.eosPrice
          : idProviderLower === 'vnt'
          ? num * product.vntPrice
          : 0
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
        if (this.currentUserInfo.idProvider.toLocaleLowerCase() === 'vnt') { // vnt 交易
        if (amount < 1)
        return this.$message.error(this.$t('p.vntBuyMinMoney'))
          const faild = error => {
            loading.close()
            this.$message.closeAll()
            this.$message.error(error.toString())
          }
          try {
            try {
              let coinbase = await this.$store.dispatch('vnt/coinbase')
              if (coinbase !== this.currentUserInfo.name) {
                faild(this.$t('p.vntBuyAccount'))
                return
              }
            } catch (error) {
              faild(error)
            }

            let orderId = -1
            // 提交订单hash
            const postOrderHah = async hash => {
              let params = {
                orderId: orderId,
                txhash: hash,
              }
              await this.$API.orderSaveHash(params)
                .then(res => {
                  if (res.code === 0) {
                    loading.close()
                    this.$message.closeAll()
                    this.$message.success(this.$t('p.buyDone'))
                    this.showModal = false
                  } else {
                    console.log('购买商品失败 提交hash')
                    reject(new Error(this.$t('p.buyFail')))
                  }
                })
                .catch(err => {
                  console.log('购买商品失败 提交hash err')
                    reject(new Error(this.$t('p.buyFail')))
                })
            }
            // 转账
            const transaction = async () => {
              let data = { // 交易数据
                data: `oid:${orderId}`,
                value: amount
              }
              try {
                let res = await this.$store.dispatch('vnt/sendTransaction', data)
                postOrderHah(res)
              } catch (error) {
                faild(error)
              }
            }

            let params = {
              signId: signId,
              amount: toPrecision(amount, idProviderLower),
              num: num,
              comment: comment
            }
            if (sponsor.id) {
              Object.assign(params, {
                referrer: sponsor.id,
              })
            }
            await this.$API.reportOrder(params)
              .then(res => {
                if (res.code === 0) {
                  orderId = res.data.orderId
                  transaction()
                }
                else faild(this.$t('p.buyFail')) // '购买商品失败 创建订单失败'
              }).catch(err => {
                faild(this.$t('p.buyFail'))
              })
          } catch (error) {
            faild(error)
          }
        } else { // other 交易
          try {
            await this.makeOrder({ amount, num, signId, sponsor, comment })
            this.$message.success(this.$t('p.buyDone'))
            this.showModal = false
            this.$emit('purchaseDone')
          } catch (error) {
            loading.close()
            this.$message.error(this.$t('p.buyFail'))
            this.showModal = false
          }
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
  border-radius: @br10;
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
      flex: 1;
      .product-price {
        color: #F7B500;
        font-size: 18px;
        font-weight: bold;
        line-height: 28px;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        justify-content: space-between;
        width: 90%;
        .type-price {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color:#f7b500;
          &:nth-of-type(2) {
            margin: 0 4px;
          }
          span {
            margin-left: 4px;
          }
        }
      }
      .product-amount {
        width: 90%;
        font-size: 16px;
        display: flex;
        align-items: center;
        span {
          margin-right: 8px;
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
