<template>
  <m-dialog
    v-model="giftDialog"
    width="600px"
    title="转账"
  >
    <el-form
      ref="form"
      v-loading="transferLoading"
      :model="form"
      :rules="rules"
      label-width="70px"
      class="gift-form"
    >
      <el-form-item label="接受对象">
        <el-input
          v-model="form.username"
          placeholder="请输入转账的对象"
          size="small"
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
      <el-form-item
        label="发送数量"
        prop="amount"
      >
        <el-input
          v-model="form.amount"
          :max="form.max"
          :min="form.min"
          placeholder="请输入数量"
          size="small"
          clearable
        />
      </el-form-item>
      <p
        v-if="balance"
        class="balance"
      >
        余额&nbsp;{{ balance }}&nbsp;
        <a
          href="javascript:;"
          @click="form.amount = balance"
        >全部转入</a>
      </p>
      <el-form-item>
        <div class="form-button">
          <el-button
            :disabled="$utils.isNull(toUserInfo)"
            type="primary"
            size="small"
            @click="submitForm('form')"
          >
            确定
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </m-dialog>
</template>

<script>
import { toPrecision } from '@/utils/precisionConversion'
import debounce from 'lodash/debounce'
import { xssFilter } from '@/utils/xss'
import avatar from '@/common/components/avatar'

export default {
  components: {
    avatar
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  data() {
    const validateAmount = (rule, value, callback) => {
      if (!value) {
        callback('发送数量不能为空')
      } else if (!(/^[0-9]+(\.[0-9]{1,4})?$/.test(value))) {
        callback(new Error(`发送的数量小数不能超过${this.form.decimals}位`))
      } else if (Number(value) < this.form.min) {
        callback(new Error(`发送数量不能少于${this.form.min}`))
      } else if (Number(value) > this.form.max) {
        callback(new Error(`发送数量不能大于${this.form.max || 99999999}`))
      } else {
        callback()
      }
    }

    return {
      giftDialog: false,
      transferLoading: false,
      form: {
        decimals: 4,
        symbol: 'CNY',
        username: '',
        amount: '',
        min: 0.0001,
        max: 99999999, // 默认最大
      },
      rules: {
        amount: [
          { validator: validateAmount, trigger: ['blur', 'change'] }
        ]
      },
      searchUserList: [], // 搜索结果
      toUserInfo: null, // 转让的对象
      historyUser: [] // 历史转让用户
    }
  },
  computed: {
    searchUserName() {
      return this.form.username
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.historyUserFunc('token')
      } else {
        this.formEmpty()
      }
      this.giftDialog = newVal
    },
    giftDialog(newVal) {
      this.$emit('input', newVal)
    },
    searchUserName() {
      this.searchUser()
    }
  },
  methods: {
    formEmpty() {
      this.form.symbol = 'CNY'
      this.form.username = ''
      this.form.decimals = ''
      this.form.amount = 1
      this.form.max = 99999999
      this.$refs.form.resetFields()


      this.searchUserList = [] // 搜索结果
      this.toUserInfo = null
    },
    closeUser(e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.toUserInfo = null
      this.searchUserList = []
      return false
    },
    giftDialogClose(done) {
      this.formEmpty()
      done()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$utils.isNull(this.toUserInfo)) {
            this.$message({ showClose: true, message: '请选择用户', type: 'warning'})
          } else {
            this.transferAsset()
          }
        } else return false
      })
    },
    transferAsset() {

      const toUserInfo = this.toUserInfo
      if (this.$utils.isNull(toUserInfo)) return

      const toId = this.$utils.isNull(toUserInfo) ? -1 : toUserInfo.id

      this.transferLoading = true
      const data = {
        symbol: this.form.symbol,
        to: toId,
        amount: toPrecision(this.form.amount, 'CNY', 4)
      }
      this.$API
        .transferAsset(data)
        .then(res => {
          console.log(res)
          if (res.code === 0) {
            this.giftDialog = false
            this.alert('转账成功')
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
        })
    },
    alert(message) {
      this.$alert(`${message}，点击确定刷新`, '温馨提示', {
        showClose: false,
        type: 'success',
        callback: () => {
          this.$router.go(0)
        }
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
    continueUser(val) {
      this.toUserInfo = val
    },
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
    }
  }
}
</script>

<style lang="less">
.gift-form {
  .tokenname {
    padding: 0;
    margin: 0;
  }
}

.balance {
  padding: 0;
  margin: 0 0 40px 70px;
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
  justify-content: flex-end;
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
    width: 40px !important;
    height: 40px !important;
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




// history user
.history-user__tag {
  cursor: pointer;
  margin: 0 10px 0 0;
}

// result transition
.result-enter-active,
.result-leave-active {
  transition: opacity .2s;
}
.result-enter,
.result-leave-to {
  opacity: 0
}
</style>
