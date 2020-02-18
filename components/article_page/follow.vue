<template>
  <tab @setIdx="i => $emit('setIdx', i)" :idx="idx">
    <articleCardListNew
      v-for="item in articleCardData.articles"
      :key="item.id"
      :card="item"
    />
    <div class="load-more-button">
      <buttonLoadMore
        :type-index="0"
        :params="articleCardData.params"
        :api-url="articleCardData.apiUrl"
        :is-atuo-request="articleCardData.isAtuoRequest"
        @buttonLoadMore="buttonLoadMore"
      />
    </div>
  </tab>
</template>

<script>
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
// import articleCard from '@/components/articleCard/index.vue'
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'

import { recommend, paginationData, getTags } from '@/api/async_data_api.js'
import tab from './tab.vue'

export default {
  transition: 'page',
  components: {
    // articleCard,
    articleCardListNew,
    buttonLoadMore,
    tab
  },
  props: {
    idx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      articleCardData: {
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
    }
  },
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) {
        this.articleCardData.articles = this.articleCardData.articles.concat(res.data.list)
      }
    },
    handleCheckedFilterChanged(value) {
      this.onCheckedFilterChanged()
    },
    onCheckedFilterChanged: debounce(async function () {
      // This page drives me crazy!!!

      this.articleCardData.params.filter = this.filter

      try {
        const res = await this.$API.getBackendData(
          { url: this.articleCardData.apiUrl, params: this.articleCardData.params },
          false
        )
        if (res.code !== 0) console.error(res.message)
        else if (res.data && res.data.list && res.data.list.length !== 0) {
          this.articleCardData.articles = res.data.list
        }
      } catch (error) {
        console.error(error)
      }
    }, 500)
  }
}
</script>
