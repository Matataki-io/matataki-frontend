<template>
  <div class="share">
    <div class="share-outer">
      <img src="@/assets/img/invest.svg" alt="share">
    </div>
    <span class="text">投资文章</span>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  components: {}
}
</script>

<style scoped lang="less">
.share {
  text-align: center;
}
.share-outer {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #F1F1F1;
  margin-bottom: 10px;
  .flexCenter();
  img {
    width: 50px;
    height: auto;
  }
}
</style>
