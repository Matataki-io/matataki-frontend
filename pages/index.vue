<template>
  <div class="home">
    <!-- 首页内容 轮播和推荐 -->
    <div class="recommend mw">
      <template v-for="(item, index) in recommendList">
        <recommendSlide v-if="index === 0" :key="index" :card="item" /></recommendSlide>
        <articleCard v-else :key="index" :type-index="0" :card-type="'recommend-card'" :card="item" />
      </template>
    </div>

    <div class="container mw">
      <div class="main article">
        <div class="main-nav">
          <span class="active">{{ articleCardData.title }}</span>
          <span>最新投资</span>
        </div>
        <articleCard
          v-for="(item, index) in articleCardData.articles"
          :key="index"
          :card="item"
          :type-index="0"
          :card-type="'article-card'"
        />
        <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
        <div class="load-more-button">
          <buttonLoadMore :params="articleCardData.params" :api-url="articleCardData.apiUrl" @buttonLoadMore="buttonLoadMore" />
        </div>
        <!-- end -->
      </div>
      <div class="tags article">
        <span>文章标签</span>
        <tags class="tags-container" :type-index="0" :tag-cards="tagCards" />
      </div>
    </div>
  </div>
</template>

<script>
import recommendSlide from '~/components/recommendSlide/index.vue'
import articleCard from '@/components/articleCard/index.vue'
import tags from '@/components/tags/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'

import { test } from '@/api/async_api.js'

export default {
  components: {
    recommendSlide,
    articleCard,
    tags,
    buttonLoadMore
  },
  data() {
    return {
      recommendList: [],
      articleCardData: {
        title: '最新发布',
        params: {
          channel: 1,
          extra: 'short_content'
        },
        apiUrl: 'homeTimeRanking',
        articles: []
      },
      tagCards: []
    }
  },
  async asyncData({ $axios }) {
    const res = await test($axios, '/posts/recommend?channel=1')
    console.log(111, res)
    return { recommendList: res.data.data }
  },
  created() {
    // this.postsRecommend(1)
    this.getTags()
  },
  methods: {
    // 获取推荐文章或者商品
    async postsRecommend(channel) {
      await this.$backendAPI
        .postsRecommend(channel)
        .then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            this.recommendList = res.data.data
          } else {
            console.log('获取推荐失败')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取标签
    async getTags() {
      await this.$backendAPI
        .getTags('post')
        .then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            this.tagCards = res.data.data
            console.log(103, this.tagCards)
          } else console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 点击更多按钮返回的数据
    buttonLoadMore(data) {
      this.articleCardData.articles = this.articleCardData.articles.concat(data)
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
