/* eslint-disable */
<template>
  <div class="login"></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  computed: {},
  mounted() {
    const { protocol, host } = window.location
    const { path, query } = this.$route
    const { code, from } = query
    const clientID = process.env.VUE_APP_GITHUB_CLIENT_ID
    const APP_URL = process.env.VUE_APP_URL
    const scope = 'read:public_repo,read:user'
    // 跳转到移动端的登录页面，添加上pc参数，标志来自pc端
    const redirectUri = `${APP_URL}/login/github?from=${from}&pc=pc` // 範例值
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
