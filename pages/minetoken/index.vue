<template>
  <userLayout>
    <template slot="main">
      <h2 class="tag-title">
        {{ $t('user.selfcoins') }}
      </h2>
      <minetoken />
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import minetoken from '@/components/user/fan_coins_manage_layout'
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'

export default {
  components: {
    minetoken,
    userLayout,
    myAccountNav
  },
  data() {
    return {
      isPublishCoins: true
    }
  }
}
</script>

<style lang="less" scoped>
.tag-title {
  font-weight: bold;
  font-size: 20px;
  padding-left: 10px;
  margin: 0;
}
</style>
