<template>
  <div class="app">
    <nuxt />
    <g-footer v-show="!hideFooter" />
    <el-backtop :bottom="140" class="backtop">
      <svg-icon
        class="backtop-icon"
        icon-class="backtop"
      />
    </el-backtop>
    <a class="feedback" href="https://wj.qq.com/s2/4206369/e337" target="_blank" title="反馈">
      <svg-icon
        class="icon-feedback"
        icon-class="feedback"
      />
    </a>
    <BaseModalForSignIn v-model="loginModalShow" />
  </div>
</template>

<script>
import footer from '~/components/footer/index.vue'
import BaseModalForSignIn from '@/components/BaseModalForSignIn'

export default {
  components: {
    gFooter: footer,
    BaseModalForSignIn
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
      // 如果是发布页面隐藏小火箭
      return this.$route.name === 'publish'
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
  width: 50px;
  height: 50px;
  border-radius: @borderRadius10;
  background: #000;
  cursor: pointer;
  &-icon {
    color: #fff;
  }
}
.feedback {
  border-radius: @borderRadius10;
  position: fixed;
  width: 50px;
  height: 50px;
  color: #fff;
  background: #000;
  cursor: pointer;
  bottom: 80px;
  right: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all .3s;
  .icon-feedback {
    font-size: 30px;
  }
}
</style>
