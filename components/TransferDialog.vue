<template>
  <el-dialog
    :visible.sync="showModal"
    title="赠送Fan票"
    custom-class="br10"
    width="380px"
  >
    <el-form
      ref="form"
      v-loading="transferLoading"
      :model="form"
      :rules="rules"
      label-width="40px"
      class="gift-form"
    >
      <el-form-item label="对象">
        <el-input
          v-model="form.username"
          placeholder="请输入赠送的对象"
          style="z-index: 2;"
        />
        <!-- 常用候选对象列表 -->
        <template v-if="historyUser.length !== 0">
          <el-tag
            v-for="item in historyUser"
            :key="item.id"
            type="info"
            class="history-user__tag"
            @click="continueUser(item)"
          >
            {{
              (item.nickname || item.username).length > 20
                ? `${(item.nickname || item.username).slice(0, 20)}...`
                : item.nickname || item.username
            }}
          </el-tag>
        </template>
        <!-- 搜索结果 -->
        <div
          v-if="searchUserList.length !== 0 && $utils.isNull(toUserInfo)"
          class="transfer—search__list"
        >
          <div
            v-for="item in searchUserList"
            :key="item.id"
            @click="continueUser(item)"
          >
            <avatar
              :src="searchUserAvatar(item.avatar)"
              class="transfer—search__list__avatar"
            />
            <span
              class="search-result__tag "
              v-html="searchUserTitle(item.nickname || item.username)"
            />
          </div>
        </div>
      </el-form-item>
      <!-- 结果 -->
      <transition name="result">
        <el-form-item
          v-if="!$utils.isNull(toUserInfo)"
          label=""
          prop=""
        >
          <router-link
            :to="{name: 'user-id', params: {id: toUserInfo.id}}"
            class="search-user"
            target="_blank"
          >
            <avatar
              :src="searchUserAvatar(toUserInfo.avatar)"
              class="search-user-avatar"
            />
            <span
              class="search-result__tag "
              v-html="searchUserTitle(toUserInfo.nickname || toUserInfo.username)"
            />
            <div
              class="gift-ful"
              @click="closeUser"
            >
              <i class="el-icon-close" />
            </div>
          </router-link>
        </el-form-item>
      </transition>
      <el-form-item label="类型">
        <el-select
          :value="selectedToken.symbol"
          filterable
          remote
          clear
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="searchTokenLoading"
          class="mttk-select"
          @change="changeTokenSelect"
        >
          <el-option
            v-for="item in tokenOptions"
            :key="item.symbol"
            :label="item.symbol"
            :value="item"
          >
            <div class="token-container">
              <img :src="$API.getImg(item.logo)" :alt="item.symbol" class="token-logo">
              <span class="token-symbol" v-html="item.symbol" />
            </div>
          </el-option>
        </el-select>
        <!-- <p class="tokenname">
          {{ form.tokenname }}
        </p> -->
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
      <el-form-item
        label="留言"
        prop="memo"
      >
        <el-input
          v-model="form.memo"
          type="textarea"
          :rows="3"
          placeholder="请写下想对作者说的话（选填）"
          size="small"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <div class="form-button">
          <el-button
            :disabled="$utils.isNull(toUserInfo)"
            type="primary"
            @click="submitForm('form')"
          >
            确定
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- </m-dialog> -->
</template>

<script>
import { precision, toPrecision } from '@/utils/precisionConversion'
import debounce from 'lodash/debounce'
import { xssFilter } from '@/utils/xss'
import avatar from '@/common/components/avatar'

