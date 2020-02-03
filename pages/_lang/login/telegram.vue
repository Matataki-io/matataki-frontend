<template>
  <div v-loading="loading" class="container">
    <TelegramLogin
      @callback="telegramLogin"
      :telegram-login="TELEGRAM_BOT_NAME"
      mode="callback"
      request-access="write"
      radius="6"
    />
    <p class="tips">
      该功能需要“科学上网”
    </p>
  </div>
</template>

<script>
import TelegramLogin from '@/components/TelegramLogin'
export default {
  layout: 'empty',
  components: {
    TelegramLogin
  },
  data() {
    return {
      loading: false,
      TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME
    }
  },
  methods: {
    telegramLogin(user) {
      this.loading = true
      this.$API
        .accountBind({
          platform: 'telegram',
          telegramParams: user,
          telegramBotName: this.TELEGRAM_BOT_NAME
        })
        .then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
          this.$router.back(-1)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('绑定失败')
        })
        .finally(() => {
          this.loading = true
        })
    }
  }
}
</script>
<style lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding-top: 10%;
}

.tips {
  font-size: 14px;
  color: #333;
  padding: 0;
  margin: 2em 0 0;
}
</style>
