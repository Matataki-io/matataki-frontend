<template>
  <el-dialog
    :title="title"
    :visible.sync="shareDialogVisible"
    width="90%"
    center
  >
    <slot />
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shareDialogVisible: false
    }
  },
  watch: {
    value(newVal) {
      this.shareDialogVisible = newVal
    },
    shareDialogVisible(newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>
