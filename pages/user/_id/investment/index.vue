<template>
  <userLayout>
    <template slot="main">
      <user-nav />
    </template>
    <template slot="info">
      <userInfo />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
export default {
  components: {
    userLayout,
    userInfo,
    userNav
  }
}
</script>

<style>

</style>
