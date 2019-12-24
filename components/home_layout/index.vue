<template>
  <div class="home">
    <g-header />
    <swipe :card="swipeList" />
    <!-- 首页内容 轮播和推荐 -->
    <banner-matataki class="home-banner" />
    <el-row class="container mw">
      <el-col :span="16">
        <div class="main article">
          <!-- 导航部分 -->
          <div class="main-nav">
            <div class="nav-title">
              <a v-for="(item, index) in head" :href="item.href" :key="index" :class="item.url === $route.name && 'active'">
                {{ item.lab }}
              </a>
            </div>
            <slot name="sort" />
          </div>
          <slot />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="position-sticky top80">
          <div v-if="usersRecommendList.length !== 0" class="recommend-author">
            <div class="ra-head">
              <span class="ra-head-title">{{ $t('home.recommendAuthor') }}</span>
              <span @click="usersrecommend" class="ra-head-random">
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
              <r-a-list v-for="item in usersRecommendList" :key="item.id" :card="item" />
            </div>
          </div>
          <n-link :to="{name: 'token'}">
            <img class="fan-entrance" src="@/assets/img/fan_entrance.png">
          </n-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { recommend, paginationData, getTags } from '@/api/async_data_api.js'
import bannerMatataki from '@/components/banner/banner_matataki.vue'
import RAList from '@/components/recommend_author_list'
import swipe from '@/components/swipe/index.vue'

export default {
  transition: 'page',
  components: {
    bannerMatataki,
    RAList,
    swipe
  },
  props: {
    swipeList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      head: [
        {
          url: 'article',
          lab: '综合创作',
          href: '/article'
        },
        {
          url: 'article-token',
          lab: 'Fan票圈',
          href: '/article/token'
        },
        {
          url: 'article-follow',
          lab: '我的关注',
          href: '/article/follow'
        }
      ],
      usersRecommendList: [],
      usersLoading: false
    }
  },
  mounted() {
    this.usersrecommend()
  },
  methods: {
    // 获取推荐作者
    usersrecommend: throttle(async function () {
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
    }, 800)
  }
}
</script>
<style lang="less" scoped src="../../pages/_lang/index.less"></style>
<style lang="less" scoped src="../../pages/_lang/home_container.less"></style>

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

.main-nav {
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  a {
    font-size: 20px;
    color:rgba(0,0,0,1);
    line-height:1;
    cursor: pointer;
    transition: all .3s;
    font-weight:400;
    margin-right: 30px;
    text-decoration: none;
    &.active {
      font-weight: bold;
    }
    em {
      font-size: 20px;
      font-style: normal;
      color: @purpleDark;
    }
  }
}
</style>
