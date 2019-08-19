<template>
  <section class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="ss-form">
      <el-form-item prop="email">
        <el-input v-model="loginForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item class="ss-btn">
        <el-button type="primary" @click="submitLoginForm">
          登录
        </el-button>
        <div class="bottom-tip">
          <!-- <a href="javascript:void(0);">忘记密码</a> |  -->
          <a href="javascript:void(0);" @click="switchRegister">注册</a>
        </div>
      </el-form-item>
    </el-form>
    <div class="oauth-box">
      <h1 class="oauth-title">
        第三方账号登录
      </h1>
      <p class="warning-tip">不同帐号内容不互通</p>
      <div class="oauth">
        <div class="oauth-bg bg-gray" @click="walletLogin('EOS')">
          <svg-icon class="eos" icon-class="eos_login" />
        </div>
        <div class="oauth-bg bg-blue" @click="walletLogin('ONT')">
          <img src="@/assets/img/icon_logo_ont.svg" alt="ONT">
        </div>
        <div class="oauth-bg bg-purple" @click="walletLogin('GitHub')">
          <svg-icon class="github" icon-class="github" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from 'vuex'
import { idProvider } from './icon.js'

export default {
  name: 'LoginContent',
  data() {
    const checkEmail = async (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入邮箱地址'))
      } else {
        // const res = await this.$API.verifyEmail(value)
        // if (res.data) {
        //   callback()
        // } else {
        //   callback(new Error('邮箱尚未注册'))
        // }
        callback()
      }
    }
    return {
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
    }
  },
  computed: {
    ...mapState(['userConfig']),
    ...mapGetters(['currentUserInfo'])
  },
  methods: {
    ...mapActions(['signIn']),
    async walletLogin(type) {
      if (type === 'GitHub') {
        this.$router.push({ name: 'login' })
        return
      }
      await this.signInx(type)
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
              this.$store.commit('setUserConfig', { idProvider: 'Email' })
              this.$message.success('登录成功')
              this.$emit('hide')
            } else {
              this.$message.error(`登录失败，账号或密码错误`)
            }
          } catch (error) {
            this.$message.error('登录失败，请联系管理员')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    switchRegister() {
      this.$emit('switch')
    }
  }
}
</script>

<style lang="less" scoped>
.bottom-tip {
  font-size: 14px;
  float: right;
  line-height: 20px;
  margin-top: 10px;
}
.oauth-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  .oauth-title {
    font-size: 16px;
    color: #000000;
    margin-bottom: 0;
    font-weight: 400;
  }
  .warning-tip {
    font-size: 14px;
    color: #FB6877;
    margin-bottom: 20px;
    font-weight: 400;
  }
  .oauth {
    .eos {
      font-size: 24px;
      color: #fff;
    }
    .github {
      font-size: 22px;
      color: #fff;
    }
    .flexCenter();
    .oauth-bg {
      cursor: pointer;
      .flexCenter();
      width: 32px;
      height: 32px;
      border-radius: 50%;
      padding: 6px;
      img {
        width: 20px;
      }
      +.oauth-bg {
        margin-left: 30px;
      }
    }
  }
}
.bg-black {
  background: #000000;
}
.bg-gray {
  background: #333;
}
.bg-blue {
  background: #4d9afd;
}
.bg-purple {
  background: #882592;
}
</style>
