<template>
  <div class="app">
    <nuxt />
    <g-footer v-show="!hideFooter" />
    <el-backtop v-if="!hideBackTop" :bottom="80" class="backtop">
      <svg-icon
        class="backtop-icon"
        icon-class="backtop"
      />
    </el-backtop>
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

      if (!isPC()) window.location.href = process.env.VUE_APP_URL
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
</style>
