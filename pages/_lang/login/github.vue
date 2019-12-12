<template>
  <div class="login" />
</template>

<script>
import { mapActions } from 'vuex'
import { getCookie, removeCookie } from '@/utils/cookie'

export default {
  layout: 'empty',
  name: 'LoginPage',
  computed: {},
  mounted() {
    const { code, from, error } = this.$route.query
    // const clientID = process.env.VUE_APP_GITHUB_CLIENT_ID
    const clientID = '750700EDFF6D3C6199CD'
    const APP_URL = process.env.VUE_APP_URL
    const scope = 'read:public_repo,read:user'
    if (from) sessionStorage.setItem('githubFrom', from) // set sessionStorage
    // const redirectUri = `${APP_URL}/login/github${from ? '?from=' + from : ''}`
    const redirectUri = `http://localhost:8080/login/github${from ? '?from=' + from : ''}`
    if (error) { // 如果是error之后
      this.$message.error('Github登录失败, 请返回重试')
      const from = sessionStorage.getItem('githubFrom') || 'index'
      this.$router.push({ name: from })
    } else if (!code) {
      // http://localhost:8080/login/github?error=redirect_uri_mismatch&error_description=The+redirect_uri+MUST+match+the+registered+callback+URL+for+this+application.&error_uri=https%3A%2F%2Fdeveloper.github.com%2Fapps%2Fmanaging-oauth-apps%2Ftroubleshooting-authorization-request-errors%2F%23redirect-uri-mismatch
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
    } else {
      const from = sessionStorage.getItem('githubFrom') || 'index'
      if (from === 'buildAccount') { // 调用接口
        // ...
        const params = {
          platform: 'github',
          code: code
        }
        this.$API.accountBind(params).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('Github绑定失败')
        }).finally(() => {
          this.$router.push({ name: 'setting-account' })
        })
      } else {
        // 移除github cookie
        const removeCookies = () => {
          const idProvider = getCookie('idProvider')
          if (idProvider.toLocaleLowerCase() === 'github') removeCookie('idProvider')
        }
        this.signIn({ code, idProvider: 'GitHub' })
          .then(res => {
            // console.log('---', res)
            if (res) this.$backendAPI.accessToken = this.currentUserInfo.accessToken
            else {
              removeCookies()
              this.$message.error('Github登录失败, 请返回重试')
            }
          })
          .catch(err => {
            console.log('err', err)
            removeCookies()
            this.$message.error('Github登录失败, 请返回重试')
          }).finally(() => {
            this.$router.push({ name: from })
          })
      }
    }
  },
  methods: {
    ...mapActions(['signIn'])
  }
}
</script>

<style scoped></style>
