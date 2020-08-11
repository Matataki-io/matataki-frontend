<template>
  <el-dialog
    :visible.sync="showModal"
    title="打赏作者"
    custom-class="reward-dialog br10"
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
              <img :src="tokenLogo(item.logo)" :alt="item.symbol" class="token-logo">
              <span class="token-symbol">{{ item.symbol }}</span>
              <span class="token-symbol">{{ tokenAmount(item.amount, item.decimals) }}</span>
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
        >全部转入</a>
      </p>
      <el-form-item label="留言">
        <el-input
          v-model="form.message"
          type="textarea"
          :rows="3"
          placeholder="请写下想对作者说的话（选填）"
          size="small"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <div class="form-button">
        <el-button
          :disabled="$utils.isNull(userData)"
          type="primary"
          class="submit-btn"
          @click="submitForm('form')"
        >
          确定
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { precision, toPrecision } from '@/utils/precisionConversion'
import { mapGetters } from 'vuex'

export default {
  name: 'TransferDialog',
  props: {
    value: {
      type: Boolean,
      default: false
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
        tokenId: '',
        amount: '',
        message: '',
        min: 0.0001,
        max: 99999999, // 默认最大
        balance: 0,
      },
      rules: {
        tokenId: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        amount: [
          { required: true, validator: validateToken, trigger: ['blur', 'change'] }
        ],
      },
      
      transferLoading: false,
      tokenOptions: [],
    }
  },
  computed: {
    ...mapGetters(['isMe'])
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
      if (val) {
        this.tokenTokenList()
      } else {
        this.resetForm('form')
        this.form.balance = 0
      }
    },
    value(val) {
      this.showModal = val
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
    changeTokenSelect(id) {
      this.getUserBalance(id)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.transferMinetoken()
        } else return false
      })
    },
    transferMinetoken() {
      const userData = this.userData
      if (this.$utils.isNull(userData)) return

      const toId = this.$utils.isNull(userData) ? -1 : userData.id
      this.transferLoading = true
      this.$message({ showClose: true, message: '链上转账中，请耐心等待（关闭此页面不影响转账进度）', type: 'info' })

      const data = {
        tokenId: this.form.tokenId,
        to: toId,
        amount: toPrecision(this.form.amount, 'CNY', 4),
        memo: this.form.message
      }
      const pid = this.$route.params.id
      this.$API.rewardArticle(pid, data)
        .then(res => {
          if (res.code === 0) {
            this.$emit('success')

            // 不知道怎么拿到更新后的tab数据 就暂时先加减吧...
            const toAmount = toPrecision(this.form.tokens, 'CNY', 4)
            const currentAmount = toPrecision(this.form.balance, 'CNY', 4)
            const endAmount = precision(currentAmount - toAmount, 'CNY', 4)
            this.form.balance = Number(endAmount)
            this.form.max = Number(endAmount)
          } else {
            this.$message({ showClose: true, message: res.message, type: 'error' })
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('赞赏失败')
        }).finally(() => {
          this.transferLoading = false
          this.showModal = false
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

<style lang="less" scoped>
.submit-btn {
  width: 200px;
}
.mttk-select {
  width: 100%;
}
.token-container {
  display: flex;
  align-items: center;
  .token-symbol {
    margin-left: 10px;
    color: #333;
    font-weight: 400;
    font-size: 14px;
  }
  .token-logo {
    width: 24px;
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

/deep/ .reward-dialog {
  width: 380px !important;
}
@media screen and (max-width: 640px) {
  /deep/ .reward-dialog {
    width: 90% !important;
  }
}
</style>
