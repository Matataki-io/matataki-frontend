<template>
  <div class="share">
    <g-header />
    <main class="container">
      <shareHeader />
      <shareMain />
    </main>
    <shareFooter class="footer" />
  </div>
</template>

<script>
import shareHeader from '@/components/share_page/share_header'
import shareMain from '@/components/share_page/share_main'
import shareFooter from '@/components/share_page/share_footer'

export default {
  components: {
    shareHeader,
    shareMain,
    shareFooter
  }
}
</script>

<style lang="less" scoped>
.share {
  .minHeight();
}
@width: 600px;
.container {
  width: @width;
  margin: 20px auto 0;
  background-color: #fff;
  border-radius:10px;
  padding: 0 0 20px 0;
}
.footer {
  width: @width;
  margin: 40px auto 100px;
}
</style>