export default {
  name: 'TransferDialog',
  components: {
    avatar
  },
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
          { validator: validateToken, trigger: ['blur', 'change'] }
        ]
      },
      searchUserList: [], // 搜索结果
      toUserInfo: null, // 转让的对象
      historyUser: [], // 历史转让用户
      transferLoading: false,
      tokenOptions: [],
      searchTokenLoading: false,
      selectedToken: {}
    }
  },
  computed: {
    searchUserName() {
      return this.form.username
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
      if (val) {
        this.historyUserFunc('token')
        this.initForm()
      } else {
        this.formEmpty()
      }
    },
    value(val) {
      this.showModal = val
    },
    searchUserName() {
      this.searchUser()
    },
  },
  mounted() {
  },
  methods: {
    getUserBalance(tokenId) {
      this.$API.getUserBalance(tokenId).then((res) => {
        if (res.code === 0) {
          this.form.balance = Number(this.tokenAmount(res.data, 4))
          this.form.max = this.form.balance
        }
      })
    },
    tokenAmount(amount, decimals) {
      const tokenamount = precision(amount, 'CNY', decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    changeTokenSelect(token) {
      this.selectedToken = token
      this.form.tokenId = token.id
      this.getUserBalance(token.id)
    },
    remoteMethod(query) {
      if (query !== '') {
        this.searchTokenLoading = true
        this.$API.searchToken(query).then((res) => {
          this.searchTokenLoading = false
          if (res.code === 0) {
            this.tokenOptions = res.data.list
          } else {
            this.tokenOptions = []
          }
        })
      } else {
        this.tokenOptions = []
      }
    },
    initForm() {
      this.form.tokenname = this.form2.tokenname
      this.form.tokenId = this.form2.tokenId
      this.form.decimals = this.form2.decimals
      this.form.max = this.form2.max
      this.form.balance = this.form2.balance
      this.selectedToken = {
        id: this.form2.tokenId,
        symbol: this.form2.tokenname,
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    continueUser(val) {
      this.toUserInfo = val
    },
    closeUser(e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.toUserInfo = null
      this.searchUserList = []
      return false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$utils.isNull(this.toUserInfo)) {
            this.$message({ showClose: true, message: '请选择用户', type: 'warning'})
          } else {
            this.transferMinetoken()
          }
        } else return false
      })
    },
    transferMinetoken() {
      const toUserInfo = this.toUserInfo
      if (this.$utils.isNull(toUserInfo)) return

      const toId = this.$utils.isNull(toUserInfo) ? -1 : toUserInfo.id
      this.transferLoading = true

      const data = {
        tokenId: this.form.tokenId,
        to: toId,
        amount: toPrecision(this.form.tokens, 'CNY', this.form.decimals),
        memo: this.form.memo
      }
      this.$API.transferMinetoken(data)
        .then(res => {
          if (res.code === 0) {
            this.$message({ showClose: true, message: res.message, type: 'success'})
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
          this.$message.error('赠送token失败')
        }).finally(() => {
          this.transferLoading = false
          this.showModal = false
        })
    },
    // 搜索用户
    searchUser: debounce(function () {
      const searchName = this.form.username.trim()
      if (!searchName) {
        this.searchUserList = []
        return
      }

      this.toUserInfo = null

      const params = {
        word: searchName,
        pagesize: 10
      }

      this.$API.search('user', params).then(res => {
        if (res.code === 0) {
          this.searchUserList = res.data.list
          if (res.data.list.length === 0) {
            // 没有结果
            this.$message({ showClose: true, message: '没有搜索结果', type: 'warning'})
          }
        } else {
          // 失败
          this.$message({ showClose: true, message: res.message, type: 'warning'})
        }
      }).catch(err => {
        // 出错
        console.log(err)
        this.searchUserList = []
      })
    }, 300),
    searchUserAvatar(src) {
      return src ? this.$ossProcess(src, { h: 60 }) : ''
    },
    searchUserTitle(html) {
      return html ? xssFilter(html) : ''
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

      this.searchUserList = [] // 搜索结果
      this.toUserInfo = null
    },
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
  button {
    padding-left: 40px;
    padding-right: 40px;
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
// history user
.history-user__tag {
  cursor: pointer;
  margin: 0 10px 0 0;
}
.transfer-dialog /deep/ .el-dialog {
  width: 600px !important;
}
@media screen and (max-width: 640px) {
  .transfer-dialog /deep/ .el-dialog {
    width: 90% !important;
  }
}
</style>
