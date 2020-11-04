<template>
  <div class="tg-container">
    <!-- <div v-loading='loading' style='height: 100%;' element-loading-text='登录中...' /> -->
    <p v-if="oauthVerifier || loading" class="tips">
      loading...
    </p>
    <el-button
      v-else
      type="primary"
      @click="authorizeClick"
    >
      <svg-icon icon-class="twitter" />
      授权访问你 Twitter 的账号
    </el-button>
    <p class="tips">
      使用该功能需要“科学上网”
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'empty',
  data() {
    return {
      token: {},
      oauthVerifier: this.$route.query.oauth_verifier || '',
      oauthToken: this.$route.query.oauth_token || '',
      callbackFunLock: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  watch: {
    isLogined(val) {
      if (this.oauthVerifier && val) this.callback()
    }
  },
  async mounted() {
    console.log('oauthVerifier：', this.oauthVerifier)
    if (this.oauthVerifier && this.isLogined) this.callback()
  },
  methods: {
    async authorizeClick () {
      this.loading = true
      try {
        const res = await this.$API.twitterRequestToken('http://localhost:8080/authorize/twitter')
        if (res) {
          if (res.code === 0) {
            window.location = 'https://api.twitter.com/oauth/authorize?oauth_token=' + res.data
            return
          }
          else this.$message.error(res.message)
        }
        else {
          console.error('[Twitter authorize failed (get token)] res:', res)
          this.$message.error(this.$t('error.fail'))
        }
      }
      catch (e) {
        console.error('[Twitter authorize failed (get token)] error:', e)
        this.$message.error(this.$t('error.fail'))
      }
      this.loading = false
    },
    async callback () {
      if (this.callbackFunLock) return
      this.callbackFunLock = true
      try {
        const res = await this.$API.twitterAccessToken(this.oauthToken, this.oauthVerifier)
        if (res) {
          if (res.code === 0 ) this.$message.success(this.$t('success.success'))
          else this.$message.error(res.message)
        }
        else {
          console.error('[Twitter authorize failed (callback)] res:', res)
          this.$message.error(this.$t('error.fail'))
        }
      }
      catch (e) {
        console.error('[Twitter authorize failed (callback)] error:', e)
        this.$message.error(this.$t('error.fail'))
      }
      this.$router.replace({ name: 'timeline-twitter' })
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
