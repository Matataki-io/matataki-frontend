<template>
  <div>
    {{ article }}
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {

    }
  }
}
</script>