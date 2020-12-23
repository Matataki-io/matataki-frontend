<template>
  <div class="dapp">
    <el-carousel
      trigger="click"
      height="240px"
      class="swipe-dapp"
    >
      <el-carousel-item>
        <div class="dapp-head-shuttle">
          <div class="head-text">
            <p class="head-description">一个基于Fan票提现和转入的工具</p>
            <p class="head-title">Fan票折跃门</p>
            <n-link :to="{ path: '/token/in-n-out' }" target="_blank" class="head-btn">
              {{ $t('visit-website') }}
            </n-link>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="dapp-head">
          <div class="head-text">
            <p class="head-description">一个基于Fan票的简单空投工具</p>
            <p class="head-title">Matataki Airdrop</p>
            <a href="https://www.matataki-airdrop.xyz/" target="_blank" class="head-btn">{{ $t('visit-website') }}</a>
          </div>
          <img class="computer" src="@/assets/img/dapp_head_computer.png" alt="computer">
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="dapp-head-quest">
          <div class="head-text">
            <p class="head-description">一个基于Fan票的任务悬赏平台</p>
            <img src="@/assets/img/dapp-banner-quest-logo.png" alt="logo">
            <a href="https://matataki-quest.netlify.app" target="_blank" class="head-btn">
              {{ $t('visit-website') }}
            </a>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="crypto-hero">
          <p>一个基于Fan票的水浒集卡游戏</p>
          <img src="@/assets/img/dapp_cryptohero_text.png" alt="">
          <a href="https://dao-hero.netlify.app" target="_blank">{{ $t('visit-website') }}</a>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="crypto-meet-up">
          <p>一个基于Fan票的地理位置共享&订阅</p>
          <h3>Crypto Meet Up</h3>
          <a href="https://cryptomeetup.async.moe" target="_blank">{{ $t('visit-website') }}</a>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="dapp-head mining">
          <div class="head-text">
            <p class="head-description">一个利用Fan票来挖矿</p>
            <p class="head-title">Matataki Mining</p>
            <a href="https://matataki-mining.netlify.app/" target="_blank" class="head-btn">{{ $t('visit-website') }}</a>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div v-for="(item, index) in list" :key="index" class="dapp-container">
      <h3>{{ item.title }}</h3>
      <ul class="item">
        <li v-for="(itemBlock, indexBlock) in item.list" :key="indexBlock">
          <div class="item-cover">
            <img
              :style="(itemBlock.width ? `width: ${itemBlock.width};` : '') + (itemBlock.height ? `height: ${itemBlock.height};` : '')"
              :src="itemBlock.img"
              :alt="item.title"
            >
          </div>
          <p class="item-title">{{ itemBlock.title }}</p>
          <p class="item-description">{{ itemBlock.description }}</p>
          <div>
            <a
              v-if="itemBlock.repo"
              :href="itemBlock.repo"
              class="item-btn github"
              target="_blank"
            >{{ $t('github-address') }}</a>
            <a
              :href="itemBlock.disabled ? 'javascript:;' :itemBlock.url"
              class="item-btn"
              :class="itemBlock.disabled && 'disabled'"
              :target="itemBlock.disabled ? '' : '_blank'"
            >{{ itemBlock.btn }}</a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import matataki from '@/assets/img/dapp_list_matataki.png'
