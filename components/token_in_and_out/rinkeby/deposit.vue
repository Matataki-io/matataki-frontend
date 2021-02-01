<template>
  <div class="card">
    <el-alert v-if="myHostingAccount" type="info" class="elalert">
      <h2 class="title">
        {{ $t('my-custody-wallet') }}
      </h2>
      <p class="description">
        {{ $t('address') }}:
        <code @click="copy">
          {{ myHostingAccount }}
        </code>
        <button @click="copy">
          {{ $t('copy') }}
        </button>
      </p>
      <a 
        :href="etherscanLink" 
        target="_blank"
        rel="noreferrer"
        class="link"
      >
        👉{{ $t('look-at-the-on-chain-transactions-of-this-escrow-account-on-Etherscan-find-txHash') }} 👈
      </a>
    </el-alert>
    <h1 class="withdraw-title">
      {{ $t('declare-recharge') }}
    </h1>
    <el-form
      ref="form"
      v-loading="transferLoading"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="withdraw-form"
    >
      <el-form-item label="txHash" prop="txHash">
        <el-input v-model="form.txHash" placeholder="请输入你充币的交易 Hash，以 0x 开头。" clearable />
      </el-form-item>
      <div class="form-button">
        <el-button
          :disabled="!isGoodToWithdraw"
          type="primary"
          class="submit-btn"
          @click="submitForm('form')"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
      <el-alert v-if="depositResult" type="success">
        <h1 class="title">
          {{ $t('coin-recharge-successfully') }}
        </h1>{{ $t('this-transaction-has-been-synchronized-to-the-database') }}
        <p>{{ $t('from-wallet-address') }}: <code>{{ depositResult.from }}</code></p>
        <p v-if="depositResult.token">
          {{ $t('coin-name') }}：{{ depositResult.token.name }}
          符号：{{ depositResult.token.symbol }}
          <router-link :to="'/token/' + depositResult.token.id" target="_blank">
            ↗️ {{ $t('view-the-coin-details') }}
          </router-link>
        </p>
        <p>{{ $t('amount') }}: <code>{{ precision(depositResult.amount, 'CNY', 4) }} {{ depositResult.token && depositResult.token.symbol }}</code></p>
      </el-alert>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { precision } from '@/utils/precisionConversion'

export default {
  name: 'TokenDeposit',
  data() {
    const validateEthereumTxHash = (rule, value, callback) => {
      if (!value) {
        callback('哈希不能为空')
      } else if (value.length === 42) {
        callback(
          new Error('这个应该是钱包地址，请再次确认是否为交易哈希')
        )
      } else if (value.slice(0, 2) !== '0x') {
        callback('不是0x开头，应该不是以太坊交易哈希🤔')
      } else {
        callback()
      }
    }
    return {
      form: {
        txHash: '',
      },
      rules: {
        txHash: [
          {
            required: true,
            validator: validateEthereumTxHash,
            trigger: ['blur', 'change'],
          },
        ],
      },
      myHostingAccount: '',
      transferLoading: false,
      depositResult: null,
    }
  },
  computed: {
    ...mapGetters(['isMe', 'isLogined', 'currentUserInfo']),
    isGoodToWithdraw() {
      return this.form.txHash
    },
    etherscanLink() {
      return `https://rinkeby.etherscan.io/address/${this.myHostingAccount}`
    }
  },
  mounted() {
    this.fetchMyHostingAccount()
  },
  methods: {
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    precision(a,b,c) {
      return precision(a,b,c)
    },
    async fetchMyHostingAccount() {
      this.myHostingAccount = (await this.$API.getMyHostingAddress()).data
    },
    getUserBalance(tokenId) {
      this.$API.getUserBalance(tokenId).then((res) => {
        if (res.code === 0) {
          this.form.balance = Number(this.tokenAmount(res.data, 4))
          this.form.max = this.form.balance
        }
      })
    },
    copy() {
      this.$copyText(this.myHostingAccount).then(
        () => {
          this.$message({
            showClose: true,
            message: this.$t('success.copy'),
            type: 'success'
          })
        },
        () => {
          this.$message({ showClose: true, message: this.$t('error.copy'), type: 'error' })
        }
      )
    },
    changeTokenSelect(id) {
      this.getUserBalance(id)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('is submit valid ☑️')
          this.depositMinetoken()
        } else return false
      })
    },
    async depositMinetoken() {
      this.transferLoading = true
      this.$message({
        showClose: true,
        message: '链上转账中，请耐心等待（关闭此页面不影响转账进度）',
        type: 'info',
      })

      try {
        const res = await this.$API.depositToken(this.form.txHash)
        
        if (res.code === 0) {
          this.$emit('success')
          this.depositResult = res.data
          const token = await this.$API.minetokenId(res.data.tokenId)
          this.depositResult.token = token.data.token
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 0
          })
        }
      } catch (err) {
        this.$message({
          showClose: true,
          message: err.response.data.message,
          type: 'error',
          duration: 0
        })
      } finally {
        this.transferLoading = false
      }
    },
    // logo
    tokenLogo(cover) {
      return cover ? this.$ossProcess(cover) : ''
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
  margin: 40px auto 0;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}
.card {
  box-sizing: border-box;
}
.card .el-alert {
  margin: 10px 0;
}
</style>


<style lang="less" scoped>
.elalert {
  .title {
    padding: 0;
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.5;
  }
  .description {
    font-size: 14px;
    padding: 0;
    margin: 4px 0 0 0;
    line-height: 1.5;
  }
  .link {
    color: rgb(25, 137, 250);
    display: inline-block;
    font-size: 14px;
    text-decoration: underline;
    padding: 0;
    margin: 4px 0 0 0;
    line-height: 1.5;
  }
}
.withdraw-title {
  padding: 0;
  margin: 20px 0 0 0;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.5;
}
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
  margin: 10px auto;
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

code {
  color: red;
  background: #EEE;
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
</style>
