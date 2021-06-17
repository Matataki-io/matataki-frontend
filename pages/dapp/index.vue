<template>
  <div class="dapp">
    <dappBanner />
    <div v-for="(item, index) in list" :key="index" class="dapp-container">
      <h3>{{ item.title }}</h3>
      <ul class="item">
        <dappItem
          v-for="(itemBlock, indexBlock) in item.list"
          :key="indexBlock"
          :item-block="itemBlock"
          :item="item"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import dappBanner from '@/components/dapp/dapp_banner.vue'
import dappItem from '@/components/dapp/dapp_item.vue'
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
import governance from '@/assets/img/dapp_list_governance.png'
import matatakiMD from '@/assets/img/dapp_list_matatakimd.png'

export default {
  components: {
    dappBanner,
    dappItem
  },
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
              url: 'https://quest.matataki.io/',
              repo: 'https://github.com/Matataki-io/Fan-TaskBoard',
              btn: this.$t('visit-website'),
              disabled: false
            },
            {
              title: 'Matataki治理委员会',
              description: '通过质押META来获取治理权限的Matataki管理后台',
              img: governance,
              width: '156px',
              height: 'auto',
              url: 'https://governance.matataki.io',
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
            {
              title: 'MatatakiMD',
              description: '用 Markdown 即时创作发布到 Web3',
              img: matatakiMD,
              width: '168px',
              height: '168px',
              url: 'http://md.mttk.net',
              repo: 'https://github.com/Matataki-io/matatakiMD',
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
  }
}

</style>