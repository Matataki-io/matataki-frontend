<template>
  <div class="share">
    <div class="container">
      <div class="img-container">
        <img src="@/assets/img/share.svg" alt="share">
      </div>
    </div>
    <span class="text">分享文章</span>
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
  cursor: pointer;
  z-index: 10;
  span {
    white-space: nowrap;
  }
}
.container{
  position: relative;
  margin-bottom: 10px;
  &:before {
    content: " ";
    display: block;
    padding-top: 100%; /*利用padding来撑开*/
  }
}
.img-container {
  position: absolute;
  top: 0; bottom: 0; right: 0; left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #F1F1F1;
  .flexCenter();
  img {
    width: 40%;
    height: auto;
  }
}
</style>
