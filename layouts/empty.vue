<template>
  <nuxt />
</template>
<script>
export default {
  name: 'Empty',
  mounted() {
    this.$store.dispatch('testLogin')
  },
  methods: {
  }
}
</script>