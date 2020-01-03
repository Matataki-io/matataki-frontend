<template>
  <div class="share">
    <g-header />
    <main class="container">
      <shareHeader />
      <shareMain />
    </main>
  </div>
</template>

<script>
import shareHeader from '@/components/share_page/share_header'
import shareMain from '@/components/share_page/share_main'

export default {
  components: {
    shareHeader,
    shareMain
  }
}
</script>

<style lang="less" scoped>
.share {
  .minHeight();
}

.container {
  width: 600px;
  margin: 20px auto 100px;
  background-color: #fff;
  border-radius:10px;
  padding: 0 0 20px 0;
}
</style>
