<template>
  <div class="user user-layout">
    <g-header />
    <el-row class="user-container mw">
      <el-col :span="18">
        <div class="user-main">
          <slot name="main" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="user-info position-sticky top70">
          <slot name="info" />
        </div>
      </el-col>
    </el-row>
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
  margin-top: 20px;
}
.user-main {
  // width: 890px;
  // height: 998px;
  background-color: #fff;
  padding: 20px;
  border-radius: @borderRadius10;
  box-sizing: border-box;
  margin-bottom: 120px;
}

.user-info {
  // width: 270px;
  // height: 396px;
  border-radius: @borderRadius10;
  background-color: #fff;
}
</style>
