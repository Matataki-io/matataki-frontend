<template>
  <div class="article-container">
    <div class="article-head">
      <tab :idx="0" />
      <!-- <div
        class="sort"
      >
        <span
          :class="sortValue === options[0].value && 'active'"
          @click="sortValue = options[0].value"
        >{{ options[0].label }}</span>
        &nbsp;/&nbsp;
        <span
          :class="sortValue === options[1].value && 'active'"
          @click="sortValue = options[1].value"
        >{{ options[1].label }}</span>
      </div> -->
    </div>
    <articleCardListNew
      v-for="item in articleCardData[sortValue].articles"
      :key="item.id"
      :card="item"
    />
    <div class="load-more-button">
      <buttonLoadMore
        :type-index="0"
        :params="articleCardData[sortValue].params"
        :api-url="articleCardData[sortValue].apiUrl"
        :is-atuo-request="articleCardData[sortValue].isAtuoRequest"
        :auto-request-time="articleCardData[sortValue].autoRequestTime"
        @buttonLoadMore="buttonLoadMore"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
// import articleCard from '@/components/articleCard/index.vue'
import tab from '@/components/article_page/tab'
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import { paginationUrl } from '@/api/pagination_url'
import { extractChar } from '@/utils/reg'
import { getCookie } from '@/utils/cookie'

export default {
  components: {
    // articleCard,
    articleCardListNew,
    buttonLoadMore,
    tab
  },
  transition: 'page',
  props: {
    idx: {
      type: Number,
      default: 0
    }
  },
  async asyncData({ $axios, req }) {
    let articleList = []
    // 获取cookie token
    let accessToekn = ''
    // 请检查您是否在服务器端
    if (process.server) {
      const cookie = req && req.headers.cookie ? req.headers.cookie : ''
      const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
      accessToekn = token ? token[0] : ''
    }
    if (process.browser) {
      accessToekn = getCookie('ACCESS_TOKEN')
    }

    try {
      // 内容列表
      const params = {
        channel: 1,
        extra: 'short_content'
      }

      const resPagination = await $axios({
        url: paginationUrl['homeScoreRanking'],
        methods: 'get',
        params,
        headers: { 'x-access-token': accessToekn }
      })
      if (resPagination.code === 0) articleList = resPagination.data.list
      else throw new Error(resPagination.message)
    } catch (error) {
      console.log('error', error)
    }

    return { articleList }
  },
  data() {
    return {
      articleCardData: [
        {
          params: {
            channel: 1,
            filter: null,
            extra: 'short_content'
          },
          apiUrl: 'homeScoreRanking',
          articles: [],
          autoRequestTime: 0,
          isAtuoRequest: false
        },
        {
          params: {
            channel: 1,
            filter: null,
            extra: 'short_content'
          },
          apiUrl: 'homeTimeRanking',
          articles: [],
          autoRequestTime: 0,
          isAtuoRequest: false
        }
      ],
      checkedFilter: ['1', '2', '4'],
      options: [{
        value: 0,
        label: this.$t('home.articleNavHotTitle')
      }, {
        value: 1,
        label: this.$t('home.articleNavNowTitle')
      }],
      sortValue: 0
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
    sortValue(value) {
      this.articleCardData[value].articles = []
      this.articleCardData[value].autoRequestTime = Date.now()
    }
  },
  created() {
    if (this.articleList && this.articleList.length !== 0) {
      this.articleCardData[0].articles = this.articleList
    }
  },
  mounted() {
  },
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      if (res.data && res.data.list && res.data.list.length !== 0) {
        this.articleCardData[this.sortValue].articles = this.articleCardData[this.sortValue].articles.concat(res.data.list)
      }
    },
    handleCheckedFilterChanged() {
      this.onCheckedFilterChanged()
    },
    onCheckedFilterChanged: debounce(async function () {
      // This page drives me crazy!!!

      this.articleCardData[this.sortValue].params.filter = this.filter

      try {
        const res = await this.$API.getBackendData(
          { url: this.articleCardData[this.sortValue].apiUrl, params: this.articleCardData[this.sortValue].params },
          false
        )
        if (res.code !== 0) console.error(res.message)
        else if (res.data && res.data.list && res.data.list.length !== 0) {
          this.articleCardData[this.sortValue].articles = res.data.list
        }
      } catch (error) {
        console.error(error)
      }
    }, 500)
  }
}
</script>

<style lang="less" scoped>
.filter {
  margin-right: 0px;
  &-header {
    display: flex;
    align-items: center;
  }
  &-icon {
    font: 22px;
    color: #000;
    margin-right: 6px;
  }
  .filter-icon {
    width: 22px;
  }
  span {
    font: 14px;
    color: #000;
  }
}
.article-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
}

.sort-articles {
  width: 100px;
}

.sort {
  display: flex;
  align-items: center;
  span {
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    &.active {
      font-weight: bold;
      color: @purpleDark;
    }
  }
}
</style>
