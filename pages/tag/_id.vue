<template>
  <div class="tag-page">
    <g-header />
    <el-row class="container mw mt40">
      <el-col
        :span="mainNavTypeIndex === 0 ? 16 : 18"
        class="main article not-padding"
      >
        <!-- 导航部分 -->
        <div class="main-nav padding-10">
          <span class="active">{{ $t('tag.contain') }}<em>{{ articleCardData[0].title }}</em>{{ $t('tag.tags') }}{{ tagType === 'product' ? $t('tag.shop') : $t('tag.article') }}</span>
        </div>
        <!-- 导航部分 end -->
        <!-- 空div控制内容 -->
        <div
          v-for="(item, index) in articleCardData"
          :key="index"
        >
          <el-row>
            <no-content-prompt :list="item.articles">
              <el-col
                v-for="(itemChild, indexChild) in item.articles"
                :key="indexChild + itemChild.id"
                :span="mainNavTypeIndex === 0 ? 24 : 8"
              >
                <articleCard
                  v-if="mainNavTypeIndex"
                  :card="itemChild"
                  :type-index="1"
                  :card-type="'commodity-card tag'"
                />
                <articleCardListNew
                  v-else
                  :card="itemChild"
                />
              </el-col>
            </no-content-prompt>
          </el-row>
          <!-- 这里结构和 commodity有点不一样 如果有影响,可以选择将上面的card包裹 -->
          <div class="load-more-button">
            <buttonLoadMore
              :type-index="index"
              :params="item.params"
              :api-url="item.apiUrl"
              @buttonLoadMore="buttonLoadMore"
            />
          </div>
        </div>

        <!-- end -->
      </el-col>
      <!-- 空div控制内容 end -->

      <el-col
        :span="mainNavTypeIndex === 0 ? 8 : 6"
        class="tags article"
      >
        <div class="tags-right">
          <span>{{ $t('tag.moreTag') }}</span>
          <tags
            :type-index="mainNavTypeIndex"
            :tag-cards="tagCards"
            class="tags-container"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import buttonLoadMore from '@/components/button_load_more/index.vue'
import tags from '@/components/tags/index.vue'
import articleCard from '@/components/articleCard/index.vue'
// import articleCardList from '@/components/article_card_list/index.vue'
import articleCardListNew from '@/components/article_card_list_new/index.vue'

export default {
  name: 'Tag',
  components: {
    articleCard,
    // articleCardList,
    articleCardListNew,
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
      await this.$API
        .getTags()
        .then((res) => {
          if (res.code === 0) {
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

            this.tagCards = res.data.filter(i => i.type === this.tagType)
          } else console.log(res.message)
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

// home页面内容区域 适用于home commodity tag 页面
.container {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  .spanStyle{
    font-size: 20px;
    color:rgba(0,0,0,1);
    line-height:1;
    cursor: pointer;
    transition: all .3s;
  }
  .main {
    display: flex;
    flex-direction: column;
    &.article{
      // max-width: 787px;
      // flex: 0 0 787px;
    }
    &.commodity{
      // max-width: 890px;
      // flex: 0 0 890px;
      // .commodity-card-content {
      //   display: flex;
      //   flex-wrap: wrap;
      // }
    }
  }
  .tags {
    &.article{
      // max-width: 374px;
      // flex: 0 0 374px;
    }
    &.commodity{
      // max-width: 270px;
      // flex: 0 0 270px;
    }
    &-container {
      margin-top: 20px;
      background: #fff;
      border-radius: @br10;
      padding: 10px;
    }
    span {
      .spanStyle();
      font-weight:bold;
      margin: 0 0 20px;
    }
  }

  .main-nav {
    margin: 0 0 20px;
    span {
      .spanStyle();
      font-weight:400;
      margin-right: 30px;
      &.active {
      font-weight: bold;
      }
      em {
        font-size: 20px;
        font-style: normal;
        color: @purpleDark;
      }
    }

    .filter {
      float: right;
      margin-right: 0px;

      &-button {
        padding: 0;
        color: #606266;
      }
      &-header {
        display: flex;
        align-items: center;
      }
      &-icon {
        width: 22px;
        height: 22px;
        margin-right: 4px;
      }
    }
  }

  .recommend-author {
    padding-bottom: 20px;
    .ra-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .change {
        width: 20px;
        height: 20px;
        //background: @purpleDark;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 6px;
        &-icon {
          width: 72%;
        }
      }
      .ra-head-title {
        .spanStyle();
        font-weight: bold;
      }
      .ra-head-random {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size:16px;
        font-weight:bold;
        color:@purpleDark;;
        cursor: pointer;
      }
    }
    .ra-content {
      background:rgba(255,255,255,1);
      border-radius: @br10;
      padding: 10px 20px;
      margin-top: 34px;
    }
  }
}

.load-more-button {
  display: flex;
  justify-content: center;
  min-height: 300px;
}

.fan-entrance {
  width: 60px;
  height: 71px;
}

.tags-right {
  position: sticky;
  top: 80px;
}
</style>
