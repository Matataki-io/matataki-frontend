<template>
  <transition name="fade">
    <el-tooltip
      v-if="show"
      class="item"
      effect="dark"
      :content="$t('anyFeedback')"
      placement="left"
    >
      <!-- 84254 -->
      <a
        class="feedback"
        href="http://andoromeda.mikecrm.com/a93Le8z"
        target="_blank"
        :title="$t('anyFeedback')"
      >
        <svg-icon
          class="icon-feedback"
          icon-class="tucao"
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
  width: 45px;
  height: 45px;
  cursor: pointer;
  z-index: 99;
  font-size: 14px;
  position: fixed;
  right: 40px;
  bottom: 60px;
  color: #b2b2b2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
  &:hover {
    opacity: 0.9;
  }
  .icon-feedback {
    color: #b2b2b2;
    font-size: 24px;
  }
}

@media screen and (max-width: 768px) {
  .feedback {
    right: 20px;
    width: 30px;
    height: 30px;
    .icon-feedback {
      font-size: 16px;
    }
  }
}
</style>