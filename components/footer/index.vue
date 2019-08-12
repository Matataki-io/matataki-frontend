<template>
  <footer class="footer">
    <div class="mw footer-content">
      <div class="content">
        <div class="nav">
          <a class="href" target="_blank" href="http://www.smartsignature.io/p/617">使用手册</a>
          <a class="href" href="javascript:;">隐私政策</a>
          <a class="href" href="javascript:;">用户协议</a>
          <a class="href" target="_blank" href="https://github.com/smart-signature/smart-signature-future">关于我们</a>
          <a class="href" target="_blank" href="http://www.smartsignature.io/p/616">智能公告牌</a>
        </div>
        <p class="link">
          友情链接:
          <a href="http://linkidol.pro/" target="_blank">链接偶像</a>
          |
          <a href="https://orange.xyz/" target="_blank">橙皮书</a>
        </p>
      </div>
      <div>
        <div>
          <img class="logo" src="@/assets/img/footer_logo.png" alt="logo">
          <div class="icon wechat-icon">
            <div class="wechat">
              <div class="wechat-img">
                <img src="@/assets/img/wechat-group.png" alt="code">
                <p class="wechat-title">
                  扫码进群
                </p>
              </div>
              <div class="wechat-img">
                <img src="@/assets/img/wechat-public.png" alt="code">
                <p class="wechat-title">
                  关注公众号
                </p>
              </div>
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
    height: 180px;
    background: #333333;
    padding-top: 52px;
    padding-bottom: 52px;
    box-sizing: border-box;
  &-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
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
      margin-right: 20px;
      text-decoration: none;
      font-size:14px;
      color:rgba(178,178,178,1);
      line-height:22px;
      &:hover {
        color: #fff;
      }
    }

  }

}

.icon {
  margin-left: 22px;
  display: inline-block;
  cursor: pointer;
  .wechat {
    display: none;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: -200px;
    left: -146px;
    width: 310px;
    background: #fff;
    border-radius: 6px;
    padding: 14px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    &-img {
      text-align: center;
    }
    &-title {
      padding: 0;
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: #000;
    }
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
      border: 1px solid #eee;
      width: 130px;
      box-sizing: border-box;
    }
  }
  &:hover .wechat {
    display: flex;
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
.copyright {
  font-size: 14px;
  color: rgba(178, 178, 178, 1);
  line-height: 22px;
  margin: 10px 0 0;
}

  .link {
    margin: 10px 0 0;
    font-size:14px;
    color:rgba(178,178,178,1);
    line-height:22px;
    a {
      color:rgba(178,178,178,1);
      text-decoration: none;
      margin: 0 4px;
      &:nth-child(1) {
        margin-left: 12px;
      }
      &:hover {
        color: #fff;
      }
    }
  }
</style>
