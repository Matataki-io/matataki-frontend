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

import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import minetoken from '@/components/user/edit_minetoken.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    minetoken
  },
  data() {
    return {
    }
  }
}
</script>
