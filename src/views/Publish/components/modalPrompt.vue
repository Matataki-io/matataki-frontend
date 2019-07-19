<template>
  <Modal
    v-model="showModaCopy"
    footer-hide
    width="330"
    class-name="modalCenter"
    @on-visible-change="change"
  >
    <div class="info-content">
      <p v-for="(item, index) in modalText.text" :key="index">{{ item }}</p>
      <a class="success" href="javascript:;" @click="success">{{ modalText.button[0] }}</a>
      <a class="cancel" href="javascript:;" @click="cancel">{{ modalText.button[1] }}</a>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'ModalPrompt',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    modalText: {
      type: Object,
      default: () => ({
        text: ['提示'],
        button: ['确认', '取消']
      })
    }
  },
  data() {
    return {
      showModaCopy: this.showModal
    }
  },
  watch: {
    showModal(newVal) {
      this.showModaCopy = newVal
    }
  },
  methods: {
    change(status) {
      this.showModaCopy = status
      this.$emit('changeInfo', status)
    },
    success() {
      this.$emit('modalSuccess')
      this.change(false)
    },
    cancel() {
      this.$emit('modalCancel')
    }
  }
}
</script>

<style lang="less" scoped>
.info-content {
  margin: 0 10px;
  p {
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
    font-weight: 500;
    color: #484848;
    line-height: 1.5;
    letter-spacing: 1px;
    margin: 10px 0;
    &:nth-child(1) {
      margin-top: 20px;
    }
  }
  a {
    display: block;
    width: 270px;
    height: 46px;
    color: #fff;
    text-align: center;
    line-height: 46px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    border-radius: 3px;
    margin: 12px auto;
    cursor: pointer;
    &.success {
      background-color: #478970;
      margin-top: 30px;
    }
    &.cancel {
      background-color: #d7d7d7;
    }
  }
}
</style>
