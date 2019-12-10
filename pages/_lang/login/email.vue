<template>
  <div class="container">
    <div class="email">
      <img src="@/assets/img/m_logo.png" class="logo" alt="logo">
      <h1>绑定邮箱</h1>
      <div v-if="setp === 0" class="step">
        <p class="setp-title">
          请输入邮箱账号
        </p>
        <el-form ref="emailAddress" :rules="rules" :model="emailAddress">
          <el-form-item label="" prop="email">
            <div class="step-input">
              <el-input v-model="emailAddress.email" type="text" placeholder="请输入邮箱账号" />
              <el-button @click="emailAddressOnSubmit('emailAddress')" class="step-input__btn" icon="el-icon-right" circle />
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="setp === 1" class="step">
        <el-form ref="emailPass" :rules="rulesPass" :model="emailPass">
          <div class="step-input">
            <el-form-item label="" prop="pass">
              <p class="setp-title">
                请设置密码
              </p>
              <el-input v-model="emailPass.pass" type="text" placeholder="请设置密码" show-password />
            </el-form-item>
            <el-form-item label="" prop="code">
              <p class="setp-title code">
                请设置验证码
              </p>
              <el-input v-model="emailPass.code" type="text" maxlength="6" placeholder="请输入验证码" style="margin-left: 10px;width:130px;" />
            </el-form-item>
            <div style="margin-bottom: 22px;">
              <el-button @click="setp--" class="step-input__btn" icon="el-icon-back" circle />
              <el-button @click="emailPassOnSubmit('emailPass')" type="primary" class="step-input__btn">
                立即绑定
              </el-button>
            </div>
          </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  layout: 'empty',
  name: 'Email',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (this.emailAddress.email === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validateEmailPass = (rule, value, callback) => {
      if (this.emailPass.pass === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateEmailCode = (rule, value, callback) => {
      if (this.emailPass.code === '') {
        callback(new Error('请输入验证码'))
      } else if (this.emailPass.code.length !== 6) {
        callback(new Error('请输入六位验证码'))
      } else {
        callback()
      }
    }
    return {
      setp: 0,
      rules: {
        email: [
          { validator: validateEmail, trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      rulesPass: {
        pass: [
          { validator: validateEmailPass, trigger: 'blur' }
        ],
        code: [
          { validator: validateEmailCode, trigger: 'blur' }
        ]
      },
      emailAddress: {
        email: ''
      },
      emailPass: {
        pass: '',
        code: ''
      }
    }
  },
  methods: {
    setpFunc(formName) {
      return new Promise(resolve => this.$refs[formName].validate(valid => resolve(valid)))
    },
    async emailAddressOnSubmit(formName) {
      if (await this.setpFunc(formName)) {
        if (this.setp >= 2) return
        ++this.setp
      }
    },
    async emailPassOnSubmit(formName) {
      if (await this.setpFunc(formName)) {
        this.$message.success('done')
        if (window.opener) {
          window.opener.location.reload()
          window.close()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  height: 100%;
  width: 100%;
}
.email {
  margin: 0 auto;
  padding: 100px 40px 0;
  h1 {
    margin: 20px 0 0;
    padding: 0;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #333;
  }
  .setp-title {
    margin: 20px 0 10px;
    padding: 0;
    font-size: 14px;
    color: #333;
    line-height: 1;
    &.code {
      margin-left: 10px;
    }
  }
}
.step-input {
  display: flex;
  align-items: flex-end;
}
.step-input__btn {
  margin-left: 10px;
}
.logo {
  display: block;
  height: 34px;
  margin: 0 auto;
}
</style>
