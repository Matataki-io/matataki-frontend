<template>
  <div class="share">
    <g-header />
    <main class="container">
      <shareHeader />
      123123
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
    </main>
  </div>
</template>

<script>
import shareHeader from '@/components/share_page/share_header'

export default {
  components: {
    shareHeader
  }
}
</script>

<style lang="less" scoped>
.share {
  .minHeight();
}

.container {
  width: 600px;
  margin: 90px auto 0;
  background-color: #fff;
  border-radius:10px;
}
</style>
