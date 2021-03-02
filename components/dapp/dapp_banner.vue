<template>
  <el-carousel
    trigger="click"
    height="240px"
    class="swipe-dapp"
    interval="100000"
  >
    <el-carousel-item>
      <div class="dapp-head-governance">
        <div class="head-text">
          <p class="head-description">{{ $t('a-Matataki-management-background-that-obtains-governance-rights-by-staking-META') }}</p>
          <img class="head-logo" src="@/assets/img/dapp-banner-governance-text.png" alt="logo">
          <a href="https://governance.matataki.io" target="_blank" class="head-btn">
            {{ $t('visit-website') }}
          </a>
        </div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div class="dapp-head-shuttle">
        <div class="head-text">
          <p class="head-description">{{ $t('a-tool-based-on-Fan-ticket-withdrawal-and-transfer') }}</p>
          <p class="head-title">{{ $t('coin-folding-door') }}</p>
          <n-link :to="{ path: '/token/in-n-out' }" target="_blank" class="head-btn">
            {{ $t('visit-website') }}
          </n-link>
        </div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div class="dapp-head">
        <div class="head-text">
          <p class="head-description">{{ $t('a-simple-airdrop-tool-based-on-coin') }}</p>
          <p class="head-title">Matataki Airdrop</p>
          <a href="https://www.matataki-airdrop.xyz/" target="_blank" class="head-btn">{{ $t('visit-website') }}</a>
        </div>
        <img class="computer" src="@/assets/img/dapp_head_computer.png" alt="computer">
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div class="dapp-head-quest">
        <div class="head-text">
          <p class="head-description">{{ $t('a-task-reward-platform-based-on-coin') }}</p>
          <img src="@/assets/img/dapp-banner-quest-logo.png" alt="logo">
          <a href="https://quest.matataki.io" target="_blank" class="head-btn">
            {{ $t('visit-website') }}
          </a>
        </div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div class="crypto-hero">
        <p>{{ $t('a-Water-Margin-Card-Game-Based-on-coin') }}</p>
        <img src="@/assets/img/dapp_cryptohero_text.png" alt="">
        <a href="https://dao-hero.netlify.app" target="_blank">{{ $t('visit-website') }}</a>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div class="crypto-meet-up">
        <p>{{ $t('a-location-sharing-subscription-based-on-coin') }}</p>
        <h3>Crypto Meet Up</h3>
        <a href="https://cryptomeetup.async.moe" target="_blank">{{ $t('visit-website') }}</a>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div class="dapp-head mining">
        <div class="head-text">
          <p class="head-description">{{ $t('one-uses-coin-to-mine') }}</p>
          <p class="head-title">Matataki Mining</p>
          <a href="https://matataki-mining.netlify.app/" target="_blank" class="head-btn">{{ $t('visit-website') }}</a>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: 'DappBanner',
  serverCacheKey() {
    return 'DappBanner'
  },
}
</script>

<style lang="less" scoped>
.swipe-dapp {
  margin: 40px 20px 0 20px;
}

