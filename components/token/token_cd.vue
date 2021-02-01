<template>
  <div v-show="showBanner" class="cd" @click="publish">
    <img src="@/assets/img/token_cd.png" alt="cd" class="cd-text">
    <img src="@/assets/img/token_cd_icon.png" alt="icon" class="cd-icon">
    <a href="javascript:;" class="cd-btn">{{ $t('apply-immediately') }}</a>
  </div>
</template>

<script src="../../common/script/token_cd"></script>

<style lang="less" scoped>
.cd {
  height: 194px;
  background-color: #f3e4da;
  border-radius: 10px;
  position: relative;
  background-image: url(../../assets/img/token_cd_bc.png);
  background-size: cover;
  cursor: pointer;
  &-text {
    max-width: 256px;
    margin-left: 20px;
    margin-top: 20px;
  }
  &-icon {
    max-width: 93px;
    position: absolute;
    top: -7px;
    right: 10px;
    z-index: 1;
    animation: Updown 3s linear infinite;
  }
  &-btn {
    display: block;
    max-width:180px;
    height:30px;
    background:rgba(250,100,0,1);
    border-radius:4px;
    font-size:14px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:30px;
    text-align: center;
    margin-left: 20px;
    margin-top: 16px;
  }
}
</style>