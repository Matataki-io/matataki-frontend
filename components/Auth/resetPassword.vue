<template>
  <!-- v-show="!isLogin" -->
  <section class="resetPassword">
    <h1>重置密码</h1>
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="ss-form">
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          :placeholder="$t('rule.loginEmailMessage')"
          type=""
        />
      </el-form-item>
      <input type="text" class="is-hidden"></input>
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
            @click="sendCode"
            type="primary"
          >
            {{ timer ? `${count}S` : $t('auth.getEmailCode') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input
          v-model="registerForm.repassword"
          type="password"
          placeholder="请在输入一遍新密码"
          show-password
        />
      </el-form-item>
      <el-form-item class="ss-btn">
        <el-button @click="submitRegisterForm" type="primary">
          重置密码
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
/* eslint-disable */
const TIME_COUNT = 60
import utils from "@/utils/utils";
export default {
  name: 'RegisterContent',
  data() {
    const checkEmail = async (rule, value, callback) => {
      if (value === '') {
        return callback(new Error(this.$t('rule.loginEmailMessage')))
      } else {
        const res = await this.$API.verifyEmail(value)
        if (!res.data) {
          callback(new Error('邮箱未注册'))
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
        callback(new Error(this.$t('rule.inputLengthNumber')))
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
          { min: 8, max: 16, message: this.$t('rule.passwordLengthMessage', [8, 16]), trigger: 'blur' }
        ],
        repassword: { validator: validatePass2, trigger: 'blur' },
        smscode: { validator: checkCode, trigger: 'blur' }
      },
    }
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
    successToast(msg) {
      this.$message.success(msg)
    },
    failToast(msg) {
      this.$message.error(msg)
    },
    confirmSendCode(gt) {
      this.$API.getResetCaptcha(this.registerForm.email, {
        geetest_challenge: gt.geetest_challenge,
        geetest_validate: gt.geetest_validate,
        geetest_seccode: gt.geetest_seccode
      }).then(res => {
        if (res.code === 0) {
          this.countDown()
          this.successToast(this.$t('success.codeSendSuccess', [5]))
        } else {
          this.failToast(this.$t('error.codeSendFail'))
        }
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
    async submitRegisterForm() {
      await this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          let params = {
            email: this.registerForm.email,
            captcha: this.registerForm.smscode,
            password: this.registerForm.password
          }

          try {
            this.loading = true
            const res = await this.$API.resetPassword(params)
            console.log(res)
            if (res.code === 0) {
              this.successToast('密码修改成功，请重新登录')
              this.$emit('switch')
            } else {
              this.failToast('密码修改失败')
            }
            this.loading = false
          } catch (error) {
            this.failToast('密码修改失败')
            this.loading = false
          }
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.is-hidden {
  position: absolute;
  left: -10000px;
  top: -10000px;
}
.resetPassword {
  h1 {
    margin: 10px 0 20px 0;
    font-size: 20px;
  }
  .code-contaniner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      margin-left: 10px;
      text-align: center;
    }
  }
}
</style>
