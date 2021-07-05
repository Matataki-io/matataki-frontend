<template>
  <div v-if="nfts.length" class="wrapper">
    <div class="nfts">
      <a
        v-for="(item, idx) in nfts"
        :key="idx"
        :href="`${nftUrl}/p/${item.id}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        <tokenNftCard :card="item" />
      </a>
    </div>
  </div>
</template>

<script>
import tokenNftCard from './token_nft_card'
import { utils } from 'ethers'
import { ERC20Profile } from '../../utils/ethers'
import { cloneDeep } from 'lodash'

export default {
  components: {
    tokenNftCard,
  },
  props: {
    address: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      nfts: []
    }
  },
  computed: {
    // nft url
    nftUrl() {
      if (process.browser) {
        return process.env.VUE_APP_NFT
      } else {
        return ''
      }
    },
  },
  watch: {
    address(newVal) {
      this.nftSearchByAskTokenFn(newVal)
    },
  },
  created() {
    if (process.browser) {
      this.nftSearchByAskTokenFn(this.address)
    }
  },
  methods: {
    // 获取所有 token 定价的 nft
    async nftSearchByAskTokenFn(address) {
      if (!address) {
        return
      }

      try {
        const res = await this.$API.nftSearchByAskToken({ tokenAddress: address })
        console.log(res)
        if (res.code === 200) {
          const list = res.data.map(i => ({ ...i, price: '---' }))
          this.nfts = list
          this.processTokenPrice()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 处理 token price
    async processTokenPrice() {
      const list = cloneDeep(this.nfts)

      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        const res = await ERC20Profile(ele.currentAsk.currency)
        if (res) {
          const price = utils.formatUnits(ele.currentAsk.amount, res.decimals)
          // console.log(price)
          const priceText = `${price} ${res.symbol}`
          list[i].price = priceText
        }
      }
      this.nfts = list
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.nfts {
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(2, minmax(0px, 330px));
  gap: 40px 24px;
  margin: 0 auto;
  & > a {
    width: 100%;
  }
  /* @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(3, minmax(0px, 330px));
  } */
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  & > a {
    height: 456px;
  }
}
</style>