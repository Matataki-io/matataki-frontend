<template>
  <div class="container">
    <div class="email">
      <img
        src="@/assets/img/m_logo.png"
        class="logo"
        alt="logo"
      >
      <h1>{{ $t('bind-email') }}</h1>
      <div
        v-if="setp === 0"
        class="step"
      >
        <p class="setp-title">
          {{ $t('please-enter-your-email-account') }}
        </p>
        <el-form
          ref="emailAddress"
          :rules="rules"
          :model="emailAddress"
          @submit.native.prevent
        >
          <el-form-item
            label=""
            prop="email"
          >
            <el-input
              v-model="emailAddress.email"
              :placeholder="$t('please-enter-your-email-account')"
              clearable
              @change="emailAddressOnSubmit('emailAddress')"
            />
          </el-form-item>
          <el-button
            v-loading="nextLoading"
            @click="emailAddressOnSubmit('emailAddress')"
          >
            {{ $t('postminetoken.next') }}
          </el-button>
        </el-form>
      </div>
      <div
        v-if="setp === 1"
        class="step"
      >
        <el-form
          ref="emailPass"
          :rules="rulesPass"
          :model="emailPass"
        >
          <el-form-item
            label=""
            prop="pass"
          >
            <p class="setp-title">
              {{ $t('please-set-your-password') }}
            </p>
            <el-input
              v-model="emailPass.pass"
              type="text"
              :placeholder="$t('please-set-your-password')"
              show-password
            />
          </el-form-item>
          <el-form-item
            label=""
            prop="code"
          >
            <p class="setp-title code">
              {{ $t('please-enter-verification-code') }}
            </p>
            <div class="setp-code">
              <el-input
                v-model="emailPass.code"
                type="text"
                maxlength="6"
                :placeholder="$t('please-enter-verification-code')"
              />
              <el-button
                :loading="codeLoading"
                :disabled="!!timer || codeLoading"
                type="primary"
                class="btn"
                @click="sendCode"
              >
                {{ timer ? `${count}S` : $t('auth.getEmailCode') }}
              </el-button>
            </div>
          </el-form-item>
          <el-button @click="setp--">
            {{ $t('postminetoken.prev') }}
          </el-button>
          <el-button
            v-loading="loading"
            type="primary"
            @click="emailPassOnSubmit('emailPass')"
          >
            {{ $t('postminetoken.stepOneBuild') }}
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie } from '@/utils/cookie'

export default {
  layout: 'empty',
  name: 'Email',
  data() {
    const validateEmail = async (rule, value, callback) => {
      if (this.emailAddress.email === '') {
        callback(new Error('请输入账号'))
      } else {
        try {
          this.nextLoading = true
          const res = await this.$API.verifyEmail(this.emailAddress.email)
          this.nextLoading = false
          if (res.data) {
            callback(new Error('账号已存在'))
          } else {
            callback()
          }
        } catch (error) {
          console.log(error)
          callback(new Error('验证账号失败,请重试'))
        }
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
      TIME_COUNT: 60,
      nextLoading: false,
      codeLoading: false,
      count: '',
      timer: null,
      loading: false,
      setp: 0,
      rules: {
        email: [
          { validator: validateEmail, trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      rulesPass: {
        pass: [
          { validator: validateEmailPass, trigger: 'blur' },
          { min: 8, max: 16, message: this.$t('rule.passwordLengthMessage', [8, 16]), trigger: 'blur' }
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
      if (!getCookie('ACCESS_TOKEN')) return this.$store.commit('setLoginModal', true)
      if (await this.setpFunc(formName)) {
        if (this.setp >= 2) return
        ++this.setp
      }
    },
    async emailPassOnSubmit(formName) {
      if (!getCookie('ACCESS_TOKEN')) return this.$store.commit('setLoginModal', true)
      if (await this.setpFunc(formName)) {
        this.loading = true
        const params = {
          platform: 'email',
          email: this.emailAddress.email,
          password: this.emailPass.pass,
          captcha: this.emailPass.code
        }
        this.$API.accountBind(params).then(res => {
          if (res.code === 0) {
            this.$message({ showClose: true, message: res.message, type: 'success'})
            if (window.opener) {
              window.opener.location.reload()
              window.close()
            }
          } else {
            this.$message({ showClose: true, message: res.message, type: 'warning'})
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('邮箱绑定失败')
        }).finally(() => {
          this.loading = false
        })
      }
    },
    registerInitGT(cb) {
      this.$API.registerGT().then(res => {
        window.initGeetest({
          // 以下 4 个配置参数为必须，不能缺少
          gt: res.gt,
          challenge: res.challenge,
          offline: !res.success, // 表示用户后台检测极验服务器是否宕机
          new_captcha: res.new_captcha, // 用于宕机时表示是新验证码的宕机
          product: 'bind', // 产品形式，包括：float，popup
          width: '300px'
          // 更多配置参数说明请参见：http://docs.geetest.com/install/client/web-front/
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          captchaObj.onReady(() => {
            captchaObj.verify()
          }).onSuccess(() => {
            const result = captchaObj.getValidate()
            if (!result) {
              this.$message.error(this.$t('rule.pleaseDoneRule'))
            } else {
              cb(result)
            }
            // this.validateGT(result, captchaObj);
          })
        })
      })
    },
    confirmSendCode(gt) {
      this.codeLoading = true
      this.$API.getCaptcha(this.emailAddress.email, {
        geetest_challenge: gt.geetest_challenge,
        geetest_validate: gt.geetest_validate,
        geetest_seccode: gt.geetest_seccode
      }).then(res => {
        if (res.code === 0) {
          this.countDown()
          this.$message.success(this.$t('success.codeSendSuccess', [5]))
        } else {
          this.$message.error(this.$t('error.codeSendFail'))
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.codeLoading = false
      })
    },
    async sendCode() {
      // await this.countDown()
      if (!getCookie('ACCESS_TOKEN')) return this.$store.commit('setLoginModal', true)
      await this.registerInitGT(this.confirmSendCode)
    },
    // 倒计时函数
    countDown() {
      if (!this.timer) {
        this.count = this.TIME_COUNT
        this.text = false
        this.timer = setInterval(() => {
          if (this.count > 1 && this.count <= this.TIME_COUNT) {
            this.count--
          } else {
            this.text = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
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
      margin-top: 0;
    }
  }
}
.setp-code {
  display: flex;
  align-items: center;
  .btn {
    margin-left: 10px;
  }
}
.logo {
  display: block;
  height: 34px;
  margin: 0 auto;
}
</style>
