<template>
  <div class="cardunit-bg">
    <div class="cardunit-bg-omit">
      <div class="cardunit-bg-omit-point" />
      <div class="cardunit-bg-omit-point" />
      <div class="cardunit-bg-omit-point" />
    </div>
    <span class="cardunit-bg-more">
      显示更多回复
    </span>
  </div>
</template>

<script>

export default {
}
</script>

<style lang="less" scoped>
.cardunit-bg {
  display: flex;
  height: 39px;
  box-sizing: border-box;
  align-items: center;

  &-omit {
    height: 39px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12px 0 12px;
    margin-right: 10px;
    &-point {
      display: block;
      height: 2px;
      width: 2px;
      margin-left: 23.5px;
      margin-right: 23.5px;
      background: #ccd6dd;
    }
  }
  &-more {
    color: #1b95e0;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
