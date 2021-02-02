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
  layout: 'empty',
  name: 'WeixinLogin',
  data() {
    return {
      loading: true
    }
  },
  computed: {},
  created() {
    if (process.browser) {
      const { code, state } = this.$route.query
      // if (from) sessionStorage.setItem('wechatFrom', from) // set sessionStorage
      if (!code || state !== 'weixin') {
        const VUE_APP_WX_URL = process.env.VUE_APP_WX_URL
        const appid = 'wx95829b6a2307300b'
        const scope = 'snsapi_userinfo'
        const redirectUri = `${VUE_APP_WX_URL}/login/weixin`
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=code&scope=${scope}&state=weixin#wechat_redirect`
      } else {
        const from = sessionStorage.getItem('wechatFrom') || 'index'
        if (from === 'buildAccount') {
          const params = {
            platform: 'weixin',
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
            this.$message.error('微信绑定失败')
          }).finally(() => {
            this.$router.push({ name: 'setting-account' })
          })
        } else {
          this.$API.loginWeixin(code).then(res => {
            if (res.code === 0) {
              this.$store.commit('setAccessToken', res.data)
              this.$store.commit('setUserConfig', { idProvider: 'weixin' })

            } else {
              this.$message({ showClose: true, message: res.message, type: 'error' })
            }
            this.$router.push({ path: from })
  
          })
        }
      }
    }
  },
  methods: {
    ...mapActions(['signIn', 'getMyUserData']),
  }
}
</script>
