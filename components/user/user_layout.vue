<template>
  <div class="user">
    <g-header />
    <div class="user-container mw">
      <div class="user-main">
        <slot name="main" />
      </div>
      <div class="user-info">
        <slot name="info" />
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.user {
  .minHeight();
}
.user-container {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
.user-main {
  width: 890px;
  height: 998px;
  background-color: #fff;
  padding: 40px;
  box-sizing: border-box;
}

.user-info {
  width: 270px;
  height: 396px;
  background-color: #fff;
}
</style>
