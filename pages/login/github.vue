<template>
  <div
    v-loading="loading"
    style="height: 100%;"
    :element-loading-text="`${$t('logging-in')}...`"
  />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  layout: 'empty',
  data() {
    return {
      loading: true
    }
  },
  computed: {},
  mounted() {
    const { code, error } = this.$route.query
    const clientID = process.env.VUE_APP_GITHUB_CLIENT_ID
    // const clientID = '750700EDFF6D3C6199CD'
    const APP_URL = process.env.VUE_APP_URL
    const scope = 'read:user,public_repo'
    // if (from) sessionStorage.setItem('githubFrom', from) // set sessionStorage
    // const redirectUri = `${APP_URL}/login/github${from ? '?from=' + from : ''}`
    const redirectUri = `${APP_URL}/login/github`
    // const redirectUri = `http://localhost:8080/login/github${from ? '?from=' + from : ''}`
    if (error) { // 如果是error之后
      this.$message.error('Github登录失败, 请返回重试')
      const from = sessionStorage.getItem('githubFrom') || 'index'
      // 得到的内容是 buildAccount 回绑定, 否则认为是登录走 path
      if (from === 'buildAccount') {
        this.$router.push({ name: 'setting-account' })
      } else {
        this.$router.push({ path: from })
      }
    } else if (!code) {
      // http://localhost:8080/login/github?error=redirect_uri_mismatch&error_description=The+redirect_uri+MUST+match+the+registered+callback+URL+for+this+application.&error_uri=https%3A%2F%2Fdeveloper.github.com%2Fapps%2Fmanaging-oauth-apps%2Ftroubleshooting-authorization-request-errors%2F%23redirect-uri-mismatch
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
    } else {
      const from = sessionStorage.getItem('githubFrom') || 'index'
      if (from === 'buildAccount') { // 调用接口
        const params = {
          platform: 'github',
          code: code
        }
        this.$API.accountBind(params).then(res => {
          if (res.code === 0) {
            this.$message({ showClose: true, message: res.message, type: 'success'})
          } else {
            this.$message({ showClose: true, message: res.message, type: 'warning'})
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('Github绑定失败')
        }).finally(() => {
          this.$router.push({ name: 'setting-account' })
        })
      } else {
        this.signIn({ code, idProvider: 'GitHub' })
          .then(() => {
            this.$backendAPI.accessToken = this.currentUserInfo.accessToken
          })
          .catch(() => {})
          .then(() => {
            this.$router.push({ path: from })
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
