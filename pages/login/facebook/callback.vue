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
    const { code, state } = this.$route.query

    if (state === 'login') {
      try {
        const res2 = await this.$API.facebookLogin({
          code,
          callbackUrl: `${window.location.origin}/login/facebook/callback`
        })
        await this.$store.commit('setLoginModal', false)
        await this.$store.commit('setAccessToken', res2.data)
        await this.$store.commit('setUserConfig', { idProvider: 'facebook' })

        this.$router.replace({ name: 'article' })
      } catch (error) {
        this.$router.replace({ name: 'article' })
        this.$message.closeAll()
        this.$message.error(error.toString())
      }

      return
    } else if (state === 'binding') {
      try {
        const res = await this.$API.accountBind({
            platform: 'facebook',
            code,
            callbackUrl: `${window.location.origin}/login/facebook/callback`
          })
        if (res.code === 0) {
          this.$message({ showClose: true, message: res.message, type: 'success'})
        } else {
          this.$message({ showClose: true, message: res.message, type: 'warning'})
        }

        this.$router.replace({ name: 'setting-account' })
      } catch (err) {
        console.log(err)
        this.$message.error('绑定失败')
      }
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
