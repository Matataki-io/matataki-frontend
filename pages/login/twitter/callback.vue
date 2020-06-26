<template>
  <div class="tg-container">
    <!-- <div v-loading='loading' style='height: 100%;' element-loading-text='登录中...' /> -->
    <p class="tips">
      {{ $t("success.loginSuccess") }}
    </p>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  async mounted() {
    try {
      const oauthtoken = this.$route.query.oauth_token
      const oauthverifier = this.$route.query.oauth_verifier
      const res2 = await this.$API.twitterLogin({
        oauth_token: oauthtoken,
        oauth_verifier: oauthverifier
      })
      await this.$store.commit('setLoginModal', false)
      await this.$store.commit('setAccessToken', res2.data)
      await this.$store.commit('setUserConfig', { idProvider: 'twitter' })
      this.$router.go(-3) // ??? // 本页面由twitter登录后重定向而来，故-1是twitter/login
    } catch (error) {
      this.$router.go(-3)
      this.$message.closeAll()
      this.$message.error(error.toString())
    }
  }
}
</script>

<style scoped lang='less'>
.tg-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding-top: 10%;
  .tips {
    font-size: 14px;
    color: #333;
    padding: 0;
    margin: 2em 0 0;
  }
}
</style>
