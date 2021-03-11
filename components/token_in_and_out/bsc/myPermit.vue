<template>
  <div class="withdraw-container">
    <client-only>
      <!-- Env Check Here -->
      <EnvironmentCheck />
      <wbAlertTips />
      <p style=" font-size: 10px; ">{{ $t('when-the-license-is-updated-approximately-every-minute-the-last-update') }}：{{ lastUpdated }}</p>
      <div
        v-for="listItem in listOfTokenAndItsPermit"
        :key="listItem.token"
        class="parsedPermit"
      >
        <p class="parse-title">Token: {{ listItem.token }}</p>
        <div>
          <el-table :data="listItem.permits" style="width: 100%">
            <el-table-column prop="to" :label="$t('withdraw-to')" width="400" />
            <el-table-column prop="nonce" :label="$t('license-number-sequence')" width="80" />
            <el-table-column :label="$t('status')" width="140">
              <template slot-scope="scope">
                {{
                  scope.row.status === 0
                    ? $t('to-be-sent')
                    : scope.row.status === -1
                      ? $t('has-been-sent')
                      : $t('please-process-to-be-sent-first')
                }}
              </template>
            </el-table-column>
            <el-table-column prop="value" :label="$t('withdrawal-amount')" width="160">
              <template slot-scope="scope">
                {{ scope.row.value / 1e4 }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('valid-period')" width="140">
              <template slot-scope="scope">
                {{ scope.row.expiryDate.toLocaleDateString() }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('operating')" width="240">
              <template slot-scope="scope">
                <div v-if="scope.row.status === -1" class="action-for-sent" />
                <el-button
                  v-else-if="scope.row.status !== -1 && !scope.row.isExpired"
                  type="primary"
                  :disabled="
                    scope.row.status !== 0
                  "
                  @click="sendPermit(scope.row)"
                >
                  {{ scope.row.status === 1
                    ? $t('deal-with-the-front-first')
                    : scope.row.status === -1
                      ? $t('has-been-sent')
                      : $t('upload-license')
                  }}
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  @click="updatePermit(scope.row)"
                >
                  {{ $t('update-license') }}
                </el-button>
                <el-button
                  :disabled="
                    scope.row.isExpired || scope.row.status !== 0
                  "
                  @click="copyPermit(scope.row)"
                >
                  {{ $t('share') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { batchQueryNonceFor, mintWithPermit, isTesting, NetworksId } from '@/utils/ethers'
import { mapGetters } from 'vuex'
import { precision } from '@/utils/precisionConversion'
import wbAlertTips from '@/components/withdraw_bsc/alert_tips'
import EnvironmentCheck from './EnvironmentCheck'

export default {
  name: 'MyBscPermit',
  components: {
    wbAlertTips,
    EnvironmentCheck,
  },
  data() {
    return {
      transferLoading: false,
      mintResult: null,
      listOfToken: [],
      listOfTokenAndItsPermit: [],
      interval: null,
      lastUpdated: '...Loading...'
    }
  },
  computed: {
    ...mapGetters(['isMe', 'isLogined', 'currentUserInfo']),
  },
  watch: {
    isLogined(val) {
      if (val) this.fetchPermit()
      // 每一分钟刷新一次
      this.interval = setInterval(() => {
        this.fetchPermit()
      }, 1000 * 60)
    },
  },
  async mounted() {
    if (!process.browser) return // NO SSR 
    if (this.isLogined) this.fetchPermit()
    this.interval = setInterval(() => {
      this.fetchPermit()
    }, 1000 * 60)
  },
  methods: {
    async fetchPermit() {
      const { data } = await this.$API.listMyCrosschainPermit('bsc')
      this.listOfToken = [
        ...new Set(data.permits.map((permit) => permit.token)),
      ]

      const listOfPermit = data.permits.map((permit) => {
        const expiryDate = new Date(Number(permit.deadline) * 1000)
        const isExpired = new Date().getTime() > expiryDate.getTime()
        return { ...permit, expiryDate, isExpired }
      })
      this.listOfPermit = listOfPermit
      const listOfTokenAndItsPermit = this.listOfToken.map((token) => {
        const permits = listOfPermit.filter((permit) => permit.token === token)
        return { token, permits }
      })
      const after = await Promise.all(
        listOfTokenAndItsPermit.map(async ({ token, permits }) => {
          const queries = permits.map(({ to }) => ({ token, who: to }))
          const nonces = await batchQueryNonceFor(queries, isTesting ? NetworksId.BSC_TESTNET : NetworksId.BSC_MAINNET)
          const parsedPermits = permits.map((p, idx) => ({
            ...p,
            currentNonces: nonces[idx].toNumber(),
            status:
              nonces[idx].toNumber() === p.nonce
                ? 0
                : // 1 为暂时不能发送，-1为已经发送
                nonces[idx].toNumber() < p.nonce
                  ? 1
                  : -1,
          }))
          return { token, permits: parsedPermits }
        })
      )
      this.listOfTokenAndItsPermit = after
      this.lastUpdated = new Date().toLocaleString()
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    async sendPermit(permit) {
      try {
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
          permit.sig.s,
          isTesting ? NetworksId.BSC_TESTNET : NetworksId.BSC_MAINNET
        )
        console.log(result)
        this.$message.success(
          `上传交易发送成功，Tx Hash: ${result.hash} 请留意 MetaMask 交易结果通知，或前往 BSCScan 检查交易情况。`
        )
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updatePermit(permit) {
      await this.$API.renewBscWithdrawPermit(permit.id)
      await this.fetchPermit()
      this.$message.success('提现许可更新成功')
    },
    copyPermit(permit) {
      const stringify = JSON.stringify(permit)
      console.info('Ready for clipboard', stringify)
      this.$copyText(stringify).then(
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
.parse-title {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  padding: 0;
  line-height: 1.5;
}
</style>
