<template>
  <div class="comment-container">
    <h2 v-if="pull.articles.length !== 0" class="comment-title">
      {{ type === 2 ? $t('p.likeList') : $t('p.commentPointBtn') }} {{ pull.allcount }} 
    </h2>
    <!-- <template v-if="type === 2">
      <CommentCard
        v-for="(itemChild, indexChild) in pull.articles"
        :key="indexChild"
        :comment="itemChild"
        :type="type"
      />
    </template>
    <template v-else> -->
    <div v-for="(itemChild, indexChild) in pull.articles" :key="indexChild" class="comment-outer">
      <articleCard
        :comment="itemChild"
        :type="type"
      />
      <ReplyList v-if="itemChild.replyList.length > 0" :list="itemChild.replyList" />
    </div>
    <!-- </template> -->
    <buttonLoadMore
      :type-index="0"
      :params="pull.params"
      :api-url="pull.apiUrl"
      :comment-request="reload"
      button-type="article-comment"
      @buttonLoadMore="buttonLoadMore"
    >
      {{ $t('viewMore') }}
    </buttonLoadMore>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import CommentCard from './Card'
import articleCard from './article_card'
import ReplyList from './ReplyList'
import buttonLoadMore from '@/components/button_load_more/index.vue'

export default {
  components: { buttonLoadMore, articleCard, ReplyList },
  props: {
    signId: {
      type: Number,
      required: true
    },
    type: {
      type: Number, // 2是商品 1是文章
      required: true
    },
    // 锚点：不等于0时，评论加载完成后跳转到所指评论
    commentAnchor: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      pull: {
        params: {
          signid: this.signId
        },
        apiUrl: 'commentsList',
        articles: [],
        commentLength: 0,
        allcount: 0
      },
      reload: this.commentRequest
    }
  },
  computed: {
    ...mapState(['commentRequest']),
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
        this.pull.allcount = res.data.allcount

        this.goCommentAnchor()
      }
    },
    goCommentAnchor() {
      if(!this.commentAnchor) return
      const commentId = this.commentAnchor
      this.$nextTick(() => {
        this.goAnchor('comment' + commentId) 
      })
    },
    goAnchor(id) {
      var anchor = document.getElementById(id)
      if(!anchor) return

      const offsetTop = anchor.offsetTop - 100

      // chrome, firefox, safari
      document.body.scrollTop = offsetTop
      document.documentElement.scrollTop = offsetTop
      window.pageYOffset = offsetTop
    }
  }
}
</script>

<style lang="less" scoped>
.comment-outer:not(:last-child) {
  border-bottom: 1px solid #e5e9ef;
}
.comment-title {
  font-size: 18px;
  padding: 0;
  margin: 0;
  font-weight: 400;
}

.comment-container {
  margin-bottom: 40px;
  margin-left: 60px;
}

// 小于860
@media screen and (max-width: 860px){
.comment-container {
  margin-left: 0;
  padding: 0 10px;
}
}
</style>
