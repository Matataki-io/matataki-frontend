<template>
  <ringPage :onlyCreator="0" />
</template>

<script>
import debounce from 'lodash/debounce'
import ringPage from '@/components/ring_page/index.vue'

export default {
  components: {
    ringPage
  },
  data() {
    return {
    }
  },
  created() {
  }
}
</script>
