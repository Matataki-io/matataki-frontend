<template>
  <div
    class="header"
    :style="headBc"
    :class="[isCenter && 'mw', scrollToggleStatus && 'bc', hasBottomBorderLine && 'border-bottom']"
  >
    <div slot="left" class="header-left">
      <svg-icon
        icon-class="back1"
        :style="{ color: iconColor }"
        class="back-icon"
        @click="goBack"
      />
      <svg-icon icon-class="home" :style="{ color: iconColor }" class="home-icon" @click="goHome" />
    </div>
    <p
      v-if="!showLogo"
      slot="title"
      :class="[scrollShowTitle && 'scroll', scrollShowTitle && scrollToggleStatus && 'scroll-show']"
      class="title"
    >
      {{ pageinfo.title }}
    </p>
    <img v-else class="logo" src="@/assets/img/logo.png" alt="logo" />
    <div
      slot="right"
      :class="[scrollShowTitle && 'scroll', scrollShowTitle && scrollToggleStatus && 'scroll-show']"
      class="header-right"
    >
      <slot name="info" />
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // mapGetters 未使用
import throttle from 'lodash/throttle'

export default {
  name: 'BaseHeader',
  props: {
    // 页面信息
    pageinfo: {
      type: Object,
      default: () => {}
    },
    // 是否居中显示 是否添加 class mw
    isCenter: {
      type: Boolean,
      default: true
    },
    // 自定义返回方法
    customizeBackFunc: {
      type: Boolean,
      default: false
    },
    // 自定义Home方法
    customizeHomeFunc: {
      type: Boolean,
      default: false
    },
    white: {
      type: Boolean,
      default: false
    },
    // 自定义图标颜色
    iconColor: {
      type: String,
      default: '#000'
    },
    // 自定义头部背景
    customizeHeaderBc: {
      type: String,
      default: 'transparent'
    },
    // 滚动切换的背景颜色
    scrollToggleBc: {
      type: String,
      default: '#fff'
    },
    // 滚动显示标题
    scrollShowTitle: {
      type: Boolean,
      default: false
    },
    // 滚动现实右侧slot
    scrollShowRight: {
      type: Boolean,
      default: false
    },
    // 是否滚动后发送事件
    isScrollEmit: {
      type: Boolean,
      default: false
    },
    // 有下边框线
    hasBottomBorderLine: {
      type: Boolean,
      default: false
    },
    // 显示logo
    showLogo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollToggleStatus: false
    }
  },
  computed: {
    headBc() {
      if (this.scrollToggleStatus) {
        return {
          background: this.scrollToggleBc //  默认当前背景色
        }
      } else {
        return {
          background: this.customizeHeaderBc //  默认当前背景色
        }
      }
    }
  },
  watch: {
    isLogined(newState) {
      if (newState) this.$Message.success('登录成功')
    }
  },
  created() {
    this.addHandleScroll()
  },
  destroyed() {
    this.removeHandleScroll()
  },
  // 依據 https://blog.csdn.net/m0_37728716/article/details/81289317
  // 從 crearted 改成 mounted
  // 這極有可能是這幾天錢包登陸老是有問題的原因
  // 依據 https://github.com/vuejs/vue/issues/7333
  // 已確認此 Header.vue 的 crearted 內容不會被執行
  mounted() {
    // console.log('Does this page need to log in?:', this.pageinfo.needLogin);
  },
  methods: {
    ...mapGetters(['isLogined']),
    // 返回
    goBack() {
      if (this.customizeBackFunc) {
        this.$emit('headerBackFunc')
      } else {
        this.$router.go(-1)
      }
    },
    // 回到首页
    goHome() {
      if (this.customizeHomeFunc) {
        this.$emit('headerHomeFunc')
      } else {
        this.$router.push({ name: 'home' })
      }
    },
    addHandleScroll() {
      window.addEventListener('scroll', throttle(this.handleScroll, 150))
    },
    handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // console.log(scrollTop);
      if (scrollTop > 10) {
        this.scrollToggleStatus = true
      } else {
        this.scrollToggleStatus = false
      }
      // console.log(this.isScrollEmit, this.scrollToggleStatus);
      this.isScrollEmit && this.$emit('scrollToggleStatus', this.scrollToggleStatus)
    },
    removeHandleScroll() {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
}
</script>

<style lang="less" scoped>
.scrollShow() {
  &.scroll {
    visibility: hidden;
    transition: all 0.28s;
    opacity: 0;
  }
  &.scroll-show {
    visibility: initial;
    opacity: 1;
  }
}
.header {
  min-height: 45px;
  background-color: transparent;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  transition: all 0.6s;
  &.bc {
    // background-color: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
  }
  &.border-bottom {
    border-bottom: 1px solid #dbdbdb;
  }
}
.header-left {
  position: absolute;
  left: 20px;
  display: flex;
  align-items: center;
}
.title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #000;
  .scrollShow();
}
.logo {
  width: 165px;
}
.header-right {
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  .scrollShow();
}
.back-icon {
  transform: scale(1.4);
  cursor: pointer;
  &.white {
    color: #fff;
  }
}

.home-icon {
  margin-left: 14px;
  transform: scale(1.9);
  cursor: pointer;
  &.white {
    color: #fff;
  }
}
</style>
