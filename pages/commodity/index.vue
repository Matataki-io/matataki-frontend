<template>
  <div class="commodity">
    <!-- 首页内容 轮播和推荐 -->
    <div class="recommend mw">
      <template v-for="(item, index) in [1,2,3,4,5]">
        <template v-if="index === 0">
          <recommendSlide :key="index" />
        </template>
        <template v-else>
          <articleCard :key="index" :type-index="1" :card-type="'recommend-card'" />
        </template>
      </template>
    </div>

    <div class="container mw">
      <div class="main commodity">
        <div class="main-nav">
          <span class="active">最新商品</span>
          <span>最热商品</span>
        </div>
        <div class="commodity-card-content">
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
          <articleCard :type-index="1" :card-type="'commodity-card'" />
        </div>
        <div class="load-more-button">
          <button class="load-more">
            查看更多
          </button>
        </div>
      </div>
      <div class="tags commodity">
        <span>商品标签</span>
        <tags class="tags-container" :type-index="1" />
      </div>
    </div>
  </div>
</template>

<script>
import recommendSlide from '@/components/recommendSlide/index.vue'
import articleCard from '@/components/articleCard/index.vue'
import tags from '@/components/tags/index.vue'

export default {
  components: {
    recommendSlide,
    articleCard,
    tags
  },
  data() {
    return {
      showSidebar: false,
      nowIndex: 0
    }
  },
  created() {
  }
}
</script>

<style lang="less" scoped src="../index.less"></style>
