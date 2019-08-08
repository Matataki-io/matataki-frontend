<template>
  <el-dialog :visible.sync="showModal" width="380px" :modal="true" custom-class="my-dialog" :close-on-click-modal="false">
    <section v-show="step === 1" class="auth-main">
      <div class="auth-title-container">
        <span :class="['auth-title', {'active':isLogin}]" @click="isLogin=true">登录</span>
        <span :class="['auth-title', {'active':!isLogin}]" @click="isLogin=false">注册</span>
      </div>
      <div class="loginRegister">
        <section class="login" v-show="isLogin">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="ss-form">
            <el-form-item prop="email">
              <el-input v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item class="ss-btn">
              <el-button type="primary" @click="submitLoginForm">登录</el-button>
              <div class="bottom-tip">
                <a href="javascript:void(0);">忘记密码</a> | <a href="javascript:void(0);" @click="isLogin=false">注册</a>
              </div>
            </el-form-item>
          </el-form>
          <div class="oauth-box">
            <h1 class="oauth-title">第三方账号登录</h1>
            <div class="oauth">
              <div class="oauth-bg bg-gray" @click="walletLogin('EOS')">
                <img src="@/assets/img/eos_icon.svg" alt="EOS">
              </div>
              <div class="oauth-bg bg-blue" @click="walletLogin('ONT')">
                <img src="@/assets/img/icon_logo_ont.svg" alt="ONT">
              </div>
              <div class="oauth-bg bg-purple" @click="walletLogin('GitHub')">
                <img src="@/assets/img/github.png" alt="github">
              </div>
            </div>
          </div>
        </section>
        <section class="register" v-show="!isLogin">
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm" class="ss-form">
            <el-form-item prop="email">
              <el-input type="" v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="registerForm.password" placeholder="请设置密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="repassword">
              <el-input type="password" v-model="registerForm.repassword" placeholder="请再次设置密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="smscode">
              <div class="code-contaniner">
                <el-input v-model.number="registerForm.smscode" placeholder="请输入验证码" autocomplete="off"></el-input>
                <el-button type="primary" :disabled="!!timer" @click="sendCode">{{ timer ? `${count}S` : `获取验证码` }}</el-button>
              </div>
            </el-form-item>
            <el-form-item class="ss-btn">
              <el-button type="primary" @click="submitRegisterForm">注册</el-button>
            </el-form-item>
          </el-form>
        </section>
      </div>
    </section>
    <Wallet v-show="step === 2" />
    <div class="footer-arrow" @click="step === 1 ? (step = 2) : (step = 1)">
      <div v-if="step === 2" class="arrow">
        <i class="el-icon-arrow-left" />
      </div>
      <span>{{ step === 1 ? '查看支持的钱包' : '返回登录' }}</span>
      <div v-if="step === 1" class="arrow">
        <i class="el-icon-arrow-right" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { idProvider } from './icon.js'
import Wallet from './wallet'
const TIME_COUNT = 60

export default {
  name: 'AuthModal',
  components: {
    Wallet
  },
  data() {
    const checkEmail = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入邮箱地址'))
      } else {
        callback()
        /* const res = await this.$API.verifyEmail(value)
        if (res.code !== 0) {
          callback()
        } else {
          callback(new Error('邮箱已注册'))
        } */
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
      count: '',
      timer: null,
      buttonText: '请输入验证码',
      isDisabled: false,
      isLogin: true,
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
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [
          { validator: checkEmail, trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' }
        ]
      },
      step: 1,
      showModal: false,
      modalLoading: false,
      modalText: {
        text: '选择授权方式'
      },
      idProvider
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    }
  },
  computed: {
    ...mapState(['userConfig']),
    ...mapGetters(['currentUserInfo'])
  },
  methods: {
    ...mapActions(['signIn']),
    async walletLogin(type) {
      this.modalLoading = true
      if (type === 'GitHub') {
        this.$router.push({ name: 'login' })
        return
      }
      await this.signInx(type)
      this.modalLoading = false
    },
    async signInx(type) {
      try {
        await this.signIn({ idProvider: type })
        this.$store.commit('setLoginModal', false)
        this.$backendAPI.accessToken = this.currentUserInfo.accessToken
      } catch (error) {
        try {
          await this.signIn({ idProvider: type })
          this.$store.commit('setLoginModal', false)
          this.$backendAPI.accessToken = this.currentUserInfo.accessToken
        } catch (err) {
          console.log('signInx 错误', err)
          this.$message.error('登陆失败')
        }
      }
    },
    sendCode() {
      this.$refs.registerForm.validateField('email', async (error) => {
        if (error) {
          console.error('sendCode error', error)
        } else {
          try {
            const res = await this.$API.getCaptcha(this.registerForm.email)
            if (res.code === 0) {
              this.countDown()
              this.$message.success('验证码发送成功，5分钟内使用有效')
            } else {
              this.$message.error('验证码发送失败')
            }
          } catch (error) {
            this.$message.error('验证码发送失败')
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
    // 登录提交
    submitLoginForm() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$API.login({
              username: this.loginForm.email,
              password: this.loginForm.password
            })
            if (res.code === 0) {
              this.$store.commit('setAccessToken', res.data)
              this.$store.commit('setUserConfig', { idProvider: 'email' })
              this.$message.success('登录成功')
              this.showModal = false
            } else {
              this.$message.error(`登录失败，${res.message}`)
            }
          } catch (error) {
            this.$message.error('登录失败，请联系管理员')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style src="./auth.less" lang="less" scoped>
</style>
