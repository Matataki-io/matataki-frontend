<template>
  <div class="home">
    <g-header />
    <swipe :card="recommendList" />
    <!-- 首页内容 轮播和推荐 -->
    <banner-matataki class="home-banner" />
    <el-row class="container mw">
      <el-col :span="16">
        <div class="main article">
          <articleTab
            v-if="idx === 0"
            :article-list="articleList"
            :idx="idx"
            @setIdx="setIdx"
          />
          <tokenTab
            v-if="idx === 1"
            :idx="idx"
            @setIdx="setIdx"
          />
          <followTab
            v-if="idx === 2"
            :idx="idx"
            @setIdx="setIdx"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="position-sticky top80">
          <div
            v-if="usersRecommendList.length !== 0"
            class="recommend-author"
          >
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import tokenTab from '@/components/article_page/token.vue'
import followTab from '@/components/article_page/follow.vue'
import articleTab from '@/components/article_page/article.vue'
import { recommend, paginationData } from '@/api/async_data_api.js'
import bannerMatataki from '@/components/banner/banner_matataki.vue'
import RAList from '@/components/recommend_author_list'
import swipe from '@/components/swipe/index.vue'

export default {
  transition: 'page',
  components: {
    bannerMatataki,
    RAList,
    swipe,
    articleTab,
    tokenTab,
    followTab
  },
  data() {
    return {
      idx: 0,
      usersRecommendList: [],
      usersLoading: false,
    }
  },
  async asyncData({ $axios }) {
    let recommendList = []
    let articleList = []
    // 推荐
    try {
      const res = await recommend($axios, 1)
      if (res.code === 0) recommendList = res.data
      else throw new Error(res.message)
    } catch (error) {
      console.log('error', error)
      for (let i = 0; i < 5; i++) recommendList.push({ cover: '', title: '', id: -1 })
    }

    try {
      // 内容列表
      const params = {
        channel: 1,
        extra: 'short_content'
      }
      const resPagination = await paginationData(
        $axios,
        'homeScoreRanking',
        params
      )
      if (resPagination.code === 0) articleList = resPagination.data.list
      else throw new Error(resPagination.message)
    } catch (error) {
      console.log('error', error)
    }

    return { recommendList, articleList }
  },
  created() {
  },
  mounted() {
    if (process.browser) {
      this.usersRecommend()
    }
  },
  methods: {
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
<style lang="less" scoped src="../index.less"></style>
<style lang="less" scoped src="../home_container.less"></style>

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
