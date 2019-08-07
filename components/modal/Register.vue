<template>
  <el-dialog :visible.sync="showModal" width="400px" :lock-scroll="false" @close="change" custom-class="gray-bg">
    <el-form label-position="right" label-width="80px" :model="formLabelAlign">
      <el-form-item label="邮箱">
        <el-input v-model="formLabelAlign.email"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="formLabelAlign.vCode"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formLabelAlign.vCode"></el-input>
      </el-form-item>
      <el-form-item label="重复密码">
        <el-input v-model="formLabelAlign.vCode"></el-input>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input v-model="formLabelAlign.type"></el-input>
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
      labelPosition: 'right',
      formLabelAlign: {
        email: '',
        vCode: '',
        password: '',
        rePassword: '',
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
  methods: {}
}
</script>

<style scoped lang="less">
</style>
