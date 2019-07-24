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
          <span class="active">最新发布</span>
          <span>最新投资</span>
        </div>
        <articleCard :type-index="0" :card-type="'article-card'" />
        <articleCard :type-index="0" :card-type="'article-card'" />
        <articleCard :type-index="0" :card-type="'article-card'" />
        <articleCard :type-index="0" :card-type="'article-card'" />
        <articleCard :type-index="0" :card-type="'article-card'" />
        <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
        <div class="load-more-button">
          <button class="load-more">
            查看更多
          </button>
        </div>
        <!-- end -->
      </div>
      <div class="tags article">
        <span>文章标签</span>
        <tags class="tags-container" :type-index="0" />
      </div>
    </div>
  </div>
</template>

<script>
import recommendSlide from '~/components/recommendSlide/index.vue'
import articleCard from '@/components/articleCard/index.vue'
import tags from '@/components/tags/index.vue'

import { test } from '@/api/async_api.js'

export default {
  components: {
    recommendSlide,
    articleCard,
    tags
  },
  data() {
    return {
      showSidebar: false,
      nowIndex: 0,
      recommendList: []
    }
  },
  async asyncData({ $axios }) {
    const res = await test($axios, 'https://apitest.smartsignature.io/posts/recommend?channel=1')
    console.log(111, res)
    return { recommendList: res.data }
  },
  created() {
    // this.postsRecommend(1)
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
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
