<template>
  <section v-loading="loading" class="login">
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
          <span class="red">首次登录领{{ $point.loginNew }}积分！</span>
          <!-- <a href="javascript:void(0);">忘记密码</a> |  -->
          <a href="javascript:void(0);" @click="switchRegister">注册</a>
        </div>
      </el-form-item>
    </el-form>
    <div class="oauth-box">
      <h1 class="oauth-title">
        第三方账号登录
      </h1>
      <p class="warning-tip">
        不同帐号内容不互通
      </p>
      <div class="oauth">
        <el-tooltip class="item" effect="dark" content="VNT登录" placement="top">
          <div class="oauth-bg bg-blue1" @click="walletLogin('Vnt')">
            <svg-icon class="vnt" icon-class="vnt" />
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="EOS登录" placement="top">
          <div class="oauth-bg bg-gray" @click="walletLogin('EOS')">
            <svg-icon class="eos" icon-class="eos_login" />
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="ONT登录" placement="top">
          <div class="oauth-bg bg-blue" @click="walletLogin('ONT')">
            <img src="@/assets/img/icon_logo_ont.svg" alt="ONT">
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="GitHub登录" placement="top">
          <div class="oauth-bg bg-purple" @click="walletLogin('GitHub')">
            <svg-icon class="github" icon-class="github" />
          </div>
        </el-tooltip>
      </div>
    </div>
    <img v-if="referral" class="referral" src="@/assets/img/invite.png" alt="已邀请">
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
      referral: false,
      loading: false
    }
  },
  computed: {
    ...mapState(['userConfig', 'loginModalShow']),
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    // 登录框关闭 隐藏loading
    loginModalShow(newVal) {
      if (!newVal) this.loading = false
    }
  },
  mounted(){
    if (process.browser) {
      this.isReferral()
      this.getReferral()
    }
  },
  methods: {
    ...mapActions(['signIn']),
    ...mapActions('vnt', [
      'login',
    ]),
    async walletLogin(type) {
      if (type === 'GitHub') {
        this.$router.push({ name: 'login' })
        return
      } else if (type === 'Vnt') {
        this.vntLogin()
      } else await this.signInx(type)
    },
    async signInx(type) {
      try {
        await this.signIn({ idProvider: type })
        this.$store.commit('setLoginModal', false)
        this.$backendAPI.accessToken = this.currentUserInfo.accessToken
        window.location.reload() // 登录完成刷新一次
      } catch (error) {
        try {
          await this.signIn({ idProvider: type })
          this.$store.commit('setLoginModal', false)
          this.$backendAPI.accessToken = this.currentUserInfo.accessToken
          window.location.reload() // 登录完成刷新一次
        } catch (err) {
          console.log('signInx 错误', err)
          this.$message.error('登录失败')
        }
      }
    },
    async vntLogin() {
      this.loading = true
      try {
        let res = await this.$store.dispatch('vnt/login')
        this.$store.commit('setUserConfig', { idProvider: 'Vnt' })
        this.loading = false
        this.$message.closeAll()
        this.$message.success(res)
        await this.$store.commit('setLoginModal', false)
        window.location.reload()
      } catch (error) {
        this.loading = false
        this.$message.closeAll()
        this.$message.error(error.toString())
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
              window.location.reload() // 登录完成刷新一次
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
    },
    // 是否有推荐
    isReferral() {
      let search = window.location.search.slice(1)
      let searchArr = search.split('&')
      let searchFilter = searchArr.filter((i) => i.includes('referral='))
      // 有邀请id
      if (searchFilter.length !== 0) this.$utils.setCookie('referral', searchFilter[0].slice(9))
      else { // 如果没有邀请连接
        // 检查是否有邀请id 有则删除
        let referral = this.$utils.getCookie('referral')
        if (referral) this.$utils.delCookie('referral')
      }
      // console.log(this.referral)
    },
    // 得到邀请状态
    getReferral() {
      let referral = this.$utils.getCookie('referral')
      if (referral) this.referral = true
    }
  }
}
</script>

<style lang="less" scoped>
.bottom-tip {
  width: 100%;
  font-size: 14px;
  float: right;
  line-height: 20px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .red {
    color:#FB6877;
  }
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
    margin: 14px 0 22px;
    font-weight: 400;
  }
  .oauth {
    .vnt {
      font-size: 24px;
      padding-top: 2px;
      color: #fff;
    }
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
.bg-blue1 {
  background: #3289ff;
}
.bg-purple {
  background: #882592;
}

.referral {
  height: 30px;
  position: absolute;
  right: 20px;
  top: 0;
}
</style>
