<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="token" />
      <fanCoinsManage />
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import moment from 'moment'

import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import fanCoinsManage from '@/components/user/fan_coins_manage.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    fanCoinsManage
  },
  data() {
    return {
      isPublishCoins: true
    }
  }
}
</script>
