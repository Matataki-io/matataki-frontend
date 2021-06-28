<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="item">
        <ul class="item-list">
          <li>
            <h3>快捷入口</h3>
          </li>
          <li>
            <a class="href" target="_blank" href="/home">
              {{ $t("footer.aboutMatataki") }}
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://www.yuque.com/matataki/matataki"
            >
              {{ $t("footer.hellpbook") }}
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://www.yuque.com/matataki/matataki_version"
            >
              {{ $t("footer.updateRecord") }}
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="http://andoromeda.mikecrm.com/a93Le8z"
            >
              {{ $t("anyFeedback") }}
            </a>
          </li>
        </ul>
        <ul class="item-list">
          <li>
            <h3>友情链接</h3>
          </li>
          <li>
            <a class="href" href="https://matters.news/" target="_blank">
              Matters
            </a>
          </li>
          <li>
            <a class="href" href="https://maskbook.com/" target="_blank">
              Maskbook
            </a>
          </li>
          <li>
            <a class="href" href="https://orange.xyz/" target="_blank">
              {{ $t("footer.orange") }}
            </a>
          </li>
          <li>
            <a class="href" href="https://www.defi.wtf" target="_blank">
              DeFi.wtf
            </a>
          </li>
          <li>
            <a class="href" href="http://nfg.fan/" target="_blank">
              NFT Gallery
            </a>
          </li>
        </ul>
        <ul class="item-list">
          <li>
            <img
              class="img-title"
              src="../../assets/img/footer-item-matataki.png"
              alt="瞬MATATAKI"
            >
          </li>
          <li>
            <a class="href" target="_blank" href="https://www.matataki.io">
              <svg-icon class="icon" icon-class="matataki" />Matataki.io
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://github.com/Matataki-io/Matataki-FE"
            >
              <svg-icon class="icon" icon-class="github" />@matataki_io
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://t.me/smartsignature_io"
            >
              <svg-icon class="icon" icon-class="telegram1" />@Matataki
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://discord.gg/KGR4SHDhBa"
            >
              <svg-icon class="icon" icon-class="discord" />@matataki
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://twitter.com/intent/follow?ref_src=twsrc%5Etfw&screen_name=realmatataki&tw_p=followbutton"
            >
              <svg-icon class="icon" icon-class="twitter" />@realmatataki
            </a>
          </li>
          <li>
            <el-popover placement="top" trigger="hover" popper-class="footer-wechat-popover">
              <div class="footer-wechat">
                <img src="../../assets/img/wechat-bot-1.jpg" alt="WeChat Bot">
                <p class="footer-wechat-title">
                  {{ $t("footer.scanCode") }}
                </p>
              </div>
              <a slot="reference" class="href" href="javascript:;">
                <svg-icon class="icon" icon-class="weixin" />@MatatakiBot
              </a>
            </el-popover>
          </li>
        </ul>
        <ul class="item-list">
          <li>
            <img
              class="img-title"
              src="../../assets/img/footer-item-metanetwork.png"
              alt="Meta Network"
            >
          </li>
          <li>
            <a class="href" target="_blank" href="https://www.meta.io">
              <svg-icon class="icon" icon-class="meta" />Meta.io
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://t.me/metanetwork"
            >
              <svg-icon class="icon" icon-class="telegram1" />@MetaNetwork
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://discord.gg/59cXXWCWUT "
            >
              <svg-icon class="icon" icon-class="discord" />@MetaNetwork
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://twitter.com/realMetaNetwork"
            >
              <svg-icon class="icon" icon-class="twitter" />@MetaNetwork
            </a>
          </li>
          <li>
            <a
              class="href"
              target="_blank"
              href="https://medium.com/meta-network"
            >
              <svg-icon class="icon" icon-class="medium" />@MetaNetwork
            </a>
          </li>
        </ul>
      </div>

      <div class="product">
        <a
          href="https://www.producthunt.com/posts/matataki?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-matataki"
          target="_blank"
        ><img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=281257&theme=light"
          alt="瞬MATATAKI - We help creators distribute SocialMoney & provide services | Product Hunt"
          width="250"
          height="54"
        ></a>
      </div>
      <div class="line" />
      <div class="footer-copyright fl jsb">
        <span class="copyright">Copyright © 2018-2021 ANDOROMEDA. 
        <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备19020303号
        </a>
        </span>
        <language class="footer-language" />
      </div>
    </div>
  </footer>
</template>

<script>
import language from '../header/language'
export default {
  name: 'Footer',
  serverCacheKey() {
    return 'Footer'
  },
  components: {
    language,
  },
}
</script>

<style lang="less" scoped>
.footer {
  background: #333333;
  box-sizing: border-box;
  &-content {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px 0;
    box-sizing: border-box;
  }
  .line {
    height: 1px;
    background-color: #b2b2b2;
    width: 100%;
  }
}

.link {
  margin: 10px 0 0;
  font-size: 14px;
  color: rgba(178, 178, 178, 1);
  line-height: 22px;
  a {
    color: rgba(178, 178, 178, 1);
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
.footer-content {
  flex-direction: row;
  align-items: flex-start;
}

.product {
  padding: 48px 0;
  display: flex;
  justify-content: flex-end;
  @media screen and (max-width: 768px) {
    justify-content: center;
  }
}

.item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.item-list {
  margin-top: 48px;
  li {
    list-style: none;
    margin-top: 24px;
    &:nth-of-type(1) {
      margin-top: 0;
    }
    .href {
      font-size: 14px;
      font-weight: 400;
      color: #b2b2b2;
      line-height: 20px;
      display: flex;
      align-items: center;
      &:hover {
        color: #fff;
      }
    }
    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #b2b2b2;
      line-height: 22px;
      padding: 0;
      margin: 0;
    }
    .img-title {
      height: 16px;
    }
    .icon {
      margin-right: 4px;
      font-size: 16px;
    }
  }
}

.footer-copyright {
  padding: 48px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .copyright {
    font-size: 14px;
    font-weight: 400;
    color: #b2b2b2;
  }
}
.footer-language {
  display: flex;
  align-items: center;
}

.footer-wechat {
  width: 260px;
  text-align: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .footer-wechat-title {
    padding: 0;
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #fff;
  }
}
</style>

<style lang="less">
.footer-wechat-popover {
  background: #1a1a1a;
  border-color: #1a1a1a;
  .popper__arrow{
    border-top-color: #1a1a1a !important;
    &::after {
      border-top-color: #1b1b1b !important;
    }
  }
}
</style>
