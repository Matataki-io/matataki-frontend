<template>
  <el-dialog
    :visible.sync="showModal"
    width="380px"
    :modal="true"
    custom-class="my-dialog"
    :close-on-click-modal="false"
    @closed="() => {step = 1; isLogin = true}"
  >
    <section v-show="step === 1" class="auth-main">
      <div class="auth-title-container">
        <span :class="['auth-title', {'active':isLogin}]" @click="isLogin=true">登录</span>
        <span :class="['auth-title', {'active':!isLogin}]" @click="isLogin=false">注册</span>
      </div>
      <div class="loginRegister">
        <Login v-show="isLogin" @switch="isLogin = false" @hide="showModal = false" />
        <Register v-show="!isLogin" @switch="isLogin = true" />
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
/* eslint-disable */
import Wallet from './wallet'
import Login from './login'
import Register from './register'

export default {
  name: 'AuthModal',
  components: {
    Wallet,
    Login,
    Register
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
  methods: {
  }
}
</script>

<style src="./auth.less" lang="less" scoped>
</style>
