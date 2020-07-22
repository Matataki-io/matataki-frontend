<template>
  <div
    v-loading.fullscreen.lock="true" 
    element-loading-text="登录中..."
  />
</template>

<script>
export default {
  layout: 'empty',
  created() {
    if (process.browser) {
      this.init()
    }
  },
  methods: {
    init() {
      try {
        let redirect = this.$route.query.redirect
        let accessToken = this.$route.query.access_token

        if (accessToken) {
          this.$store.commit('setAccessToken', accessToken)
          this.$store.commit('setUserConfig', { idProvider: 'weixin' })
        } else {
          console.log('not access_token', accessToken)
        }

        if (redirect) {
          window.location.href = decodeURIComponent(redirect)
        } else {
          throw new Error(`not redirect url redirect: ${redirect}`)
        }
      } catch (e) {
        console.log('auth redirect error', e)
        window.location.href = process.env.VUE_APP_PC_URL
      }
    }
  }
}
</script>