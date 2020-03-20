<template>
  <section class="register">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="ss-form"
    >
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          :placeholder="$t('rule.loginEmailMessage')"
          type=""
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          :placeholder="$t('rule.setPassword')"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input
          v-model="registerForm.repassword"
          :placeholder="$t('rule.setPasswordAgain')"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item prop="smscode">
        <div class="code-contaniner">
          <el-input
            v-model="registerForm.smscode"
            :placeholder="$t('rule.emailCode')"
            autocomplete="off"
          />
          <el-button
            :loading="loading"
            :disabled="!!timer || loading"
            type="primary"
            @click="sendCode"
          >
            {{ timer ? `${count}S` : $t('auth.getEmailCode') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item class="ss-btn">
        <el-button
          type="primary"
          @click="submitRegisterForm"
        >
          {{ $t('registered') }}
        </el-button>
      </el-form-item>
    </el-form>
    <img
      v-if="referral"
      class="referral"
      src="@/assets/img/invite.png"
      alt="$t('auth.invite')"
    >
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
        return callback(new Error(this.$t('rule.loginEmailMessage')))
      } else {
        const res = await this.$API.verifyEmail(value)
        if (res.data) {
          callback(new Error(this.$t('rule.emailHasBeenRegistered')))
        } else {
          callback()
        }
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('rule.inputPasswordAgain')))
      } else if (value !== this.registerForm.password) {
        callback(new Error(this.$t('rule.twiceInputPasswordInconsistent')))
      } else {
        callback()
      }
    }
    const checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('rule.emailCode')))
      }
      if (!Number.isInteger(Number(value))) {
        callback(new Error(this.$t('rule.inputNumber')))
      } else if (value.toString().length !== 6) {
        callback(new Error(this.$t('rule.inputLengthNumber', [6])))
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
          { type: 'email', message: this.$t('rule.emailMessage'), trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: this.$t('rule.passwordMessage'), trigger: 'blur' },
          { min: 8, max: 16, message:  this.$t('rule.passwordLengthMessage', [8, 16]), trigger: 'blur' }
        ],
        repassword: { validator: validatePass2, trigger: 'blur' },
        smscode: { validator: checkCode, trigger: 'blur' }
      },
      referral: false
    }
  },
  mounted() {
    if (process.browser) this.getReferral()
  },
  methods: {
    registerInitGT(cb) {
      this.$API.registerGT().then(res => {
        window.initGeetest({
          // 以下 4 个配置参数为必须，不能缺少
          gt: res.gt,
          challenge: res.challenge,
          offline: !res.success, // 表示用户后台检测极验服务器是否宕机
          new_captcha: res.new_captcha, // 用于宕机时表示是新验证码的宕机
          product: "bind", // 产品形式，包括：float，popup
          width: "300px"
          // 更多配置参数说明请参见：http://docs.geetest.com/install/client/web-front/
        }, (captchaObj) => {
          this.captchaObj = captchaObj;
          captchaObj.onReady(() => {
            captchaObj.verify();
          }).onSuccess(() => {
            const result = captchaObj.getValidate();
            if (!result) {
              this.$message.error(this.$t('rule.pleaseDoneRule'))
            } else {
              cb(result);
            }
            // this.validateGT(result, captchaObj);
          });
        });
      })
    },
    confirmSendCode(gt) {
      this.loading = true
      this.$API.getCaptcha(this.registerForm.email, {
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
        this.loading = false
      })
    },
    sendCode() {
      this.$refs.registerForm.validateField('email', async (error) => {
        if (error) {
          console.error('sendCode error', error)
        } else {
          this.registerInitGT(this.confirmSendCode)
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
          let params = {
            email: this.registerForm.email,
            captcha: this.registerForm.smscode,
            password: this.registerForm.password
          }
          // 检查是否有邀请id
          let referral = this.$utils.getCookie('referral')
          if (referral) Object.assign(params, { referral: referral })
          try {
            const res = await this.$API.register(params)
            if (res.code === 0) {
              this.$message.success(this.$t('success.registeredSuccess'))
              this.$emit('switch')
              this.isLogin = true
            } else {
              this.$message.error(res.message)
            }
          } catch (error) {
            this.$message.error(this.$t('error.registeredFail'))
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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

.referral {
  height: 30px;
  position: absolute;
  right: 20px;
  top: 0;
}
</style>
