<template>
  <userLayout>
    <template slot="main">
      <minetoken />
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>

import userLayout from '@/components/user/user_layout.vue'
import minetoken from '@/components/user/edit_minetoken.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'

export default {
  components: {
    userLayout,
    myAccountNav,
    minetoken
  },
  data() {
    return {
    }
  }
}
</script>
