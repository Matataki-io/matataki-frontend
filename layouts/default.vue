<template>
  <div class="app">
    <nuxt />
    <g-footer v-show="!hideFooter" />
    <back-to-top class="backtop" :visibility-height="300" :back-position="50" transition-name="fade">
      <svg-icon
        class="backtop-icon"
        icon-class="backtop"
      />
    </back-to-top>
    <el-tooltip class="item" effect="dark" content="吐个槽?" placement="left">
      <a class="feedback" href="https://support.qq.com/product/84254" target="_blank" title="反馈">
        <svg-icon
          class="icon-feedback"
          icon-class="tgc"
        />
      </a>
    </el-tooltip>

    <AuthModal v-model="loginModalShow" />
  </div>
</template>

<script>
import footer from '~/components/footer/index.vue'
import AuthModal from '@/components/Auth/index.vue'
import BackToTop from '@/components/BackToTop'
export default {
  components: {
    gFooter: footer,
    AuthModal,
    BackToTop
  },
  computed: {
    loginModalShow: {
      get() {
        return this.$store.state.loginModalShow
      },
      set(v) {
        this.$store.commit('setLoginModal', v)
      }
    },
    hideBackTop() {
      // 如果是发布页面隐藏小火箭
      return this.$route.name === 'publish' || this.$route.name === 'p-id'
    },
    hideFooter() {
      // 发布页面 GitHub登录
      return this.$route.name === 'publish' || this.$route.name === 'login'
    }

  },
  created() {

  },
  mounted() {
    (function () {
      const isPC = () => {
        const userAgentInfo = navigator.userAgent
        const Agents = ['Android', 'iPhone',
          'SymbianOS', 'Windows Phone',
          'iPad', 'iPod']
        let flag = true
        for (let v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false
            break
          }
        }
        return flag
      }
      // 规则只匹配了 文章详情页面 其他直接使用 all
      const pathname = window.location.pathname.includes('/p/')
        ? '/article/' + window.location.pathname.slice(3)
        : window.location.pathname === '/'
          ? ''
          : window.location.pathname
      if (!isPC()) window.location.href = process.env.VUE_APP_URL + pathname
    })()

    this.$store.dispatch('testLogin')
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.app .backtop {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: @purpleDark;
  cursor: pointer;
  z-index: 99;
  font-size: 18px;
  position: fixed;
  right: 40px;
  bottom: 80px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  // box-shadow: 0 4px 24px rgba(84, 45, 224, .5);
  &:hover {
    opacity: 0.9;
  }

  &-icon {
    color: #fff;
  }
}
.feedback {
  border-radius: 50%;
  position: fixed;
  width: 50px;
  height: 50px;
  color: #fff;
  background: @purpleDark;
  cursor: pointer;
  bottom: 20px;
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
