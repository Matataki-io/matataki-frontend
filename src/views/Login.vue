/* eslint-disable */
<template>
  <div class="login"></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  computed: {},
  created() {
    const { protocol, host } = window.location
    const { path, query } = this.$route
    const { code, from } = query
    const clientID = process.env.VUE_APP_GITHUB_CLIENT_ID
    const scope = 'read:public_repo,read:user'
    const redirectUri = `${protocol}//${host}${path}?from=${from}` // 範例值
    if (!code) {
      // 跳轉
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}`
    } else {
      this.signIn({ code, idProvider: 'GitHub' })
        .then(() => {
          this.$backendAPI.accessToken = this.currentUserInfo.accessToken
        })
        .catch(() => {})
        .then(() => {
          this.$router.push(from)
        })
    }
  },
  methods: {
    ...mapActions(['signIn'])
  }
}
</script>

<style scoped></style>
