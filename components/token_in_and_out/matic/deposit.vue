<template>
  <div class="withdraw-container">
    <client-only>
      <EnvironmentCheck />
      <el-form
        ref="form"
        v-loading="transferLoading"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="withdraw-form"
      >
        <el-form-item :label="$t('coin-to-be-transferred')" prop="token">
          <el-input
            v-model="form.token"
            :placeholder="$t('please-enter-Token-address')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('quantity')" prop="value">
          <el-input
            v-model="form.value"
            :max="form.max"
            :min="form.min"
            :placeholder="$t('please-enter-the-quantity')"
            clearable
          />
        </el-form-item>
        <p class="balance">
          {{ $t('balance') }}&nbsp;<span>---.----</span>&nbsp;
          <a
            href="javascript:;"
          ><del>{{ $t('deposit-all') }}</del></a>
        </p>
        <div class="form-button">
          <!-- <el-button @click="signPermitOfApproval">
            授权
          </el-button> -->
          <el-button
            type="primary"
            class="submit-btn"
            @click="burn"
          >
            {{ $t('confirm') }}
          </el-button>
        </div>
      </el-form>
    </client-only>
    <div class="my-deposits">
      <h1 class="history-title">
        {{ $t('my-cross-chain-coin-deposit-record') }}
      </h1>
      <el-table
        :data="myDeposit"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          :label="`#${$t('numbering')}`"
          width="100"
        />
        <el-table-column
          prop="burnTx"
          label="Tx ID"
          width="180"
        >
          <template slot-scope="scope">
            <a :href="`http://explorer.matic.network/tx/${scope.row.burnTx}`" target="_blank" style="font-size: 10px">
              ...{{ scope.row.burnTx.slice(-6) }} ↗️
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          :label="$t('amount')"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.value / 10000 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('status')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ depositStatusRenderer(scope.row.status).message }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { depositStatusRenderer } from '../utils/util'
import { ethers } from 'ethers'
import { approve, burn } from '../utils/PeggedToken'
// import { mintWithPermit } from '@/utils/ethers'
import { mapGetters } from 'vuex'
import EnvironmentCheck from './EnvironmentCheck'
import { precision } from '@/utils/precisionConversion'
import { isTesting, NetworksId, TokenBurnerContractAddress } from '../../../utils/ethers'


export default {
  name: 'DepositFromBsc',
  components: {
    EnvironmentCheck,
  },
  data() {
    const validateToken = (rule, value, callback) => {
      if (!value) {
        callback('发送数量不能为空')
      } else if (!/^[0-9]+(\.[0-9]{1,4})?$/.test(value)) {
        callback(new Error('发送的数量小数不能超过4位'))
      } else if (Number(value) < this.form.min) {
        callback(new Error('发送数量不能少于0.0001'))
      } else if (Number(value) > this.form.max) {
        callback(new Error(`发送数量不能大于${this.form.max || 99999999}`))
      } else {
        callback()
      }
    }
    const validateEthereumAddress = (rule, value, callback) => {
      if (!value) {
        callback('地址不能为空')
      } else if (value.length !== 42) {
        callback(
          new Error(
            '地址长度不正确，请再次确认是否为 Matic 主网钱包地址'
          )
        )
      } else if (value.slice(0, 2) !== '0x') {
        callback('地址不是0x开头，应该不是 Matic 主网地址🤔')
      } else {
        callback()
      }
    }
    return {
      transferLoading: false,
      form: {
        token: '',
        value: '',
        min: 0,
        max: 9999999999999
      },
      rules: {
        token: [{
          required: true, validator: validateEthereumAddress,
          trigger: ['change', 'blur'] }
        ],
        value: [
          {
            required: true,
            validator: validateToken,
            trigger: ['blur', 'change'],
          },
        ]
      },
      myDeposit: [],
      permit: null
    }
  },
  computed: {
    ...mapGetters(['isMe', 'isLogined', 'currentUserInfo']),
    permitExpiry() {
      if (!this.permit) return null
      return new Date(this.permit.deadline * 1000)
    },
    isPermitExpired() {
      if (!this.permitExpiry) return null
      return new Date().getTime() > this.permitExpiry.getTime()
    },
  },
  watch: {
    // form(newVal, oldVal) {
    //   // if (newVal.token !== oldVal.token) {
    //   //   this.checkNew()
    //   // }
    // }
  },
  async mounted() {
    const { data } = await this.$API.listMyCrossChainDeposit()
    console.log('listMyCrossChainDeposit', data)
    this.myDeposit = data.deposits
  },
  methods: {
    async burn() {
      // Init Ethers
      try {
        const { token, value } = this.form
        const { data: tokenDetail } = await this.$API.isCrossChainToken(token.toLowerCase())
        console.log('tokenDetail', tokenDetail)
        await window.ethereum.enable()
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        )
        const signer = provider.getSigner()
        const wallet = await signer.getAddress()
        console.info('signer: ', wallet)
        const parsedValue = (Number(value) * 10000)
        const chainId = isTesting ? NetworksId.MATIC_TESTNET : NetworksId.MATIC_MAINNET
        const approveTx = await approve(signer, token, TokenBurnerContractAddress[chainId], parsedValue)
        alert('正在 Approve，确认后需要再次签名 Burn，请点击确认，稍后确认成功后会进行下一步')
        await approveTx.wait(1)
        const uid = this.currentUserInfo.id
        const burnTx = await burn(signer, token, uid, parsedValue)
        console.log(burnTx)
        alert('正在销毁跨链 Fan 票，请点击确认，不要走开。大概1分钟后（视网络情况而定）页面会反馈')
        const receipt = await burnTx.wait(3)
        await this.$API.depositFromMatic(tokenDetail.token.tokenId, {
          txHash: receipt.transactionHash
        })
        alert('跨链 Fan 票销毁成功，Matataki 站内Fan票将于稍后转移到你的账户')
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('network error: ', error.toJSON())
          return this.$message.error('该 Token 不是跨链Fan票')
        }
        this.$message.error(error)
        console.error(error)
      }
    },
    depositStatusRenderer(code) {
      return depositStatusRenderer(code)
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    // token amount 单位换算
    tokenAmount(amount, decimals) {
      const tokenamount = precision(amount, 'CNY', decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
  },
}
</script>

<style scoped>
.withdraw-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 40px;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}
.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  padding: 10px;
}
.card .el-alert {
  margin: 10px 0;
}
</style>


