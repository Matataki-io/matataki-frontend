<template>
  <div class="tg-container">
    <!-- <div v-loading='loading' style='height: 100%;' element-loading-text='登录中...' /> -->
    <p class="tips">
      loading...
    </p>
    <p class="tips">
      使用该功能需要“科学上网”
    </p>
  </div>
</template>

<script>
import axios from 'axios'
const crypto = require('crypto')

export default {
  layout: 'empty',
  data() {
    return {
      token: {}
    }
  },
  mounted() {
    this.ready()
  },
  methods: {
    randomString(len) {
      len = len || 32
      const $chars = 'abcdefhijkmnprstwxyz2345678'
      const maxPos = $chars.length
      let pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    async ready() {
      const timestamp = parseInt(Date.parse(new Date())) / 1000
      const ranstr = this.randomString(12)
      const httpmethod = 'GET'
      const twitterurl = 'http://api.twitter.com/oauth/request_token'
      const params = 'oauth_consumer_key=' + process.env.TWITTER_APP_KEY +
      '&oauth_nonce=' + ranstr +
      '&oauth_signature_method=' + 'HMAC-SHA1' +
      '&oauth_timestamp=' + timestamp +
      '&oauth_version=' + '1.0'
      const signtext = httpmethod + '&' + encodeURIComponent(twitterurl) + '&' + encodeURIComponent(params)
      const signkey = encodeURIComponent(process.env.TWITTER_APP_KEY) + '&'
      const sign = encodeURIComponent(crypto.createHmac('sha1', signkey).update(signtext).digest().toString('base64'))
      const requesturl = 'https://twitter.com/oauth/request_token?' +
      'oauth_consumer_key=' + process.env.TWITTER_APP_KEY +
      '&oauth_nonce=' + ranstr +
      '&oauth_signature_method=' + 'HMAC-SHA1' +
      '&oauth_version=' + '1.0' +
      '&oauth_signature=' + sign +
      'oauth_timestamp=' + timestamp
      try {
        const step1 = (await axios({
          method: 'get',
          url: requesturl
        })).data
        const token = {}
        const step1arr = step1.split('&')
        for (const index in step1arr) {
          token[step1arr[index].split('=')[0]] = step1arr[index].split('=')[1]
        }
        console.log(token)
        this.token = token
        window.location = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + token.oauth_token
      } catch (error) {
        this.$router.go(-1)
        console.log(error)
        this.$message.closeAll()
        this.$message.error(error.toString())
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
