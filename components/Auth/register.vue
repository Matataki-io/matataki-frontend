<template>
  <section class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="ss-form">
      <el-form-item prop="email">
        <el-input v-model="registerForm.email" type="" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="请设置密码" show-password />
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input v-model="registerForm.repassword" type="password" placeholder="请再次设置密码" show-password />
      </el-form-item>
      <el-form-item prop="smscode">
        <div class="code-contaniner">
          <el-input v-model.number="registerForm.smscode" placeholder="请输入邮箱验证码" autocomplete="off" />
          <el-button type="primary" :loading="loading" :disabled="!!timer || loading" @click="sendCode">
            {{ timer ? `${count}S` : `获取邮箱验证码` }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item class="ss-btn">
        <el-button type="primary" @click="submitRegisterForm">
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
/* eslint-disable */
const TIME_COUNT = 60

export default {
  name: 'RegisterContent',
  data() {
    const checkEmail = async (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入邮箱地址'))
      } else {
        const res = await this.$API.verifyEmail(value)
        if (res.data) {
          callback(new Error('邮箱已被注册'))
        } else {
          callback()
        }
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else if (value.toString().length !== 6) {
        callback(new Error('请输入6位数字'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      count: '',
      timer: null,
      isDisabled: false,
      registerForm: {
        email: '',
        password: '',
        repassword: '',
        smscode: ''
      },
      registerRules: {
        email: [
          { validator: checkEmail, trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' }
        ],
        repassword: { validator: validatePass2, trigger: 'blur' },
        smscode: { validator: checkCode, trigger: 'blur' }
      },
    }
  },
  methods: {
    sendCode() {
      this.$refs.registerForm.validateField('email', async (error) => {
        if (error) {
          console.error('sendCode error', error)
        } else {
          try {
            this.loading = true
            const res = await this.$API.getCaptcha(this.registerForm.email)
            if (res.code === 0) {
              this.countDown()
              this.$message.success('验证码发送成功，5分钟内使用有效')
            } else {
              this.$message.error('验证码发送失败')
            }
            this.loading = false
          } catch (error) {
            this.$message.error('验证码发送失败')
            this.loading = false
          }
        }
      })
    },
    // 倒计时函数
    countDown() {
      if (!this.timer) {
        this.count = TIME_COUNT
        this.text = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.text = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    // 注册提交
    submitRegisterForm() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$API.register({
              email: this.registerForm.email,
              captcha: this.registerForm.smscode,
              password: this.registerForm.password
            })
            if (res.code === 0) {
              this.$message.success('注册成功，请登录')
              this.$emit('switch')
              this.isLogin = true
            } else {
              this.$message.error('注册失败，请重试')
            }
          } catch (error) {
            this.$message.error('注册失败，请重试')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.register {
  .code-contaniner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      margin-left: 10px;
      // width: 120px;
      text-align: center;
    }
  }
}
</style>
