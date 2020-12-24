<template>
  <div class="mint-no-token">
    <div class="no-token-img">
      <img src="@/assets/img/gray_oops.png" alt="oops" class="oops">
      <img src="@/assets/img/gray_fanpiao.png" alt="Fan票">
    </div>
    <p class="no-token-tip">{{ $t('fan-tickets-not-yet-issued') }}</p>
    <router-link :to="{ name: 'postminetoken' }">
      <el-button type="primary" class="issue-btn">
        {{ $t('to-issue') }}
      </el-button>
    </router-link>
  </div>
</template>

<style lang="less" scoped>
.mint-no-token {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  .no-token-tip {
    font-size: 20px;
    color: #aaa;
  }
  .oops {
    position: absolute;
    top: 0;
    left: 0;
  }
  .issue-btn {
    width: 200px;
  }
  .no-token-img {
    position: relative;
    padding: 50px 60px 0;
  }
}
</style>
