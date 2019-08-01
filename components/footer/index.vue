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
          <div class="icon wechat-icon">
            <div class="wechat">
              <img src="@/assets/img/code.png" alt="code">
            </div>
          </div>
          <a target="_blank" href="https://github.com/smart-signature/smart-signature-future">
            <div class="icon github-icon" />
          </a>
          <a target="_blank" href="https://t.me/smartsignature_io">
            <div class="icon telegram-icon" />
          </a>
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
    background: #333333;
    padding: 52px 0;
  &-content {
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.logo {
  width: 152px;
}
.content {
  .nav {
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    .href {
      margin-left: 20px;
      text-decoration: none;
      font-size:14px;
      color:rgba(178,178,178,1);
      line-height:22px;
      &:hover {
        color: #fff;
      }
    }
    .icon {
      margin-left: 40px;
      display: inline-block;
      cursor: pointer;
      .wechat {
        display: none;
        position: absolute;
        top: -190px;
        left: -74px;
        width: 170px;
        background: #fff;
        border-radius: 6px;
        padding: 14px;
        box-sizing: border-box;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
        &::after {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translate(-50%, 0);
          display: block;
          content: '';
          width: 0;
          height: 0;
          border: 10px solid #fff;
          border-color: #fff transparent transparent;
        }
        img {
          width: 100%;
        }
      }
      &:hover .wechat {
        display: block;
      }
      &.wechat-icon {
        width: 28px;
        height: 23px;
        position: relative;
        background-image: url('../../assets/img/footer_wechat.svg');
        &:hover {
          background-image: url('../../assets/img/footer_wechat_active.svg');
        }
      }
      &.github-icon {
        width: 22px;
        height: 24px;
        background-image: url('../../assets/img/footer_github.svg');
        &:hover {
          background-image: url('../../assets/img/footer_github_active.svg');
        }
      }
      &.telegram-icon{
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
    font-size: 14px;
    color: rgba(178, 178, 178, 1);
    line-height: 22px;
    text-align: right;
    margin: 36px 0 0;
  }
}
</style>