<style lang="less" scoped>
.mttk-select {
  width: 100%;
}
.token-container {
  display: flex;
  align-items: center;
  .token-symbol {
    margin-left: 10px;
  }
  .token-logo {
    width: 26px;
    border-radius: 50%;
  }
}
.balance {
  float: right;
  padding: 0;
  margin: -20px 0 10px 0;
  font-size: 14px;
  font-weight: 400;
  color: #777777;
  word-spacing: 1px;
  a {
    font-size: 14px;
    color: #542de0;
    cursor: pointer;
  }
}
.form-button {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  button {
    width: 200px;
  }
}

.transfer—search__list {
  position: absolute;
  left: 0;
  right: 0;
  top: 32px;
  background: #fff;
  border: 1px solid #b2b2b2;
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 1;
  padding: 4px 0 0 0;
  &__avatar {
    margin-right: 10px;
    flex: 0 0 30px;
  }
  & > div {
    width: 100%;
    margin: 0;
    padding: 5px 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &:hover {
      background: #f1f1f1;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
.search-user {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  &-avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    flex: 0 0 40px;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .gift-ful {
    cursor: pointer;
    position: absolute;
    top: -2px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
  }
}
.withdraw-form {
  max-width: 500px;
  margin: 40px auto 20px;
  .tokenname {
    padding: 0;
    margin: 0;
  }
}
.history-user {
  &::after {
    display: block;
    content: "";
    width: 0;
    height: 0;
    clear: both;
  }
}
// history user
.history-user__tag {
  cursor: pointer;
  margin: 10px 10px 0 0;
  float: left;
}

.username {
  margin: 0 0 0 10px;
  font-size: 14px;
  font-weight: 400;
}

/deep/ .transfer-dialog {
  width: 380px !important;
}
@media screen and (max-width: 640px) {
  /deep/ .transfer-dialog {
    width: 90% !important;
  }
}
.not-logined {
  h1.title {
    font-size: 24px;
    font-weight: 600;
    color: #222;
  }
  h2.subtitle {
    color: #777;
    font-size: 16px;
    font-weight: 400;
  }
}

.withdraw-title {
  font-size: 24px;
  color: #222;
  margin: 40px 0 20px 0;
  padding: 0;
}
.withdraw-result-textarea {
  margin: 10px 0;
}
.parse-title {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  padding: 0;
  line-height: 1.5;
}
.parse-item {
  padding: 0;
  margin: 8px 0;
  line-height: 1.5;
  font-size: 16px;
  color: #333;
  word-break: break-all;
}
.parse-btn {
  margin: 20px 0 0 0;
}

.history-title {
  padding: 0;
  margin: 20px 0 0 0;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.5;
}
</style>
