<template>
  <ringLayout>
    <el-popover
      slot="sort"
      placement="bottom"
      width="100"
      popper-class="ring-head-popper"
      trigger="click"
    >
      <div>
        <el-checkbox-group
          v-model="sortCheckList"
          @change="sortChange"
        >
          <el-checkbox
            v-for="(item, idx) in sortList"
            :key="idx"
            :disabled="sortCheckList.length <= 1 && sortCheckList[0] === item.label"
            :label="item.label"
            class="head-sort-check"
          >
            {{ item.value }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span
        slot="reference"
        class="head-sort"
      >
        <i class="el-icon-s-operation" />筛选
      </span>
    </el-popover>

    <div class="list">
      <no-content-prompt
        :prompt="this.$t('not') "
        :list="pull.list"
      >
        <articleCardListNew
          v-for="item in pull.list"
          :key="item.id"
          :card="item"
        />
      </no-content-prompt>
      <div class="load-more">
        <buttonLoadMore
          :type-index="0"
          :url-replace="$route.params.id + ''"
          :params="pull.params"
          :api-url="pull.apiUrl"
          :auto-request-time="pull.autoRequestTime"
          @buttonLoadMore="buttonLoadMore"
        />
      </div>
    </div>
  </ringLayout>
</template>

<script>
import debounce from 'lodash/debounce'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import ringLayout from '@/components/ring_layout/index.vue'

export default {
  components: {
    buttonLoadMore,
    articleCardListNew,
    ringLayout
  },
  props: {
    onlyCreator: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      sortList: [
        // 3
        {
          label: 'hold',
          value: '持票可见' // 1
        },
        {
          label: 'pay',
          value: '付费可见' // 2
        }
      ],
      sortCheckList: ['hold', 'pay'],
      pull: {
        params: {
          pagesize: 10,
          filter: 3,
          sort: 'time-desc'
          // extra: 'short_content' // 好像接口没有提供这个功能
        },
        autoRequestTime: 0,
        apiUrl: 'minetokenRelated',
        list: []
      }
    }
  },
  watch: {
    onlyCreator(value) {
      this.pull.params.onlyCreator = value
    }
  },
  created() {
    this.pull.params.onlyCreator = this.onlyCreator
    console.log('结果：', this.pull, this.onlyCreator)
  },
  methods: {
    sortChange: debounce(function (val) {
      if (val.length >= 2) {
        this.pull.params.filter = 3
      } else if (val[0] === 'hold') this.pull.params.filter = 1
      else if (val[0] === 'pay') this.pull.params.filter = 2
      else this.pull.params.filter = 1
      this.pull.autoRequestTime = Date.now()
      this.pull.list.length = 0
    }, 500),
    buttonLoadMore(res) {
      if (res.data && res.data.list && res.data.list.length !== 0) {
        this.pull.list.push(...res.data.list)
      }
    }
  }
}
</script>

<style lang="less">
.ring-head-popper {
  z-index: 99 !important;
}
</style>

<style lang="less" scoped>
.head-sort {
  font-size: 16px;
  cursor: pointer;
}
.head-sort-check:nth-child(n + 2) {
  margin-top: 10px;
}
.list {
  max-width: 800px;
  padding: 0 20px;
  margin: 0 auto;
  .list-card {
    margin: 20px 0 0;
  }
}
.load-more{
  height: 168px;
}
</style>
