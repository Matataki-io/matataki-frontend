<template>
  <div class="comment-container">
    <h2 class="comment-title">
      {{ type === 2 ? $t('p.likeList') : $t('p.commentPointBtn') }} {{ articleCardData.commentLength }}
    </h2>
    <no-content-prompt :list="articleCardData.articles">
      <template v-if="type === 2">
        <CommentCard v-for="(itemChild, indexChild) in articleCardData.articles" :key="indexChild" :comment="itemChild" :type="type" />
      </template>
      <template v-else>
        <articleCard v-for="(itemChild, indexChild) in articleCardData.articles" :key="indexChild" :comment="itemChild" :type="type" />
      </template>
    </no-content-prompt>
    <buttonLoadMore
      button-type="article-comment"
      :type-index="0"
      :params="articleCardData.params"
      :api-url="articleCardData.apiUrl"
      :comment-request="commentRequest"
      @buttonLoadMore="buttonLoadMore"
    >
      {{ $t('viewMore') }}
    </buttonLoadMore>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentCard from './Card'
import articleCard from './article_card'
import buttonLoadMore from '@/components/button_load_more/index.vue'

export default {
  components: { CommentCard, buttonLoadMore, articleCard },
  props: {
    signId: {
      type: Number,
      required: true
    },
    type: {
      type: Number, // 2是商品 1是文章
      required: true
    },
    commentRequest: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // comments: [],
      articleCardData: {
        params: {
          signid: this.signId
        },
        apiUrl: 'commentsList',
        articles: [],
        commentLength: 0
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  async mounted() {
    // await this.getListData()
  },
  methods: {
    // async getListData() {
    //   const res = await this.$API.getComments(this.signId)
    //   console.log('res', res)
    //   this.comments = res.data
    // },
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) {
        if (res.isEmpty) {
          this.articleCardData.articles = res.data.list
          this.articleCardData.commentLength = res.data.count
        } else {
          this.articleCardData.articles = this.articleCardData.articles.concat(res.data.list)
        }
        this.articleCardData.commentLength = res.data.count
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment-title {
  font-size: 18px;
  padding: 0;
  margin: 0;
  font-weight: 400;
}

.comment-container {
  margin-bottom: 40px;
}
</style>
