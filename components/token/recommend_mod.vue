<template>
  <div class="module">
    <h2 class="token-title">
      {{ $t('token.recommendMod') }}
    </h2>
    <div class="module-list">
      <div class="module-list-card">
        <img src="@/assets/img/token/map.png" alt="Map">
        <p>
          地图社交
        </p>
        <el-button
          class="open-button"
          size="small"
        >
          立即启用
        </el-button>
      </div>
      <div class="module-list-card">
        <img src="@/assets/img/token/hackmd.png" alt="Hackmd">
        <p>
          共享文档
        </p>
        <el-button
          class="open-button"
          size="small"
        >
          立即启用
        </el-button>
      </div>
      <div class="module-list-card">
        <img src="@/assets/img/token/candy_airdrop.png" alt="Candy Airdrop">
        <p>
          领空投
        </p>
        <el-button
          class="open-button"
          size="small"
        >
          立即启用
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  // props: {
  //   minetokenToken: {
  //     type: Object,
  //     required: true
  //   },
  // },
}
</script>
<style lang="less" scoped>
.module {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);

  &-list {
    &-card {
      display: flex;
      align-items: center;
      height: 60px;
      margin-top: 10px;
      img {
        width: 61px;
      }
      p {
        flex: 1;
        margin: 0 15px;
        font-size: 16px;
        font-weight: 500;
        color: black;
        line-height: 22px;
      }
    }
  }

  .open-button {
    padding: 7px 7px;
    font-size: 14px;
    border-radius: 6px;
  }
}
.token-title {
  font-size: 24px;
  font-weight: bold;
  color: @black;
  line-height: 33px;
  padding: 0;
  margin: 0;
}
@media screen and (max-width: 600px) {
  .token-title {
    font-size: 20px;
  }
}
</style>
