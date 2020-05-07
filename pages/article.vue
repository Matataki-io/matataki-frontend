<template>
  <div class="home">
    <g-header />
    <swipe :card="recommendList" />
    <!-- 首页内容 轮播和推荐 -->
    <!-- <banner-matataki class="home-banner" /> -->
    <div class="container">
      <div class="col-6">
        <router-view />
      </div>
      <div class="col-3">
        <div class="position-sticky top80">
          <div class="recommend-author">
            <div class="ra-head">
              <span class="ra-head-title">{{ $t('home.recommendAuthor') }}</span>
              <span
                class="ra-head-random"
                @click="usersRecommend"
              >
                <div class="change">
                  <svg-icon
                    :class="usersLoading && 'rotate'"
                    class="change-icon"
                    icon-class="change"
                  />
                </div>
                <span>{{ $t('home.random') }}</span>
              </span>
            </div>
            <div class="ra-content">
              <r-a-list
                v-for="item in usersRecommendList"
                :key="item.id"
                :card="item"
              />
            </div>
          </div>
          <router-link :to="{name: 'token'}">
            <img
              class="fan-entrance"
              src="@/assets/img/fan_entrance.png"
            >
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
// import bannerMatataki from '@/components/banner/banner_matataki.vue'
import RAList from '@/components/recommend_author_list'
import swipe from '@/components/swipe/index.vue'

export default {
  transition: 'page',
  components: {
    // bannerMatataki,
    RAList,
    swipe,
  },
  data() {
    return {
      idx: 0,
      usersRecommendList: [{},{},{},{},{}],
      usersLoading: false,
      recommendList: [], 
      articleList: []
    }
  },
  created() {
    if (process.browser) {
      this.recommendFn()
      this.usersRecommend()
    }
  },
  mounted() {
  },
  methods: {
    async recommendFn() {
      await this.$API.recommend({
        channel: 1
      }).then(res => {
        if (res.code === 0) {
          this.recommendList = res.data
        }
      }).catch(e => {
        console.log(e)
      })
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
  margin-top: 60px;
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

.home-content {
  .minHeight();
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
  margin: 60px auto 0;
  &::after {
    content: '';
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

// 页面小于
@media screen and (max-width: 768px) {
  .container {
    .col-6 {
      width: 100%;
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
