<template>
  <div class="dapp">
    <div class="dapp-head">
      <div class="head-text">
        <p class="head-description">一个基于Fan票的简单空投工具</p>
        <p class="head-title">Matataki Airdrop</p>
        <a href="https://www.matataki-airdrop.xyz/" target="_blank" class="head-btn">访问网站</a>
      </div>
      <img class="computer" src="@/assets/img/dapp_head_computer.png" alt="computer">
    </div>

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
            >GitHub地址</a>
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
import input from '@/assets/img/dapp_list_input.png'
import output from '@/assets/img/dapp_list_output.png'
import developer from '@/assets/img/dapp_list_developer.png'
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
              btn: '访问网站',
              disabled: false
            },
            {
              title: 'Fan票交换事务所',
              description: '基于Uniswap的Fan票交易工具',
              img: exchange,
              width: '168px',
              height: '99px',
              url: 'https://www.matataki.io/exchange/',
              repo: 'https://github.com/Matataki-io/Matataki-FE',
              btn: '访问网站',
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
              btn: '访问网站',
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
              btn: '访问网站',
              disabled: false
            },
            {
              title: 'Fan票提现',
              description: '将Fan票提现到Metamask钱包',
              img: output,
              width: '138px',
              height: '159px',
              url: '/token/withdraw',
              btn: '访问网站',
              disabled: false
            },
            {
              title: 'Fan票转入',
              description: '将Metamask钱包中的Fan票充值到Matataki',
              img: input,
              width: '138px',
              height: '148px',
              url: '/token/deposit',
              btn: '访问网站',
              disabled: false
            },
          ]
        },
        {
          title: '其他',
          list: [
            {
              title: '开发文档',
              description: '关于瞬Matataki的开发文档',
              img: doc,
              width: '134px',
              height: '140px',
              url: 'https://docs.matataki.io/',
              repo: 'https://github.com/Matataki-io/api-doc',
              btn: '立即查看',
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
              btn: '访问网站',
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

.dapp-head {
  height: 240px;
  background-image: url(../../assets/img/dapp_head_bc.png);
  background-size: cover;
  background-position: center;
  background-color: #181352;
  background-repeat: no-repeat;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  margin: 40px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
          object-fit: cover;
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
        transition: all .2s;
        &.github {
          padding-left: 8px;
          padding-right: 8px;
          color: #333;
          border:1px solid rgba(178,178,178,1)
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
            border-color: rgba(178,178,178,1);
            background-color: rgba(178,178,178,1);
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