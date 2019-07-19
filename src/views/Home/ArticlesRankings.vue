<template>
  <div class="mw">
    <div class="head">
      <div class="head-list">
        <a
          v-for="(item, index) in tabsData"
          :key="index"
          href="javascript:;"
          class="head-list-button"
          :class="activeIndex === index && 'active'"
          @click="toggleHeadButton(index)"
        >
          {{ item.label }}
        </a>
      </div>
      <Checkbox v-model="channel" class="head-store">
        <img class="head-store-icon" src="@/assets/img/icon_store.svg" alt="store" />商品
      </Checkbox>
      <!-- <div class="head" ref="head" :class="isFixedHead && 'fixed'"> -->
    </div>
    <BasePull
      v-for="(item, index) in tabsData"
      v-show="index === activeIndex"
      :key="index"
      :params="item.params"
      :api-url="item.apiUrl"
      :active-index="activeIndex"
      :now-index="index"
      :is-obj="{ type: 'Object', key: 'data' }"
      :auto-request-time="autoRequestTime"
      @getListData="getListData"
    >
      <ArticleCard v-for="(item, itemIndex) in item.articles" :key="itemIndex" :article="item" />
    </BasePull>
  </div>
</template>

<script>
import { ArticleCard } from '@/components/'
// import throttle from 'lodash/throttle';

export default {
  name: 'ArticlesRankings',
  components: { ArticleCard },
  data() {
    return {
      channel: false,
      tabsData: [
        {
          label: '最新',
          params: {},
          apiUrl: 'homeTimeRanking',
          articles: []
        },
        {
          label: '最热',
          params: {},
          apiUrl: 'homeSupportsRanking',
          articles: []
        },
        {
          label: 'EOS',
          params: {
            symbol: 'eos'
          },
          apiUrl: 'homeAmountRankingEOS',
          articles: []
        },
        {
          label: 'ONT',
          params: {
            symbol: 'ont'
          },
          apiUrl: 'homeAmountRankingONT',
          articles: []
        }
      ],
      activeIndex: 0,
      isFixedHead: false,
      autoRequestTime: 0
    }
  },
  watch: {
    channel() {
      this.tabsData.map(i => {
        if (this.channel) i.params.channel = 2
        else delete i.params.channel
      })
      this.autoRequestTime += Date.now()
    }
  },
  created() {
    // this.addHandleScroll();
  },
  destroyed() {
    // this.removeHandleScroll();
  },
  methods: {
    getListData(res) {
      this.tabsData[res.index].articles = res.list
    },
    toggleHeadButton(name) {
      this.activeIndex = name
    }
    // addHandleScroll() {
    //   window.addEventListener('scroll', throttle(this.handleScroll, 150));
    // },
    // handleScroll() {
    //   const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    //   // console.log(scrollTop);
    //   if (scrollTop > 296) this.isFixedHead = true;
    //   else this.isFixedHead = false;
    // },
    // removeHandleScroll() {
    //   window.removeEventListener('scroll', this.handleScroll);
    // },
  }
}
</script>

<style lang="less" scoped>
.head {
  padding: 20px 16px 10px;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    max-width: 750px;
    margin: 0 auto;
    background-color: #f0f0f0;
  }
}

.head-list {
  padding: 0 0 0 10px;
  &-button {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.24);
    margin: 0 30px 0 0;
    transition: all 0.18s;
    text-align: center;
    display: inline-block;
    &.active {
      color: rgba(0, 0, 0, 7);
      position: relative;
      transform: scale(1.3);
      &::after {
        content: '';
        display: block;
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translate(-50%, 0);
        height: 2px;
        width: 30px;
        border-radius: 10px;
        background-color: #00adf2;
      }
    }
  }
}

.head-store {
  display: flex;
  align-items: center;
  justify-content: center;
  &-icon {
    width: 20px;
    margin-left: 4px;
  }
}

@media screen and (max-width: 576px) {
  .head-list-button {
    margin: 0 14px 0 0;
    &:nth-last-child(1) {
      margin: 0;
    }
    &.active {
      transform: scale(1.2);
    }
  }
}
</style>
