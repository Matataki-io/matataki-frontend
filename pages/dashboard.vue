<template>
  <div class="container">
    <div class="head">
      <h3>{{ $t('dashboard-text') }}</h3>
      <!-- <p>每日中午12:00更新前一日数据</p> -->
    </div>
    <router-view />
  </div>
</template>

<style lang="less" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  @media screen and ( max-width: 540px ) {
    padding-left: 10px;
    padding-right: 10px;
  }

  .head {
    width: 100%;
    height: 240px;
    margin-top: 40px;
    margin-bottom: 40px;
    background-image: url(../assets/img/dashboard_head_bc.png);
    background-color: #ebe6fe;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
    h3 {
      font-size:36px;
      font-weight:600;
      color:rgba(84,45,224,1);
      line-height:50px;
      padding: 0;
      margin: 0;
      opacity: 0;
      animation: 1s fadeInUp 1s both;
    }
    p {
      font-size:16px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:22px;
      padding: 0;
      margin: 0;
      opacity: 0;
      animation: 1.2s fadeInUp 1s both;
    }

    @media screen and ( max-width: 540px ) {
      margin-top: 20px;
      margin-bottom: 20px;
      height: 140px;
      h3 {
        font-size: 30px;
        line-height: 1.5;
      }
      p {
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }
}
</style>