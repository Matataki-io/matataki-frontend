<template>
  <tab @setIdx="i => $emit('setIdx', i)" :idx="idx">
    <!-- <el-popover slot="sort" class="filter" placement="bottom-end" trigger="click">
      <el-button slot="reference" class="filter-button" type="text">
        <div class="filter-header">
          <img class="filter-icon" src="@/assets/img/filter.svg">
          <span>过滤</span>
        </div>
      </el-button>
      <div style="font-size: 16px">
        <el-checkbox-group v-model="checkedFilter" :min="1" @change="handleCheckedFilterChanged">
          <div style="margin-bottom: 8px">
            <el-checkbox label="1">
              免费
            </el-checkbox>
          </div>
          <div style="margin-bottom: 8px">
            <el-checkbox label="2">
              持票可见
            </el-checkbox>
          </div>
          <div>
            <el-checkbox label="4">
              付费可见
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </el-popover> -->

    <div slot="sort" class="sort">
      <span @click="sortValue = options[0].value" :class="sortValue === options[0].value && 'active'">{{ options[0].label }}</span>
      &nbsp;/&nbsp;
      <span @click="sortValue = options[1].value" :class="sortValue === options[1].value && 'active'">{{ options[1].label }}</span>
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
        :autoRequestTime="articleCardData[sortValue].autoRequestTime"
        @buttonLoadMore="buttonLoadMore"
      />
    </div>
  </tab>
</template>

<script>
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
// import articleCard from '@/components/articleCard/index.vue'
import tab from './tab.vue'
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'

import { recommend, paginationData, getTags } from '@/api/async_data_api.js'

export default {
  transition: 'page',
  components: {
    // articleCard,
    articleCardListNew,
    buttonLoadMore,
    tab
  },
  props: {
    articleList: {
      type: Array,
      required: true
    },
    idx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // articleCardData: {
      //   title: this.$t('home.articleNavHotTitle'),
      //   params: {
      //     channel: 1,
      //     filter: null,
      //     extra: 'short_content'
      //   },
      //   apiUrl: 'homeScoreRanking',
      //   articles: [],
      //   isAtuoRequest: false
      // },
      articleCardData: [
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
        },
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
        }
      ],
      checkedFilter: ['1', '2', '4'],
      options: [{
        value: 0,
        label: this.$t('home.articleNavNowTitle')
      }, {
        value: 1,
        label: this.$t('home.articleNavHotTitle')
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
    this.articleCardData[0].articles = this.articleList
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
    handleCheckedFilterChanged(value) {
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
