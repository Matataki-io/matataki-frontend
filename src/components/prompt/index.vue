<template>
  <van-popup v-model="show" :overlay="true" class="container">
    <h1>{{ content.title }}</h1>
    <button class="btn blue" @click="confirm">{{ content.confirmText }}</button>
    <button class="btn gray" @click="cancel">{{ content.cancelText }}</button>
  </van-popup>
</template>

<script>
export default {
  name: 'Prompt',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: () => {
        return {
          title: '是否删除草稿？',
          confirmText: '删除草稿',
          cancelText: '不删除'
        }
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px 60px;
  text-align: center;
  h1 {
    color: #000000;
    font-size: 20px;
    line-height: 28px;
    margin: 0 0 20px;
    font-weight: 700;
  }
}
.btn {
  width: 195px;
  border-radius: 6px;
  border: none;
  color: #ffffff;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 20px;
}
.blue {
  background: #1c9cfe;
}
.gray {
  background: #b2b2b2;
}
</style>
