<template>
  <div class="container">
    home
    <button>登录</button>
    <BaseModalForSignIn />
  </div>
</template>

<script>
import BaseModalForSignIn from '@/components/BaseModalForSignIn'
export default {
  components: {
    BaseModalForSignIn
  },
  data() {
    return {}
  },
  async mounted() {
    const data = await this.$axios.$get(
      `${this.$API.wx}?url=${window.location.url}`
    )
    console.log(data)
  },
  methods: {
  }
}
</script>

<style>
</style>
