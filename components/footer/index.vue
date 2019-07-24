<template>
  <footer class="footer">
    <div class="mw footer-content">
      <img class="logo" src="@/assets/img/footer_logo.png" alt="logo">
      <div class="content">
        <div class="nav">
          <a class="href" href="#">使用手册</a>
          <a class="href" href="#">隐私政策</a>
          <a class="href" href="#">用户协议</a>
          <a class="href" href="#">关于我们</a>
          <a class="href" href="#">智能公告牌</a>
          <div class="icon" />
          <div class="icon" />
          <div class="icon" />
        </div>
        <p class="copyright">
          Copyright © 2018-2019 ANDOROMEDA TECH.ltd
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.footer {
  height: 200px;
  background: #333333;
  &-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.logo {
  width: 304px;
}
.content {
  .nav {
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    .href {
      font-size: 16px;
      font-weight: 500;
      color: rgba(178, 178, 178, 1);
      line-height: 22px;
      margin-left: 40px;
      &:hover {
        color: #fff;
      }
    }
    .icon {
      margin-left: 40px;
      display: inline-block;
      cursor: pointer;
      &:nth-of-type(1) {
        width: 28px;
        height: 23px;
        background-image: url('../../assets/img/footer_wechat.svg');
        &:hover {
          background-image: url('../../assets/img/footer_wechat_active.svg');
        }
      }
      &:nth-of-type(2) {
        width: 22px;
        height: 24px;
        background-image: url('../../assets/img/footer_github.svg');
        &:hover {
          background-image: url('../../assets/img/footer_github_active.svg');
        }
      }
      &:nth-of-type(3) {
        width: 25px;
        height: 21px;
        background-image: url('../../assets/img/footer_telegram.svg');
        &:hover {
          background-image: url('../../assets/img/footer_telegram_active.svg');
        }
      }
    }
  }
  .copyright {
    font-size: 16px;
    font-weight: 500;
    color: rgba(178, 178, 178, 1);
    line-height: 22px;
    text-align: right;
    margin-top: 36px;
  }
}
</style>
