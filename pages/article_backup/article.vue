<template>
  <div class="home">
    <g-header />
    <banner-matataki />

    <!-- 首页内容 轮播和推荐 -->
    <el-row class="recommend mw">
      <template v-for="(item, index) in recommendList">
        <el-col v-if="index === 0" :key="index" :span="16">
          <recommendSlide :card="item" />
        </el-col>
        <el-col v-else :key="index" :span="8">
          <articleCard :type-index="0" :card="item" card-type="recommend-card" />
        </el-col>
      </template>
    </el-row>

    <!-- <banner /> -->

    <el-row class="container mw">
      <el-col :span="16">
        <div class="main article">
          <!-- 导航部分 -->
          <div class="main-nav">
            <span
              v-for="(itme, index) in articleCardData"
              :key="index"
              :class="nowMainIndex === index && 'active'"
              @click="nowMainIndex = index"
            >{{ itme.title }}</span>

            <el-popover class="filter" placement="bottom-end" trigger="click">
              <el-button slot="reference" class="filter-button" type="text">
                <div class="filter-header">
                  <img class="filter-icon" src="@/assets/img/filter.svg">{{ $t('filter') }}
                </div>
              </el-button>
              <div style="font-size: 16px">
                <el-checkbox-group v-model="checkedFilter" :min="1" @change="handleCheckedFilterChanged">
                  <div style="margin-bottom: 8px">
                    <el-checkbox label="1">
                      免费
                    </el-checkbox>
                  </div>
                  <div style="margin-bottom: 8px">
                    <el-checkbox label="2">
                      持票可见
                    </el-checkbox>
                  </div>
                  <div>
                    <el-checkbox label="4">
                      付费可见
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </el-popover>
          </div>
          <!-- 导航部分 end -->
          <!-- 空div控制内容 -->
          <no-content-prompt :list="articleCardData">
            <div v-for="(item, index) in articleCardData" v-show="nowMainIndex === index" :key="index">
              <no-content-prompt :prompt="promptComputed(index)" :list="item.articles">
                <articleCardList
                  v-for="itemChild in item.articles"
                  :key="itemChild.id"
                  :card="itemChild"
                />
              </no-content-prompt>
              <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
              <div class="load-more-button">
                <buttonLoadMore :type-index="index" :params="item.params" :api-url="item.apiUrl" :is-atuo-request="item.isAtuoRequest" @buttonLoadMore="buttonLoadMore" />
              </div>
            <!-- end -->
            </div>
          </no-content-prompt>

        <!-- 空div控制内容 end -->
        </div>
      </el-col>
      <el-col :span="8">
        <div class="position-sticky top80">
          <div class="tags article">
            <span>{{ $t('home.articleTagTitle') }}</span>
            <tags :type-index="0" :tag-cards="tagCards" class="tags-container" />
          </div>

          <div v-if="usersRecommendList.length !== 0" class="recommend-author">
            <div class="ra-head">
              <span class="ra-head-title">{{ $t('home.recommendAuthor') }}</span>
              <span @click="usersrecommend" class="ra-head-random">
                <div class="change">
                  <svg-icon :class="usersLoading && 'rotate'" class="change-icon" icon-class="change" />
                </div>
                <span>{{ $t('home.random') }}</span>
              </span>
            </div>
            <div class="ra-content">
              <r-a-list v-for="item in usersRecommendList" :key="item.id" :card="item" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import articleCard from '@/components/articleCard/index.vue'
import articleCardList from '@/components/article_card_list/index.vue'
import tags from '@/components/tags/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'

import { recommend, paginationData, getTags } from '@/api/async_data_api.js'
// import banner from '@/components/banner/index.vue'
import bannerMatataki from '@/components/banner/banner_matataki.vue'
import RAList from '@/components/recommend_author_list'
import recommendSlide from '~/components/recommendSlide/index.vue'

export default {
  transition: 'page',
  components: {
    recommendSlide,
    articleCard,
    articleCardList,
    tags,
    buttonLoadMore,
    // banner,
    bannerMatataki,
    RAList

  },
  data() {
    return {
      nowMainIndex: 0,
      recommendList: [],
      initData: [],
      articleCardData: [
        {
          title: this.$t('home.articleNavHotTitle'),
          params: {
            channel: 1,
            filter: null
          },
          apiUrl: 'homeScoreRanking',
          articles: [],
          isAtuoRequest: false
        },
        {
          title: this.$t('home.articleNavNowTitle'),
          params: {
            channel: 1,
            filter: null
          },
          apiUrl: 'homeTimeRanking',
          articles: [],
          isAtuoRequest: true
        },
        {
          title: this.$t('home.articleNavFollowTitle'),
          params: {
            channel: 1,
            filter: null
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
      else initData.recommend = [{}, {}, {}, {}, {}]

      // 内容列表
      const params = {
        channel: 1
        // extra: 'short_content'
      }
      const resPagination = await paginationData($axios, 'homeScoreRanking', params)
      if (resPagination.code === 0) initData.paginationData = resPagination.data.list
      else initData.paginationData = []

      // tags
      const resTag = await getTags($axios, 'post')
      if (resTag.code === 0) initData.tags = resTag.data
      else initData.tags = []

      return { initData }
    } catch (error) {
      console.log(error)
      return { initData }
    };
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
      await this.$API.usersRecommend(params)
        .then(res => {
          if (res.code === 0) {
            this.usersRecommendList = res.data
          } else {
            console.log(`获取推荐用户失败${res.code}, ${res.message}`)
          }
        }).catch(err => {
          console.log(`获取推荐用户失败${err}`)
        }).finally(() => {
          setTimeout(() => {
            this.usersLoading = false
          }, 300)
        })
    }, 800),
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) this.articleCardData[res.index].articles = this.articleCardData[res.index].articles.concat(res.data.list)
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
        const res = await this.$API.getBackendData({ url: currentTab.apiUrl, params: currentTab.params }, false)
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
<style lang="less" scoped src="./index.less"></style>
<style lang="less" scoped src="./home_container.less"></style>

<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}

.rotate {
  animation: rotate 0.8s ease-in-out infinite;
}
</style>
