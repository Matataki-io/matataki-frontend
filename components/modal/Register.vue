<template>
  <el-dialog :visible.sync="showModal" width="400px" :lock-scroll="false" @close="change" custom-class="gray-bg">
    <el-form label-position="right" label-width="80px" :model="formLabelAlign">
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="formLabelAlign.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="smscode" label="验证码" class="code">
        <el-input v-model="formLabelAlign.smscode" placeholder="验证码"></el-input>
        <el-button type="primary" :disabled="isDisabled" @click="sendCode">{{buttonText}}</el-button>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="formLabelAlign.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="rePassword" label="重复密码">
        <el-input v-model="formLabelAlign.rePassword" placeholder="重复密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" style="width:100%;">注册</el-button>
        <p class="login" @click="gotoLogin">已有账号？立即登录</p>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'RegisterModal',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false,
      buttonText: '发送验证码',
      formLabelAlign: {
        email: '',
        smscode: '',
        password: '',
        rePassword: ''
      }
    }
  },
  computed: {},
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    }
  },
  mounted() {},
  methods: {
    sendCode() {

    },
    submitForm() {

    }
  }
}
</script>

<style scoped lang="less">
.code > .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code button {
  margin-left: 20px;
  width: 140px;
  text-align: center;
}
</style>
