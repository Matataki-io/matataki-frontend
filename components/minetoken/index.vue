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

import userLayout from '@/components/user/user_layout.vue'
import userNav from '@/components/user/user_nav.vue'
import minetoken from '@/components/user/edit_minetoken.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'

export default {
  components: {
    userLayout,
    userNav,
    myAccountNav,
    minetoken
  },
  data() {
    return {
    }
  }
}
</script>
