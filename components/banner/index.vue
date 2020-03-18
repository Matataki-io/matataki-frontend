<template>
  <div class="banner mw">
    <div class="bg">
      <img
        src="@/assets/img/home_logo.png"
        alt="logo"
      >
      <img
        src="@/assets/img/pc_banner.png"
        alt="banner"
      >
      <img
        src="@/assets/img/pc_banner_img.png"
        alt="banner"
      >
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.banner {
  box-sizing: border-box;
  margin-top: 20px;
  .bg {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #E3F4FF;
    border-radius: @br10;
  }
  img {
    &:nth-child(1){
      // width:182px;
      height:46px;
      margin-left: 60px;
    }
    &:nth-child(2){
      height: 36px;
    }
    &:nth-child(3){
      height: 100px;
      margin-right: 60px;
    }
  }
}
</style>
