<template>
  <div class="app">
    <nuxt />
    <g-footer v-show="!hideFooter"/>
    <el-backtop :bottom="80" class="backtop" v-if="!hideBackTop">
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
  mounted() {
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
