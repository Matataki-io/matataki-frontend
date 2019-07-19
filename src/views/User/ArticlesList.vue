<template>
  <div>
    <!-- tabs.less -->
    <div class="tabs">
      <div
        v-for="(item, index) in tabsData"
        :key="index"
        class="tabs-item"
        :class="activeIndex === index && 'active'"
        @click="toggleTabs(index)"
      >
        {{ item.label }}
      </div>
    </div>
    <BasePull
      v-for="(item, index) in tabsData"
      v-show="activeIndex === index"
      :key="index"
      :params="item.params"
      :api-url="item.apiUrl"
      :active-index="activeIndex"
      :now-index="index"
      :auto-request-time="item.autoRequestTime"
      :loading-text="item.loadingText"
      :is-obj="{ type: 'Object', key: 'data' }"
      :show-no-more-icon="listtype !== 'others'"
      @getListData="getListDataTab"
    >
      <ArticleCard
        v-for="(item, index) in item.articles"
        :key="index"
        :class="listtype !== 'others' && 'card-margin'"
        :article="item"
        :now-index="activeIndex"
        :is-other-user="isOtherUser"
      />
    </BasePull>
  </div>
</template>

<script>
import { ArticleCard } from '@/components/'

export default {
  name: 'ArticlesList',
  components: { ArticleCard },
  props: {
    listtype: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: ''
    },
    isOtherUser: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabsData: [],
      activeIndex: 0
    }
  },
  computed: {},
  created() {
    const { id, listtype } = this
    if (listtype === 'others') {
      this.tabsData = [
        {
          label: '原创',
          params: { author: id },
          apiUrl: 'homeTimeRanking',
          articles: [],
          loadingText: '暂无原创',
          autoRequestTime: 0
        },
        {
          label: '投资',
          params: { user: id },
          apiUrl: 'userArticlesSupportedList',
          articles: [],
          loadingText: '暂无投资',
          autoRequestTime: 0
        }
      ]
    } else if (listtype === 'original') {
      this.tabsData = [
        {
          label: '文章',
          params: { author: id, channel: 1 },
          apiUrl: 'homeTimeRanking',
          articles: [],
          loadingText: '暂无文章',
          autoRequestTime: 0
        },
        {
          label: '商品',
          params: { author: id, channel: 2 },
          apiUrl: 'homeTimeRanking',
          articles: [],
          loadingText: '暂无商品',
          autoRequestTime: 0
        }
      ]
    } else if (listtype === 'reward') {
      this.tabsData = [
        {
          label: '文章',
          params: { user: id, channel: 1 },
          apiUrl: 'userArticlesSupportedList',
          articles: [],
          loadingText: '暂无文章',
          autoRequestTime: 0
        },
        {
          label: '商品',
          params: { user: id, channel: 2 },
          apiUrl: 'userArticlesSupportedList',
          articles: [],
          loadingText: '暂无商品',
          autoRequestTime: 0
        }
      ]
    }
  },
  methods: {
    toggleTabs(i) {
      this.activeIndex = i

      // 判断是否自动刷新请求数据
      if (this.tabsData[i].autoRequestTime === 0 && this.tabsData[i].articles.length === 0)
        this.tabsData[i].autoRequestTime = Date.now()
    },
    getListDataTab({ index, list }) {
      this.tabsData[index].articles = list
    },
    async getUsername(id) {
      const {
        data: { data }
      } = await this.$backendAPI.getUser({ id })
      return data.username
    }
  }
}
</script>

<style lang="less" scoped>
.card-margin {
  margin: 0 0 10px 0;
}
</style>
