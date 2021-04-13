<template>
  <el-dialog
    :visible.sync="showModal"
    :title="$t('transferMoney')"
    custom-class="transfer-dialog br10"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      v-loading="transferLoading"
      :model="form"
      :rules="rules"
      label-width="60px"
      class="gift-form"
    >
      <el-form-item :label="$t('object')">
        <el-select
          v-model="userVal"
          filterable
          remote
          reserve-keyword
          :placeholder="$t('please-enter-a-keyword')"
          :remote-method="userRemoteMethod"
          :loading="userLoading"
          style="width: 100%;"
          @change="userValChange"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="searchUsername(item.nickname, item.username)"
            :value="item.id"
          >
            <div class="fl ac">
              <c-avatar :src="cover(item.avatar)" />
              <span class="username">{{ searchUsername(item.nickname, item.username) }}</span>
            </div>
          </el-option>
        </el-select>
        <!-- 常用候选对象列表 -->
        <div v-if="historyUser.length !== 0" class="history-user">
          <el-tag
            v-for="item in historyUser"
            :key="item.id"
            type="info"
            class="history-user__tag"
            size="small"
            @click="continueUser(item)"
          >
            {{
              (item.nickname || item.username).length > 20
                ? `${(item.nickname || item.username).slice(0, 20)}...`
                : item.nickname || item.username
            }}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item :label="$t('types-of')" prop="tokenId">
        <el-select
          v-model="form.tokenId"
          filterable
          :placeholder="$t('please-choose')"
          style="width: 100%"
          @change="changeTokenSelect"
        >
          <el-option
            v-for="item in tokenOptions"
            :key="item.token_id"
            :label="item.symbol + '-' + item.name"
            :value="item.token_id"
          >
            <div class="token-container">
              <img
                v-if="item.logo"
                :src="cover(item.logo)"
                :alt="item.symbol"
                class="token-logo"
              >
              <svg-icon v-else class="token-icon" icon-class="currency" />
              <span class="token-symbol">{{ item.symbol }}</span>
              <span class="token-symbol">{{ tokenAmount(item.amount, item.decimals) }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('quantity')"
        prop="tokens"
      >
        <el-input
          v-model="form.tokens"
          :max="form.max"
          :min="form.min"
          :placeholder="$t('please-enter-the-quantity')"
          clearable
        />
      </el-form-item>
      <p
        v-if="form.balance"
        class="balance"
      >
        {{ $t('balance') }}&nbsp;{{ form.balance }}&nbsp;
        <a
          href="javascript:;"
          @click="form.tokens = form.balance"
        >{{ $t('transfer-all-in') }}</a>
      </p>
      <el-form-item :label="$t('leave-a-message')">
        <el-input
          v-if="form.tokenId !== 0"
          v-model="form.memo"
          type="textarea"
          :rows="3"
          :placeholder="$t('please-write-down-what-you-want-to-say-to-the-author-optional')"
          size="small"
          class="customize-input"
          maxlength="500"
          show-word-limit
        />
        <p v-else class="cny-help">
          <i class="el-icon-circle-close" />
          {{ $t('mttk-points') }} {{ $t('message-transfer-is-temporarily-not-supported') }}
        </p>
      </el-form-item>
      <div class="form-button">
        <el-button
          :disabled="!userVal"
          type="primary"
          @click="submitForm('form')"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
  <!-- </m-dialog> -->
</template>

<script>
import { precision, toPrecision } from '@/utils/precisionConversion'
import { filterOutHtmlTags } from '@/utils/xss'
import { mapGetters } from 'vuex'

export default {
  name: 'TransferDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    form2: {
      type: Object,
      default: () => {
        return {
          tokenname: '',
          username: '',
          useravatar: '',
          userId: '',
          tokenId: '',
          tokens: '',
          min: 0.0001,
          max: 99999999, // 默认最大
          balance: 0
        }
      }
    },
    userData: {
      type: Object,
      default: null
    }
  },
  data() {
    const validateToken = (rule, value, callback) => {
      if (!value) {
        callback('发送数量不能为空')
      } else if (!(/^[0-9]+(\.[0-9]{1,4})?$/.test(value))) {
        callback(new Error('发送的数量小数不能超过4位'))
      } else if (Number(value) < this.form.min) {
        callback(new Error('发送数量不能少于0.0001'))
      } else if (Number(value) > this.form.max) {
        if (this.form.max === 0) callback(new Error('余额不足'))
        else callback(new Error(`发送数量不能大于${this.form.max || 99999999}`))
      } else {
        callback()
      }
    }
    return {
      showModal: false,
      form: {
        tokenname: '',
        username: '',
        useravatar: '',
        userId: '',
        tokenId: '',
        tokens: '',
        min: 0.0001,
        max: 99999999, // 默认最大
        balance: 0,
        memo: ''
      },
      rules: {
        tokens: [
          { required: true, validator: validateToken, trigger: ['blur', 'change'] }
        ],
        tokenId: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      toUserInfo: null, // 转让的对象
      historyUser: [], // 历史转让用户
      transferLoading: false,
      tokenOptions: [],
      selectedToken: {},
      userVal: '',
      userLoading: false,
      userList: [], // 用户列表
      cnyBalance: 0
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isMe']),
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
      if (val) {
        this.historyUserFunc('token')
        this.initForm()
        this.initUser()
        this.tokenTokenList()
      } else {
        this.formEmpty()
      }
    },
    value(val) {
      this.showModal = val
    },
  },
  methods: {
    initUser() {
      if (!this.userData) return
      this.toUserInfo = this.userData
      this.userVal = this.userData.nickname || this.userData.username
      this.userList = [this.userData]
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
      this.form.tokenId = id
      if (id === 0) { // 处理是 CNY 的情况
        this.form.balance = Number(this.tokenAmount(this.cnyBalance, 4))
        this.form.max = this.form.balance
      }
      else this.getUserBalance(id)
    },
    // 获取所有token
    async tokenTokenList() {
      let data = {
        pagesize: 999,
        order: 0
      }
      await this.$API.tokenTokenList(data).then(res => {
        if (res.code === 0) {
          this.tokenOptions = res.data.list
          this.topOwnToken()
          this.addCnyToken()
        } else {
          this.tokenOptions = []
        }
      }).catch(err => {
        console.log(err)
        this.tokenOptions = []
      })
    },
    initForm() {
      if (!this.form2) return
      this.form.tokenname = this.form2.tokenname
      this.form.tokenId = this.form2.tokenId
      this.form.decimals = this.form2.decimals
      this.form.max = this.form2.max
      this.form.balance = this.form2.balance
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    continueUser(val) {
      this.toUserInfo = val
      this.userVal = val.nickname || val.username
      this.userList = [val]
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.userVal) {
            this.$message({ showClose: true, message: '请选择用户', type: 'warning'})
          } else {
            this.transferMinetoken()
          }
        } else {
          return false
        }
      })
    },
    // 转账
    transferMinetoken() {
      const toUserInfo = this.toUserInfo

      if (this.$utils.isNull(toUserInfo)) {
        this.$message({ showClose: true, message: '请选择转账用户', type: 'info' })
        return
      }

      const toId = this.$utils.isNull(toUserInfo) ? -1 : toUserInfo.id

      if (Number(toId) === Number(this.currentUserInfo.id)) {
        this.$message({ showClose: true, message: '不能给自己转账', type: 'info' })
        return
      }

      if (!this.form.tokenId && this.form.tokenId !== 0) {
        this.$message({ showClose: true, message: '请选择类型', type: 'info' })
        return
      }

      if (this.form.tokenId === 0) { // 如果是 CNY 转账，则跳转至专用方法。
        this.transferCny(toId, this.form.tokens)
        return
      }

      this.transferLoading = true
      this.$message({ showClose: true, message: '链上转账中，请耐心等待（关闭此页面不影响转账进度）', type: 'info' })

      const data = {
        tokenId: this.form.tokenId,
        to: toId,
        amount: toPrecision(this.form.tokens, 'CNY', this.form.decimals),
        memo: this.form.memo
      }
      this.$API.transferMinetoken(data)
        .then(res => {
          if (res.code === 0) {
            this.$message({ showClose: true, message: '转账成功', type: 'success'})
            this.reload = Date.now()

            // 不知道怎么拿到更新后的tab数据 就暂时先加减吧...
            const toAmount = toPrecision(this.form.tokens, 'CNY', this.form.decimals)
            const currentAmount = toPrecision(this.form.balance, 'CNY', this.form.decimals)
            const endAmount = precision(currentAmount - toAmount, 'CNY', this.form.decimals)
            this.form.balance = Number(endAmount)
            this.form.max = Number(endAmount)
          } else {
            this.$message({ showClose: true, message: res.message, type: 'error' })
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('转账失败')
        }).finally(() => {
          this.transferLoading = false
          this.showModal = false
        })
    },
    /** CNY 转账 */
    transferCny(userId, amount) {

      this.transferLoading = true
      const data = {
        symbol: 'CNY',
        to: userId,
        amount: toPrecision(amount, 'CNY', 4)
      }
      this.$API
        .transferAsset(data)
        .then(res => {
          if (res.code === 0) {
            this.transferLoading = false
            this.$message({ showClose: true, message: '转账成功', type: 'success'})
          } else {
            this.$message({ showClose: true, message: res.message, type: 'error' })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('转账失败')
        })
        .finally(() => {
          this.transferLoading = false
          this.showModal = false
        })
    },
    // 获取常用用户列表
    historyUserFunc(type) {
      this.$API.historyUser({
        type
      }).then(res => {
        if (res.code === 0) {
          this.historyUser = res.data.slice(0, 10)
        } else {
          console.log(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    formEmpty() {
      this.form.tokenname = ''
      this.form.username = ''
      this.form.useravatar = ''
      this.form.userId = ''
      this.form.tokenId = ''
      this.form.decimals = ''
      this.form.tokens = ''
      this.form.memo = ''

      this.form.max = 99999999
      this.form.balance = 0
      this.$refs.form.resetFields()

      this.toUserInfo = null
      this.userVal = ''
    },
    // logo 
    cover(cover) {
      return cover ? this.$ossProcess(cover) : ''
    },
    tokenAmount(amount, decimals) {
      const tokenamount = precision(amount, 'CNY', decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    // 用户改变事件
    userValChange(val) {
      this.toUserInfo = {
        id: val
      }
    },
    // 搜索用户名
    searchUsername(nickname, username) {
      let name = nickname || username
      return name ? filterOutHtmlTags(name) : ''
    },
    // 用户远程搜索方法
    userRemoteMethod(query) {
      if (query !== '') {
        this.userLoading = true

        const params = {
          word: query,
          pagesize: 10
        }

        this.$API.search('user', params).then(res => {
          if (res.code === 0 && res.data.list.length !== 0) {
            this.userList = res.data.list
          } else {
            console.log(res.message)
            this.userList = []
          }
        }).catch(err => {
          console.log(err)
          this.userList = []
        }).finally(() => {
          this.userLoading = false
        })

      } else {
        this.userList = []
      }
    },
    /** 吧自己的Fan票排到最前面 */
    topOwnToken() {
      let list = this.tokenOptions
      list.forEach((token,index) => {
        if(this.isMe(token.uid)) list.unshift(list.splice(index, 1)[0])
      })
    },
    /** 添加 CNY 到最前 */
    async addCnyToken() {
      await this.getCnyBalance()
      this.tokenOptions.unshift({
        token_id: 0,
        name: '人民币',
        symbol: 'CNY',
        logo: '',
        amount: this.cnyBalance,
        decimals: 4
      })
    },
    // 获取用户账户余额
    async getCnyBalance() {
      try {
        const res = await this.$API.getCNYBalance()
        this.cnyBalance = res
      }
      catch (e) {
        this.$message.error('MTTK积分 余额获取失败')
        console.error(e)
      }
    }
  }
}
</script>

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
    height: 26px;
    min-width: 26px;
    min-height: 26px;
    border-radius: 50%;
  }
  .token-icon {
    width: 26px;
    height: 26px;
    min-width: 26px;
    min-height: 26px;
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
.gift-form {
  // margin: 0 40px 0 20px;
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

.cny-help {
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  margin: 10px 0 0;
  white-space: nowrap;
  color: #B2B2B2;
}

/deep/ .transfer-dialog {
  width: 380px !important;
}
@media screen and (max-width: 640px) {
  /deep/ .transfer-dialog {
    width: 90% !important;
  }
}
</style>
