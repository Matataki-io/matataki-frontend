<template>
  <div class="home">
    <swipe :card="recommendList" />
    <!-- 首页内容 轮播和推荐 -->
    <!-- <banner-matataki class="home-banner" /> -->
    <div class="container">
      <div class="col-6">
        <router-view />
      </div>
      <div class="col-3">
        <div class="position-sticky top80">
          <popularArticles :list="popularlist" />
          <section class="head ra-head tag">
            <h3 class="head-title">
              {{ $t('home.hotTag') }}
            </h3>
            <router-link :to="{name: 'tags'}">
              {{ $t('home.viewAll') }}
              <svg-icon icon-class="arrow" class="icon" />
            </router-link>
          </section>
          <tagsHot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
// import bannerMatataki from '@/components/banner/banner_matataki.vue'
import swipe from '@/components/swipe/index.vue'
import popularArticles from '@/components/popularArticles/index.vue'
import tagsHot from '@/components/tags/tags_hot.vue'

export default {
  transition: 'page',
  components: {
    // bannerMatataki,
    swipe,
    popularArticles,
    tagsHot
  },
  data() {
    return {
      idx: 0,
      usersRecommendList: [{},{},{},{},{}],
      usersLoading: false,
      recommendList: [{},{},{},{},{}],
      popularlist: [],
      articleList: []
    }
  },
  async created() {
    if (process.browser) {
      this.recommendList = await this.recommendFn(1,11)
      // 列表第五条之后的文章放到侧边栏的不要错过中展示
      this.popularlist = this.recommendList.splice(5, 6)
      this.usersRecommend()
    }
  },
  mounted() {
  },
  methods: {
    async recommendFn(channel = 1, amount = 5) {
      try{
        const res = await this.$API.recommend({channel, amount})
        
        if (res.code === 0) {
          return res.data
        }
      }catch(e) {
        console.error(e)
      }
      return []
    },
    // 获取推荐作者
    usersRecommend: throttle(async function () {
      this.usersLoading = true
      const params = {
        amount: 3
      }
      await this.$API
        .usersRecommend(params)
        .then(res => {
          if (res.code === 0) {
            this.usersRecommendList = res.data
          } else {
            console.log(`获取推荐用户失败${res.code}, ${res.message}`)
          }
        })
        .catch(err => {
          console.log(`获取推荐用户失败${err}`)
        })
        .finally(() => {
          setTimeout(() => {
            this.usersLoading = false
          }, 300)
        })
    }, 800),
    setIdx(i) {
      this.idx = i
    }
  }
}
</script>
<style lang="less" scoped >
// 这里是index commodity的style
.home {
  min-height: 100%;
}

.now-title {
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  text-align: left;
  margin: 0 0 0 20px;
  &.nav-hide {
    padding-top: 50px;
  }
}

.recommend-top80 {
  margin-top: 80px;
}
</style>
<style lang="less" scoped >
// home页面内容区域 适用于home commodity tag 页面
.container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  margin: 10px auto 0;
  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }
  .col-6 {
    width: 66.666%;
    padding: 0 10px;
    float: left;
    box-sizing: border-box;
  }
  .col-3 {
    width: 33.333%;
    padding: 0 10px;
    float: left;
    box-sizing: border-box;
  }
  .spanStyle {
    font-size: 20px;
    color: rgba(0, 0, 0, 1);
    line-height: 1;
    cursor: pointer;
    transition: all 0.3s;
  }
  .main {
    display: flex;
    flex-direction: column;
    &.article {
      // max-width: 787px;
      // flex: 0 0 787px;
    }
    &.commodity {
      // max-width: 890px;
      // flex: 0 0 890px;
      // .commodity-card-content {
      //   display: flex;
      //   flex-wrap: wrap;
      // }
    }
  }
  .tags {
    &.article {
      // max-width: 374px;
      // flex: 0 0 374px;
    }
    &.commodity {
      // max-width: 270px;
      // flex: 0 0 270px;
    }
    &-container {
      margin-top: 20px;
      background: #fff;
      border-radius: @br10;
      padding: 10px;
    }
    span {
      .spanStyle();
      font-weight: bold;
    }
  }

  .main-nav {
    // margin: 0 0 20px;
    // span {
    //   .spanStyle();
    //   font-weight:400;
    //   margin-right: 30px;
    //   &.active {
    //   font-weight: bold;
    //   }
    //   em {
    //     font-size: 20px;
    //     font-style: normal;
    //     color: @purpleDark;
    //   }
    // }

    .filter {
      float: right;
      margin-right: 0px;

      &-button {
        padding: 0;
        color: #606266;
      }
      &-header {
        display: flex;
        align-items: center;
      }
      &-icon {
        width: 22px;
        height: 22px;
        margin-right: 4px;
      }
    }
  }

  .recommend-author {
    padding-bottom: 20px;
    .ra-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .change {
        width: 20px;
        height: 20px;
        //background: @purpleDark;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 6px;
        &-icon {
          width: 72%;
        }
      }
      .ra-head-title {
        .spanStyle();
        font-weight: bold;
      }
      .ra-head-random {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        color: @purpleDark;
        cursor: pointer;
      }
    }
    .ra-content {
      background: rgba(255, 255, 255, 1);
      border-radius: @br10;
      padding: 10px 20px;
      margin-top: 20px;
    }
  }
}

.load-more-button {
  display: flex;
  justify-content: center;
  min-height: 300px;
}

.fan-entrance {
  width: 60px;
  height: 71px;
}

.head {
  height: 24px;
  &-title {
    margin: 0;
    padding: 0;
  }
}
.ra-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .change {
    width: 20px;
    height: 20px;
    background: @purpleDark;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 6px;
    &-icon {
      width: 72%;
    }
  }
  .ra-head-random {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: @purpleDark;
    cursor: pointer;
  }
}
.tag {
  margin-top: 20px;
  a {
    font-size: 14px;
    font-weight: 500;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    &:hover {
      text-decoration: underline;
      .icon {
        transform: translateX(2px);
      }
    }
    .icon {
      line-height: 20px;
      font-size: 12px;
      margin-bottom: 1px;
      transition: transform 0.2s;
    }
  }
}
// 组件的
.tag-list {
  margin: 20px 0 0 0;
}
// 页面小于
@media screen and (max-width: 768px) {
  .container {
    // margin-top: 20px;
    .col-6 {
      width: 100%;
      // padding-left: 20px;
      // padding-right: 20px;
    }
    .col-3 {
      display: none;
    }
  }
}

</style>

<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rotate {
  animation: rotate 0.8s ease-in-out infinite;
}

.home-banner {
  margin-top: 10px;
}
</style>
