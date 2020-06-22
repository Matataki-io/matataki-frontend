<template>
  <el-dialog
    :visible.sync="showModal"
    title=""
    :close-on-click-modal="false"
    :show-close="false"
    custom-class="br10"
    width="380px"
  >
    <div class="reward-success">
      <img src="@/assets/img/zan.png" alt="zan">
      <h1>打赏成功！</h1>
      <p class="success-tip">你的鼓励会成为作者的动力，感谢打赏！</p>
      <el-button
        type="primary"
        class="success-btn"
        @click="showModal = false"
      >
        完成
      </el-button>
    </div>
  </el-dialog>
  <!-- </m-dialog> -->
</template>

<script>

export default {
  name: 'TransferSuccess',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    },
  },
}
</script>

<style lang="less" scoped>
.reward-success {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.success-btn {
  width: 200px;
}
.success-tip {
  margin: 20px 0 40px 0;
  font-size: 16px;
}
</style>
