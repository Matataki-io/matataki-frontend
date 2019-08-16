<template>
  <el-dialog :visible.sync="showModal" width="400px" :lock-scroll="false" custom-class="br10">
    <div class="buy-product-modal">
      <h1 class="title">
        购买商品
      </h1>
      <div class="info-container">
        <img :src="article.cover" alt="cover" class="cover">
        <div class="info-inner">
          <div class="product-price">
            <span class="ont-price">
              <svg-icon icon-class="ont" />
              <span>{{ product.ontPrice }}</span>
            </span>
            <span class="eos-price">
              <svg-icon icon-class="eos" />
              <span>{{ product.eosPrice }}</span>
            </span>
          </div>
          <div class="product-amount">
            <span>数量</span>
            <el-input-number v-model="productNumber" size="mini" disabled />
          </div>
        </div>
      </div>
      <el-input
        v-model="comment"
        type="textarea"
        class="comment-container"
        :rows="4"
        placeholder="输入推荐语…"
      />
      <div class="buy-container">
        <span class="storage">库存还有剩{{ product.stock }}份</span>
        <div class="buy-btn" @click="buyProduct">
          购买
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
  name: 'PurchaseModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    article: {
      type: Object,
      default: () => ({
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
        return {
          eosPrice: article.prices[0].price / 10 ** article.prices[0].decimals,
          ontPrice: article.prices[1].price / 10 ** article.prices[1].decimals,
          stock: article.prices[0].stock_quantity
        }
      } else {
        return {
          eosPrice: 0,
          ontPrice: 0,
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
    async buyProduct() {
      const loading = this.$loading({
        text: `购买中...`
      })
      const { comment, signId, product } = this
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'GitHub') return
      const num = this.productNumber
      const amount =
        idProvider === 'ONT'
          ? num * product.ontPrice
          : idProvider === 'EOS'
          ? num * product.eosPrice
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
      this.isSupported = RewardStatus.LOADING
      try {
        let sponsor = await toSponsor(this.getInvite)
        await this.makeOrder({ amount, num, signId, sponsor, comment })
        loading.close()
        this.$message.success('购买成功')
        this.isSupported = RewardStatus.NOT_REWARD_YET
        this.showModal = false
        this.$emit('purchaseDone')
      } catch (error) {
        loading.close()
        this.$message.error('购买失败')
        this.showModal = false
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
