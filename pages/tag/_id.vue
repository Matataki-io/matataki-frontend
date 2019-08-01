<template>
  <div class="tag-page">
    <g-header customize-header-logo="white" :customize-header-bc="customizeHeaderBc" customize-header-text-color="#fff" customize-header-icon-color="#fff" />
    <div class="head" :style="tagStyleObject">
      <tag-icon :id="Number($route.params.id)" />
      <p class="head-title">
        {{ articleCardData[0].title }}
      </p>
    </div>

    <div class="container mw">
      <div class="main article">
        <!-- 导航部分 -->
        <div class="main-nav">
          <span class="active">{{ mainNavTitle }}</span>
        </div>
        <!-- 导航部分 end -->
        <!-- 空div控制内容 -->
        <div v-for="(item, index) in articleCardData" v-show="nowMainIndex === index" :key="index">
          <template v-if="mainNavTypeIndex">
            <div class="commodity-card-content">
              <articleCard
                v-for="(itemChild, indexChild) in item.articles"
                :key="indexChild"
                :card="itemChild"
                :type-index="1"
                :card-type="'commodity-card tag'"
              />
            </div>
          </template>
          <template v-else>
            <articleCard
              v-for="(itemChild, indexChild) in item.articles"
              :key="indexChild"
              :card="itemChild"
              :type-index="mainNavTypeIndex"
              :card-type="mainNavTypeCard"
            />
          </template>

          <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
          <div class="load-more-button">
            <buttonLoadMore :type-index="index" :params="item.params" :api-url="item.apiUrl" @buttonLoadMore="buttonLoadMore" />
          </div>
        <!-- end -->
        </div>
        <!-- 空div控制内容 end -->
      </div>
      <div class="tags article">
        <span>更多标签</span>
        <tags class="tags-container" :type-index="0" :tag-cards="tagCards" :is-more-type="true" />
      </div>
    </div>
  </div>
</template>

<script>
import buttonLoadMore from '@/components/button_load_more/index.vue'
import tags from '@/components/tags/index.vue'
import articleCard from '@/components/articleCard/index.vue'
import tagIcon from '@/components/tags/tagIcon.vue'
import { tagColor } from '@/utils/tag'

export default {
  name: 'Tag',
  components: {
    articleCard,
    tags,
    buttonLoadMore,
    tagIcon
  },
  data() {
    return {
      nowMainIndex: 0,
      articleCardData: [
        {
          title: this.$route.query.name,
          params: {
            tagid: this.$route.params.id,
            extra: 'short_content'
          },
          apiUrl: 'getPostByTagById',
          articles: []
        }
      ],
      tagCards: [],
      tagStyleObject: {},
      tagType: this.$route.query.type || 'post' // 文章 post 商品 product

    }
  },
  computed: {
    customizeHeaderBc() {
      return tagColor()[this.$route.params.id]
    },
    mainNavTitle() {
      return this.tagType === 'post' ? '最新发布' : this.tagType === 'product' ? '最新商品' : '最新发布'
    },
    mainNavTypeIndex() {
      return this.tagType === 'post' ? 0 : this.tagType === 'product' ? 1 : 0
    },
    mainNavTypeCard() {
      return this.tagType === 'post' ? 'article-card' : this.tagType === 'product' ? 'commodity-card' : 'article-card'
    }
  },
  created() {
    this.getTags()
    console.log(this.$route)
    this.tagStyleObject = {
      backgroundColor: tagColor()[this.$route.params.id]
    }
  },
  methods: {
    // 获取标签
    async getTags() {
      await this.$backendAPI
        .getTags()
        .then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            // console.log(res.data.data)
            const tagArr = res.data.data
            const tagArrPost = []
            const tagArrProduct = []

            tagArr.map((i) => {
              if (i.type === 'post') tagArrPost.push(i)
              else if (i.type === 'product') tagArrProduct.push(i)
            })

            console.log(tagArrPost, tagArrProduct)

            if (this.tagType === 'post') {
              this.tagCards.push(tagArrPost)
              this.tagCards.push(tagArrProduct)
            } else if (this.tagType === 'product') {
              this.tagCards.push(tagArrProduct)
              this.tagCards.push(tagArrPost)
            }
            // console.log(103, this.tagCards)
          } else console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      console.log(res)
      this.articleCardData[res.index].articles = this.articleCardData[res.index].articles.concat(res.data.list)
    }
  }
}
</script>

<style lang="less" scoped>
.tag-page{
  .minHeight();
}
.head {
  width: 100%;
  height: 240px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 120px;
    display: block;
    padding: 0;
    margin: 0 auto;
    text-align: center;
  }
  &-title {
    font-size:30px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:42px;
    text-align: center;
    padding: 0;
    margin: 10px 0 0;
  }
}

// todo 需要优化调整
.commodity-card-content {
  display: flex;
  flex-wrap: wrap;
}
</style>
<style lang="less" scoped src="../home_container.less"></style>
