<template>
  <div class="user user-layout">
    <g-header />
    <el-row class="user-container mw">
      <el-col :span="4">
        <div class="account-nav position-sticky top70">
          <slot name="nav" />
        </div>
      </el-col>
      <el-col :span="20">
        <div :class="needFrame && 'user-main'">
          <slot name="main" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    needFrame: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  .minHeight();
}
.user-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.user-main {
  // width: 890px;
  // height: 998px;
  background-color: #fff;
  padding: 20px;
  border-radius: @br10;
  box-sizing: border-box;
  margin-bottom: 120px;
}

.account-nav {
  // width: 270px;
  // height: 396px;
  border-radius: @br10;
  background-color: #fff;
}

.position-sticky {
  margin-top: 0px;
}
</style>
