<template>
  <div class="app">
    <nuxt />
    <g-footer />
    <el-backtop :bottom="80" class="backtop">
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
