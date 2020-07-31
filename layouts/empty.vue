<template>
  <nuxt />
</template>
<script>
export default {
  name: 'Empty',
  head: {
    script: [
      { src: '/bowl.min.js' }
    ]
  },
  mounted() {
    this.$store.dispatch('testLogin')
    if (process.browser) {
      this.injectScript()
    }
  },
  methods: {
    injectScript() {
      try {
        // eslint-disable-next-line no-undef
        var bowl = new Bowl()
        bowl.add([
          { url: '/bowl.min.js', key: 'bowl' },
          { url: '/gt.js', key: 'gt' }
        ])
        bowl.inject().then(() => {
          console.log('success')
        })
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>