<template>
  <homeLayout :swipeList="recommendList">
    <no-content-prompt :list="articleCardData">
      <div
        v-for="(item, index) in articleCardData"
        v-show="nowMainIndex === index"
        :key="index"
      >
        <no-content-prompt :prompt="promptComputed(index)" :list="item.articles">
          <articleCardListNew
            v-for="itemChild in item.articles"
            :key="itemChild.id"
            :card="itemChild"
          />
        </no-content-prompt>
        <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
        <div class="load-more-button">
          <buttonLoadMore
            :type-index="index"
            :params="item.params"
            :api-url="item.apiUrl"
            :is-atuo-request="item.isAtuoRequest"
            @buttonLoadMore="buttonLoadMore"
          />
        </div>
        <!-- end -->
      </div>
    </no-content-prompt>
    <!-- 空div控制内容 end -->
  </homeLayout>
</template>

<script>
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
// import articleCard from '@/components/articleCard/index.vue'
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'

import { recommend, paginationData, getTags } from '@/api/async_data_api.js'
import homeLayout from '@/components/home_layout/index.vue'

export default {
  transition: 'page',
  components: {
    // articleCard,
    articleCardListNew,
    buttonLoadMore,
    homeLayout
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
  },
  methods: {
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
