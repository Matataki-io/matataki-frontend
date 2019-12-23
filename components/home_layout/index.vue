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
              <router-link v-for="(item, index) in head" :to="{name: item.url}" :key="index" :class="item.url === $route.name && 'active'">
                {{ item.lab }}
              </router-link>
            </div>
            <!-- <span
              v-for="(itme, index) in articleCardData"
              :key="index"
              :class="nowMainIndex === index && 'active'"
              @click="nowMainIndex = index"
            >{{ itme.title }}</span> -->
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
// import recommendSlide from '~/components/recommendSlide/index.vue'
// import articleCard from '@/components/articleCard/index.vue'
// import articleCardListNew from '@/components/article_card_list_new/index.vue'
// import tags from '@/components/tags/index.vue'
// import buttonLoadMore from '@/components/button_load_more/index.vue'

import { recommend, paginationData, getTags } from '@/api/async_data_api.js'
// import banner from '@/components/banner/index.vue'
import bannerMatataki from '@/components/banner/banner_matataki.vue'
import RAList from '@/components/recommend_author_list'
import swipe from '@/components/swipe/index.vue'

export default {
  transition: 'page',
  components: {
    // recommendSlide,
    // articleCard,
    // articleCardListNew,
    // tags,
    // buttonLoadMore,
    // banner,
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
      nowMainIndex: 0,
      recommendList: [],
      initData: [],
      head: [
        {
          url: 'article',
          lab: '综合创作'
        },
        {
          url: 'article-token',
          lab: 'Fan票圈'
        },
        {
          url: 'article-follow',
          lab: '我的关注'
        }
      ],
      articleCardData: [
        {
          title: this.$t('home.articleNavHotTitle'),
          params: {
            channel: 1,
            filter: null,
            extra: 'short_content'
          },
          apiUrl: 'homeScoreRanking',
          articles: [],
          isAtuoRequest: false
        },
        {
          title: this.$t('home.articleNavNowTitle'),
          params: {
            channel: 1,
            filter: null,
            extra: 'short_content'
          },
          apiUrl: 'homeTimeRanking',
          articles: [],
          isAtuoRequest: true
        },
        {
          title: this.$t('home.articleNavFollowTitle'),
          params: {
            channel: 1,
            filter: null,
            extra: 'short_content'
          },
          apiUrl: 'followedPosts',
          articles: [],
          isAtuoRequest: true
        }
      ],
      tagCards: [],
      usersRecommendList: [],
      usersLoading: false,
      checkedFilter: ['1', '2', '4']
    }
  },
  computed: {
    filter() {
      let result = 0
      for (const item of this.checkedFilter) {
        result |= parseInt(item)
      }
      return result
    }
  },
  watch: {
    nowMainIndex(value) {
      this.articleCardData[value].articles = []
      this.onCheckedFilterChanged()
    }
  },
  async asyncData({ $axios }) {
    const initData = Object.create(null)
    try {
      // 推荐
      const res = await recommend($axios, 1)
      if (res.code === 0) initData.recommend = res.data
      else {
        const obj = { src: '', title: '' }
        for (let i = 0; i < 5; i++) initData.recommend = [obj]
      }

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
      if (resPagination.code === 0) { initData.paginationData = resPagination.data.list } else initData.paginationData = []

      // tags
      const resTag = await getTags($axios, 'post')
      if (resTag.code === 0) initData.tags = resTag.data
      else initData.tags = []

      return { initData }
    } catch (error) {
      console.log(error)
      return { initData }
    }
  },
  created() {
    this.recommendList = this.initData.recommend
    this.articleCardData[0].articles = this.initData.paginationData
    this.tagCards = this.initData.tags
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
    }, 800),
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) {
        this.articleCardData[res.index].articles = this.articleCardData[
          res.index
        ].articles.concat(res.data.list)
      }
    },
    promptComputed(index) {
      return index === 2 ? this.$t('notFollowContent') : this.$t('notArticle')
    },
    handleCheckedFilterChanged(value) {
      this.onCheckedFilterChanged()
    },
    onCheckedFilterChanged: debounce(async function () {
      // This page drives me crazy!!!

      const currentTab = this.articleCardData[this.nowMainIndex]

      currentTab.params.filter = this.filter

      try {
        const res = await this.$API.getBackendData(
          { url: currentTab.apiUrl, params: currentTab.params },
          false
        )
        if (res.code !== 0) console.error(res.message)
        else if (res.data && res.data.list && res.data.list.length !== 0) {
          currentTab.articles = res.data.list
        }
      } catch (error) {
        console.error(error)
      }
    }, 500)
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
