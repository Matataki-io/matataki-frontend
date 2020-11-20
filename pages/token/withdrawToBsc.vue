<template>
  <div class="withdraw-container">
    <client-only>
      <!-- Frank 留言：可以先不整这个，我还在弄后端接口 -->
      <h1 class="withdraw-title">
        跨链提取 Fan票到币安智能链（Binance Smart Chain）
      </h1>
      <div v-if="!isLogined" class="card not-logined">
        <h1 class="title">
          😺嗯？你好像还没有登录？
        </h1>
        <h2 class="subtitle">
          你需要先登录才能使用这个功能
        </h2>
        <el-button @click="login">
          注册/登录
        </el-button>
      </div>
      <div v-else class="card">
        <wbAlertWarning />
        <wbAlertTips />
        <h4 class="title">
          跨链转账到币安智能区块链 主网 BSC Mainnet
        </h4>
        <el-form
          ref="form"
          v-loading="transferLoading"
          :model="form"
          :rules="rules"
          label-width="120px"
          class="withdraw-form"
        >
          <el-form-item label="要转出的Fan票" prop="tokenId">
            <el-select
              v-model="form.tokenId"
              filterable
              placeholder="请选择"
              style="width: 100%"
              @change="changeTokenSelect"
            >
              <el-option
                v-for="item in tokenOptions"
                :key="item.token_id"
                :label="`${item.name}(${item.symbol})`"
                :value="item.token_id"
              >
                <div class="token-container">
                  <img
                    :src="tokenLogo(item.logo)"
                    :alt="item.symbol"
                    class="token-logo"
                  >
                  <span
                    class="token-symbol"
                  >{{ item.name }}({{ item.symbol }})</span>
                  <span
                    class="token-symbol"
                  >余额: {{ tokenAmount(item.amount, item.decimals) }}
                    {{ item.symbol }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量" prop="amount">
            <el-input
              v-model="form.amount"
              :max="form.max"
              :min="form.min"
              placeholder="请输入数量"
              clearable
            />
          </el-form-item>
          <p class="balance">
            余额&nbsp;<span v-if="form.balance">{{ form.balance }}</span>&nbsp;
            <a
              v-if="form.balance"
              href="javascript:;"
              @click="form.amount = form.balance"
            >全部转出</a>
          </p>
          <el-form-item label="转账目的地" prop="to">
            <el-input
              v-model="form.to"
              placeholder="请输入目标钱包的BSC地址，以 0x 开头。"
              clearable
            />
          </el-form-item>
          <div class="form-button">
            <el-button
              :disabled="!isGoodToWithdraw"
              type="primary"
              class="submit-btn"
              @click="submitForm('form')"
            >
              确定
            </el-button>
          </div>
          <el-alert v-if="withdrawResult" type="success" class="withdraw-result">
            <h1 class="title">
              Fan 票 BSC 跨链转账许可证已下发
            </h1>
            <p class="description">
              因为这是 BSC
              主网跨链资产，需要你消耗一定的手续费来创建。请确保你的钱包有足够的
              BNB，以创建跨链资产。
            </p>
            <p class="description">
              你的提现许可证如下（不用怕，你可以随时到许可证列表查看之前申请过的）
            </p>
            <el-input
              v-model="permitOfMint"
              type="textarea"
              :rows="6"
              class="withdraw-result-textarea"
              autosize
            />
            <div class="actions">
              <el-button @click="goToMintPermitList">
                查看我申请过的许可证 / 发送激活
              </el-button>
              <el-button @click="copyGoToMintPermitList(permitOfMint)">
                复制许可证 / 发送激活
              </el-button>
            </div>
          </el-alert>
        </el-form>
        <h4 class="title">
          其他
        </h4>
        <el-button @click="$router.push({ name: 'token-myBscPermit' })">
          查看自己的可证
        </el-button>
        <el-button @click="$router.push({ name: 'token-bscMintWithPermit' })">
          上传提现许可
        </el-button>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { precision, toPrecision } from '@/utils/precisionConversion'
import { ethers } from 'ethers'
import { mintWithPermit } from '../../utils/ethers'
import wbAlertWarning from '@/components/withdraw_bsc/alert_warning'
import wbAlertTips from '@/components/withdraw_bsc/alert_tips'

// @todo: 到时候成熟了去掉
const BSC_PEGGED_WHITELIST = ['DEV', 'DAO', 'META', 'SSS']

export default {
  name: 'TokenWithdrawToBsc',
  components: {
    wbAlertWarning,
    wbAlertTips,
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
        callback('目标钱包地址不能为空')
      } else if (value.length !== 42) {
        callback(
          new Error(
            '钱包地址长度不正确，请再次确认是否为币安智能区块链钱包地址'
          )
        )
      } else if (value.slice(0, 2) !== '0x') {
        callback('地址不是0x开头，应该不是币安智能区块链的钱包地址🤔')
      } else {
        callback()
      }
    }
    return {
      form: {
        tokenId: '',
        amount: '',
        message: '',
        min: 0.0001,
        max: 99999999, // 默认最大
        balance: 0,
        to: '',
      },
      rules: {
        tokenId: [{ required: true, message: '请选择类型', trigger: 'change' }],
        amount: [
          {
            required: true,
            validator: validateToken,
            trigger: ['blur', 'change'],
          },
        ],
        to: [
          {
            required: true,
            validator: validateEthereumAddress,
            trigger: ['blur', 'change'],
          },
        ],
      },
      transferLoading: false,
      tokenOptions: [],
      withdrawResult: null,
    }
  },
  computed: {
    ...mapGetters(['isMe', 'isLogined', 'currentUserInfo']),
    permitOfMint() {
      return this.withdrawResult
        ? JSON.stringify(this.withdrawResult, null, 2)
        : ''
    },
    isGoodToWithdraw() {
      if (!this.form.amount) return false
      return Number(this.form.amount) <= this.form.max
    },
  },
  watch: {
    isLogined(val) {
      if (val) this.tokenTokenList()
    },
  },
  mounted() {
    if (process.browser) { this.tokenTokenList() }
  },
  methods: {
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    goToMintPermitList() {
      this.$router.push('/token/myBscPermit')
    },
    copyGoToMintPermitList(val) {
      let str = ''
      try {
        str = JSON.stringify(val)
        console.log('str', str)
      } catch (error) {
        console.log('error', error)
        str = val
      }
      this.$copyText(str).then(
        () => {
          this.$message({
            showClose: true,
            message: this.$t('success.copy'),
            type: 'success',
          })
          let routeData = this.$router.resolve({
            name: 'token-bscMintWithPermit',
          })
          window.open(routeData.href, '_blank')
        },
        () =>
          this.$message({
            showClose: true,
            message: this.$t('error.copy'),
            type: 'error',
          })
      )
    },
    async sendPermit() {
      try {
        const { withdrawResult: permit } = this
        await window.ethereum.enable()
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        ).getSigner()
        const result = await mintWithPermit(
          provider,
          permit.token,
          permit.to,
          permit.value,
          permit.deadline,
          permit.sig.v,
          permit.sig.r,
          permit.sig.s
        )
        this.$message.success(
          `上传交易发送成功，Tx Hash: ${result.hash} 请留意 MetaMask 交易结果通知，或前往 BSCScan 检查交易情况。`
        )
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    getUserBalance(tokenId) {
      this.$API.getUserBalance(tokenId).then((res) => {
        if (res.code === 0) {
          this.form.balance = Number(this.tokenAmount(res.data, 4))
          this.form.max = this.form.balance
        }
      })
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
          this.withdrawMinetoken()
        } else return false
      })
    },
    withdrawMinetoken() {
      this.transferLoading = true
      this.$message({
        showClose: true,
        message: '链上转账中，请耐心等待（关闭此页面不影响转账进度）',
        type: 'info',
      })

      const data = {
        target: this.form.to,
        amount: toPrecision(this.form.amount, 'CNY', 4),
      }
      this.$API
        .withdrawTokenToBsc(this.form.tokenId, data)
        .then((res) => {
          if (res.code === 0) {
            this.$emit('success')

            // 不知道怎么拿到更新后的tab数据 就暂时先加减吧...
            const toAmount = toPrecision(this.form.tokens, 'CNY', 4)
            const currentAmount = toPrecision(this.form.balance, 'CNY', 4)
            const endAmount = precision(currentAmount - toAmount, 'CNY', 4)
            this.form.balance = Number(endAmount)
            this.form.max = Number(endAmount)
            this.withdrawResult = res.data
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error',
            })
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('提现失败')
        })
        .finally(() => {
          this.transferLoading = false
        })
    },
    /**
     * 获取所有token
     */
    async tokenTokenList() {
      let data = {
        pagesize: 999,
        order: 0,
      }
      await this.$API
        .tokenTokenList(data)
        .then((res) => {
          if (res.code === 0) {
            this.tokenOptions = res.data.list.filter(
              ({ symbol }) =>
                BSC_PEGGED_WHITELIST.indexOf(symbol.toUpperCase()) > -1
            )
            this.topOwnToken()
          } else {
            this.tokenOptions = []
          }
        })
        .catch((err) => {
          console.log(err)
          this.tokenOptions = []
        })
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
    /** 吧自己的Fan票排到最前面 */
    topOwnToken() {
      let list = this.tokenOptions
      list.forEach((token, index) => {
        if (this.isMe(token.uid)) list.unshift(list.splice(index, 1)[0])
      })
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
.withdraw-form-title {
  font-size: 20px;
  color: #222;
  margin: 20px 0 20px 0;
  padding: 0;
}

.withdraw-form {
  max-width: 560px;
  margin: 40px auto;
  .tokenname {
    padding: 0;
    margin: 0;
  }

  .balance {
    text-align: right;
    padding: 0;
    margin: -20px 0 10px 0;
    font-size: 14px;
    font-weight: 400;
    color: #777777;
    word-spacing: 1px;
    .clearfix();
    a {
      font-size: 14px;
      color: #542de0;
      cursor: pointer;
    }
  }
}

.withdraw-result {
  margin-top: 40px !important;
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
  .withdraw-result-textarea {
    margin: 10px 0;
  }
}
</style>
