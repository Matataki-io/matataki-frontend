<template>
  <div class="comment-container">
    <h2 class="comment-title">
      {{ type === 2 ? $t('p.likeList') : $t('p.commentPointBtn') }} {{ pull.commentLength }}
    </h2>
    <no-content-prompt :list="pull.articles">
      <template v-if="type === 2">
        <CommentCard v-for="(itemChild, indexChild) in pull.articles" :key="indexChild" :comment="itemChild" :type="type" />
      </template>
      <template v-else>
        <articleCard v-for="(itemChild, indexChild) in pull.articles" :key="indexChild" :comment="itemChild" :type="type" />
      </template>
    </no-content-prompt>
    <buttonLoadMore
      :type-index="0"
      :params="pull.params"
      :api-url="pull.apiUrl"
      :comment-request="reload"
      @buttonLoadMore="buttonLoadMore"
      button-type="article-comment"
    >
      {{ $t('viewMore') }}
    </buttonLoadMore>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import CommentCard from './Card'
import articleCard from './article_card'

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
      pull: {
        params: {
          signid: this.signId
        },
        apiUrl: 'commentsList',
        articles: [],
        commentLength: 0
      },
      reload: this.commentRequest
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    // 监听id是否变化
    signId() {
      this.pull.params.signid = this.signId
      this.reload = Date.now()
    },
    commentRequest() {
      this.reload = this.commentRequest
    }
  },
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res) {
        if (res.isEmpty) {
          this.pull.articles.length = 0
          this.pull.articles = res.data.list
        } else {
          this.pull.articles = this.pull.articles.concat(res.data.list)
        }
        this.pull.commentLength = res.data.count
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
