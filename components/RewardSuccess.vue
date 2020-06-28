<template>
  <el-dialog
    :visible.sync="showModal"
    title=""
    :close-on-click-modal="false"
    :show-close="false"
    custom-class="reward-dialog br10"
  >
    <div class="reward-success">
      <div class="image">
        <img src="@/assets/img/zan.png" alt="zan">
      </div>
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
  .image {
    width: 152px;
    img {
      width: 100%;
    }
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

/deep/ .reward-dialog {
  width: 380px !important;
}
@media screen and (max-width: 640px) {
  /deep/ .reward-dialog {
    width: 90% !important;
  }
}
</style>
