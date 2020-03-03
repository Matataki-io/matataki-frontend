<template>
  <transition name="fade">
    <el-tooltip v-if="show" class="item" effect="dark" :content="$t('sidebar.feedback') + '?'" placement="left">
      <!-- 84254 -->
      <a class="feedback" href="https://support.qq.com/product/98576" target="_blank" title="反馈">
        <svg-icon
          class="icon-feedback"
          icon-class="tgc"
        />
      </a>
    </el-tooltip>
  </transition>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  props: {
    showPosition: {
      type: Number,
      default: 0,
      scrollEvent: null
    }
  },
  data() {
    return {
      show: this.showPosition === 0
    }
  },
  mounted() {
    if (process.browser) {
      this.$nextTick(() => {
        if (this.showPosition !== 0) {
          this._scrollShow()
          this.scrollEvent = throttle(this._scrollShow, 300)
          window.addEventListener('scroll', this.scrollEvent)
        }
      })
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollEvent)
  },
  methods: {
    _scrollShow() {
      const currentTop = document.body.scrollTop || document.documentElement.scrollTop
      if (currentTop > this.showPosition) this.show = true
      else this.show = false
    }
  }
}
</script>

<style scoped lang="less">
.feedback {
  border-radius: 50%;
  position: fixed;
  width: 50px;
  height: 50px;
  color: #fff;
  background: @purpleDark;
  cursor: pointer;
  bottom: 40px;
  right: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all .3s;
  z-index: 99;
  // box-shadow: 0 4px 24px rgba(84, 45, 224, .5);
    &:hover {
    opacity: 0.9;
  }
  .icon-feedback {
    font-size: 30px;
    color: #fff;
  }
}
</style>
