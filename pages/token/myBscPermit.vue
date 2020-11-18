<template>
  <div class="withdraw-container">
    <!-- Frank 留言：需要有人帮我修剪一下这个页面的 UI，功能应该都OK的 -->
    <h1 class="title">
      我的 BSC 许可
    </h1>
    <div class="card">
      <el-alert type="warning">
        <h2 class="title">
          ⚠️你找到了暂未对公众开放的试验性功能⚠️
        </h2>
        这是目前你申请的 BSC 转账许可，一经上传即可生成在 BSC 上的Fan票资产。<b>你需要 MetaMask 连接上币安智能链主网，并有足够的 BNB 去上传提现许可。</b>
        <br>
        <a 
          style="color: #1989FA;"
          href="https://www.readblocks.com/archives/32275" 
          target="_blank" 
          rel="noreferrer"
        >👉在 MetaMask 添加币安智能链的指南 ↗️ 👈</a>
        <br>
        如果你没有足够的 BNB，你可以把许可分享给有 BNB 的朋友，让 Ta 帮你生成币安智能链上的 Fan票 资产
      </el-alert>
      <el-alert type="info">
        <h2 class="title">
          ❓分享我的「提现许可」给他人会造成 Fan 票损失吗？ 
        </h2>
        不会，提现许可包含了： Token 、收款账户、许可发行号码的这三个要素。
        <br> 我们的智能合约会校验这一点。上传提现许可到智能合约只会把 Token 转到许可指定的账户里。
        <br> 但是最好不要在第三方网站上传提现许可。因为钓鱼网站可能会诱导把Fan票转账到他们的账户。
      </el-alert>
      <div v-for="listItem in listOfTokenAndItsPermit" :key="listItem.token" class="parsedPermit">
        <p>Token: {{ listItem.token }}</p>
        <div>
          <el-table
            :data="listItem.permits"
            style="width: 100%"
          >
            <el-table-column
              prop="to"
              label="提现到"
              width="400"
            />
            <el-table-column
              prop="nonce"
              label="许可号(顺序）"
              width="80"
            />
            <el-table-column
              label="状态"
              width="160"
            >
              <template slot-scope="scope">
                {{ 
                  scope.row.status === 0 ? '待发送' :
                  scope.row.status === -1 ? '已发送' : '请先处理待发送' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="提现金额"
              width="160"
            >
              <template slot-scope="scope">
                {{ scope.row.value / 1e4 }}
              </template>
            </el-table-column>
            <el-table-column
              label="有效期"
              width="160"
            >
              <template slot-scope="scope">
                {{ scope.row.expiryDate.toLocaleDateString() }}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button 
                  type="primary" 
                  :disabled="scope.row.isPermitExpired || scope.row.status !== 0"
                  @click="sendPermit(scope.row)"
                >
                  {{ 
                    scope.row.isExpired ? '许可证已过期' :
                    scope.row.status === 1 ? '先处理前面的' :
                    scope.row.status === -1 ? '已发送' : '上传许可' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { batchQueryNonceFor, mintWithPermit } from '../../utils/ethers'
import { mapGetters } from 'vuex'
import { precision } from '@/utils/precisionConversion'

export default {
  name: 'MintWithPermit',
  data() {
    return {
      transferLoading: false,
      mintResult: null,
      listOfToken: [],
      listOfTokenAndItsPermit: []
    }
  },
  computed: {
    ...mapGetters(['isMe', 'isLogined', 'currentUserInfo']),
  },
  watch: {
    isLogined(val) {
      if (val) this.fetchPermit()
    }
  },
  mounted() {
    if (this.isLogined) this.fetchPermit()
  },
  methods: {
    async fetchPermit() {
      const { data } = await this.$API.listMyBscPermit()
      this.listOfToken = [...new Set(data.permits.map(permit => permit.token))]
      
      const listOfPermit = data.permits.map(permit => {
        const expiryDate = new Date(Number(permit.deadline) * 1000)
        const isExpired = new Date().getTime() > expiryDate.getTime()
        return { ...permit, expiryDate, isExpired }
      })
      this.listOfPermit = listOfPermit
      const listOfTokenAndItsPermit = this.listOfToken.map(token => {
        const permits = listOfPermit.filter((permit) => permit.token === token)
        return { token, permits }
      })
      const after = await Promise.all(listOfTokenAndItsPermit.map(async ({ token, permits }) => {
        const queries = permits.map(({ to }) => ({ token, who: to }))
        const nonces = await batchQueryNonceFor(queries)
        console.log('nonces', nonces)
        const parsedPermits = permits.map((p, idx) => ({ 
          ...p, 
          currentNonces: nonces[idx].toNumber(),
          status: nonces[idx].toNumber() === p.nonce ? 0 :
          // 1 为暂时不能发送，-1为已经发送
            nonces[idx].toNumber() < p.nonce ? 1 : -1
        }))
        return { token, permits: parsedPermits }
      }))
      this.listOfTokenAndItsPermit = after
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    async sendPermit(permit) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum).getSigner()
        const result = await mintWithPermit(
          provider, permit.token, permit.to, 
          permit.value, permit.deadline, 
          permit.sig.v, permit.sig.r, permit.sig.s)
        console.log(result)
        this.$message.success(`上传交易发送成功，Tx Hash: ${result.hash} 请留意 MetaMask 交易结果通知，或前往 BSCScan 检查交易情况。`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // token amount 单位换算
    tokenAmount(amount, decimals) {
      const tokenamount = precision(amount, 'CNY', decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
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
