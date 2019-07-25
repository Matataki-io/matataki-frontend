<template>
  <div class="commodity">
    <!-- 首页内容 轮播和推荐 -->
    <div class="recommend mw">
      <template v-for="(item, index) in recommendList">
        <recommendSlide v-if="index === 0" :key="index" :card="item" /></recommendSlide>
        <articleCard v-else :key="index" :type-index="1" :card-type="'recommend-card'" :card="item" />
      </template>
    </div>

    <div class="container mw">
      <div class="main commodity">
        <div class="main-nav">
          <span class="active">{{ articleCardData.title }}</span>
          <span>最热商品</span>
        </div>
        <div class="commodity-card-content">
          <articleCard
            v-for="(item, index) in articleCardData.articles"
            :key="index"
            :card="item"
            :type-index="1"
            :card-type="'commodity-card'"
          />
        </div>
        <div class="load-more-button">
          <buttonLoadMore :params="articleCardData.params" :api-url="articleCardData.apiUrl" @buttonLoadMore="buttonLoadMore" />
        </div>
      </div>
      <div class="tags commodity">
        <span>商品标签</span>
        <tags class="tags-container" :type-index="1" :tag-cards="tagCards" />
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
        title: '最新商品',
        params: {
          channel: 2,
          extra: 'short_content'
        },
        apiUrl: 'homeTimeRanking',
        articles: []
      },
      tagCards: []
    }
  },
  async asyncData({ $axios }) {
    const res = await test($axios, '/posts/recommend?channel=2')
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
        .getTags('product')
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
<style lang="less" scoped src="../index.less"></style>
