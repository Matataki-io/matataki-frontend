<template>
  <div class="app">
    <nuxt />
    <g-footer />
    <back-to-top
      :visibility-height="300"
      :back-position="50"
      class="backtop"
      transition-name="fade"
    >
      <svg-icon
        class="backtop-icon"
        icon-class="back_top"
      />
    </back-to-top>
    <feedback :show-position="100" />
    <AuthModal v-model="loginModalShow" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AuthModal from '@/components/Auth/index.vue'
import BackToTop from '@/components/BackToTop'
import feedback from '@/components/feedback'
import footer from '~/components/footer/index.vue'
export default {
  name: 'Default',
  components: {
    gFooter: footer,
    AuthModal,
    BackToTop,
    feedback
  },
  data() {
    return {
      time: null
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    loginModalShow: {
      get() {
        return this.$store.state.loginModalShow
      },
      set(v) {
        if(v && this.isLogined) return

        this.$store.commit('setLoginModal', v)
      }
    },
  },
  watch: {
    isLogined(val) {
      if(val) this.loginModalShow = false
    }
  },
  created() {
    if(this.$route.query.referral && !this.isLogined) {
      setTimeout(()=> {
        this.loginModalShow = true
      }, 100)
    }
  },
  mounted() {
    this.$store.dispatch('testLogin')
    if (process.browser) {
      this.removeOverflowHide()
    }
  },
  methods: {
    removeOverflowHide() {
      // 这段代码也是无奈之举
      // 这里的代码, 如果没有找到为什么会设置 overflow hideen, 就删除了的话, 就等着加班吧 !!!
      clearInterval(this.time)
      this.time = setInterval(() => {
        const bodyDom = document.querySelector('body')
        if (bodyDom.style.overflow) {
          const dialog = document.querySelectorAll('.el-dialog__wrapper')
          let dialogStatus = false
          // 循环 所有元素有一个不是node 说明是展开的dialog
          for (let i = 0; i < dialog.length; i++) {
            if (dialog[i].style.display !== 'none') {
              dialogStatus = true
              break
            }
          }
          // 此时body hidden 否则 auto
          if (dialogStatus) {
            bodyDom.style.overflow = 'hidden'
          } else {
            bodyDom.style.overflow = 'auto'
          }
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.app {
  .backtop {
    width: 45px;
    height: 45px;
    cursor: pointer;
    z-index: 99;
    font-size: 14px;
    position: fixed;
    right: 40px;
    bottom: 115px;
    color: #B2B2B2;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 4px 2px rgba(0,0,0,0.05);
    border-radius: 4px;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
    &:hover {
      opacity: 0.9;
    }

    &-icon {
      color: #B2B2B2;
      font-size: 24px;
    }
  }
}
@media screen and (max-width: 768px) {
  .app {
    .backtop {
      width: 30px;
      height: 30px;
      right: 20px;
      bottom: 80px;
      &-icon {
        font-size: 16px;
      }
    }
  }
}
</style>
