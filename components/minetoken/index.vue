<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="token" />
      <fanCoinsPublish v-if="!isPublishCoins" @publishToken="isPublishCoins = true" />
      <fanCoinsManage v-else />
      <!-- <fanCoinsManage v-else @notToken="isPublishCoins = false" /> -->
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>

import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import fanCoinsPublish from '@/components/user/edit_minetoken.vue'
import fanCoinsManage from '@/components/user/fan_coins_manage.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    fanCoinsPublish,
    fanCoinsManage
  },
  data() {
    return {
      isPublishCoins: false
    }
  }
}
</script>
