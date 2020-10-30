<template>
  <div class="cardunit-bg">
    <div class="cardunit-bg-uline" />
    <div class="cardunit-bg-uline" />
    <div class="cardunit-bg-uline" />
  </div>
</template>

<script>

export default {
}
</script>

<style lang="less" scoped>
.cardunit-bg {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 39px;
  padding: 12px 0;
  box-sizing: border-box;

  .cardunit-bg-uline {
    display: block;
    height: 2px;
    width: 2px;
    margin-left: 23.5px;
    background: #ccd6dd;
  }
}
</style>