import exchange from '@/assets/img/dapp_list_exchange.png'
import airdrop from '@/assets/img/dapp_list_airdrop.png'
import map from '@/assets/img/dapp_list_map.png'
import doc from '@/assets/img/dapp_list_doc.png'
// import input from '@/assets/img/dapp_list_input.png'
// import output from '@/assets/img/dapp_list_output.png'
import developer from '@/assets/img/dapp_list_developer.png'
import cryptohero from '@/assets/img/dapp_list_cryptohero.png'
import nft from '@/assets/img/dapp_list_nft.png'
import dao from '@/assets/img/dapp_list_dao.png'
import mine from '@/assets/img/dapp_list_mine.png'
import shuttle from '@/assets/img/dapp_list_shuttle.png'
import quest from '@/assets/img/dapp_list_quest.png'
export default {
  data() {
    return {
      list: [
        {
          title: 'DAPP',
          list: [
            {
              title: '瞬Matataki',
              description: '公开永存的数字作品库',
              img: matataki,
              width: '128px',
              height: '128px',
              url: 'https://www.matataki.io/',
              repo: 'https://github.com/Matataki-io/Matataki-FE',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: 'Matataki Airdrop',
              description: '基于Fan票的简单空投工具',
              img: airdrop,
              width: '170px',
              height: '173px',
              url: 'https://www.matataki-airdrop.xyz/',
              repo: 'https://github.com/NaoMikuOshi/Matataki-Token-AirDropper',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: 'Cryptomeetup',
              description: '基于Fan票的地理位置共享&订阅',
              img: map,
              width: '166px',
              height: '123px',
              url: 'https://cryptomeetup.async.moe/',
              repo: 'https://github.com/crypto-meetup-dev/cryptomeetup-portal',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: '水浒英雄',
              description: '基于Fan票的水浒集卡游戏',
              img: cryptohero,
              width: '148px',
              height: '143px',
              url: 'https://dao-hero.netlify.app/',
              repo: 'https://github.com/cryptohero/cryptohero-erc20-frontend-ng',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: 'Matataki NFT',
              description: '基于Fan票的NFT生成和交易工具',
              img: nft,
              width: '120px',
              height: '120px',
              url: 'https://matataki-nft.netlify.app/',
              repo: 'https://github.com/Matataki-io/Matataki-NFT',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: 'Matataki DAO',
              description: '基于Fan票和二次方投票系统的DAO',
              img: dao,
              width: '120px',
              height: '120px',
              url: 'https://matataki-dao.netlify.app/#/',
              repo: 'https://github.com/Matataki-io/Matataki-DAO',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: 'Fan票挖矿',
              description: '利用Fan票来挖矿',
              img: mine,
              width: '120px',
              height: '120px',
              url: 'https://matataki-mining.netlify.app/',
              repo: 'https://github.com/Andoromeda-Foundation/Matataki-Mining-Interface',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: 'Matataki Quest',
              description: '基于Fan票的任务悬赏平台',
              img: quest,
              width: '130px',
              height: '147px',
              url: 'https://matataki-quest.netlify.app/',
              repo: 'https://github.com/Matataki-io/Fan-TaskBoard',
              btn: this.$t('visit-website'),
              disabled: false
            },
          ]
        },
        {
          title: this.$t('tool'),
          list: [
            {
              title: 'Fan票交换事务所',
              description: '基于Uniswap的Fan票交易工具',
              img: exchange,
              width: '168px',
              height: '99px',
              url: 'https://www.matataki.io/exchange/',
              repo: 'https://github.com/Matataki-io/Matataki-FE',
              btn: this.$t('visit-website'),
              disabled: false
            },
            // {
            //   title: 'Fan票提现',
            //   description: '将Fan票提现到Metamask钱包',
            //   img: output,
            //   width: '138px',
            //   height: '159px',
            //   url: '/token/withdraw',
            //   btn: this.$t('visit-website'),
            //   disabled: false
            // },
            // {
            //   title: 'Fan票转入',
            //   description: '将Metamask钱包中的Fan票充值到Matataki',
            //   img: input,
            //   width: '138px',
            //   height: '148px',
            //   url: '/token/deposit',
            //   btn: this.$t('visit-website'),
            //   disabled: false
            // },
            // {
            //   title: 'Fan提取',
            //   description: '跨链提取 Fan票到币安智能链（Binance Smart Chain）',
            //   img: output,
            //   width: '138px',
            //   height: '148px',
            //   url: '/token/withdrawToBsc',
            //   btn: this.$t('visit-website'),
            //   disabled: false
            // },
            {
              title: 'Fan票折跃门',
              description: 'Fan票跨链导入导出工具',
              img: shuttle,
              width: 'auto',
              height: '100%',
              url: '/token/in-n-out',
              btn: this.$t('visit-website'),
              disabled: false
            },
          ]
        },
        {
          title: this.$t('other'),
          list: [
            {
              title: '开发文档',
              description: '关于瞬Matataki的开发文档',
              img: doc,
              width: '134px',
              height: '140px',
              url: 'https://docs.matataki.io/',
              repo: 'https://github.com/Matataki-io/api-doc',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: 'Develop Portal',
              description: 'Fan票的开发者中心',
              img: developer,
              width: '120px',
              height: '120px',
              url: 'https://developer.matataki.io',
              repo: 'https://github.com/Matataki-io/DeveloperPortal-FE',
              btn: this.$t('visit-website'),
              disabled: false
            },
          ]
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.dapp {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 96px;
}
.swipe-dapp {
  margin: 40px 20px 0 20px;
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
    margin: 0 0 0 180px;
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

.dapp-container {
  margin: 40px 0 0;
  padding: 0 20px;
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 28px;
    padding: 0;
    margin: 0 0 20px;
  }
  .item {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
    grid-gap: 20px 20px;
    justify-content: space-between;
    &::after {
      display: block;
      content: "";
      width: 0;
      height: 0;
      clear: both;
    }
    li {
      &::after {
        display: block;
        content: "";
        width: 0;
        height: 0;
        clear: both;
      }
      background: rgba(255, 255, 255, 1);
      border-radius: 10px;
      float: left;
      padding: 0 20px 20px;
      box-sizing: border-box;
      text-align: center;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
      }
      .item-cover {
        height: 168px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 36px;
        img {
          width: 168px;
          height: 168px;
          object-fit: contain;
        }
      }

      .item-title {
        font-size: 20px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 28px;
        padding: 0;
        margin: 40px 0 0 0;
        text-align: center;
      }
      .item-description {
        font-size: 16px;
        font-weight: 400;
        color: rgba(178, 178, 178, 1);
        line-height: 22px;
        padding: 0;
        margin: 20px 0 44px;
        text-align: center;
        flex: 1;
      }
      .item-btn {
        border-radius: 8px;
        border: 1px solid rgba(84, 45, 224, 1);
        font-size: 14px;
        font-weight: 500;
        color: rgba(84, 45, 224, 1);
        line-height: 20px;
        padding: 5px 16px;
        margin: 0 10px;
        display: inline-block;
        text-align: center;
        transition: all 0.2s;
        &.github {
          padding-left: 8px;
          padding-right: 8px;
          color: #333;
          border: 1px solid rgba(178, 178, 178, 1);
        }
        &.disabled {
          border-color: rgba(241, 241, 241, 1);
          background: rgba(241, 241, 241, 1);
          color: rgba(178, 178, 178, 1);
          cursor: not-allowed;
          &:hover {
            border-color: rgba(241, 241, 241, 1);
            background: rgba(241, 241, 241, 1);
            color: rgba(178, 178, 178, 1);
          }
        }
        &:hover {
          background: rgba(84, 45, 224, 1);
          color: #fff;
          &.github {
            border-color: rgba(178, 178, 178, 1);
            background-color: rgba(178, 178, 178, 1);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .dapp-head .head-text {
    margin-left: 60px;
  }
  .dapp-head .computer {
    margin-right: 60px;
  }

  // .dapp-container .item li {
  //   width: calc(33.33% - 13.33333px);
  //   &:nth-of-type(3n) {
  //     margin-right: 0;
  //   }
  //   &:nth-of-type(4n) {
  //     margin-right: 20px;
  //   }
  // }
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

  // .dapp-container .item li {
  //   width: calc(50% - 10px);
  //   &:nth-of-type(2n) {
  //     margin-right: 0;
  //   }
  //   &:nth-of-type(3n) {
  //     margin-right: 20px;
  //   }
  // }
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

  .dapp-container .item li {
    // width: calc(100%);
    // margin-left: 0;
    // margin-right: 0;
    // &:nth-of-type(3n) {
    //   margin-right: 0;
    // }

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>