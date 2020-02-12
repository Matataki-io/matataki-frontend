<template>
  <searchLayout :params="params" api-url-path="searchArticleList" />
</template>

<script>
import searchLayout from '@/components/search/layout'
export default {
  components: {
    searchLayout
  },
  data() {
    return {
      params: {
        channel: 1,
        type: 'post'
      }
    }
  }
}
</script>
