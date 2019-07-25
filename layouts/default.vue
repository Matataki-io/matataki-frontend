<template>
  <div class="app">
    <g-header />
    <nuxt />
    <g-footer />
    <BaseModalForSignIn v-model="loginModalShow" />
  </div>
</template>

<script>
import header from '~/components/header/index.vue'
import footer from '~/components/footer/index.vue'
import BaseModalForSignIn from '@/components/BaseModalForSignIn'

export default {
  components: {
    gHeader: header,
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
  }
}
</script>

<style>

</style>
