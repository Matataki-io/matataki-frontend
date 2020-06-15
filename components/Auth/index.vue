<template>
  <el-dialog
    :visible.sync="showModal"
    :modal="true"
    :close-on-click-modal="false"
    width="380px"
    custom-class="my-dialog br10 auth-dialog"
    @closed="() => {step = 1; isLogin = true}"
  >
    <section
      v-show="step === 1"
      class="auth-main"
    >
      <div class="auth-title-container">
        <span
          :class="['auth-title', {'active':isLogin}]"
          @click="isLogin=true"
        >
          {{ $t('login') }}</span>
        <span
          :class="['auth-title', {'active':!isLogin}]"
          @click="isLogin=false"
        >
          {{ $t('registered') }}</span>
      </div>
      <div class="loginRegister">
        <Login
          v-show="isLogin"
          @switch="step = 3"
          @hide="showModal = false"
        />
        <Register
          v-show="!isLogin"
          @switch="isLogin = true"
        />
      </div>
    </section>
    <Wallet v-show="step === 2" />
    <section
      v-show="step === 3"
      class="auth-main"
    >
      <ResetPassword @switch="step = 1;isLogin = true;" />
    </section>
    <div
      class="footer-arrow"
      @click="step === 1 ? (step = 2) : (step = 1)"
    >
      <div
        v-if="step === 2 || step === 3"
        class="arrow"
      >
        <i class="el-icon-arrow-left" />
      </div>
      <span>{{ step === 1 ? $t('auth.viewWallet') : $t('auth.backLogin') }}</span>
      <div
        v-if="step === 1"
        class="arrow"
      >
        <i class="el-icon-arrow-right" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import Wallet from './wallet'
import Login from './login'
import Register from './register'
import ResetPassword from './resetPassword'
export default {
  name: 'AuthModal',
  head: {
    script: [
      { src: '/bowl.min.js' }
    ]
  },
  components: {
    Wallet,
    Login,
    Register,
    ResetPassword
  },
  data() {
    return {
      isLogin: true,
      step: 1,
      showModal: false,
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
  },
  created() {
    if (process.browser) {
      this.injectScript()
    }
  },
  methods: {
    injectScript() {
      try {
        var bowl = new Bowl()
        bowl.add([
          { url: '/gt.js', key: 'gt' }
        ])
        bowl.inject().then(() => {
          console.log('success')
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style src="./auth.less" lang="less" scoped>
</style>


<style lang="less" scoped>
// <420
@media screen and (max-width: 420px) {
  /deep/ .auth-dialog {
    width: 90% !important;
  }
}
</style>