<template>
  <div class="commodity">
    <g-header />
    <!-- 首页内容 轮播和推荐 -->
    <div class="recommend mw">
      <el-row>
        <template v-for="(item, index) in recommendList">
          <el-col v-if="index === 0" :key="index" :span="16">
            <recommendSlide :card="item" />
          </el-col>
          <el-col v-else :key="index" :span="8">
            <articleCard :type-index="0" card-type="recommend-card" :card="item" />
          </el-col>
        </template>
      </el-row>
    </div>
    <banner />
    <el-row class="container mw">
      <el-col class="not-padding" :span="18">
        <div class="main commodity">
          <!-- 导航部分 -->
          <div class="main-nav padding-10">
            <span
              v-for="(itme, index) in articleCardData"
              :key="index"
              :class="nowMainIndex === index && 'active'"
              @click="nowMainIndex = index"
            >{{ itme.title }}</span>
          </div>
          <!-- 导航部分 end -->
          <!-- 空div控制内容 -->
          <no-content-prompt :list="articleCardData">
            <div v-for="(item, index) in articleCardData" v-show="nowMainIndex === index" :key="index">
              <div style="overflow: hidden;">
                <el-col
                  v-for="(itemChild, indexChild) in item.articles"
                  :key="indexChild"
                  :span="8"
                >
                  <articleCard
                    :card="itemChild"
                    card-type="commodity-card"
                    :type-index="1"
                  />
                </el-col>
              </div>
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
      <el-col :span="6">
        <div class="tags commodity position-sticky top80">
          <span>商品标签</span>
          <tags class="tags-container" :type-index="1" :tag-cards="tagCards" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import recommendSlide from '~/components/recommendSlide/index.vue'
import articleCard from '@/components/articleCard/index.vue'
import tags from '@/components/tags/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'

import { recommend, paginationData, getTags } from '@/api/async_data_api.js'
import banner from '@/components/banner/index.vue'

export default {
  transition: 'page',
  components: {
    recommendSlide,
    articleCard,
    tags,
    buttonLoadMore,
    banner
  },
  data() {
    return {
      nowMainIndex: 0,
      recommendList: [],
      initData: [],
      articleCardData: [
        {
          title: '最新商品',
          params: {
            channel: 2,
            extra: 'short_content'
          },
          apiUrl: 'homeTimeRanking',
          articles: [],
          isAtuoRequest: false
        },
        {
          title: '最热商品',
          params: {
            channel: 2,
            extra: 'short_content'
          },
          apiUrl: 'homeSupportsRanking',
          articles: [],
          isAtuoRequest: true
        }
      ],
      tagCards: []
    }
  },
  async asyncData({ $axios }) {
    const initData = Object.create(null)
    try {
      // 推荐
      const res = await recommend($axios, 2)
      if (res.code === 0) initData.recommend = res.data
      else initData.recommend = [{}, {}, {}, {}, {}]

      // 内容列表
      const params = {
        channel: 2,
        extra: 'short_content'
      }
      const resPagination = await paginationData($axios, 'homeTimeRanking', params)
      if (resPagination.code === 0) initData.paginationData = resPagination.data.list
      else initData.paginationData = []

      // tags
      const resTag = await getTags($axios, 'product')
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
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) this.articleCardData[res.index].articles = this.articleCardData[res.index].articles.concat(res.data.list)
    }
  }
}
</script>
<style lang="less" scoped src="../index.less"></style>
<style lang="less" scoped src="../home_container.less"></style>
