<template>
  <el-dialog
    :title="title"
    :visible.sync="shareDialogVisible"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
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
    width: {
      type: String,
      default: '90%'
    },
    value: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
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
