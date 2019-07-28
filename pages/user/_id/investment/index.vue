<template>
  <userLayout>
    <div slot="main">
      investment
    </div>
    <div slot="info">
      <userInfo />
    </div>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
export default {
  components: {
    userLayout,
    userInfo
  }
}
</script>

<style>

</style>
