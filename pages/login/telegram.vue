<template>
  <div
    v-loading="loading"
    class="tg-container"
  >
    <client-only>
      <TelegramLogin
        :telegram-login="TELEGRAM_BOT_NAME"
        mode="callback"
        request-access="write"
        radius="6"
        @callback="login"
      />
    </client-only>
    <p class="tips">
      {{ $t('scientific-Internet-access-is-required-to-use-this-function') }}
    </p>
  </div>
</template>

<script>
import TelegramLogin from '@/components/TelegramLogin'
export default {
  components: {
    TelegramLogin
  },
  layout: 'empty',
  data() {
    return {
      loading: false,
      // TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME
    }
  },
  computed: {
    domainEnv() {
      // if (!process.browser) { return 'desktop' }
      switch(window.location.hostname) {
        case 'meta.io': return 'desktop'
        case 'matataki.io': return 'mobile'
        case 'www.matataki.cn': return 'desktop-cn'
        case 'matataki.cn': return 'mobile-cn'
        case 'wwwtest.smartsignature.io': return 'desktop'
        case 'test.smartsignature.io': return 'mobile'
        case 'sstest.frontenduse.top': return 'wechat'
        case 'smartsignature.frontenduse.top': return 'wechat'
        default: return 'local'
      }
    },
    TELEGRAM_BOT_NAME() {
      switch(this.domainEnv) {
        case 'mobile': return process.env.TELEGRAM_BOT_ROOT_NAME
        case 'wechat': return process.env.TELEGRAM_BOT_IN_WX
        default: return process.env.TELEGRAM_BOT_NAME
      }
    }
  },
  methods: {
    login(user) {
      const from = this.$route.query.from
      if (from === 'login') {
        this.telegramLogin(user)
      } else {
        this.telegramBinding(user)
      }
    },
    telegramLogin(user) {
      this.loading = true
      this.$API
        .telegramLogin({
          telegramParams: user,
          telegramBotName: this.TELEGRAM_BOT_NAME
        })
        .then(res => {
          this.$store.commit('setAccessToken', res.data)
          this.$store.commit('setUserConfig', { idProvider: 'telegram' })
          this.$router.back(-1)
        })
        .finally(() => {
          this.loading = false
        })
    },
    telegramBinding(user) {
      this.loading = true
      this.$API
        .accountBind({
          platform: 'telegram',
          telegramParams: user,
          telegramBotName: this.TELEGRAM_BOT_NAME
        })
        .then(res => {
          if (res.code === 0) {
            this.$message({ showClose: true, message: res.message, type: 'success'})
          } else {
            this.$message({ showClose: true, message: res.message, type: 'warning'})
          }
          this.$router.back(-1)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('绑定失败')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="less">
.tg-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding-top: 10%;
  min-height: 100%;
  background: #fff;
  .tips {
    font-size: 14px;
    color: #333;
    padding: 0;
    margin: 2em 0 0;
  }
}
</style>
