<template>
  <div class="no-page">
    <noPage />
  </div>
</template>

<script>
import noPage from '@/components/error/404.vue'
export default {
  components: {
    noPage
  },
  layout: 'empty'
}
</script>

<style lang="less" scoped>
.no-page {
    background-color: #23294b;
    overflow: hidden;
    min-height: 100%;
}
</style>
