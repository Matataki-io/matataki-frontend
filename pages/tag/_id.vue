<template>
  <div class="tag-page">
    <g-header />
    <el-row class="container mw mt40">
      <el-col :span="mainNavTypeIndex === 0 ? 16 : 18" class="main article not-padding">
        <!-- 导航部分 -->
        <div class="main-nav padding-10">
          <span class="active">包含<em>{{ articleCardData[0].title }}</em>标签的文章</span>
        </div>
        <!-- 导航部分 end -->
        <!-- 空div控制内容 -->
        <div v-for="(item, index) in articleCardData" :key="index">
          <el-row>
            <no-content-prompt :list="item.articles">
              <el-col
                v-for="(itemChild, indexChild) in item.articles"
                :key="indexChild"
                :span="mainNavTypeIndex === 0 ? 24 : 8"
              >
                <articleCard
                  v-if="mainNavTypeIndex"
                  :card="itemChild"
                  :type-index="1"
                  :card-type="'commodity-card tag'"
                />
                <articleCardList v-else :card="itemChild" />
              </el-col>
            </no-content-prompt>
          </el-row>
          <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
          <div class="load-more-button">
            <buttonLoadMore :type-index="index" :params="item.params" :api-url="item.apiUrl" @buttonLoadMore="buttonLoadMore" />
          </div>
        </div>

        <!-- end -->
      </el-col>
      <!-- 空div控制内容 end -->

      <el-col :span="mainNavTypeIndex === 0 ? 8 : 6" class="tags article">
        <div class="position-sticky top80">
          <span>更多标签</span>
          <tags class="tags-container" :type-index="mainNavTypeIndex" :tag-cards="tagCards" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import buttonLoadMore from '@/components/button_load_more/index.vue'
import tags from '@/components/tags/index.vue'
import articleCard from '@/components/articleCard/index.vue'
import articleCardList from '@/components/article_card_list/index.vue'

export default {
  name: 'Tag',
  components: {
    articleCard,
    articleCardList,
    tags,
    buttonLoadMore
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
      tagType: this.$route.query.type || 'post' // 文章 post 商品 product

    }
  },
  computed: {
    mainNavTypeIndex() {
      return this.tagType === 'post' ? 0 : this.tagType === 'product' ? 1 : 0
    },
    mainNavTypeCard() {
      return this.tagType === 'post' ? 'article-card' : this.tagType === 'product' ? 'commodity-card' : 'article-card'
    }
  },
  created() {
    this.getTags()
  },
  methods: {
    // 获取标签
    async getTags() {
      await this.$backendAPI
        .getTags()
        .then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            // console.log(res.data.data)
            // const tagArr = res.data.data
            // const tagArrPost = []
            // const tagArrProduct = []

            // tagArr.map((i) => {
            //   if (i.type === 'post') tagArrPost.push(i)
            //   else if (i.type === 'product') tagArrProduct.push(i)
            // })

            // console.log(tagArrPost, tagArrProduct)

            // if (this.tagType === 'post') {
            //   this.tagCards.push(tagArrPost)
            //   this.tagCards.push(tagArrProduct)
            // } else if (this.tagType === 'product') {
            //   this.tagCards.push(tagArrProduct)
            //   this.tagCards.push(tagArrPost)
            // }
            // console.log(103, this.tagCards)

            this.tagCards = res.data.data.filter(i => i.type === this.tagType)
          } else console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) this.articleCardData[res.index].articles = this.articleCardData[res.index].articles.concat(res.data.list)
    }
  }
}
</script>

<style lang="less" scoped>
.tag-page{
  .minHeight();
}
.mt40 {
  margin-top: 40px !important;
}

</style>
<style lang="less" scoped src="../home_container.less"></style>
