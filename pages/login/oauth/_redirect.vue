<template>
  <div>
    <LoginIndex 
      :value="isLogin"
      :single="true"
    />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookie'

import LoginIndex from '@/components/Auth/index.vue'

export default {
  name: 'Single',
  components: {
    LoginIndex
  },
  data () {
    return {
      isLogin: true,
      url: process.env.VUE_APP_DEVELOPER
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
  },
  watch: {
    currentUserInfo (val) {
      console.log(val)
      if (val.id !== null) {
        this.isLogin = false
        let cookie = getCookie('ACCESS_TOKEN')
        cookie = '/type=token&token=' + cookie
        window.location = decodeURIComponent(this.url + '/' + this.$route.params.redirect + cookie)
      }
    }
  },
  created() {

  },
  mounted() {
    if (this.currentUserInfo.id !== null) {
      this.isLogin = false
      let cookie = getCookie('ACCESS_TOKEN')
      cookie = '/type=token?&token=' + cookie
      window.location = decodeURIComponent(this.url + '/' + this.$route.params.redirect + cookie)
    }
  }
}
</script>

<style lang="less">
.el-dialog__headerbtn {
  display: none;
}
</style>