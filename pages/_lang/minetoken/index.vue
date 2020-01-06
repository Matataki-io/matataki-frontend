<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="token" />
      <minetoken />
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import moment from 'moment'

import minetoken from '@/components/user/fan_coins_manage_layout'
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'
import userNav from '@/components/user/user_nav.vue'

export default {
  components: {
    minetoken,
    userLayout,
    myAccountNav,
    userNav
  },
  data() {
    return {
      isPublishCoins: true
    }
  }
}
</script>
