<template>
  <div class="token-detail" style="display: flex;">
    <!-- <c-token-popover :token-id="Number(minetokenToken.id)"> -->
    <avatar :src="chainDetail.logo" size="60px" />
    <!-- </c-token-popover> -->
    <div class="token-detail-info">
      <div class="fl info-line">
        <div class="token-info-title bold">
          {{ chainDetail.name }}
        </div>
      </div>
      <div class="fl info-line">
        <el-button v-if="!permit" @click="requestPermit">
          Request Creation Permit
        </el-button>
        <el-button v-else @click="sendPermit">
          Send Creation Permit to Create on {{ chainDetail.name }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { Notification } from 'element-ui'
import { sendCreationPermit } from '@/utils/ethers'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar,
  },
  props: {
    chainDetail: {
      type: Object,
      required: true
    },
    tokenId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    permit: null
  }),
  computed: {
    targetChainId() {
      if (this.chainDetail.tag === 'matic') {
        return process.env.NODE_ENV === 'production' ? 137 : 80001
      }
      else if (this.chainDetail.tag === 'bsc') {
        return process.env.NODE_ENV === 'production' ? 56 : 97
      }
      return 1
    }
  },
  async mounted() {
    // await this.requestPermit()
  },
  methods: {
    async requestPermit() {
      try {
        const { data } = await this.$API.requestPermitOfCreation(this.tokenId, this.chainDetail.tag)
        console.info('requestPermit', data)
        this.permit = data.data
      } catch (error) {
        console.error('err', error)
      }
    },
    getNetworkNameById(id) {
      switch(id) {
        case -1: return 'Loading'
        case 1: return 'Ethereum Mainnet'
        case 56: return 'BSC Mainnet'
        case 137: return 'Polygon(Matic) Mainnet'
        case 80001: return 'Polygon(Matic) Testnet'
        case 97: return 'BSC Testnet'
        default: return `Chain ID ${this.network}`
      }
    },
    async sendPermit() {
      try {
        const { networkVersion } = window.ethereum
        if (this.targetChainId !== Number(networkVersion)) {
          throw new Error('请检查当前 MetaMask 所在的网络是否正确')
        }
        const { permit } = this
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        ).getSigner()
        const txResponse = await sendCreationPermit(
          provider,
          permit.name, permit.symbol, permit.tokenId, permit.decimals,
          permit.sig.v,
          permit.sig.r,
          permit.sig.s,
          this.targetChainId
        )
        Notification.info({
          title: '创建交易发送成功',
          message: `请不要关闭此页面，正在向区块链查询交易结果。交易ID: ${txResponse.hash}`,
          duration: 0
        })
        const receipt = await txResponse.wait()
        console.log('receipt', receipt)
        await this.uploadTxToServer(receipt.transactionHash)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async uploadTxToServer(txHash) {
      const result = await this.$API.appendCrosschainTokenByTxHash(txHash, this.chainDetail.tag)
      console.info('result', result)
      Notification.closeAll()
      Notification.success({
        title: '交易成功',
        message: '数据库已收录该跨链 Fan 票，五秒后刷新本页面',
        duration: 0
      })
      setTimeout(() => {
        window.location.reload()
      }, 1000 * 5)
    }
  },
}
</script>


<style lang="less" scoped>

.balance {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  color: #542DE0;
}

.balance-mobile {
  display: none;
}

.info-btns {
  top: 70%;
  left: 72%;
  position: absolute;
}

.float {
  margin-left: 1rem;
  span {
      color: #15AD8B;
      white-space: nowrap;
      &.red {
        color: #FB6877;
      }
    }
}

.token-detail {
  position: relative;
  margin: 20px auto 0;
  padding: 20px;
  background: @white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  cursor: pointer;
}
.info-line {
  margin: 6px 0;
}
.token-detail-info {
  width: 100%;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 400;
  color: @black;
  line-height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.token-info-title {
  // width: 70px;
  flex: 0 0 170px;
  &.bold {
    font-weight: bold;
    font-size: 14px;
  }
}
.token-info-address {
  padding: 0px;
  margin: 0;
  a {
    color: #542de0;
  }
}
.token-info-sub {
  padding: 0 0 0 10px;
  margin: 0;
  a {
    color: #542de0;
  }
}

.token {
  &-tags {
    display: flex;
    margin-left: 10px;
    flex-wrap: wrap;
    .tag-item {
      padding: 1px 8px 1px;
      color: #542DE0;
      border-radius: 5px;
      background-color: #D6CDFF;
      margin-right: 5px;
    }
  }
  &-header {
    flex-direction: row;
    display: flex;
    align-items: center;
  }
  &-username {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
}

// 小于992
@media screen and (max-width: 992px) {

  .info-btns {
    position: absolute;
    left: 69%;
  }
  .token {
    &-header {
      display: block;
    }
    &-tags {
      margin-top: 10px;
      .tag-item {
        margin: 0 5px 5px 0;
      }
    }
  }
}

// <600
@media screen and (max-width: 650px) {
  .balance {
    display: none;
  }
  .balance-mobile {
    display: flex;
  }

  .info-btns {
    position: relative;
    margin-top: 0px;
    left: 0px;
  }
  .token-detail {
    padding: 10px;
  }
  .token-detail-info {
    width: 100%;
  }
  .token-detail /deep/ .g-avatar {
    width: 60px !important;
    height: 60px !important;
    flex: 0 0 60px;
  }
  
  .token-detail-info {
    font-size: 14px;
  }

}
</style>