.dapp-head-governance {
  height: 240px;
  background-image: url(../../assets/img/dapp-banner-governance.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .head-description {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    line-height: 22px;
    padding: 0;
    margin: 0;
  }
  .head-logo {
    display: block;
    width: 450px;
    margin: 8px 0 0 0;
  }
  .head-text {
    margin: 0 auto 0 auto;
    text-align: left;
  }
  .head-btn {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #ffffff;
    padding: 8px 40px;
    margin: 18px 0 0 0;
    display: inline-block;
    background: #6236FF;
    border-radius: 20px;
  }
}

.dapp-head-shuttle {
  height: 240px;
  background-image: url(../../assets/img/dapp-banner-shuttle.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .head-description {
    font-size: 20px;
    font-weight: 400;
    color: #fff;
    line-height: 28px;
    padding: 0;
    margin: 0;
  }
  .head-text {
    margin: 0 auto;
    text-align: center;
  }
  .head-title {
    padding: 0;
    margin: 7px 0 0;
    font-size: 48px;
    font-weight: 900;
    color: #F7B500;
    line-height: 67px;
    text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
    font-family: STSongti-SC-Black STSongti-SC serif;
  }
  .head-btn {
    // background: #542de0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #ffffff;
    padding: 8px 40px;
    margin: 18px 0 0 0;
    display: inline-block;
    background: #6236FF;
    border-radius: 20px;
  }
}

.dapp-head-quest {
  height: 240px;
  background-image: url(../../assets/img/dapp-banner-quest.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .head-description {
    width: 275px;
    height: 28px;
    font-size: 20px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 28px;
    padding: 0;
    margin: 0;
  }
  .head-text {
    margin: 0 auto 0 auto;
    img {
      display: block;
      width: 464px;
      margin: 8px 0;
    }
  }
  .head-btn {
    // background: #542de0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #ffffff;
    padding: 8px 40px;
    margin: 0;
    display: inline-block;
    background: #6236FF;
    border-radius: 20px;
  }
}

.crypto-hero {
  height: 240px;
  background-image: url(../../assets/img/dapp_cryptohero_bc.png);
  background-size: cover;
  background-position: left;
  background-repeat: no-repeat;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  p {
    font-size: 20px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 28px;
    padding: 0;
    margin: 0;
  }
  img {
    width: 436px;
    margin: 18px 0 26px;
  }
  a {
    width: 160px;
    height: 40px;
    background: #f34c20;
    border-radius: 20px;
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    line-height: 40px;
    padding: 0;
    margin: 0;
    text-align: center;
  }
  @media screen and (max-width: 700px) {
    p {
      font-size: 16px;
    }
    img {
      width: 260px;
      margin: 10px 0 20px;
    }
    a {
      width: 110px;
      height: 34px;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      line-height: 34px;
    }
  }
}

.crypto-meet-up {
  height: 240px;
  background-image: url(../../assets/img/dapp_cryptomeetup_bc.png);
  background-size: cover;
  background-position: left;
  background-repeat: no-repeat;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  padding: 0 140px 0 0;

  p {
    font-size: 20px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 28px;
    padding: 0;
    margin: 0;
  }
  h3 {
    font-size: 36px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 50px;
    padding: 0;
    margin: 5px 0 17px;
  }
  a {
    width: 160px;
    height: 40px;
    background: rgba(21, 196, 255, 1);
    border-radius: 8px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    text-align: center;
  }
  @media screen and (max-width: 700px) {
    padding: 0;
    align-items: center;
    p {
      font-size: 18px;
      color: #fff;
      text-shadow: 0 0 10px #000;
    }
    h3 {
      font-size: 30px;
      margin: 0px 0 10px;
      text-shadow: 0 0 10px #000;
    }
    a {
      width: 110px;
      height: 34px;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      line-height: 34px;
    }
  }
}

.dapp-head {
  height: 240px;
  background-image: url(../../assets/img/dapp_head_bc.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.mining {
    justify-content: center;
    .head-text {
      margin-left: 0;
      text-align: center;
    }
  }
  .computer {
    height: 200px;
    margin-right: 180px;
  }
  .head-description {
    font-size: 20px;
    font-weight: 400;
    color: #b2b2b2;
    line-height: 28px;
    padding: 0;
    margin: 0;
  }
  .head-text {
    margin-left: 180px;
  }
  .head-title {
    font-size: 36px;
    font-weight: 500;
    color: #fff;
    line-height: 50px;
    padding: 0;
    margin: 5px 0 0;
  }
  .head-btn {
    background: #542de0;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    padding: 8px 40px;
    margin: 18px 0 0 0;
    display: inline-block;
  }
}

@media screen and (max-width: 1100px) {
  .dapp-head .head-text {
    margin-left: 60px;
  }
  .dapp-head .computer {
    margin-right: 60px;
  }
}


@media screen and (max-width: 800px) {
  .dapp-head .computer {
    display: none;
  }

  .dapp-head {
    justify-content: center;
    .head-text {
      margin-left: 20px;
      margin-right: 20px;
      text-align: center;
    }
  }
}

@media screen and (max-width: 600px) {
  .dapp-head-governance {
    .head-text {
      text-align: center;
    }
    .head-logo {
      width: 300px;
    }
    .head-description {
      font-size: 12px;
    }
  }
  .dapp-head-quest {
    .head-text {
      text-align: center;
      img {
        width: 300px;
      }
    }
    .head-description {
      margin: 0 auto 0 auto;
    }
  }
}

@media screen and (max-width: 540px) {
  .dapp-head {
    .head-description {
      font-size: 14px;
    }
    .head-title {
      font-size: 26px;
      line-height: 1;
    }
    .head-btn {
      font-size: 14px;
    }
  }
}
</style>

<style lang="less">
@media screen and (max-width: 600px){
  .swipe-dapp {
    .el-carousel__button {
      width: 15px;
    }
  }
}
</style>
