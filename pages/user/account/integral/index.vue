<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="account" />
      intergral
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

export default {
  components: {
    userLayout,
    userInfo,
    userNav
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped src="../index.less"></style>

<style>

</style>
