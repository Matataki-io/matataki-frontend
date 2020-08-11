<template>
  <div>
    {{ $route.params.redirect }}
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
      isLogin: true
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
        cookie = '&cookies=' + cookie
        window.location = decodeURIComponent(this.$route.params.redirect + cookie)
      }
    }
  },
  created() {

  },
  mounted() {
    if (this.currentUserInfo.id !== null) {
      this.isLogin = false
      let cookie = getCookie('ACCESS_TOKEN')
      cookie = '&cookies=' + cookie
      window.location = decodeURIComponent(this.$route.params.redirect + cookie)
    }
  }
}
</script>