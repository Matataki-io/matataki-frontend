<template>
  <homeLayout :swipeList="recommendList">
    <div>
      <div v-if="tokenCards" v-for="tokenCard in tokenCards.list" class="token-card">
        <div class="img-frame">
          <img :src="logo(tokenCard.logo)" :alt="tokenCard.symbol">
        </div>
        <div class="title">
          {{ tokenCard.symbol }}的Fan票圈
        </div>
      </div>
    </div>
    <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
    <div class="load-more-button">
      <buttonLoadMore
        :type-index="pull.index"
        :params="pull.params"
        :api-url="pull.apiUrl"
        :is-atuo-request="pull.isAtuoRequest"
        @buttonLoadMore="buttonLoadMore"
      />
    </div>
    <!-- 空div控制内容 end -->
  </homeLayout>
</template>

<script>
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
// import articleCard from '@/components/articleCard/index.vue'
// import articleCardListNew from '@/components/article_card_list_new/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'

import { recommend, paginationData, getTags, tokenTokenList } from '@/api/async_data_api.js'
import homeLayout from '@/components/home_layout/index.vue'
import { extractChar, regRemoveContent } from '@/utils/reg'

export default {
  transition: 'page',
  components: {
    // articleCard,
    // articleCardListNew,
    buttonLoadMore,
    homeLayout
  },
  data() {
    return {
      recommendList: [],
      initData: [],
      tokenCards: { list: [], count: 0 },
      pull: {
        params: {
          login: null
        },
        apiUrl: 'tokenTokenList',
        isAtuoRequest: false,
        index: 0
      }
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
  },
  async asyncData({ $axios, req }) {
    const initData = Object.create(null)
    // 推荐
    try {
      const res = await recommend($axios, 1)
      if (res.code === 0) initData.recommend = res.data
      else throw new Error(res.message)
    } catch (error) {
      console.log('error', error)
      initData.recommend = []
      for (let i = 0; i < 5; i++) initData.recommend.push({ cover: '', title: '', id: -1 })
    }

    try {
      // 获取cookie token
      let accessToekn = ''
      // 请检查您是否在服务器端
      if (process.server) {
        const cookie = req && req.headers.cookie ? req.headers.cookie : ''
        const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
        accessToekn = token ? token[0] : ''
      }
      const resTokenList = initData.tokenList = await tokenTokenList($axios, {
        login: null,
        channel: 1,
        extra: 'short_content'
      }, accessToekn)
      if (resTokenList.code === 0) initData.tokenList = resTokenList.data
      else throw new Error(resTokenList.message)
    } catch (error) {
      console.log('error', error)
      initData.tokenList = { list: [], count: 0 }
    }
    return { initData }
  },
  created() {
    console.log('请求结果：', this.initData)
    this.tokenCards = this.initData.tokenList
    this.recommendList = this.initData.recommend
  },
  mounted() {
  },
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      // if (res.data && res.data.list && res.data.list.length !== 0) {
      //   this.tokenCards.list = this.tokenCards.list.concat(res.data.list)
      // }
    },
    promptComputed(index) {
      return index === 2 ? this.$t('notFollowContent') : this.$t('notArticle')
    },
    logo(logo) {
      return logo ? this.$API.getImg(logo) : ''
    }
  }
}
</script>

<style lang="less" scoped>
  .token-card {
    width:177px;
    height:239px;
    border-radius: 10px;
    background:white;
    margin-right: 20px;
    margin-right: 18px;
    margin-bottom: 20px;
    float: left;
    .img-frame {
      width:177px;
      height:177px;
      img {
        width:177px;
        height:177px;
      }
    }
    .title {
      margin: auto;
    }
  }
</style>
