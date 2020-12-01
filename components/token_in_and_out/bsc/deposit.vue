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
        <el-form-item label="要转入的Fan票" prop="token">
          <el-input
            v-model="form.token"
            placeholder="请输入Token地址"
            clearable
          />
        </el-form-item>
        <el-form-item label="数量" prop="value">
          <el-input
            v-model="form.value"
            :max="form.max"
            :min="form.min"
            placeholder="请输入数量"
            clearable
          />
        </el-form-item>
        <p class="balance">
          余额&nbsp;<span>---.----</span>&nbsp;
          <a
            href="javascript:;"
          ><del>全部存入</del></a>
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
            确定
          </el-button>
        </div>
      </el-form>
    </client-only>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { approve, burn } from './PeggedToken'
// import { mintWithPermit } from '@/utils/ethers'
import { mapGetters } from 'vuex'
import EnvironmentCheck from './EnvironmentCheck'
import { precision } from '@/utils/precisionConversion'

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
            '地址长度不正确，请再次确认是否为币安智能区块链钱包地址'
          )
        )
      } else if (value.slice(0, 2) !== '0x') {
        callback('地址不是0x开头，应该不是币安智能区块链地址🤔')
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
  methods: {
    // async signPermitOfApproval() {
    // Disabled for Timing
    //   try {
    //     // Init Ethers
    //     await window.ethereum.enable()
    //     const provider = new ethers.providers.Web3Provider(
    //       window.ethereum
    //     )
    //     const signer = provider.getSigner()
    //     const wallet = await signer.getAddress()
    //     console.info('signer: ', wallet)
        
    //     const { token, value } = this.form

    //     const permit = await signERC2612Permit(signer, token, wallet, process.env.VUE_APP_PeggedTokenBurner, value)
    //     console.info('signed permit: ', permit)
    //     this.permit = permit
    //   } catch (error) {
    //     console.error(error)
    //     this.$message.error(error)
    //   }
    // },
    async burn() {
      // Init Ethers
      try {
        await window.ethereum.enable()
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        )
        const signer = provider.getSigner()
        const wallet = await signer.getAddress()
        console.info('signer: ', wallet)
        const { token, value } = this.form
        const parsedValue = (Number(value) * 10000)
        const approveTx = await approve(signer, token, process.env.VUE_APP_PeggedTokenBurner, parsedValue)
        alert('正在 Approve，确认后需要再次签名 Burn，请稍后')
        await approveTx.wait(1)
        const uid = this.currentUserInfo.id
        const burnTx = await burn(signer, token, uid, parsedValue)
        console.log(burnTx)
      } catch (error) {
        this.$message.error(error)
        console.error(error)
      }
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
  margin: 10px;
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
</style>
