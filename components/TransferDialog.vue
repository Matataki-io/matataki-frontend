<template>
  <el-dialog
    :visible.sync="showModal"
    title="转账"
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
      <el-form-item label="对象">
        <el-select
          v-model="userVal"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
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
            :label="item.symbol + '-' + item.name"
            :value="item.token_id"
          >
            <div class="token-container">
              <img :src="cover(item.logo)" :alt="item.symbol" class="token-logo">
              <span class="token-symbol">{{ item.symbol }}</span>
              <span class="token-symbol">{{ tokenAmount(item.amount, item.decimals) }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="数量"
        prop="tokens"
      >
        <el-input
          v-model="form.tokens"
          :max="form.max"
          :min="form.min"
          placeholder="请输入数量"
          clearable
        />
      </el-form-item>
      <p
        v-if="form.balance"
        class="balance"
      >
        余额&nbsp;{{ form.balance }}&nbsp;
        <a
          href="javascript:;"
          @click="form.tokens = form.balance"
        >全部转入</a>
      </p>
      <el-form-item label="留言">
        <el-input
          v-model="form.memo"
          type="textarea"
          :rows="3"
          placeholder="请写下想对作者说的话（选填）"
          size="small"
          class="customize-input"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <div class="form-button">
        <el-button
          :disabled="!userVal"
          type="primary"
          @click="submitForm('form')"
        >
          确定
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
        callback(new Error(`发送数量不能大于${this.form.max || 99999999}`))
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
      userList: [] // 用户列表
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
      this.getUserBalance(id)
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
        } else return false
      })
    },
    // 转账
    transferMinetoken() {    
      const toUserInfo = this.toUserInfo
      if (this.$utils.isNull(toUserInfo)) return

      const toId = this.$utils.isNull(toUserInfo) ? -1 : toUserInfo.id

      if (Number(toId) === Number(this.currentUserInfo.id)) {
        this.$message({ showClose: true, message: '不能给自己转账', type: 'info' })
        return
      }

      if (!this.form.tokenId) {
        this.$message({ showClose: true, message: '请选择类型', type: 'info' })
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
      this.form.max = 99999999
      this.form.balance = 0
      this.$refs.form.resetFields()

      this.toUserInfo = null
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

/deep/ .transfer-dialog {
  width: 380px !important;
}
@media screen and (max-width: 640px) {
  /deep/ .transfer-dialog {
    width: 90% !important;
  }
}
</style>
