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
            <img :src="itemBlock.img" :alt="item.title">
          </div>
          <p class="item-title">{{ itemBlock.title }}</p>
          <p class="item-description">{{ itemBlock.description }}</p>
          <a
            :href="itemBlock.disabled ? 'javascript:;' :itemBlock.url"
            class="item-btn"
            :class="itemBlock.disabled && 'disabled'"
            :target="itemBlock.disabled ? '' : '_blank'"
          >{{ itemBlock.btn }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import matataki from '@/assets/img/dapp_list_matataki.png'
import airdrop from '@/assets/img/dapp_list_airdrop.png'
import map from '@/assets/img/dapp_list_map.png'
import doc from '@/assets/img/dapp_list_doc.png'

export default {
  data() {
    return {
      list: [
        {
          title: 'DAPP',
          list: [
            {
              title: '瞬Matataki',
              description: '一个公开永存的数字作品库',
              img: matataki,
              url: 'https://www.matataki.io',
              btn: '访问网站',
              disabled: false
            },
            {
              title: 'Matataki Airdrop',
              description: '一个基于Fan票的简单空投工具',
              img: airdrop,
              url: 'https://www.matataki-airdrop.xyz/',
              btn: '访问网站',
              disabled: false
            },
            {
              title: '神秘应用',
              description: '此应用正在开发中',
              img: map,
              url: '',
              btn: '即将上线',
              disabled: true
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
              url: 'https://docs.matataki.io/',
              btn: '立即查看',
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
  margin: 0 auto 20px;
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
    margin: 0;
  }
  .item {
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
      width: calc(25% - 15px);
      // height: 412px;
      background: rgba(255, 255, 255, 1);
      border-radius: 10px;
      float: left;
      margin: 20px 20px 0 0;
      padding: 0 20px 20px;
      box-sizing: border-box;
      transition: all 0.3s;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
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
      }
      .item-btn {
        border-radius: 8px;
        border: 1px solid rgba(84, 45, 224, 1);
        font-size: 14px;
        font-weight: 500;
        color: rgba(84, 45, 224, 1);
        line-height: 20px;
        padding: 6px 16px;
        text-align: center;
        float: right;
        transition: all .2s;
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

  .dapp-container .item li {
    width: calc(33.33% - 13.33333px);
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    &:nth-of-type(4n) {
      margin-right: 20px;
    }
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

  .dapp-container .item li {
    width: calc(50% - 10px);
    &:nth-of-type(2n) {
      margin-right: 0;
    }
    &:nth-of-type(3n) {
      margin-right: 20px;
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

  .dapp-container .item li {
    width: calc(100%);
    margin-left: 0;
    margin-right: 0;
    &:nth-of-type(3n) {
      margin-right: 0;
    }

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>