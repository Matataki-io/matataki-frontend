<template>
  <div class="container">
    <h1>home</h1>
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

<style lang='less' scoped>
h1 {
  color: @yellow;
  //.subinfo-font();
}
</style>
