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
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
          <articleCard :key="index" :type-index="1" :card-type="'commodity-card'" />
        </div>
      </div>
      <div class="tags commodity">
        <span>商品标签</span>
        <tags class="tags-container" :type-index="1" />
      </div>
    </div>

    <button class="load-more">
      查看更多
    </button>
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
  }
}
</script>

<style lang="less" scoped>
.home {
  min-height: 100%;
}

.now-title {
  font-size:20px;
  font-weight:bold;
  color:rgba(0,0,0,1);
  text-align: left;
  margin: 0 0 0 20px;
  &.nav-hide {
    padding-top: 50px;
  }
}

.home-content {
  padding: 60px 0 0 0;
}

// recommend
.recommend {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 60px;
}

.container {
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
  .spanStyle{
    font-size:24px;
    color:rgba(0,0,0,1);
    line-height:33px;
    cursor: pointer;
    transition: all .3s;
  }
  .main {
    display: flex;
    flex-direction: column;
    &.article{
      max-width: 787px;
      flex: 0 0 787px;
    }
    &.commodity{
      max-width: 890px;
      flex: 0 0 890px;
      .commodity-card-content {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
  .tags {
    &.article{
      max-width: 374px;
      flex: 0 0 374px;
    }
    &.commodity{
      max-width: 270px;
      flex: 0 0 270px;
    }
    &-container {
      margin-top: 40px;
      background: #fff;
      border-radius: 10px;
      padding: 10px 20px;
    }
    span {
      .spanStyle();
      font-weight:600;
    }
  }

  .main-nav {
    span {
      .spanStyle();
      font-weight:400;
      &:nth-of-type(1){
        margin-right: 48px;
      }
      &.active {
      font-weight:600;
      }
    }
  }
}

.load-more {
  width: 300px;
  height: 60px;
  background: #000000;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin: 120px auto;
  display: block;
  cursor: pointer;
}
</style>
