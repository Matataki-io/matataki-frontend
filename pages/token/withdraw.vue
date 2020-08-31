<template>
  <div class="withdraw-container">
    <h1 class="title">
      提取 Fan票
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
      <el-alert type="warning">
        <h2 class="title">
          ⚠️你找到了暂未对公众开放的试验性功能⚠️
        </h2>
        提取出站外的Fan票为普通的 ERC20 代币。（在 Rinkeby Testnet 上）
        <br>
        请确保你自己知道你在做啥，并提供的一个有效的以太坊地址，我们不为搞错地址所造成的丢币负责。
      </el-alert>
      <el-alert type="info">
        <h2 class="title">
          ❓怎么在以太坊钱包显示我提现出来的Fan票？ 
        </h2>
        <a 
          style="color: #1989FA;"
          href="https://matataki.io/p/4881" 
          target="_blank" 
          rel="noreferrer"
        >👉在 MetaMask 添加 Fan票的指南👈</a>
      </el-alert>
      <el-form
        ref="form"
        v-loading="transferLoading"
        :model="form"
        :rules="rules"
        label-width="60px"
        class="withdraw-form"
      >
        <el-form-item label="类型" prop="tokenId">
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
                <img :src="tokenLogo(item.logo)" :alt="item.symbol" class="token-logo">
                <span class="token-symbol">{{ item.name }}({{ item.symbol }})</span>
                <span class="token-symbol">余额: {{ tokenAmount(item.amount, item.decimals) }} {{ item.symbol }}</span>
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
        <el-form-item label="目标地址" prop="to">
          <el-input
            v-model="form.to"
            placeholder="请输入目标钱包的以太坊地址，以 0x 开头。"
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
        <el-alert v-if="withdrawResult" type="success">
          <h1 class="title">
            Fan 票提现成功
          </h1>
          这笔交易已经提交到区块链网络，等待网络确认。
          <a 
            style="color: #1989FA;"
            :href="`https://rinkeby.etherscan.io/tx/${withdrawResult.txHash}`" 
            target="_blank" 
            rel="noreferrer"
          >
            👉 在 EtherScan 查看这笔提现交易 👈
          </a>
        </el-alert>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { precision, toPrecision } from '@/utils/precisionConversion'

export default {
  name: 'TokenWithdraw',
  data() {
    const validateToken = (rule, value, callback) => {
      if (!value) {
        callback('发送数量不能为空')
      } else if (!(/^[0-9]+(\.[0-9]{1,4})?$/.test(value))) {
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
        callback(new Error('钱包地址长度不正确，请再次确认是否为以太坊钱包地址'))
      } else if (value.slice(0, 2) !== '0x') {
        callback('地址不是0x开头，应该不是以太坊地址🤔')
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
        to: ''
      },
      rules: {
        tokenId: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        amount: [
          { required: true, validator: validateToken, trigger: ['blur', 'change'] }
        ],
        to: [
          { required: true, validator: validateEthereumAddress, trigger: ['blur', 'change'] }
        ],
      },
      transferLoading: false,
      tokenOptions: [],
      withdrawResult: null
    }
  },
  computed: {
    ...mapGetters(['isMe', 'isLogined', 'currentUserInfo']),
    isGoodToWithdraw() {
      if (!this.form.amount) return false
      return Number(this.form.amount) <= this.form.max
    }
  },
  watch: {
    isLogined(val) {
      if (val) this.tokenTokenList()
    },
  },
  mounted() {
    this.tokenTokenList()
  },
  methods: {
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
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
      this.$message({ showClose: true, message: '链上转账中，请耐心等待（关闭此页面不影响转账进度）', type: 'info' })

      const data = {
        target: this.form.to,
        amount: toPrecision(this.form.amount, 'CNY', 4),
      }
      this.$API.withdrawToken(this.form.tokenId, data)
        .then(res => {
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
            this.$message({ showClose: true, message: res.message, type: 'error' })
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('提现失败')
        }).finally(() => {
          this.transferLoading = false
        })
    },
    /**
     * 获取所有token
     */
    async tokenTokenList() {
      let data = {
        pagesize: 999,
        order: 0
      }
      await this.$API.tokenTokenList(data).then(res => {
        if (res.code === 0) {
          this.tokenOptions = res.data.list
          this.topOwnToken()
        } else {
          this.tokenOptions = []
        }
      }).catch(err => {
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
      list.forEach((token,index) => {
        if(this.isMe(token.uid)) list.unshift(list.splice(index, 1)[0])
      })
    }
  }
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
  border: 1px solid #B2B2B2;
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
      font-size:14px;
      font-weight:400;
      color:rgba(178,178,178,1);
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
    font-size:14px;
    font-weight:400;
    color:rgba(178,178,178,1);
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
  margin: 10px;
  .tokenname {
    padding: 0;
    margin: 0;
  }
}
.history-user {
  &::after {
    display: block;
    content: '';
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
</style>
