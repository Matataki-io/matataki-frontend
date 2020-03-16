<template>
  <tab
    :idx="idx"
    @setIdx="i => $emit('setIdx', i)"
  >
    <div class="token-tap">
      <div>
        <router-link :to="{name: 'token'}">
          <div class="add-card">
            <svg-icon icon-class="add1" />
            <span>{{ $t('home.buyFanTickets') }}</span>
          </div>
        </router-link>
        <fanCard
          v-for="(tokenCard, index) in tokenCards.list"
          :key="index"
          :card="tokenCard"
        />
      </div>
      <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
      <div class="load-more-button">
        <!-- v-if="tokenCards.count !== tokenCards.list.length" -->
        <buttonLoadMore
          :type-index="pull.index"
          :params="pull.params"
          :api-url="pull.apiUrl"
          @buttonLoadMore="buttonLoadMore"
        />
      </div>
    </div>
    <!-- 空div控制内容 end -->
  </tab>
</template>

<script>
import tab from './tab.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import fanCard from '@/components/fan_card/index.vue'

import { getCookie } from '@/utils/cookie'

export default {
  transition: 'page',
  components: {
    fanCard,
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
      initData: [],
      tokenCards: { list: [], count: 0 },
      pull: {
        params: {
          login: null
        },
        apiUrl: 'tokenTokenList',
        index: 0
      }
    }
  },
  watch: {
  },
  created() {
    // 登录了才能请求数据, login: null只是为了阻断请求
    if (getCookie('ACCESS_TOKEN')) this.pull.params = { pagesize: 20 }
  },
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) {
        this.tokenCards.list = this.tokenCards.list.concat(res.data.list)
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .token-tap {
      min-height: 600px;
      margin-bottom: 60px;
    }
    .add-card {
      background: white;
      margin-right: 18px;
      margin-bottom: 20px;
      float: left;
      transition: all 0.3s;
      border: 1px dashed #dbdbdb;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 40px;
      color: #dbdbdb;
      overflow: hidden;
      text-decoration: none;
      width: 175px;
      height: 237px;
      span {
        font-size: 12px;
        margin: 4px 0 0;
        padding: 0;
        color: #dbdbdb;
      }
      &:hover {
        transform: translate(0, -4px);
        box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
      }
    }
</style>
