<template>
  <div class="withdraw-container">
    <client-only>
      <textarea
        v-model.trim="permitInput" 
        style="width: 50%; margin: 10px 0px;height: 286px;"
        :rows="6"
        class="withdraw-result-textarea"
        :placeholder="placeholderForPermitInput"
        @change="onPermitInput"
      />

      <div 
        v-if="permit" 
        style="width: 50%;" 
        class="parsedPermit" 
      >
        <p class="parse-title">解析出来的提现许可</p>
        <p class="parse-item">在 BSC 的 Fan票 地址: {{ permit.token }}</p>
        <p class="parse-item">提现到: {{ permit.to }}</p>
        <p class="parse-item">提现金额: {{ permit.value / 1e4 }}</p>
        <p class="parse-item">许可号: {{ permit.nonce }}</p>
        <p class="parse-item">
          许可证截止使用时间: {{ permitExpiry.toLocaleString() }}
        </p>
        <!-- :disabled="isPermitExpired" -->
        <div class="parse-btn">
          <el-button type="primary" @click="sendPermit">
            {{ isPermitExpired ? "许可证已过期" : "上传许可" }}
          </el-button>
        </div>
        <el-alert v-if="mintResult" type="success">
          <h2>发送成功</h2>
          交易哈希: {{ mintResult.hash }}
          <!-- todo: 上正式网记得删掉 testnet. -->
          <a
            :href="`https://testnet.bscscan.com/tx/${mintResult.hash}`"
            target="_blank"
          >
            在 BSCScan 查看这个交易 ↗️
          </a>
        </el-alert>
      </div>
    </client-only>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { mintWithPermit } from '@/utils/ethers'
import { mapGetters } from 'vuex'
import { precision } from '@/utils/precisionConversion'

export default {
  name: 'MintWithPermit',
  components: {
  },
  data() {
    return {
      transferLoading: false,
      permitInput: '',
      mintResult: null,
      placeholderForPermitInput: `请把许可复制到此处，例子：
      {
  "sig": {
    "r": "0x38fb8b99ec663c221c595e69f8f8c6a00b5d8543e1ecfd21b709fbcc99b58fab",
    "s": "0x17ccb0a240ba8fae8cc3fe25bcd431b802ca97ca6a9365522ec241fa7df9cec4",
    "v": 28
  },
  "token": "0x14372C682A88f5F2A5eFc0d3A65195C91AbF7754",
  "to": "0x2F129a52aAbDcb9Fa025BFfF3D4C731c2D914932",
  "value": "123456789",
  "nonce": 2,
  "deadline": 1605611329
}`,
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
  watch: {},
  methods: {
    onPermitInput(e) {
      console.info('onPermitInput event e', e)
      const { value } = e.target
      if (!value) return
      let permitData
      try {
        permitData = JSON.parse(value)
        this.permit = permitData
      } catch (error) {
        this.$message.error('对不起，这不是有效的许可。请检查格式是否正确。')
      }
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    async sendPermit() {
      try {
        const { permit } = this
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
        console.log(result)
        this.mintResult = result
        this.$message.success(
          `上传交易发送成功，Tx Hash: ${result.hash} 请留意 MetaMask 交易结果通知，或前往 BSCScan 检查交易情况。`
        )
      } catch (error) {
        this.$message.error(error)
      }
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
  display: flex;
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
