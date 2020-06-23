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
  img {
    width: 152px;
  }
  h1 {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 28px;
    padding: 0;
    margin: 36px 0 20px;
  }
}
.success-btn {
  width: 200px;
  margin-top: 40px;
}
.success-tip {
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 22px;
  padding: 0;
  margin: 0;
}
</style>
