<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="token" />
      <minetoken />
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import moment from 'moment'

import minetoken from '@/components/user/fan_coins_manage_layout'
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'

export default {
  components: {
    minetoken,
    userLayout,
    userInfo,
    userNav
  },
  data() {
    return {
      isPublishCoins: true
    }
  }
}
</script>
