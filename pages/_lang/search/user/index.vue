<template>
  <searchLayout :params="params" api-url-path="searchUserList" />
</template>

<script>
import searchLayout from '@/components/search/layout'
export default {
  components: {
    searchLayout
  },
  data() {
    return {
      params: { }
    }
  }
}
</script>
