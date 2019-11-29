<template>
  <el-dialog
    title="转账"
    :visible.sync="giftDialog"
    width="600px"
    :before-close="giftDialogClose"
  >
    <el-form
      ref="form"
      v-loading="transferLoading"
      :model="form"
      label-width="70px"
      class="gift-form"
    >
      <el-form-item label="接受对象">
        <el-input
          v-model="form.username"
          placeholder="请输入赠送的对象"
          size="medium"
          @keyup.enter.native="searchUser"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser" />
        </el-input>
      </el-form-item>
      <el-form-item v-if="form.userId" label="" prop="">
        <div class="avatar-content">
          <avatar class="gift-avatar" :src="form.useravatar" size="60px" />
          <div class="gift-ful" @click="closeUser">
            <i class="el-icon-close" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="发送数量" prop="">
        <el-input-number v-model="form.amount" size="small" :min="0.01" :max="form.max" :step="0.01"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('form')">
          确定
        </el-button>
        <el-button size="small" @click="formClose">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'

export default {
  components: {
    avatar
  },
  props: {
    value: Boolean
  },
  data() {
    return {
      giftDialog: false,
      transferLoading: false,
      form: {
        symbol: 'CNY',
        username: '',
        useravatar: '',
        userId: '',
        amount: 0.01,
        max: 99999999 // 默认最大
      }
    }
  },
  watch: {
    value(val) {
      this.giftDialog = val
    },
    giftDialog(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    formEmpty() {
      this.form.symbol = 'CNY'
      this.form.username = ''
      this.form.useravatar = ''
      this.form.userId = ''
      this.form.decimals = ''
      this.form.amount = 1
      this.form.max = 99999999
      this.$refs.form.resetFields()
    },
    giftDialogClose(done) {
      this.formEmpty()
      done()
    },
    formClose() {
      this.giftDialog = false
      this.formEmpty()
    },
    closeUser() {
      this.form.userId = ''
      this.form.useravatar = ''
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.userId) this.transferAsset()
          else {
            this.$message.warning('请选择用户')
          }
        } else return false
      })
    },
    transferAsset() {
      this.transferLoading = true
      const { symbol, userId } = this.form
      const data = {
        symbol,
        to: userId,
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
            this.$message.error(res.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('赠送token失败')
        })
        .finally(() => {
          this.transferLoading = false
        })
    },
    alert(message) {
      this.$alert(`${message}，点击确定刷新`, '温馨提示', {
        showClose: false,
        type: 'success',
        callback: action => {
          this.$router.go(0)
        }
      })
    },
    async searchUser() {
      if (!this.form.username.trim()) return this.$message.warning('用户名不能为空')
      this.transferLoading = true
      await this.$API.searchUsername(this.form.username.trim())
        .then(res => {
          if (res.code === 0) {
            console.log(res)
            this.form.useravatar = res.data.avatar ? this.$API.getImg(res.data.avatar) : ''
            this.form.userId = res.data.id
          } else return this.$message.warning(res.message)
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.transferLoading = false
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
.gift-avatar {
  border: 1px solid #ececec;
}
.avatar-content {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  .gift-ful {
    cursor: pointer;
    position: absolute;
    top: -10px;
    right: -20px;
    align-items: center;
    justify-content: center;
    color: #8c8c8c;
    font-size: 20px;
  }
}
</style>
