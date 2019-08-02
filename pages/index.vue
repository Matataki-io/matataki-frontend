<template>
  <div class="home">
    <g-header />
    <!-- 首页内容 轮播和推荐 -->
    <div class="recommend mw">
      <template v-for="(item, index) in recommendList">
        <recommendSlide v-if="index === 0" :key="index" :card="item" /></recommendSlide>
        <articleCard v-else :key="index" :type-index="0" :card-type="'recommend-card'" :card="item" />
      </template>
    </div>

    <div class="container mw">
      <div class="main article">
        <!-- 导航部分 -->
        <div class="main-nav">
          <span
            v-for="(itme, index) in articleCardData"
            :key="index"
            :class="nowMainIndex === index && 'active'"
            @click="nowMainIndex = index"
          >{{ itme.title }}</span>
        </div>
        <!-- 导航部分 end -->
        <!-- 空div控制内容 -->
        <div v-for="(item, index) in articleCardData" v-show="nowMainIndex === index" :key="index">
          <articleCardList
            v-for="(itemChild, indexChild) in item.articles"
            :key="indexChild"
            :card="itemChild"
          />
          <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
          <div class="load-more-button">
            <buttonLoadMore :type-index="index" :params="item.params" :api-url="item.apiUrl" @buttonLoadMore="buttonLoadMore" />
          </div>
        <!-- end -->
        </div>
        <!-- 空div控制内容 end -->
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
import articleCardList from '@/components/article_card_list/index.vue'
import tags from '@/components/tags/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'

import { recommend } from '@/api/async_data_api.js'

export default {
  components: {
    recommendSlide,
    articleCard,
    articleCardList,
    tags,
    buttonLoadMore
  },
  data() {
    return {
      nowMainIndex: 0,
      recommendList: [],
      articleCardData: [
        {
          title: '最新发布',
          params: {
            channel: 1,
            extra: 'short_content'
          },
          apiUrl: 'homeTimeRanking',
          articles: []
        },
        {
          title: '最多投资',
          params: {
            channel: 1,
            extra: 'short_content'
          },
          apiUrl: 'homeSupportsRanking',
          articles: []
        }
      ],
      tagCards: []
    }
  },
  async asyncData({ $axios }) {
    try {
      const res = await recommend($axios, 1)
      // console.log(111, res)
      return { recommendList: res.data }
    } catch (error) {
      console.log(error)
      return { recommendList: [{}, {}, {}, {}, {}] }
    }
  },
  created() {
    this.getTags()
  },
  methods: {
    // 获取标签
    async getTags() {
      await this.$backendAPI
        .getTags('post')
        .then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            this.tagCards = res.data.data
            // console.log(103, this.tagCards)
          } else console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      this.articleCardData[res.index].articles = this.articleCardData[res.index].articles.concat(res.data.list)
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
<style lang="less" scoped src="./home_container.less"></style>
