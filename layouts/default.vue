<template>
  <div class="app">
    <g-header />
    <nuxt />
    <g-footer />
  </div>
</template>

<script>
import header from '~/components/header/index.vue'
import footer from '~/components/footer/index.vue'

export default {
  components: {
    gHeader: header,
    gFooter: footer
  }
}
</script>

<style>

</style>
