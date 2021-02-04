<template>
  <el-dialog
    :visible.sync="showModal"
    :modal="true"
    :close-on-click-modal="false"
    width="380px"
    custom-class="my-dialog br10 auth-dialog"
    :before-close="handleClose"
  >
    <inputContent
      style="margin-top: 20px;"
      :reference="reference"
      :reset="reset"
      @pushed="pushed"
    />
  </el-dialog>
</template>

<script>
import inputContent from './input_content.vue'

export default {
  name: 'AuthModal',
  components: {
    inputContent
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    preset: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showModal: false,
      reference: null,
      reset: 0
    }
  },
  computed: {
  },
  watch: {
    value(nVal) {
      if (nVal !== this.showModal) {
        this.showModal = nVal
        this.started(nVal)
      }
    },
    showModal(nVal) {
      if (nVal !== this.value) {
        this.$emit('input', nVal)
        this.started(nVal)
      }
    }
  },
  mounted() {
    this.showModal = this.value
  },
  methods: {
    started(status) {
      if (!status) return
      this.initInput()
    },
    initInput() {
      this.reset = Date.now()
      const {
        reference
      } = { ...this.preset }
      this.reference = reference || null
    },
    pushed() {
      this.$emit('pushed')
    },
    handleClose(done) {
      this.$confirm('未发布的内容将会丢失', '确认关闭？')
        .then(() => {
          this.reset = Date.now()
          done()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
// <420
@media screen and (max-width: 420px) {
  /deep/ .auth-dialog {
    width: 90% !important;
  }
}
</style>
